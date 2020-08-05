define(
[
	"system/helper/url",
	"system/helper/array",
	
],
function( URLHelper, ArrHelper )
{
	return function URL( str )
	{
		if( ! ( this instanceof URL ))

			return new URL( str );

		// ana etki alanı
		var root = this;

		// str tanımsızsa ama document.URL mevcutsa bunu kullanalım
		if( ! str && window && window.document && document.URL )

			str = document.URL;

		/**
		 * Orijinal url.
		 * @type {string}
		 */
		this.original = str;

		/**
		 * Url parçaları.
		 * @type {Object}
		 */
		this.parts = URLHelper.parse( str );

		/**
		 * uri içindeki dizinsel yapılar
		 * @type {Array}
		 */
		this.segments = [];

		/**
		 * uri içindeki dizinsel yapıların içinden
		 * site kök dizini çıkarılmamış saf hali.
		 * 
		 * @type {Array}
		 */
		this.rawSegments = [];

		/**
		 * uridaki domain ve querystring dışında kalan dizin
		 * yapılarını ayrıştırır
		 */
		this.parseSegments = function()
		{
			var baseurlPaths;

			// önce örneklenen url'in string bir değer tuttuğundan emin
			// olup sonra urlde bulunan dizin yapısını array haline getirelim
			this.rawSegments = ( this.parts.path || "" ).split( "/" );

			// sitenin kök urlsini yapıtaşlarına ayıralım ve string bir değer
			// tuttuğundan emin olalım site kök urlsinde bulunan dizinleri
			// array haline getirelim
			baseurlPaths = URLHelper.parse( app.baseurl()).path || "";
			baseurlPaths = baseurlPaths.split( "/" );

			this.segments = ArrHelper.removeWith( this.rawSegments, baseurlPaths );
		}

		/**
		 * uri segmentlerini ilişkilendirir
		 *
		 * 		example.com/user/search/name/joe/location/UK/gender/male
		 *
		 * 		{
		 * 			name: "joe",
		 * 			location: "UK",
		 * 			gender: "male"
		 * 		}
		 * 
		 * @param {Integer} start başlanacak segment pozisyonu
		 * @return {Object}
		 */
		this.assocSegments = function( start )
		{
			return ArrHelper.assoc( this.segments.slice( start || 0 ));
		}

		/**
		 * Sıra numarası verilen segment değerini döndürür. Negatif değerler
		 * sondan başla anlamına gelir. Sıra numaraları 1den başlar. 1 ilk eleman
		 * demek, -1 son eleman demektir.
		 * 
		 * @param {Integer} i negatif veya pozisif bir sıra numarası
		 * @return {String}
		 */
		this.segment = function( i )
		{
			i = i < 0
				? this.segments.length + i
				: i - 1;

			return this.segments[ i ];
		}

		/**
		 * Sıra numarası verilen segmente yeni değeri yazar.
		 * 
		 * @param {Integer} i yazılacak segmentin sıra numarası
		 * @param {String} val segmente yazılacak yeni veri
		 */
		this.setSegment = function( i, val )
		{
			i = i < 0
				? this.segments.length + i
				: i - 1;

			this.segments[ i ] = val;
		}

		/**
		 * Temsil edilen URL'in hash bölümüne yazar.
		 * 
		 * @param {String} hash hash ifadesi
		 * @return {this}
		 */
		this.setHash = function( hash )
		{
			this.parts.hash = hash;
			return this;
		}

		/**
		 * Adı veya pozisyonu verilen segment var mı yok mu kontrol eder.
		 * 
		 * @param {String|Number} name sorgulanacak olan segment değeri veya pozisyonu
		 * @return {Boolean}
		 */
		this.hasSegment = function( name )
		{
			if( is( name, "string" ))

				return this.segments.indexOf( name ) > -1;

			if( is( name, "number" ))

				return this.segments.length - 1 >= name;
		}

		/**
		 * Mevcut segmentleri aralarına verilen karakterden ekleyerek birleştirip
		 * döndürür. Eğer hiç segment yoksa segment alanını temsilen bir tane
		 * ayırıcı karakter döndürülür.
		 *
		 * Ayırıcı karakterin varsayılan değeri: "/"
		 * 
		 * @param {String} glue bir karakter
		 * @return {String}
		 */
		this.joinSegments = function( glue )
		{
			glue = glue || "/";

			if( this.segments.length == 0 )

				return glue;

			return this.segments.join( glue );
		}

		/**
		 * QueryString havuzunda adı verilen değişkeni döndürür.
		 * 
		 * @param {String} name istenen url değişkeninin adı
		 * @param {mixed} deflt varsayılan değer
		 * @return {String}
		 */
		this.get = function( name, deflt )
		{
			var item = this.parts.query.items[ name ];

			return ( item && decodeURI( item )) || deflt;
		}

		/**
		 * QueryString havuzuna adı verilen değişkeni ilave eder.
		 * 
		 * @param {String} name eklenecek değişkenin adı
		 * @param {String|Numeric} value değişken değeri
		 * @return {this}
		 */
		this.set = function( name, value )
		{
			this.parts.query.items[ name ] = value;
			return this;
		}

		/**
		 * QueryString havuzundan adı verilen değişkeni siler geriye
		 * sildiği değişkenin değerini döndürür.
		 * 
		 * @param {string} name silinecek değişken adı
		 * @return {string}
		 */
		this.unset = function( name )
		{
			var val = this.get( name );

			delete this.parts.query.items[ name ];

			return val;
		}

		/**
		 * Mevcut parçalanmış url yapısını tekrar birleştirip döndürür.
		 * @return {string}
		 */
		this.rebuild = function()
		{
			var hash = this.parts.hash? "#" + this.parts.hash : "";
			return this.url() + hash + URLHelper.serializeQuerystring( this.parts.query.items );
		}

		/**
		 * Temsil edilen URL'in query string bölümü olmadan
		 * domain ve path bölümlerini birleştirip döndürür.
		 * 
		 * @return {String}
		 */
		this.url = function()
		{
			var r = "";

			// protokol
			r += this.parts.protocol + "://";
			// alan adı
			r += this.parts.host.orig;
			// port bölümü
			r += this.parts.port? ":" + this.parts.port : "";
			// dizin kısmı
			if( this.rawSegments.length > 0 )
			
				r += "/" + this.rawSegments.join( "/" );

			return r;
		}

		/**
		 * Rebuild metodunun kısayoludur.
		 * @return {String}
		 */
		this.toString = function()
		{
			return this.rebuild();
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.parseSegments();
		}

		this.init();
	}
});
