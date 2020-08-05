define(
[
	"system/core/type",

	"./traits/inheritable",
	"./traits/middlewareable",
	"./controller-reference",

	"system/library/caching/cache",
	"system/helper/string/assign",
	"system/helper/string/serialize-key-value"

],
function( Type, Inheritable, Middlewareable, ControllerReference, Cache, assign, serializeKeyValue )
{
	/**
	 * Bir rotayı temsil eder, rotalara işlevsellik katar.
	 */
	return Type( "Route" ).use( Inheritable, Middlewareable ).prototype(
	{
		/**
		 * Bu rotaya sahip olan üst grup.
		 * @type {RouteGroup}
		 */
		parent: null,

		/**
		 * Rotanın http metodu.
		 * @type {String}
		 */
		method: null,

		/**
		 * İsimli dizin yakalama sözdizimi.
		 * @type {RegularExpression}
		 */
		pattern: null,

		/**
		 * Rotanın eşleştiği son url'den elde edilen parametreler.
		 * @type {Object}
		 */
		params: null,

		/**
		 * Rotanın ait olduğu controller çalışmadan
		 * önce geçmesi gereken middleware yığını.
		 * 
		 * @type {Array}
		 */
		middlewares: null,

		/**
		 * İsimli yakalayıcı kuralları.
		 * @type {Array}
		 */
		rules: null,

		/**
		 * Rotaya basit bir isimle erişmekte kullanılacak isim.
		 * @type {String}
		 */
		nm: null,

		/**
		 * Bu rotanın hedef gösterdiği controller
		 * dosyalarına dizin yapıları ekler.
		 * 
		 * @type {String}
		 */
		ns: "",

		/**
		 * Rota controller'ı. Bir ControllerReference olabileceği gibi
		 * Function da olabilir.
		 * 
		 * @type {mixed}
		 */
		controller: null,

		/**
		 * Kalıtım yapısı.
		 * @type {Object}
		 */
		inheritance:
		{
			extendingInheritance: [ "rules", "middlewares" ],
			prefixingInheritance: [ "prf", "ns" ]
		},

		/**
		 * Kurulumu yapar.
		 * 
		 * @param {String} verb rotanın ait olduğu http fiil adı
		 * @param {String|Object} pattern isimli dizin yakalama sözdizimi
		 * @param {String|Function|Object} handler rota bilgileri
		 */
		construct: function( verb, pattern, handler )
		{
			this.handler = handler;
			this.method = verb || "get";
			this.pattern = pattern || "";

			this.params = {}
			this.middlewares = {}
			this.rules = {}
		},

		/**
		 * Rota için verilen controller ayarlanır.
		 * 
		 * @param {String|Function} controller bir controller
		 * @return {this}
		 */
		controller: function( controller )
		{
			if( is( controller, "string" ))

				this.controller = new ControllerReference( controller );

			else if( is( controller, "function" ))

				this.controller = controller;

			else

				throw new Error( "Rota işleyicisi olarak controller referans sözdizimi (controller@method) veya bir fonksiyon bekleniyor!" );

			return this;
		},

		/**
		 * Rota adını ayarlar.
		 * 
		 * @param {String} name rota adı
		 * @return {this}
		 */
		name: function( name )
		{
			this.nm = name;
			return this;
		},

		/**
		 * Kurallara ekler.
		 * 
		 * @param {String} paramName parametre adı
		 * @param {String|RegExp} regex düzenli ifade
		 * @param {Number} targetGroup düzenli ifade içinden kullanılması istenen grubun konumu
		 * @return {this}
		 */
		where: function( paramName, regex, targetGroup )
		{
			var rules = [];
			var root = this;

			// tekli giriş modu
			if( ! is( paramName, "array" ))

				rules.push([ paramName, regex, targetGroup ]);

			// toplu giriş modu
			else

				rules = arg( arguments );

			rules.forEach( function( rule )
			{
				// rule[ 1 ].targetGroup = rule[ 2 ] || 0;
				root.rules[ rule[ 0 ]] = rule[ 1 ];
			});

			return this;
		},

		/**
		 * Bazen rotalar string veya anonim metotlar yerine nesne olarak da
		 * verilebilir. Bu nesne içinden rotanın bir çok özelliği belirlenebilir.
		 * 
		 * @param {Object} options rota özellikleri
		 */
		handleJSONOptions: function( options )
		{
			if( ! ( "controller" in options ))

				warn( JSON.stringify( this.pattern ) + " rotası için herhangi bir işleyici sağlanmadı. Bu desenle eşleşen bir url açıldığında boş bir sayfa oluşacak!", 1);

			options.controller &&
				this.controller( options.controller );

			options.middleware &&
				this.middleware( options.middleware );

			options.name &&
				( this.nm = options.name );
		},

		/**
		 * Temsil edilen rotaya son halini verip önbelleğe gönderir.
		 */
		store: function()
		{
			delete this.parent;

			Cache.new( "routes" ).add( this.nm || undefined, this );
		},

		/**
		 * Temsil edilen rotanın eşleştirme desenine verilen
		 * parametreleri geçirerek bir uri üretip döndürür.
		 * 
		 * @param {Object} params isimli parametreler
		 * @return {String}
		 */
		getURi: function( params )
		{
			if( is( this.pattern, "object" ))

				return serializeKeyValue( params, "&", "=" );
			
			var clean = this.pattern
				.replace( /\{/g, "{{" )
				.replace( /\}/g, "}}" )
				.replace( /\?/g, "" );

			return assign( clean, params );
		},

		/**
		 * Rota kurulumunu yapar.
		 */
		init: function()
		{
			if( is( this.handler, "string" ) || is( this.handler, "function" ))

				this.controller( this.handler );

			else if( is( this.handler, "object" ))

				this.handleJSONOptions( this.handler );
		}
	});
});