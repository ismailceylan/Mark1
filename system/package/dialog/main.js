/*
| -----------------------------------------------------------------------
| Dialog by Ismail CEYLAN
| -----------------------------------------------------------------------
| Bu jQuery eklentisi, web sayfaları için diyalog pencereleri oluşturur.
|
| Pratik bir kullanım sağlamak amacıyla html5 destekli tasarlandı. Eski
| bazı tarayıcı sürümleri tarafından desteklenmeyebilir.
|
| -----------------------------------------------------------------------
| HTML Kurulum
| -----------------------------------------------------------------------
| <a href="#" data-role="dialog" data-remote="file.php?q=test">Show</a>
|
| -----------------------------------------------------------------------
| Runtime Kurulum
| -----------------------------------------------------------------------
| var danger = new Dialog({ title: "Warning!" });
|	  danger.open();
|
| veya
|
| Dialog.alert( "test" );
|
*/
define(
[
	"text!./view/body.xml",
	"text!./css/style.min.css",
	"system/core/type",
	"./traits/actionable",
	"./traits/remoteable",
	"./traits/stateable",
	"system/core/view",

	"system/machine/zindex",
	"system/machine/anonstyle",
],
function( skeleton, styles, Type, Actionable, Remoteable, Stateable, View )
{
	return Type( "Dialog" ).use( Actionable, Remoteable, Stateable ).prototype(
	{
		/**
		 * Eklenti için hayati öneme sahip ayar değişkenleri, kullanıcının
		 * insiyatifine kalmadan default değerlere sahip olabilmesini
		 * sağlamamız gerekiyor. Yoksa kod işleyişinde hatalar oluşur.
		 * 
		 * @type {Object}
		 */
		options:
		{
			/**
			 * Dialog başlık çubuğunda görünecek metin.
			 * @type {String}
			 */
			title: "Uyarı",
			
			/**
			 * Kapanma işleminde uygulanacak bir efekt adı [undefined,fade,crt]
			 * @type {String}
			 */
			closeEffect: "fade",

			/**
			 * İçeriği dialog gövdesinde gösterilecek bir uzak http url.
			 * @type {String}
			 */
			remote: null,

			/**
			 * Dialoğu genişleten sınıfın/paketin adı.
			 * @type {String}
			 */
			role: null
		},

		/**
		 * Dialog penceresi için benzersiz bir id tutar.
		 * @type {Integer}
		 */
		id: null,

		/**
		 * Dialoğun ekranda olup olmadığı.
		 * @type {Boolean}
		 */
		isOpen: false,

		/**
		 * Dialoğa mevcut şeklini veren komut setini tutar.
		 * @type {String|StringGroup}
		 */
		currentState: null,

		/**
		 * Katman yönetim arayüzünün örneğini tutar.
		 * @type {Zindex}
		 */
		layer: null,
		
		/**
		 * Tüm dialoglar için aynı stili kullanacağımızdan bir tane
		 * dialog adında isim alanı tanımlayıp ona özel çalışan bir
		 * anonim stil arayüzü örneği tutar.
		 * 
		 * @type {Anonstyle}
		 */
		styles: null,

		/**
		 * Dialog iskelet yapısı.
		 * @type {View}
		 */
		view: null,

		/**
		 * Kurulumu yapar.
		 * @param {Object} options kurulumsal ayarlar
		 */
		construct: function( options )
		{
			this.listeners = new this.listeners( this );
			this.options = $.extend( this.options, options );
			this.id = ( new Date()).getTime();
			this.layer = new Zindex( "dialog-" + this.id );
			this.styles = Anonstyle.new( "dialog-" + this.id );

			this.view = View.new( skeleton, function( root )
			{
				this.$dialog.attr( "id", "dialog-" + root.id );

				// dialoğun yerleştirileceği bir alana ihtiyaç var güzel bir
				// efekt olarak arkaplanda kalan herşeye blur verebilmek için
				// bütün sayfanın direkt body içinde değil de bir div içinde
				// kodlanması gerekir böylece bu div'e blur verebiliriz ancak
				// böyle bir yapı kurulmamışsa dialoğu direkt body içine push
				// edeceğiz
				var all = $( "body>.all" );

				if( all.length > 0 )
				
					this.assign( "all", all );

				else

					this.assign( $( document.body ));

				this.$overlay.append( this.$content );

				if( root.options.role )

					this.$dialog.addClass( root.options.role );
			},
			this );
		},

		/**
		 * Olay dinleyici metotları tutar.
		 * @type {Object}
		 */
		listeners: function( root )
		{
			/**
			 * Uygulama seviyesinde ekran temizleme
			 * olayı gerçekleştikçe tetiklenir.
			 */
			this.onAppScreenCleaned = function()
			{
				root.close();
			}

			/**
			 * Kullanıcı klavyeden bir tuşa bastığında tetiklenir.
			 * @param {Object} e olay bilgileri
			 */
			this.onKeyPress = function( e )
			{
				// ESC tuşuna basılmışsa pencere kapansın
				if( 27 == e.keyCode )

					root.close();
			}

			/**
			 * Dialoğun kenar boşluklarına tıklandığında tetiklenir.
			 * @param {Object} e olay bilgileri
			 */
			this.onBlankClick = function( e )
			{
				if( e.target.id == "dialog-" + root.id )
					
					root.close();
			}

			/**
			 * Başlık çubuğundaki çarpı simgesine tıklandığında tetiklenir.
			 */
			this.onCloseIconClick = function()
			{
				root.close();
			}

			/**
			 * Dinlenmesi gereken elementlerin dinlenmesi gereken
			 * olaylarına ilgili olay dinleyici metotları attach eder.
			 */
			this.attach = function()
			{
				$( window )
					.on( "keydown", this.onKeyPress )

				$( app )
					.on( "screen-cleaned", this.onAppScreenCleaned );

				root.view.$dialog
					.on( "click", this.onBlankClick );

				root.view.$close
					.on( "click", this.onCloseIconClick );
			}

			/**
			 * Bazı elementler dökümandan silinmediği için bunların
			 * olaylarını dinlemeyi kendimiz bırakmalıyız (mesela window nesnesi)
			 */
			this.dettach = function()
			{
				$( window )
					.off( "keydown", this.onKeyPress );

				$( app )
					.off( "screen-cleaned", this.onAppScreenCleaned );
			}
		},

		/**
		 * Dialoğun başlığını değiştirir.
		 * @param {String} title Başlık metni
		 */
		title: function( title )
		{
			if( ! title )

				this.view.$titlebar.hide();

			else

				this.view.$titleText.html( title );
		},

		/**
		 * Dialoğun gövdesini değiştirir.
		 * @param {String} content Dialog gövdesi
		 */
		body: function( content )
		{
			this.view.$body.html( content );
		},

		/**
		 * Dialog gövdesindeki bir elementi döndürür.
		 * 
		 * @param {String} selector Seçilmek istenen gövdedeki element
		 * @return {jQuery}
		 */
		find: function( selector )
		{
			return this.view.$body.find( selector );
		},

		/**
		 * Dialog penceresinin ekranda görünmesini sağlar. Bunu
		 * yaparken efekt vb. istekler varsa onları da yerine
		 * getirmekten sorumludur.
		 * 
		 * @event beforeOpen dialog penceresi ekrana gelmeden hemen önce oluşur
		 * @event opened     dialog penceresi ekrana geldikten sonra oluşur
		 */
		open: function()
		{
			// pencereyi önceden zaten açmışsak işlem yapmıyoruz
			if( this.isOpen )

				return;

			// açılmadan önce user tanımlı callbacki çalıştıralım
			// belki de açılmamızı return deyimiyle iptal etmişse
			// açılmadan önce son bir çıkış kapısı vermiş oluruz
			if( is( this.beforeOpen, "function" ) && this.beforeOpen() === false )

				return;

			var view = this.view;

			// öncelikle efektler için dialoğun
			// görünmez olduğundan emin olalım
			// view.$dialog.hide();

			// eğer .all isimli tüm gövdeyi saran ana bir div mevcutsa
			// bunun yüksekliğini yok edersek dialog ekrandayken sadece
			// dialoğun içeriği kaydırılabilir olur
			view.$all
				.addClass( "back-plan" )
				.height( $( document ).height());

			this.window_scrolled = $( window ).scrollTop();

			// window nesnesinde bütün dialog pencerelerinin yönetiminden
			// sorumlu nesneye bildirimde bulunalım
			// window.dialogs.opened( root.id );

			// dialog iskeletini sayfaya ekleyelim
			$( document.body ).append( view.$dialog );

			// anonim stillerimizi set edelim
			this.styles.push( "all", styles );

			// olayları attach edelim
			this.listeners.attach();
			// uygun bir olay tetikleyelim
			$( this ).trigger( "opened" );
			// dialog durum bayrağını set edelim
			this.isOpen = true;

			setTimeout( function()
			{
				view.$dialog.addClass( "fade-in" );
			}, 50 )
		},

		/**
		 * Dialog penceresinin state ayarlarıyla oynayarak
		 * eski tip crt monitörlerdeki gibi görüntünün kaybolmasını
		 * canlandırır. Düzgün çalışabilmesi için css tarafında
		 * transition değerlerinin doğru ayarlanmış olması gerekir.
		 * 
		 * @param {Function} callback animasyon bittiğinde çalışacak bir metot
		 */
		CRTOut: function( callback )
		{
			var root = this;

			// ekranın tam ortasında uzun tek piksel
			// yüksekliğinde bir çizgi şekline getirelim
			this.state( "hor-sm" );

			// yukarıdaki işlem css transition yapacağı için
			// onun bitmesini beklememiz gerekiyor
			setTimeout( function()
			{
				// şimdi de en boy tek piksele düşsün
				root.state( "" );

				// elbette bu işlemin de animasyonunu
				// beklememiz gerekiyor
				setTimeout( function()
				{
					// animasyonumuz tamam callbacki çalıştıralım
					callback();
				},
				300 );
			},
			200 );
		},

		/**
		 * Dialoğu ekrandan yavaşça kaybeder, dökümandan silmez.
		 * @param {Function} callback animasyon bittiğinde çalışacak bir metot
		 */
		fadeOut: function( callback )
		{
			this.view.$dialog.removeClass( "fade-in" );
			this.view.$all
				.removeClass( "back-plan" )
				.removeAttr( "style" );

			setTimeout( function()
			{
				callback();
			},
			200 );

			return;

			var root = this;

			// önce efekti uygulayalım
			this.view.$dialog.fadeOut( 300, function()
			{
				// .all isimli tüm gövdeyi saran ana
				// divin yüksekliğini fixlemiştik bunu
				// şimdi serbest bırakalım
				root.view.$all
					.removeClass( "back-plan" )
					.removeAttr( "style" );

				// callbacki çalıştıralım
				callback();
			});
		},

		/**
		 * Dialog penceresinin ekrandan sorunsuz biçimde yok edilmesini
		 * sağlar. Gereken efekt vb. işlemleri yerine getirir.
		 *
		 * @param {String} effect kapanırken uygulanacak bir efekt, belirtilmezse anında kapatılır [crt,fade]
		 * @event beforeClose dialog penceresi kapatılmadan hemen önce oluşur
		 * @event closed      dialog penceresi kapatıldıktan sonra oluşur
		 */
		close: function( effect )
		{
			// kullanıcı tanımlı callbacki çalıştıralım
			// belki de kapnmamıza engel olacak bir return
			// deyimi kullanılmışsa son bir iptal seçeneği
			// sağlamış olacağız
			if( is( this.beforeClose, "function" ) && this.beforeClose() === false )

				return;

			var root = this;

			/**
			 * Hemen kapatma işlemini yapar. Nihai kapanma
			 * rutinini belirler.
			 */
			var closer = function()
			{
				// buton yöneticisini ve ayarlarını sıfırlayalım
	//			root.button.reset();
				// belleği şişirmemek adına
				// çöplerimizi toplayalım
				root.view.$dialog.remove();
				root.styles.destroy( "all" );

				// olayları dinlemeyelim
				root.listeners.dettach();
				// bir olay tetikleyelim
				$( root ).trigger( "closed" );
				// durum bayrağını ayarlayalım
				root.isOpen = false;
				// önceki açık pencereleri eski haline getirelim
	//			root.update_old( "front-plan" );
				// pencerenin kapandığını yönetim arayüzüne bildirelim
	//			window.dialogs.closed( root.id );
			}

			effect = effect || this.options.closeEffect;

			if( ! effect )

				closer();

			else if( effect == "crt" )
			
				this.CRTOut( closer );

			else if( effect == "fade" )

				this.fadeOut( closer );
		},

		/**
		 * Kurulumu yapar.
		 */
		init: function()
		{
			var root = this;

			// katman yöneticisine bir dinleyici kaydedelim böylece
			// katman sıralamamız dışarıdan gerekiyorsa değiştirilebilir.
			this.layer.attach( function( z )
			{
				root.view.$dialog.css({ "z-index": z });
			});

			// ayarlarda başlık varsa alıp iskeletteki yerine set edelim
			this.title( this.options.title );

			// ayarlarda uzak bir kaynaktan içerik
			// istenmişse remote özelliğini işletelim
			if( this.options.remote )

				// uzak bir kaynağı yükleyip ayrıştır
				this.remote( this.options.remote );

			// standart bir görünüm uygulayalım
			this.state( "title close footer action .col-md-8 .col-md-offset-2" );

			return this;
		}
	});
});
