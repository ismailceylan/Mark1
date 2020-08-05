/*
| -----------------------------------------------------------------------
| Popup by Ismail CEYLAN
| -----------------------------------------------------------------------
| Bu eklentisi, web sayfamızdaki eklentilerin ihtiyaçları için popup
| pencereler üretir ve onların kontrol edilmesi için uygun bir arayüz
| sağlar.
|
| -----------------------------------------------------------------------
| Kurulum
| -----------------------------------------------------------------------
| var menu = new Popup({ to: "mouse", puff: true, single: true });
|
| 	  menu.body( $( "<p>Lorem ipsum</p>" ));
|
|	  var paragraph = menu.find( "p" );
|
|	  menu.show();
| 
|
| -----------------------------------------------------------------------
| Gereksinimler
| -----------------------------------------------------------------------
|
| Aşağıdaki koşullar script'in çalışması için gereklidir;
|
| 1. jQuery 2.1.1
| 2. Anonstyle
| 3. Zindex
|
*/

define(
[
	"system/helper/physic/alignment",
	"system/machine/anonstyle",
	"system/machine/zindex"
],
function( alignment )
{
	window.Popup = function Popup( options, onInitialized )
	{
		/**
		 * Etki alanını yedekler.
		 * @type {Object}
		 */
		var root = this;

		// açık popuplar için bir liste tutalım ki
		// yönetimi bu liste üzerinden sağlayalım
		if( ! Popup.popups )

			Popup.popups = { length: 0 }

		/**
		 * Popup html iskeletini tutar.
		 * @type {String}
		 */
		var skeleton = '<div class="popup"></div>';

		/**
		 * Popup görünümünü biçimlendirir.
		 * @type {String}
		 */
		var style = ".popup{ position:fixed; background:#FFF; min-width:250px; min-height: 40px }";

		/**
		 * Popup için benzersiz bir id değeri tutar. Nesne örneklendiği anda belirlenir ve sayfa kapanmadıkça
		 * bir daha değişmez.
		 * @type {Number}
		 */
		this.id = ( new Date ).getTime();

		/**
		 * Popup ekranda mı değil mi bilgisini tutar.
		 * @type {Boolean}
		 */
		this.isOpen = false;

		/**
		 * Popup nesnesini alıp geliştiren başka bir nesneyi tutar. Bir nevi popupın
		 * ebeveynini tutar.
		 * 
		 * @type {Object}
		 */
		this.role = null;

		/**
		 * Popup iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new ( function()
		{
			this.body = $( skeleton );
			// popup'ın idsini set edelim
			this.body.attr( "id", "popup-" + root.id );
		})();

		/**
		 * Ayarları tutar.
		 * @type {Object}
		 */
		this.options = $.extend(
		{
			/**
			 * Popup başka bir eklenti tarafından örneklenip üzerine
			 * yeni özellikler eklenerek geliştiriliyor ise bu
			 * eklentinin örneğidir. Bu değer atanırsa popup eklentisi
			 * kendi show ve hide metotlarından feragat edip üst eklentinin
			 * bu metotları sağlamasını talep eder.
			 * 
			 * @type {Object}
			 */
			role: null,

			/**
			 * Popupın hedef nesnenin hangi bölgesine hizalanacağı.
			 * @type {String}
			 */
			align : "start-bottom-left",
			
			/**
			 * Popup için referans alınacak öğe konumu.
			 * @type {Array}
			 */
			to : [ 100, 100 ],

			/**
			 * Single özellikli popuplardan istek
			 * gelirse buna uyulup uyulmayacağı.
			 * 
			 * @type {Boolean}
			 */
			puffy : true,

			/**
			 * Bu popupın ekranda tek popup olup olmayacağı. True
			 * olarak ayarlanırsa diğer popuplardan puffy özellikli
			 * olanlar kapatılır, diğerleri kapatılmaz.
			 * 
			 * @type {Boolean}
			 */
			single : true
		},
		options );

		/**
		 * Tüm popupların anonim stillerini yönetecek arayüz örneğini tutar. Aslında popup IDsine
		 * gerek yoktu ama arayüz isimalanı üzerinde işliyor. ekranda aynı anda 1'den fazla popup
		 * bile olsa anonim stil alanına 1 defa popup isminde kayıt oluyordu buraya kadar sorun yok
		 * ancak popuplardan 1 tanesi bile kapansa anonim stil alanında hiç popup stili kalmıyordu
		 * (ortak isimalanı kullanıldığı için) bu olmasın diye her popup kendi anonim stilini dökümana
		 * kaydetmeli bu stil alanında gereksiz tekrara sebep olsa da popuplar çok fazla ekranda
		 * kalmayacağından bu fazlalık kısa süre içinde yok olacak bir fazlalık.
		 * @type {anonstyle}
		 */
		this.stylize = Anonstyle.new( "popup" );

		/**
		 * Popupları bir isim alanı altında toplayıp diğer eklentilere göre zindexini
		 * ayarlamayı sağlayan arayüzün örneğini tutar.
		 * @type {zindex}
		 */
		this.layer = new Zindex( "popup-" + this.id );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Pencere ebatları değiştiğinde tetiklenir.
			 */
			onWindowResize: function()
			{
				root.locate( root.options.align );
			},

			/**
			 * Global sıralamadaki derinlik sıralamamız ilgili
			 * yönetici tarafında değiştirildiğinde tetiklenir.
			 * 
			 * @param {integer} index yeni z-index pozisyonu
			 */
			onGlobalZIndexChange: function( index )
			{
				root.skeleton.body.css({ "z-index": index });
			},

			/**
			 * Olay dinleyicileri set eder.
			 */
			attach: function()
			{
				$( window ).on( "resize", this.onWindowResize );

				root.layer.attach( this.onGlobalZIndexChange );
			}
		}

		/**
		 * Popup'ın register fonksiyonelliğini tutar. Bu özellikler bütünü sayesinde birbiri üzerine
		 * sınırsız sayıda açılan popup desteği sağlanacağı gibi bazı popupların açılması diğer tüm
		 * açık popupların kapanmasını sağlayabilir.
		 * 
		 * @type {Object}
		 */
		this.reg =
		{
			/**
			 * Ekranda açık olan popup sayısını döndürür.
			 * @return {Integer}
			 */
			length: function()
			{
				return Popup.popups.length;
			},

			/**
			 * Register alanına Popup'ı ekler. Zaten eklenmişse işlem yapmaz.
			 * @return {void}
			 */
			attach: function()
			{
				// eğer listede yoksa devam edelim
				if( ! this.isopen())
				{
					Popup.popups[ "popup-" + root.id ] =
					{
						// kolayca erişmek için popup IDsini yedekleyelim
						id: root.id,
						// popup ekrana geliş anını tutalım
						openedAt: ( new Date ).getTime(),
						// popupı örneklendiği yer dışında başka noktalardan yönetmek gerekirse diye instance ayıralım
						instance: root
					}

					// yeni bir nesne eklendiği için sayıyı güncelleyelim
					Popup.popups.length++
				}
			},

			/**
			 * Popupı listeden çıkartır.
			 * @return {void}
			 */
			dettach: function()
			{
				// eğer listedeysek devam edeceğiz
				if( this.isopen())
				{
					// listeden silelim
					delete Popup.popups[ "popup-" + root.id ];

					// eleman sayısını güncelleyelim
					Popup.popups.length--
				}
			},

			/**
			 * Popup mevcutsa true değilse false döner.
			 * @return {Boolean}
			 */
			isopen: function()
			{
				return Popup.popups.hasOwnProperty( "popup-" + root.id );
			},

			/**
			 * Popup'ın ne kadar süredir açık olduğunu söyler. Popup açık değilse 0 döner.
			 * @return {Integer}
			 */
			when: function()
			{
				// güncel zamanı alalım
				var now = ( new Date ).getTime();

				// listedeysek zamanı, değilsek 0 döndürelim
				return this.isopen()
					? Math.round(( now - Popup.popups[ "popup-" + root.id ].openedAt ) / 1000 )
					: 0;
			},

			/**
			 * Popup açık durumdaysa adı verilen özelliğini döndürür. Açık değilse undefined döner.
			 * 
			 * @param  {String} item istenen özelliğin adı
			 * @return {Mixed}
			 */
			info: function( item )
			{
				// açık değilse işlem yapmıyoruz
				if( ! this.isopen( )) return "s";

				return Popup.popups[ "popup-" + root.id ][ item ];
			}
		}

		/**
		 * Popup'ı istenen element veya mouse pozisyonuna göre hizalar.
		 *
		 * @param {String} pos popupın hedef elementin hangi noktasına göre hizalanacağı
		 * @event overflow popup belirtilen konuma yerleştirilince ekrandan taşıyorsa oluşur
		 */
		this.locate = function( pos )
		{
			pos = pos || "start-bottom-left";

			var o = alignment( pos, this.options.to, this.skeleton.body );

			$( this ).trigger( "overflow",
			[
				this,
				root.overflow = o.overflow
			]);

			this.skeleton.body.css(
			{
				top: o.top,
				left: o.left
			});
		}

		/**
		 * Popupı görünür yapar.
		 * @event open popup ekrana geldiğinde oluşur
		 */
		this.show = function()
		{
			// zaten ekrandaysa işleme gerek yok
			if( this.isOpen )

				return;

			// eklenecek alan ya all elementi, yoksa body alanına ekleyeceğiz
			var target = $( document.body ).find( ".all" ).eq( 0 );
				target = target.length == 0
					? $( document.body )
					: target;

			// iskelet stillerini dökümana ilave edelim
			this.stylize.push( "all", style );
			// iskeleti dökümana ilave edelim
			target.append( this.skeleton.body );

			// sayfada kapanması mümkün olan popupları kapatalım
			this.makeSingle();

			// popup'ı açtığımıza göre register edelim
			this.reg.attach();

			// popup konumunu ayarlayalım
			this.locate( this.options.align );

			// popup ekrana geldiğine göre uygun bir olay tetiklensin
			$( this ).trigger( "open", this );
			
			this.isOpen = true;
		}

		/**
		 * Ekranda görünmekte olan Popup'ı kaybeder.
		 * @event close popup ekrandan gizlendiğinde oluşur
		 */
		this.hide = function()
		{
			// ekranda değilse işleme gerek yok
			if( ! this.isOpen )

				return;

			// dökümandan alalım
			this.skeleton.body.remove();
			// popupın tüm stillerini dökümandan silelim
			this.stylize.destroy( "all" );

			// registerdan alalım
			this.reg.dettach();

			// popup ekrandan gitti uygun bir olay tetiklensin
			$( this ).trigger( "close", this );

			this.isOpen = false;
		}

		/**
		 * Popup açıksa gizler, gizliyse açar.
		 */
		this.toggle = function( callback )
		{
			var job = this.reg.isopen()
				? "hide"
				: "show";

			// popup açılsın veya kapansın
			this[ job ]();

			// dinleyici işleve ne yaptığımızı söyleyelim
			if( callback ) callback( job );
		}

		/**
		 * Popup gövdesinde jQuery araması yapar.
		 * 
		 * @param {Mixed} selector jQuery selector ifadesi
		 * @return {Object jQuery}
		 */
		this.find = function( selector )
		{
			return this.skeleton.body.find( selector );
		}

		/**
		 * Popup gövdesine verilen jQuery elementini ilave eder.
		 * @param {Object jQuery} el uygulanacak element
		 */
		this.append = function( el )
		{
			this.skeleton.body.append( el );
		}

		/**
		 * Popup gövdesine verilen jQuery elementini önce gelecek şekilde ilave eder.
		 * @param {Object jQuery} el uygulanacak element
		 */
		this.prepend = function( el )
		{
			this.skeleton.body.prepend( el );
		}

		/**
		 * Popup gövdesinde sadece verilen element yer alır.
		 * @param {Object jQuery} el uygulanacak element
		 */
		this.html = function( el )
		{
			this.skeleton.body.html( el );
		}

		/**
		 * Popup ana penceresine bir css class'ını parametre olarak ekler.
		 * @param {String} cls eklenecek css class adı
		 */
		this.addClass = function( cls )
		{
			this.skeleton.body.addClass( cls );
		}

		/**
		 * Popup ana penceresine bir css class'ını parametre olarak ekler.
		 * @param {String} cls eklenecek css class adı
		 */
		this.removeClass = function( cls )
		{
			this.skeleton.body.removeClass( cls );
		}

		/**
		 * Popup ana penceresinin herhangi bir parametresini değiştirir.
		 * 
		 * @param {String} param düzenlenecek parametre adı
		 * @param {String} val   parametrenin değeri
		 */
		this.attr = function( param, val )
		{
			this.skeleton.body.attr( param, val );
		}

		/**
		 * Popup elementine kısa yoldan ulaşmayı sağlar. Element zaten jQuery nesnesi olduğu
		 * için kütüphane metodlarını kullanmak mümkün olur.
		 */
		this.$ = this.skeleton.body;

		/**
		 * Ekranda kapanmasında sorun olmayacak açık popupları kapatır.
		 */
		this.makeSingle = function()
		{
			if( this.options.single )
			
			for( i in Popup.popups )
			{
				if( i == "length" ) continue;

				var item = Popup.popups[ i ].instance;

				if( item.options.puffy )
				{
					item.role
						? item.role.hide()
						: item.hide();
				}
			}
		}

		/**
		 * Eklenti ayarlarını tamamlayıp herşeyi hazır hale getirir.
		 */
		this.init = function()
		{
			// ayarlardan role atanmışsa bunu ana etki alanı üzerindeki ilgili özelliğe geçirelim
			this.role = this.options.role;
			
			// native elemente etki alanını yedekleyelim böylece fonksiyonelliği direkt dökümandaki
			// elementi seçerek kullanabiliriz.
			this.skeleton.body[ 0 ].instance = this;

			// olay dinleyicileri attach edelim
			this.listener.attach();

			// popup hazır ilgili callbacki çalıştıralım
			if( onInitialized && onInitialized instanceof Function )

				onInitialized.call( this );
		}

		// kurulumu başlatalım
		this.init();
	}

	return Popup;
});
