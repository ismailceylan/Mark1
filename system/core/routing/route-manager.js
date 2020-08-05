/*
 *---------------------------------------------------------------
 * ROUTE
 *---------------------------------------------------------------
 *
 * Rota yönetim sistemi.
 * 
 */
define(
[
	"./route",
	"./route-group",
	"./traits/renderable",
	"./traits/middlewareable",
	"./controller-reference",

	"system/core/type",
	"system/core/controller",
	"system/core/middleware",
	"system/library/caching/cache",
	"system/library/url",
	
	"system/helper/object/each",
	"system/helper/string/trim2",
	"system/helper/string/extract",
	"system/helper/typo/camel-to-dash",
	"system/helper/string/serialize-key-value",

],
function
(
	Route, RouteGroup, Renderable, Middlewareable, ControllerReference,
	Type, Controller, Middleware, Cache, URL,
	each, trim, extract, camel2dash, serializeKeyValue
)
{
	/**
	 * Rotaları yönetir.
	 */
	var RouteManager = Type( "RouteManager" ).use( Renderable, Middlewareable ).prototype(
	{
		/**
		 * Rotaların önbelleklenmesinden sorumlu arayüz.
		 * @type {Cache}
		 */
		routes: null,

		/**
		 * Url için bulunan rotayı önbelleklemeyi sağlar.
		 * @type {Cache}
		 */
		urlCache: null,

		/**
		 * Son oluşturulan rota grubu.
		 * @type {RouteGroup}
		 */
		currentGroup: null,

		/**
		 * Rota grupları yığını.
		 * @type {Array}
		 */
		stack: null,

		/**
		 * İsimli yakalayıcı kuralları.
		 * @type {Array}
		 */
		rules: null,

		/**
		 * Tüm rotalara uygulanacak url ön eki.
		 * @type {String}
		 */
		prf: "",

		/**
		 * Tüm rotalara uygulanacak url ön eki.
		 * @type {Object}
		 */
		middlewares: null,

		/**
		 * Tüm rotaların hedef gösterdiği controller
		 * dosyalarına dizin yapıları ekler.
		 * 
		 * @type {String}
		 */
		ns: "",

		/**
		 * Rotayı çalıştırma sırasında uğranacak tüm middleware
		 * ve controller çalıştırılabilirlerini sıralı tutar.
		 * 
		 * @type {Array}
		 */
		callStack: null,

		/**
		 * Kurulumu yapar.
		 * 
		 * @param {RouteGroup} subGroup rota yöneticisinin işlemleri üzerinde
		 * yapacağı bir rota grubu
		 */
		construct: function( subGroup )
		{
			this.routes = Cache.new( "routes" );
			this.urlCache = Cache.new( "detected url routes" );
			this.stack = [];
			this.rules = {};
			this.middlewares = {};
			this.callStack = [];

			// alt grup gelmişse bunu set edelim
			subGroup && this.setSubGroup( subGroup );
		},

		/**
		 * Bir grup oluşturup döndürür.
		 * 
		 * @param {Object} options grup özellikleri
		 * @return {RouteGroup}
		 */
		createGroup: function( options )
		{
			return RouteGroup.new( options || {});
		},

		/**
		 * Bir rota oluşturup döndürür.
		 * 
		 * @param {String} verb fiil adı
		 * @param {String|Object} pattern isimli dizin yakalama sözdizimi
		 * @param {String|Function|Object} handler rota özellikleri
		 * @return {Route}
		 */
		createRoute: function( verb, pattern, handler )
		{
			return Route.new( verb, pattern, handler );
		},

		/**
		 * Yeni bir rota grubu oluşturur.
		 * 
		 * @param {Object} groupOptions grup özellikleri
		 * @param {Function} context grubun içinde çalışacak bir metot
		 * @return {RouteGroup}
		 */
		group: function( groupOptions, context )
		{
			if( arguments.length === 1 && is( groupOptions, "function" ))
			{
				context = groupOptions;
				groupOptions = {}
			}

			var manager;

			context.call( manager = this.createRouteManagerForSubGroup( groupOptions ), manager );

			return manager.currentGroup;
		},

		/**
		 * Http get metodu için bir rota oluşturur.
		 * 
		 * @param {String|Object} pattern isimli dizin yakalama sözdizimi
		 * @param {String|Function|Object} controller rota özellikleri
		 * referansı veya anonim bir metot
		 * @return {Route}
		 */
		get: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "get", pattern, controller ));
		},

		/**
		 * POST metodu için bir rota oluşturur.
		 * 
		 * @param {String|Object} pattern url deseni
		 * @param {String|Function} controller bir controller@metod sözdizimi veya fonksiyon
		 * @return {this}
		 */
		post: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "post", pattern, controller ));
		},

		/**
		 * PATCH metodu için bir rota oluşturur.
		 * 
		 * @param {String|Object} pattern url deseni
		 * @param {String|Function} controller bir controller@metod sözdizimi veya fonksiyon
		 * @return {this}
		 */
		patch: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "patch", pattern, controller ));
		},

		/**
		 * PUT metodu için bir rota oluşturur.
		 * 
		 * @param {String|Object} pattern url deseni
		 * @param {String|Function} controller bir controller@metod sözdizimi veya fonksiyon
		 * @return {this}
		 */
		put: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "put", pattern, controller ));
		},

		/**
		 * DELETE metodu için bir rota oluşturur.
		 * 
		 * @param {String|Object} pattern url deseni
		 * @param {String|Function} controller bir controller@metod sözdizimi veya fonksiyon
		 * @return {this}
		 */
		delete: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "delete", pattern, controller ));
		},

		/**
		 * Adı verilen http fiil(ler)i için bir rota oluşturur.
		 *
		 * Birden fazla http fiiline aynı kontrolcüyü atamak için kullanışlıdır. Ayrıca
		 * standart dışı http fiilleri için de bu metot ile rota eklenebilir.
		 * 
		 * @param {String|Array} verbs fiil veya fiiller
		 * @param {String|Object} pattern rota yolu
		 * @param {String|Function} controller kontrolcü
		 * @return {this}
		 */
		match: function( verbs, pattern, controller )
		{
			if( is( verbs, "string" ))

				verbs = [ verbs ];

			verbs.forEach( function( verb )
			{
				this[ verb ]( pattern, controller );
			},
			this );

			return this;
		},

		/**
		 * Verilen rotayı bütün http fiileri
		 * karşısında çalışacak şekilde ekler.
		 * 
		 * @param {String|Object} pattern rota
		 * @param {String|Function} controller kontrolcü
		 * @return {this}
		 */
		any: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "*", pattern, controller ));
		},

		/**
		 * Verilen rotayı ghost olarak ekler. Bu tür rotalar
		 * bir url ile eşleştiklerinde rota arayışı
		 * durdurulmaz, devam eder.
		 * 
		 * @param {String|Object} pattern rota
		 * @param {String|Function} controller kontrolcü
		 * @return {this}
		 */
		ghost: function( pattern, controller )
		{
			return this.pushToProperStack( this.createRoute( "ghost", pattern, controller ));
		},

		/**
		 * Verilen grup özellikleriyle yeni bir grup oluşturup bunu yeni bir
		 * rota yöneticisine vererek örnekler. Bu yönetici ilgili grup için
		 * çalışacak bir yöneticidir. Bu yönetici örneğin anonim bir metoda
		 * geçirilecek olursa metot içinde yönetici ile yapılacak tüm işlemler
		 * ilgili grup içine yansıyacaktır.
		 * 
		 * @param {Object} groupOptions yeni grubun özellikleri
		 * @return {RouteManager}
		 */
		createRouteManagerForSubGroup: function( groupOptions )
		{
			var group = this.createGroup( groupOptions );
			
			group.manager = RouteManager.new( group );

			this.pushToProperStack( group );

			return group.manager;
		},

		/**
		 * Bir grubu veya rotayı bulunması gereken yığın alanına ekler.
		 * 
		 * @param {Route|RouteGroup} item yığına eklenecek bir öğe
		 * @return {Route|RouteGroup}
		 */
		pushToProperStack: function( item )
		{
			return this.currentGroup

				// şuanda bir grubun içindeysek öğeleri bu grubun rota yığınına
				// eklemeliyiz bu durum group metodu kullanıldığında gerçekleşir
				? this.currentGroup.pushStack( item )

				// mevcutta bir grup yoksa bu manager arayüzü ilk defa örnekleniyor
				// ve hiç group metodu çalıştırılmamış demektir
				: this.pushStack( item );
		},

		/**
		 * Verilen rotayı veya rota grubunu bu yöneticinin rota yığınına ekler.
		 * 
		 * @param {Route|RouteGroup} item bir rota veya rota grubu
		 * @return {Route|RouteGroup}
		 */
		pushStack: function( item )
		{
			item.parent = this;
			
			is( item.init, "function" ) &&
				item.init();

			this.stack.push( item );

			return item;
		},

		/**
		 * Bu rota yöneticisini dışarıdan enjekte edilen bir rota grubu üzerinde
		 * çalışabileceği şekilde ayarlar. Bu işleyiş iç içe gruplar oluştururken
		 * gereklidir.
		 * 
		 * @param {RouteGroup} group bir rota grubu
		 */
		setSubGroup: function( group )
		{
			this.stack.push( this.currentGroup = group );
		},

		/**
		 * Tüm rotalara uygulanacak url ön eki.
		 * 
		 * @param {String} prefix url ön eki
		 * @return {this}
		 */
		prefix: function( prefix )
		{
			this.prf = prefix;
			return this;
		},

		/**
		 * Tüm rotalara uygulanacak controller ön eki.
		 * 
		 * @param {String} namespace controller ön eki
		 * @return {this}
		 */
		namespace: function( namespace )
		{
			this.ns = namespace;
			return this;
		},

		/**
		 * Genel bir kural oluşturur. Kuralın kontrol ettiği isimde
		 * parametre tanımlayan her rota bu kuraldan etkilenir.
		 * 
		 * @param {String} paramName rotadaki parametre adı
		 * @param {String|RegExp} regex düzenli ifade
		 * @param {Number} targetGroup düzenli ifade içinden kullanılması istenen grubun konumu
		 * @return {this}
		 */
		pattern: function( paramName, regex, targetGroup )
		{
			if( is( paramName, "array" ))
			{
				var root = this;

				paramName.forEach( function( paramName )
				{
					root.pattern( paramName, regex, targetGroup );
				});

				return this;
			}

			// düzenli ifade içinde sadece 1 tane parantez grubu geçiyorsa
			// geliştirici bunu 3. parametreye 1 yazarak belirtmelidir ancak
			// önündeki kodda zaten tek parantez grubu olduğu için ve bunun
			// da pozisyonu zaten 1 diye geçtiği için bunu yazmasını beklemek
			// iyi bir yol olmaz bu nedenle bunu burada biz yapacağız
			if( this.getRegExpGroupCount( regex ) === 1 )

				targetGroup = 1;

			regex.targetGroup = targetGroup || 0;

			this.rules[ paramName ] = regex;

			return this;
		},

		/**
		 * Verilen düzenli ifade içinde kaç tane parantezli grup olduğunu söyler.
		 * 
		 * @param {RegExp} regexp düzenli ifade
		 * @return {Number}
		 */
		getRegExpGroupCount: function( regexp )
		{
			regexp = regexp.source;

			return regexp.length - regexp.replace( /\(/g, "" ).length;
		},

		/**
		 * Verilen bir url yapısıyla eşleşme sağlayan
		 * bir rota olup olmadığını sınar.
		 * 
		 * @param {String} url sınanacak bir url dizin yapısı
		 * @return {Boolean}
		 */
		hasMatch: function( url )
		{
			return this.getMatch( url )
				? true
				: false;
		},

		/**
		 * Verilen url ile eşleşen rotanın kontrolcüsünü çalıştırır.
		 * @param {String} url bir url
		 */
		hit: function( url )
		{
			// önce url ile eşleşme arayalım
			var route = this.getMatch( trim( url, "/" ));

			// rota yoksa hata ekranı gösterelim
			if( ! route )

				console.warn( url + " adresi için rota bulunamadı." );

			else

				this.loadRoute( route );
		},

		/**
		 * Verilen bir url yapısıyla eşleşme sağlayan bir rota döndürür.
		 * 
		 * @param {String} url bir url
		 * @return {undefined|Object}
		 */
		getMatch: function( url )
		{
			var root = this;

			// önce rotalar render edilsin
			this.renderRoutes();

			return this.urlCache.remember( url, Infinity,
			function()
			{
				// url ilk defa rotalar üzerinde aranıyor, full tarama yapacağız
				return root.fullSearchRoutePool( url );
			},
			function( routeFromCache )
			{
				// url için önceden bir rota bulmuşuz aynı rotayı elde ettik
				// bu rotayı kullanıma hazır hale getirip döndürebiliriz
				return root.getReadyCachedRoute( routeFromCache, url );
			});
		},

		/**
		 * Kayıtlı rotalar havuzunu baştan sona verilen url ile eşleşen bir tane
		 * bulmak için tarar ve bulunan rotayı verilen url bilgileriyle hazır hale
		 * getirip döndürür.
		 * 
		 * @param {String} url bir url
		 * @return {Object}
		 */
		fullSearchRoutePool: function( url )
		{
			var root = this;

			return this.routes.search( function( route )
			{
				if( route = root.tryToMatchAndMakeItReady( route, url ))
				{
					// rota ghost türündeyse hemen burada çalıştıralım
					if( route.method == "ghost" )

						root.loadRoute( route );

					else

						return route;
				}
			});
		},

		/**
		 * Rota arama işlemi cache alanından sonuç verdiğinde verilen
		 * rotayı verilen url için hazır edip rotayı geriye döndürür.
		 * 
		 * @param {Route} route cache alanından elde edilmiş bir rota
		 * @param {String} url bir url
		 * @return {Route}
		 */
		getReadyCachedRoute: function( route, url )
		{
			return this.tryToMatchAndMakeItReady( route, url );
		},

		/**
		 * Verilen bir rotayı verilen url ile eşleştirmeye çalışır. Eşleşme
		 * sağlarsa url üzerinden elde ettiği verileri elindeki rotaya parametre
		 * olarak ekleyip hazır hale getirdikten sonra rotayı geri döndürür.
		 * 
		 * @param {Route} route bir rota
		 * @param {String} url bir url
		 * @return {Route|undefined}
		 */
		tryToMatchAndMakeItReady: function( route, url )
		{
			var qsMatchedRoute = this.tryToMatchQueryString( route );
			var captured;

			// query string türünde bir rotaysa ve url ile eşleştiyse
			if( qsMatchedRoute )

				return qsMatchedRoute;

			// query string türünde bir rota bu ama url ile eşleşmiyor
			else if( qsMatchedRoute === false )

				return;

			if( captured = extract( URL( url ).joinSegments(), route.pattern, route.rules ))

				return this.initRouteParamsByCapturedData( route, captured );
		},

		/**
		 * Geliştirici, rota filtresi oluştururken pattern olarak bir object verirse
		 * devreye girer ve geliştiricinin sağladığı "key:value" filtrelerinin hepsi
		 * url üzerinde tek tek test edilir ve geliştiricinin girdiği değerlerle 
		 * eşleşip eşleşmediğine bakılır. Eğer tümü eşleşiyorsa geriye verilen rota
		 * döndürülür. Eşleşme sağlanamazsa false değer dönülür.
		 * 
		 * @param {Route} route bir rota
		 * @return {Route|false|undefined}
		 */
		tryToMatchQueryString: function( route )
		{
			// rota yazarken querystring filtrelemesi object notasyonu şeklinde girilmeli
			if( is( route.pattern, "object" ))
			{
				var unequality = false;

				for( var name in route.pattern )
				{
					var valFromURL = app.uri.get( name );

					// rotada koşul tutulan query string url içinde
					// hiç yoksa veya varsa ama değerleri eşleşmiyorsa
					if( valFromURL !== route.pattern[ name ])

						unequality = true;
				}

				// geliştiricinin istediği tüm eşleşmeler başarılı olmuşsa
				if( ! unequality )
				{
					route.params = route.pattern;
					return route;
				}

				return false;
			}
		},

		/**
		 * Verilen rotanın parametre bölümüne, url üzerinden
		 * yakalanmış bilgileri parametre olarak dağıtır.
		 * 
		 * @param {Route} route bir rota
		 * @param {Object} data url üzerinden yakalanmış isimli değişkenler
		 */
		initRouteParamsByCapturedData: function( route, data )
		{
			each( data, function( name, value )
			{
				route.params[ name ] = value;
			});

			return route;
		},

		/**
		 * Verilen rotada varsa middleware kümesini çalıştırır
		 * ardından controller çalıştırılır.
		 * 
		 * @param {Route} route rota nesnesi
		 */
		loadRoute: function( route )
		{
			var root = this;

			// bütün middlewareler indirilsin
			this.loadMiddlewares( route.middlewares, function()
			{
				// kontrolcüyü yükleyelim
				root.loadController( route, function()
				{
					// ilk adımı alalım ve bunu çağrılabilir hale getirip
					// ilk çağırma işlemini manuel olarak buradan başlatalım
					// bu muhtemelen bir middleware olacağı için bunlar zaten
					// çalışmasını bitirince kendinden sonraki gelen adımı
					// çalıştıracaklar ve en sonunda controller çalışınca bu
					// süreç sonlanacak
					root.makeCallableNextTick( root.callStack.shift())
					();
				});
			});
		},

		/**
		 * Verilen middleware listesini önce dahil eder ardından
		 * verildiği sırayla çalıştırır ve sıralı çalışma yığınına ekler.
		 * 
		 * @param {Object} middlewares middleware yığını
		 * @param {Function} onReady tüm middleware yığını indirilip çalıştırıldığında tetiklenir
		 */
		loadMiddlewares: function( middlewares, onReady )
		{
			var map = [];
			var requireStack = [];
			var root = this;

			each( middlewares, function( name, params )
			{
				map.push( params );
				requireStack.push( "application/middleware/" + name );
			});

			// önce middleware dosyalarını topluca yükleyelim
			require( requireStack, function()
			{
				// bu callback'in her bir argümanında bir middleware bulunuyor
				// bunları tek tek dönersek orijinal sıralamayı bozmamış oluruz
				arg( arguments ).forEach( function( Middleware, i )
				{
					var middleware;

					// middleware olarak örneklenmemiş bir Middleware sınıfı ise örnekleyelim
					if( is( Middleware, Type ))

						middleware = Middleware.singleton();

					// bunların dışında bir şey ise tanımıyoruz
					else

						throw new TypeError( "Middleware türü bekleniyor: " + JSON.stringify( Middleware ));

					// if( is( Middleware, "type" ))
					// middleware'i sonraki adım olarak listeye ilave edelim
					root.pushCallStack( middleware, map[ i ]);
				});

				onReady();
			});
		},

		/**
		 * Verilen bir controller'ı yükler ve sıralı çalışma yığınına ekler.
		 *
		 * @param {Route} route route öğesi
		 * @param {Function} onReady controller dosyası yüklenip hazır hale geldiğinde tetilenir
		 */
		loadController: function( route, onReady )
		{
			var root = this;

			// controller bir function olabilir bu durumda yükleme yapmayacağız
			if( is( route.controller, "function" ))
			{
				this.pushCallStack( route.controller, route.params );
				onReady();
			}
			else if( is( route.controller, ControllerReference ))
			{
				var name = route.ns + "/" + camel2dash( route.controller.controller );
				var path = "application/controller/" + trim( name, "/" );

				/**
				 * Yükleme hatası durumunda devreye girecek metot.
				 */
				function onError()
				{
					exception( "BadControllerReference", name );
				}

				require([ path ], function( Controller )
				{
					if( ! Controller )

						return onError();

					var controller = app.setCurrentController( Controller.singleton());

					if( ! controller )

						return;

					root.pushCallStack( controller, route.params, route.controller.method );
					onReady();
				},
				onError );
			}
		},

		/**
		 * Sıralı çalışma yığınına bir öğe oluşturup ekler.
		 * 
		 * @param {Object} instance bir middleware veya controller örneği
		 * @param {Array} params parametre listesi
		 * @param {String} method controller metodu
		 */
		pushCallStack: function( instance, params, method )
		{
			this.callStack.push(
			{
				instance: instance,
				method: method,
				params: params
			});
		},

		/**
		 * Rota sıralı çalışma yığınına bir adım daha ekler. Bu metodun
		 * döndürdüğü değer çalıştırılabilir bir metottur ve nerede
		 * çalıştırılırsa çalışsın mutlaka çalışma yığınındaki sonraki
		 * adımın çalışmasını sağlar. Yani bir middleware boot metoduna
		 * parametre olarak verilirse ilgili middleware içinden sonraki
		 * adıma geçiş yapılabilir veya yapılmaz ve istek sonlandırılabilir.
		 * 
		 * @param {Object} current çalıştırılabiliri ve parametrelerini içeren bir nesne
		 * @return {Function}
		 */
		makeCallableNextTick: function( current )
		{
			var root = this;

			return function()
			{
				var instance = current.instance,
					params = current.params,
					method = current.method;

				// henüz tanımlı değilse instance üzerinde
				// times isimli bir property tanımlayalım
				if( ! instance.hasOwnProperty( "times" ))

					instance.times = 0;

				if( is( instance, "function" ))
				{
					var ctrl = Controller.new();

					ctrl.anonymouse = instance;
					
					ctrl.anonymouse.apply(
						ctrl,
						root.normalizeUrlParamsAsControllerArgs( params )
					);
					
					instance.times++
				}
				else if( instance.is( Middleware ))
				{
					// boot metodu tanımlı değilse istisna fırlatalım
					if( ! is( instance.boot, "function" ))

						throw new Error( "application/middleware/" +
							instance.type.name.toLowerCase() +
							".js türü altında geçerli bir \"boot\" metodu bulunamadı!" );

					var args = [];

					// ikinci argüman sonraki adıma geçişi sağlayan bir metot olur
					args.push( root.makeCallableNextTick( root.callStack.shift()));

					// middleware için geliştiricinin rotaya girdiği parametreler
					// yazıldıkları sırayla yukarıdaki parametrelerden sonra
					// olacak şekilde alınabilir olsunlar
					args = args.concat( params );

					// middleware'in boot metodunu yine kendi etki alanında kalacak
					// şekilde ancak bizim oluşturduğumuz parametrelerle çağıralım
					instance.boot.apply( instance, args );

					instance.times++
				}
				else if( instance.is( Controller ))
				{
					// controller üzerinde belki henüz adı verilen metot
					// geliştirici tarafından tanımlanmamış olabilir
					if( ! instance[ method ])

						throw Error( "Controller metodu tanımsız: " + instance.constructor.name + "@" + method );

					instance.arg = params;

					instance[ method ].apply
					(
						instance,
						root.normalizeUrlParamsAsControllerArgs( params )
					);

					instance.times++
				}

				return instance;
			}
		},

		/**
		 * İsimli url parametrelerinin değerlerinden dizi oluşturur, değerleri
		 * işler ve ilgili controller metoduna parametre olarak enjekte
		 * edilebilir hale getirip döndürür.
		 * 
		 * @param {Object} params parametre listesi
		 * @return {Array}
		 */
		normalizeUrlParamsAsControllerArgs: function( params )
		{
			params = Object.values( params );

			return params.map( function( item )
			{
				var value = item && is( item, "numeric" )
					? parseInt( item, 10 )
					: item;

				return value;
			});
		},

		/**
		 * Adı verilen rotaya verilen parametreler teslim
		 * edilir ve elde edilen url döndürülür.
		 * 
		 * @param {String} name rota adı
		 * @param {Object} params parametreler
		 * @return {String}
		 * @throws {ReferenceError} adı verilen rota bulunamadığında fırlatılır
		 */
		getRouteURi: function( name, params )
		{
			var route = this.getRoute( name );

			if( ! route )

				throw ReferenceError( name + " isimli rota bilinmiyor." );

			return route.getURi( params );
		},

		/**
		 * Adı verilen rotayı cache alanından döndürür.
		 * 
		 * @param {String} name rota adı
		 * @return {Route}
		 */
		getRoute: function( name )
		{
			return this.routes.get( name );
		}
	});

	return RouteManager;
});
