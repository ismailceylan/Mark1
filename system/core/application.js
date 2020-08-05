define( 
[
	"i18n!../language/nls/common",
	"../library/caching/cache",
	"../helper/url/serialize-querystring",
	"../helper/object/each",
	"../helper/string/trim2",
	"../helper/string/assign",
	"../package/resource-loading-indicator/main",

	"../machine/keep",

],
function( Lang, Cache, serializeQuerystring, each, trim, assign, ResourceLoadingIndicator )
{
	/**
	 * Uygulamayı gerçekler.
	 *
	 * @event {screenModeChange} ekran boyutu (yani small, medium vs gibi grup adı) değiştiğinde tetiklenir
	 * @event {urichange} uygulama url yapısı push state yapısı üzerinden değiştiğinde tetiklenir
	 * @event {package:<PackageName>} dinleyen bir paketin tetiklenmesine neden olur
	 */
	return function Application()
	{
		var root = this;

		/**
		 * Uygulamanın çalışmakta olduğu url yapısını tutar.
		 * @type {URL}
		 */
		this.uri = null;

		/**
		 * Site ayarlarını bir arada tutar.
		 * @type {Object}
		 */
		this.config = {}

		/**
		 * Worker örneklerini tutar.
		 * @type {Object}
		 */
		this.webWorker = {}

		/**
		 * Ekran boyutunun dahil olduğu grup adını tutar.
		 * @type {String}
		 */
		this.currentScreenGroup = null;

		/**
		 * Dinamik sayfa geçmişi yönetim arayüzü.
		 * @type {Navigate}
		 */
		this.navigate = null;

		/**
		 * Çalışmakta olan controller örneği.
		 * @type {Controller}
		 */
		this.currentController = null;

		/**
		 * [resourceLoadingIndicator description]
		 * @type {ResourceLoadingIndicator}
		 */
		this.resourceLoadingIndicator = new ResourceLoadingIndicator;

		/**
		 * İzlenen url değişkenleri yığınıt.
		 * @type {Object}
		 */
		this.watchedQueryStrings = {};

		/**
		 * Uygulamanın dil girdilerini bir arada tutar.
		 * @type {Object}
		 */
		this.lang = ( function()
		{
			Lang.render = function( item, data )
			{
				if( ! this[ item ])
				
					throw new ReferenceError( assign( this.unknownLangEntry,
					{
						key: item
					}));

				return assign( this[ item ], data );
			}

			return Lang;
		})
		();

		/**
		 * Verilen url'i set eder.
		 * @param {URL} uri URL nesnesi
		 */
		this.setUri = function( uri )
		{
			this.uri = uri;
			this.scanWatchedQueryStrings();
		}

		/**
		 * Adı verilen query string değişkeninde herhangi bir
		 * değişiklik (oluşma,değişme,silinme) olduğunda verilen
		 * callback çalıştırılır.
		 *
		 * Sadece mevcut url üzerindeki değişken dinlenecekse
		 * ikinci parametreye "only current url" değeri verilmelidir.
		 * Bu verilmezse url farketmeksizin global olarak adı verilen
		 * değişken dinlenir.
		 * 
		 * @param {String} name dinlenecek query string değişkenin adı
		 * @param {String} where dinleme yöntemi
		 * @param {Function} onChange değişim olduğunda çalıştırılacak metot
		 */
		this.watchQueryString = function( name, where, onChange )
		{
			if( is( where, "function" ))
			{
				onChange = where;
				where = undefined;
			}

			// zaten tanımlıysa
			if( name in this.watchedQueryStrings )
			
				this.watchedQueryStrings[ name ].listeners.push( onChange );

			// ilk kez tanımlanıyorsa
			else
				
				this.watchedQueryStrings[ name ] = 
				{
					currentValue: this.uri.get( name ),
					listeners: [ onChange ]
				}

			if( where == "only current url" )

				this.watchedQueryStrings[ name ].original = this.uri.parts;
		}

		/**
		 * İzleme listesindeki query string değişkenlerinde son taramadan
		 * beri bir değişiklik varsa bunlar için atanan callback metotlarını
		 * çalıştırır.
		 */
		this.scanWatchedQueryStrings = function()
		{
			var root = this;

			var handleChange = function( name, qs )
			{
				var urlCurrent = root.uri.get( name );

				// url'deki değişken değeri ile son değer eşit değilse
				if( qs.currentValue != urlCurrent )
				
					qs.listeners.forEach( function( listener )
					{
						listener( qs.currentValue = urlCurrent );
					});
			}

			each( this.watchedQueryStrings, function( name, qs )
			{
				var orig = qs.original;

				// değişken için bir url kıstası varsa 
				if( orig )
				{
					var url = orig.protocol + '://' + orig.host.orig + '' + orig.path;
					var currentUrl = root.uri.protocol + '://' + root.uri.host.orig + '' + root.uri.path;

					// mevcut url ile aynıysa
					if( url == currentUrl )
					
						handleChange( name, qs );
				}
				else
				
					handleChange( name, qs );
			});
		}

		/**
		 * Sayfayı verilen bir dizine yönlendirir.
		 * 
		 * @param {string} path yönlendirilecek dizin/dosya
		 * @param {string} mode yönlendirme yöntemi (varsayılan location) [pushstate, location]
		 */
		this.redirect = function( path, mode )
		{
			if( ! mode )
			
				window.location.href = this.baseurl( path );

			else if( mode == "pushstate" )

				this.navigate.open( path );
		}

		/**
		 * Tarayıcı geçmişinde bir adım geri gider.
		 */
		this.redirect.back = function()
		{
			window.history.back();
		}

		/**
		 * Tarama geçmişinde bir adım ileri gider.
		 */
		this.redirect.forward = function()
		{
			window.history.forward();
		}

		/**
		 * Tarayıcı geçmişinde verilen adım kadar geri veya ileri
		 * gider. Pozitif ve negatif sayılar anlamlıdır.
		 *
		 * @param {Number} delta geri veya ileri gidilecek adım sayısı
		 */
		this.redirect.go = function( delta )
		{
			window.history.go( delta );
		}

		/**
		 * Adı verilen rotaya yoluna verilen parametreler enjekte edilerek
		 * elde edilen url'e yönlendirme yapar.
		 *  
		 * @param {String} name rota adı
		 * @param {Object} params parametreeler
		 */
		this.redirect.route = function( name, params )
		{
			root.navigate.open( root.route( name, params ));
		}

		/**
		 * Sitenin configde bulunan domain adını döndürür.
		 *
		 * @param {String} append domaine eklenecek bir dizin/dosya yolu
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.baseurl = function( append, qs )
		{
			var b = [ this.config.site.paths.base ];

			if( is( append, "object" ))
			{
				qs = append;
				append = undefined;
			}

			if( append = trim( deft( append, "" ), "/" ))

				b.push( append );

			return b.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Sitenin herkesin erişimine açık kaynakları için adres üretir.
		 * 
		 * @param {String} append linke eklenecek bir dizin/dosya yolu
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.public = function( append, qs )
		{
			var b = [ this.baseurl( this.config.site.paths.public )];

			if( append && append != "/" )

				b.push( append );

			return b.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Sitenin static kaynakları için adres üretir.
		 * 
		 * @param {String} append linke eklenecek bir dizin/dosya yolu
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.asset = function( append, qs )
		{
			var b = [ this.public( this.config.site.paths.asset )];

			if( append && append != "/" )

				b.push( append );

			return b.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Sitenin js kaynakları için adres üretir.
		 * 
		 * @param {String} append linke eklenecek bir dizin/dosya yolu
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.js = function( append, qs )
		{
			var b = [ this.asset( this.config.site.paths.js )];

			if( append && append != "/" )

				b.push( append );

			return b.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Sitenin medya kaynakları için adres üretir.
		 * 
		 * @param {String} append linke eklenecek dizin/dosya yolu
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.media = function( append, qs )
		{
			var b = [ this.baseurl( this.config.site.paths.media )];

			if( append && append != "/" )

				b.push( append );

			return b.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Adı verilen rotaya verilen parametreleri teslim ederek url
		 * oluşturması istenir ve oluşturulan göreceli url kök dizin
		 * ile birleştirilip tam url olarak döndürülür.
		 * 
		 * @param {String} name rota adı
		 * @param {Object} params parametreler
		 * @param {Object} qs linke eklenecek querystring değişkenler
		 * @return {String}
		 */
		this.route = function( name, params, qs )
		{
			return this.baseurl(
				app
					.singleton( "route" )
					.getRouteURi( name, params )
			)
			+ serializeQuerystring( qs );
		}

		/**
		 * Api kök dizinini kullanıp verilen dizini ve parametreleri
		 * bu kök dizine ilave ederek bir url üretir.
		 * 
		 * @param {String} path api kök dizinine ilave edilecek dizin
		 * @param {Object} qs get parametreleri
		 * @return {String}
		 */
		this.api = function( path, qs )
		{
			var b = [ this.baseurl( this.config.site.paths.api ), "v" + this.config.site.api.version ];
			var root = [ b.join( "/" )];

			if( path )
			
				root.push( path == "/"? "" : path );

			return root.join( "/" ) + serializeQuerystring( qs );
		}

		/**
		 * Adı verilen bir worker yüklü değilse yükler, yüklüyse
		 * örnekleyip döndürür.
		 * 
		 * @param  {String} name worker yolu/adı
		 * @return {Worker}
		 */
		this.worker = function( name )
		{
			if( instance = this.webWorker[ name ])

				return instance;

			var side = "system/";

			// yol bilgisi application ile başlıyorsa application
			// klasöründe, değilse system klasöründe arayacağız
			if( name.substr( 0, 12 ) == "application/" )

				side = "";

			// ismi tam yola çevirelim
			url = this.js( side + "/worker/" + name );

			// en sonda js yoksa ekleyelim
			if( url.substr( -3 ) != ".js" )

				url += ".js";

			return this.webWorker[ name ] = new Worker( url );
		}

		/**
		 * Önceden bir controller mevcutsa bunu destroy
		 * eder ve yeni verileni güncel alana yazar.
		 * 
		 * @param {Controller} controller yeni controller
		 */
		this.setCurrentController = function( controller )
		{
			var old = this.currentController;

			if( old && old.destroy )

				old.destroy();

			return this.currentController = controller;
		}

		/**
		 * Uygulamanın pencere başlığını set eder.
		 * @param {String} msg başlık metni
		 * @param {Boolean} shouldAddSiteName site adının en sona eklenip eklenmeyeceği
		 */
		this.title = function( msg, shouldAddSiteName )
		{
			var appendex = shouldAddSiteName
				? this.config.config.sitename
					? " - " + this.config.config.sitename
					: ""
				: "";

			window.document.title = msg + appendex;
		}

		/**
		 * Uygulama düzeyinde adı verilen isimde bir değer saklar. Bu isme sonradan
		 * başka değerler yazılamaz. Geriye daima ilk seferde saklanan değer döner.
		 * 
		 * @param {String} name bir isim
		 * @param {mixed} value saklanacak bir değer
		 * @return {mixed}
		 */
		this.singleton = function( name, life, value )
		{
			if( value === undefined )
			{
				value = life;
				life = undefined;
			}
			
			return Cache.new( "singletones" ).remember( name, life, value );
		}

		/**
		 * Sistem genelinde bir hata tetiklendiğinde devreye girip hata bilgilerini
		 * parse eder ve hata ayıklama arayüzüne göndererek hata için bir arayüz
		 * çizilmesini sağlar.
		 * 
		 * @param {Object} errEvent hata olayını temsil eden nesne
		 */
		this.debug = function( errEvent )
		{
			if( app.config.site.environment == "production" )

				return;

			require([ "system/component/debugger/debugger" ], function( Debugger )
			{
				var evt = errEvent.originalEvent;

				Debugger.new(
				{
					file: evt.filename,
					msg: evt.message,
					line: evt.lineno,
					col: evt.colno,
					callStack: evt.error.stack || ""
				});
			});
		}
	}
});
