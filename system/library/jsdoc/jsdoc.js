define(
[
	"./sheet",
	"./directives/index",
	"system/helper/string/trim2",
	"system/helper/typo/dash-to-camel",
	"system/helper/string/extract",
	"system/helper/object/each",

],
function( Sheet, Directives, trim, dash2camel, extract, each )
{
	/**
	 * Verilen javascript koduna jsdoc formatına uygun biçimde yerleştirilmiş
	 *   olan dökümantasyonu parse edip anlamlı js nesneleri haline getirir.
	 *
	 * @module system/library/jsdoc
	 * @method JSDoc
	 * @param {String} #body bir amd modül gösterimi
	 * @author Ismail Ceylan
	 * @created 2020-06-02T11:26:48+0300
	 */
	return function JSDoc( body )
	{
		if( ! ( this instanceof JSDoc ))

			return new JSDoc( body );

		/**
		 * Ana etki alanı.
		 *
		 * @name root
		 * @type {this}
		 * @private
		 */
		var root = this;

		/**
		 * AMD modül tanımlama syntax'ı ile eşleşir.
		 *
		 * @name moduleDefinition
		 * @type {RegExp}
		 * @private
		 */
		var moduleDefinition = /define\s*\(\s*(?:(?:"|')(.*)(?:"|'),)*\s*\[([\w\W]*?)\]/;

		/**
		 * Dökümantasyon bloklarıyla eşleşen düzenli ifade.
		 *
		 * @name docs
		 * @type {RegExp}
		 * @private
		 */
		var docs = /\/\*\*\s*([\w\W]+?)\s*\*\//gm;

		/**
		 * Modül bilgileri.
		 *
		 * @name module
		 * @type {Object}
		 * @property {String} name modül adı
		 * @property {String} path modül yolu
		 * @property {Array} dependencies modül bağımlılıkları
		 * @property {String} author modül yazarı
		 * @property {Date} created modülün oluşturulma tarihi
		 * @default {...}
		 */
		this.module =
		{
			name: null,
			path: null,
			dependencies: [],
			author: null,
			created: null
		}

		/**
		 * Modülün tanıtım dökümantasyonu.
		 * 
		 * @name intro
		 * @type {String}
		 * @default null
		 */
		this.intro = null;

		/**
		 * Bütün dökümantasyon girdileri.
		 *
		 * @name docs
		 * @type {Array}
		 * @default []
		 */
		this.docs = [];

		/**
		 * Modül bağımlılıklarını parse edip ilgili property'e yazar.
		 *
		 * @method parseModule
		 * @author Ismail Ceylan
		 * @created 2020-06-03T16:04:38+0300
		 * @private
		 */
		function parseModule()
		{
			var matches = body.match( moduleDefinition );

			// eşleşme yoksa define kullanılmıyor demektir
			if( ! matches )

				return exception( "NoModuleDefinition" );

			parseModuleDeps( matches[ 2 ]);
		}

		/**
		 * Script içinden regexp ile blok halinde elde edilen modül
		 *   bağımlılıklarını işleyip array halinde ilgili property üzerine
		 *   yazar.
		 *
		 * @method parseModuleDeps
		 * @param {String} depsFromRegExp modül bağımlılıkları
		 * @author Ismail Ceylan
		 * @created 2020-06-03T16:06:41+0300
		 * @private
		 */
		function parseModuleDeps( depsFromRegExp )
		{
			if( is( depsFromRegExp, "empty" ))

				return;

			root.module.dependencies = depsFromRegExp

				.match( /(?:"|')(.*)(?:"|')/g )
			
				.map( function( dep )
				{
					return trim( dep, "\"'" );
				});
		}

		/**
		 * Dökümanları parse eder.
		 *
		 * @method parseDocs
		 * @author Ismail Ceylan
		 * @created 2020-06-03T16:07:28+0300
		 * @private
		 */
		function parseDocs()
		{
			var match;
			var matches = body.matchAll( docs );

			while( ! ( match = matches.next()).done )
			
				parseDirectives( match.value[ 1 ]);
		}

		/**
		 * Verilen bir döküman bloğunda bulunan bütün direktifleri ayrıştırıp
		 *   döküman yığınına ilave eder.
		 *
		 * Bunu gerçekten yapar.
		 *
		 * @method parseDirectives
		 * @param {String} doc dökümantasyon bloğu
		 *    ama ne blok
		 * @author Ismail Ceylan
		 * @created 2020-06-03T16:44:07+0300
		 * @private
		 */
		function parseDirectives( doc )
		{
			var sheet = Sheet.new();
			var lines = lineify( doc );
			var lastDirective = null;

			lines.forEach( function( line, i )
			{
				var currentDirective = findDirective( line );

				// satırı işleyecek direktif yoksa bu satırı pas geçiyoruz
				if( ! currentDirective )

					return;

				// son direktif tanımsızsa ilk satırdayız demektir
				if( lastDirective === null )
				{
					// ilk direktif olduğu için adını değiştirelim
					currentDirective.label = "description";

					// normalde aşağıdaki satırlarda text direktif ile karşılaşınca bunu
					// dökümana eklemek yerine bir önceki direktife ilave edeceğiz ancak bu
					// direktif dökümanın açıklama alanını temsil ettiği için normal bir
					// direktife dönüştürmemiz gerek bu sayede sonradan gelecek olan text
					// türünden direktifler bu text direktife ilave olabilecekler çünkü son
					// direktif alanına bu direktifi ekleyeceğiz
					return sheet.add( lastDirective = currentDirective );
				}

				// metinsel direktifse öncekine dahil olsun
				if( currentDirective.label == "plain text" || currentDirective.label == "empty line" )
				
					return lastDirective.concat( currentDirective );

				// elimizde geçerli bir direktif var, ilk değil ve text türünde değil ve
				// empty line değil bu tür direktifleri direkt dökümana ekleyebiliriz
				sheet.add( lastDirective = currentDirective );
			});

			root.docs.push( sheet );
		}

		/**
		 * Verilen satırı işlemeyi kabul eden bir direktif bulup örnekleyip
		 *   döndürür.
		 *
		 * @method findDirective
		 * @param {String} line bir döküman satırı
		 * @return {Directive}
		 * @author Ismail Ceylan
		 * @created 2020-06-05T02:01:21+0300
		 * @private
		 */
		function findDirective( line )
		{
			var r;

			Directives.find( function( Directive )
			{
				var directive = Directive.new( line );

				if( directive.isAccepted )
				
					return r = directive;
			});

			return r;
		}

		/**
		 * Verilen bir döküman bloğunun her bir satırı boşluk ve asteriks
		 *   işaretleriyle başlar. Ayrıca satır sonlarında da boşluklar
		 *   bırakılmış olabilir. Bu tür gereksiz karakterleri temizleyip kalan
		 *   içeriği \n karakterinden bölerek dizi haline getirir. Dizinin her
		 *   bir elemanında dökümanın bir satırı temiz biçimde bulunur.
		 *
		 * @method lineify
		 * @param {String} doc bir döküman bloğu
		 * @return {Array}
		 * @author Ismail Ceylan
		 * @created 2020-06-04T01:29:03+0300
		 * @private
		 */
		function lineify( doc )
		{
			return doc
				.replace( /^[\t\f\v ]*\*[\t\f\v ]*|[\t\f\v ]*$/gm, "" )
				.split( "\n" );
		}

		parseModule();
		parseDocs();
	}
});
