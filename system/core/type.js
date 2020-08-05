define(
[
	"./trait",
	"../helper/argument/arg",
	"../helper/typo/capitalize",
	"../helper/object/each",
	"../helper/property/concrete",

],
function( Trait, arg, capitalize, each, concrete )
{
	/**
	 * Yeni bir tür oluşturur.
	 *
	 * @module system/core/type
	 * @method Type
	 * @param {String} name tür adı
	 * @return {Type} new operatörü olmaksızın çalıştırılırsa geriye bu metodun
	 *   aynı parametrelerle new operatörüyle örneklenmiş hali döndürülür.
	 *
	 * @throws {TypeError} İlk argüman native bir fonksiyon adı için uygun
	 *   olmadığında fırlatılır.
	 *
	 * @author Ismail Ceylan
	 * @created 2020-01-16T14:22:36+0300
	 */
	return function Type( name )
	{
		if( ! ( this instanceof Type ))

			return new Type( name );

		if( ! is( name, "nameable" ))

			throw TypeError( "İlk argüman geçerli bir tür adı olmalıdır!" );

		/**
		 * Ana etki alanı.
		 *
		 * @name root
		 * @type {this}
		 * @private
		 */
		var root = this;

		/**
		 * Türün adı.
		 *
		 * @name name
		 * @type {String}
		 * @hidden
		 * @readOnly
		 */
		concrete( this, "name", capitalize( name ));

		/**
		 * Bu türün kendi türü de dahil sahip olduğu türleri tutar.
		 *
		 * @name types
		 * @type {Array}
		 */
		this.types = [ this.name ];

		/**
		 * Bu türün miras aldığı trait isimlerini tutar.
		 *
		 * @name behaviours
		 * @type {Array}
		 * @default []
		 */
		this.behaviours = [];

		/**
		 * Bu türün miras aldığı ebeveyn tür.
		 *
		 * @name parent
		 * @type {Type}
		 * @default null
		 */
		this.parent = null;

		/**
		 * Bu türden singleton yoluyla üretilen ilk instance.
		 *
		 * @name instance
		 * @type {Object}
		 * @default null
		 */
		this.instance = null;

		/**
		 * Türü native olarak temsil edecek kurucu metot.
		 *
		 * @name constructor
		 * @type {Function}
		 */
		this.constructor = eval( "( function " + this.name + "(){})" );

		/**
		 * Verilen trait'(ler)in özelliklerini bu türün özellikleri arasına
		 *   kopyalar. Özellikler bu türün kurucusunun prototype'ına kopyalanır
		 *   yani kopyalanan özellikler sanki bu türün birer özelliğiymiş gibi
		 *   görünür.
		 *
		 * @method use
		 * @param {Trait} ...parents özellikleri miras alınacak trait(ler)
		 * @return {this}
		 * @author Ismail Ceylan
		 */
		this.use = function( parents )
		{
			arg( arguments ).forEach( function( trait )
			{
				renameTraitConstructMethod( trait );
				extendPrototype( trait.properties );

				this.behaviours = this.behaviours.concat( trait.types );
			},
			this );

			return this;
		}

		/**
		 * Verilen trait'in özellikleri arasındaki construct metodunu benzersiz
		 *   bir isimle değiştirir. Böylece türlere ait construct metotları ile
		 *   çakışmaların önüne geçilir.
		 *
		 * @method renameTraitConstructMethod
		 * @param {Trait} trait bir trait
		 * @author Ismail Ceylan
		 * @private
		 */
		function renameTraitConstructMethod( trait )
		{
			if( trait.properties.construct )
			{
				trait.properties[ "construct" + trait.name + "Trait" ] = trait.properties.construct;
				delete trait.properties.construct;
			}
		}

		/**
		 * Tür prototype'ını oluşturur.
		 *
		 * @method prototype
		 * @param {Object} context türün metot ve özelliklerini içeren bir nesne
		 * @return {this}
		 * @author Ismail Ceylan
		 */
		this.prototype = function( context )
		{
			extendPrototype( context );

			if( this.parent )
			
				inherit( this.parent.constructor.prototype );

			renameTraitMethods();
			handleStaticProps();
			upgradePrototype();

			return this;
		}

		/**
		 * Verilen nesnedeki özellikleri türün prototype yığınına ekler.
		 *
		 * @method extendPrototype
		 * @param {Object} context metot ve özellikler içeren bir nesne
		 * @return {this}
		 * @author Ismail Ceylan
		 * @private
		 */
		function extendPrototype( context )
		{
			Object.assign( root.constructor.prototype, context );
			return root;
		}

		/**
		 * Temsil edilen türün miras aldığı trait'lerde bulunan metotlar, tür
		 *   prototype'ı tanımlanırken yeniden isimlendirilmiş olabilir. Bunları
		 *   uygular.
		 *
		 * @method renameTraitMethods
		 * @author Ismail Ceylan
		 * @private
		 */
		function renameTraitMethods()
		{
			var AS;
			var proto = root.constructor.prototype;

			// kurucu prototype'ında use isimli bir property yoksa işlem yok
			if( ! ( AS = proto.AS ))

				return;

			for( var oldMethodName in AS )
			{
				var newMethodName = AS[ oldMethodName ];

				proto[ newMethodName ] = proto[ oldMethodName ];
				delete proto[ oldMethodName ];
			}

			delete proto.AS;
		}

		/**
		 * Temsil edilen türün prototype alanında static adında bir property
		 *   varsa bunun içindeki property'leri alıp temsil edilen türün
		 *   constructor nesnesine kopyalar ve prototype alanından kaldırır.
		 *
		 * @method handleStaticProps
		 * @author Ismail Ceylan
		 * @private
		 */
		function handleStaticProps()
		{
			var statics;
			var constructor = root.constructor;
			var proto = constructor.prototype;

			if( ! ( "static" in proto ))

				return;

			if( "pass" in proto.static )
			
				return delete proto.static.pass;

			Object.assign( constructor, proto.static );

			delete proto.static;
		}

		/**
		 * Verilen üstel türün özelliklerini bu türün özellikleri arasına
		 *   kopyalar, miras alır.
		 *
		 * @method extends
		 * @param {Type} parent özellikleri miras alınacak ebeveyn tür
		 * @return {this}
		 * @author Ismail Ceylan
		 */
		this.extends = function( parent )
		{
			this.parent = parent;
			this.types = this.types.concat( parent.types );
			this.behaviours = this.behaviours.concat( parent.behaviours );

			return this;
		}

		/**
		 * Temsil edilen türün kurucu metodunu verilen parametrelerle örnekleyip
		 *   döndürür.
		 *
		 * @method new
		 * @return {Object}
		 * @author Ismail Ceylan
		 */
		this.new = function()
		{
			var instance = new this.constructor;

			callTraitInitializers( instance );
			igniteConstructMethod( instance, arguments );
			
			return instance;
		}

		/**
		 * Verilen nesne içindeki property'ler bu türün prototype'ında yoksa
		 *   buraya yerleştirilir. Tür o property'e sahipse bunu kullanmaya
		 *   devam eder.
		 *
		 * native property'ler (toString, toSource gibi) nesnede olsa bile yine
		 *   de yeni property'ler miras alınır.
		 *
		 * @method inherit
		 * @param {Object} inheritance miras alınacakları içeren bir nesne
		 * @author Ismail Ceylan
		 * @private
		 */
		function inherit( inheritance )
		{
			var inheriter = root.constructor.prototype;
			var must = [ "toString", "toStringTag", "toLocaleString", "toSource", "valueOf", "toPrimitive" ];

			for( var prop in inheritance )
			{
				if( prop in inheriter && must.indexOf( prop ) < 0 )

					continue;

				inheriter[ prop ] = inheritance[ prop ];
			}
		}

		/**
		 * Verilen nesnenin miras aldığı davranışların kendi iç işlerini
		 *   ilgilendiren kurucu metotları varsa bunları çalıştırır.
		 *
		 * @method callTraitInitializers
		 * @param {Object} instance bir tür
		 * @author Ismail Ceylan
		 * @private
		 */
		function callTraitInitializers( instance )
		{
			instance.type.behaviours.forEach( function( behaviour )
			{
				var initializer;

				if( initializer = instance[ "construct" + behaviour + "Trait" ])
				
					initializer.call( instance );
			});
		}

		/**
		 * Verilen nesne üzerinde construct adında bir metot varsa buna verilen
		 *   arguments nesnesindeki argümanları geçirerek çalıştırır. Metot
		 *   kendi etki alanında çalışır yani construct metodunun içinde
		 *   kullanlacak this sözcüğü o metodun içinde bulunduğu türe refere
		 *   eder.
		 *
		 * @method igniteConstructMethod
		 * @param {Object} instance bir nesne
		 * @param {Arguments} initialArgs kurulum anındaki argüman listesi
		 * @author Ismail Ceylan
		 * @private
		 */
		function igniteConstructMethod( instance, initialArgs )
		{
			is( instance.construct, "function" ) &&
				instance.construct.apply( instance, arg( initialArgs ));
		}

		/**
		 * Temsil edilen türün kurucu metodunu verilen parametrelerle örnekleyip
		 *   döndürür. new metodundan farkı her çalıştırıldığında yeni bir
		 *   instance üretmek yerine hep aynı instance'ı döndürür.
		 *
		 * @method singleton
		 * @return {Object}
		 * @author Ismail Ceylan
		 */
		this.singleton = function()
		{
			return this.instance || ( this.instance = this.new.apply( this, arg( arguments )));
		}

		/**
		 * Temsil edilen türün constructor nesnesi üzerinde bulunan adı verilen
		 *   özellik değerini döndürür. Özellik mevcut değilse undefined döner.
		 *
		 * ```
		 * static( "propName" )
		 * // özellik veya metotun kendisini/tuttuğu değeri verir
		 *
		 * static( "propName", { value: mixed })
		 * // adı verilen property'e verilen değeri yazar
		 *
		 * static( "propName", { args:[ ]})
		 * // adı verilen metodu verilen parametrelerle çalıştırıp değerini döndürür
		 * ```
		 *
		 * @method static
		 * @param {String} propName static alandan istenen property adı
		 * @param {Object} options değer atama/metot çağırma ayarları
		 * @return {mixed|undefined}
		 * @throws {TypeError} Metot çalıştırma modundayken adı verilen property
		 *   bir metot değilse fırlatılır.
		 *
		 * @author Ismail Ceylan
		 */
		this.static = function( propName, options )
		{
			var prop;
			var constructor = this.constructor;

			options = options || {}

			// değer yazma modu
			if( "value" in options )
			
				constructor[ propName ] = options.value;

			// adı verilen property yoksa işleme gerek yok
			if( ! ( prop = constructor[ propName ]))

				return;

			// çalıştırma modu
			if( "args" in options )
			{
				// property metot değilse
				if( ! is( prop, "function" ))

					throw TypeError( this.name + "." + propName + " bir metot değil!" );

				// çalıştıralım
				return prop.apply( constructor.prototype, options.args );
			}

			return prop;
		}

		/**
		 * Temsil edilen türün prototype'ına gerekli özellikleri yerleştirir.
		 *
		 * @method upgradePrototype
		 * @author Ismail Ceylan
		 * @private
		 */
		function upgradePrototype()
		{
			var features = 
			{
				// bu kurucuyu oluşturan tür arayüzüne
				// instance'lar üzerinden ulaşabilelim
				type: root,

				// instance'lar üzerinde tür sınama metodu bulunsun
				// bu metot instanceof işleyişinin yerini alacak
				is: root.is,

				// instance'lar üzerinde davranış sınama metodu bulunsun
				behave: root.behave,

				// super metodu bulunsun
				super: root.super
			}

			each( features, function( feature, value )
			{
				concrete( root.constructor.prototype, feature, value );
			});
		}

		/**
		 * Temsil edilen türün verilen türü miras alıp almadığını söyler.
		 *
		 * @method is
		 * @param {Type} target sınanacak bir tür veya tür adı
		 * @return {Boolean}
		 * @author Ismail Ceylan
		 */
		this.is = function( target )
		{
			if( target instanceof Type )

				target = target.name;

			if( this instanceof Type )

				return this.types.indexOf( target ) > -1;
			
			if( this.type && this.type instanceof Type )
				
				return this.type.types.indexOf( target ) > -1;

			return false;
		}

		/**
		 * Temsil edilen türün verilen trait'i miras alıp almadığını söyler.
		 *
		 * @method behave
		 * @param {Trait|String} target sınanacak bir trait veya trait adı
		 * @return {Boolean}
		 * @author Ismail Ceylan
		 */
		this.behave = function( trait )
		{
			if( trait instanceof Trait )

				trait = trait.name;

			if( this instanceof Type )

				return this.behaviours.indexOf( trait ) > -1;
			
			if( this.type && this.type instanceof Type )
				
				return this.type.behaviours.indexOf( trait ) > -1;

			return false;
		}

		/**
		 * Temsil edilen türün ebeveyn türüne erişimi sağlar.
		 *
		 * ### Ebeveynin belli bir metodunu call etmek
		 * (String, [...Array])
		 *
		 * ### Ebeveynin construct metodunu call etmek
		 * (...Params)
		 *
		 * ### Ebeneynin bağlamına erişmek
		 * ()
		 *
		 * @method super
		 * @return {mixed}
		 * @author Ismail Ceylan
		 */
		this.super = function()
		{
			var context = is( this, Type )
				? this.parent
				: this.type.parent;

			if( ! context )

				return;

			context = context.constructor.prototype;

			// parent bağlamına erişim
			if( arguments.length == 0 )

				return context;

			// varsayacağımız metot adı construct olacak
			var method = "construct";
			// parametrelere dizi olarak ihtiyacımız var
			var args = arg( arguments );

			// adı verilmiş bir metot call edilecek
			if( args.length == 2 && is( args[ 0 ], "string" ) && is( args[ 1 ], "array" ))
			{
				// ilk parametre metot adı
				method = args.shift();
				args = args.shift();
			}
			else if( args.length == 1 && is( args[ 0 ], "string" ))

				method = args.shift();

			// metot adı ve parametreler elimizde, call edelim
			return context[ method ].apply( this, args );
		}
	}
});
