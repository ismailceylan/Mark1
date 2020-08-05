/*
| -----------------------------------------------------------------------
| Dropdown by Ismail Ceylan
| -----------------------------------------------------------------------
| Bu eklenti, web sayfalarında özel amaçlı açılır menüler oluşturmayı sağlar.
|
| -----------------------------------------------------------------------
| Kurulum
| -----------------------------------------------------------------------
|
| var menu  = new Dropdown( $el, { align: 'start-bottom-left' });
| var item1 = menu.item(
|	  {
| 		 name: 'item1',
|		 label: 'test option 1',
|        value: 'OK'
|     });
|     menu.separator();
| 	  menu.superior({ label: 'test option 2', dropdown: menu2 });
|
| olay tabanlı programlama için;
|
| menu.on( 'select', function( e )
| {
|    if( e.name = 'item1' )
|
|       // ... 
| });
|
| veya
|
| item1.on( 'select', function( e )
| {
| 	 console.log( e.value );
|    // output: OK
| });
|
|
*/
window.Dropdown = Dropdown = function( trigger, o )
{
	// ana etki alanını yedekleyelim
	var root = this;

	/**
	 * Açılır menünün ekranda olup olmadığını söyler.
	 * @type {Boolean}
	 */
	this.isOpen = false;

	/**
	 * Açılır menünün hiyerarşik düzende (iç içe açılır menüler) kaçıncı seviyede
	 * olduğunu tutar. 0 ana menü iken tüm 1 olan menüler 0'ın alt menüsüdür ve tüm
	 * 2 olan menüler de 1 olan menünün alt menüsüdür.
	 * @type {Number}
	 */
	this.level = 0;

	/**
	 * Bu dropdown, sadece bir başka dropdown'daki bir seçenek tarafından
	 * açılabiliyorsa (yani bir alt menüyse) ebeveyni olan dropdown menüyü
	 * verir.
	 * 
	 * @type {Dropdown}
	 */
	this.parent = null;

	/**
	 * Bu dropdown'ın seçeneklerinden biri tarafından açılmış ve o anda ekranda
	 * açık durumda olan bir alt dropdown menüyü tutar. Ekranda açık alt menü yoksa
	 * bile bir dropdown tutuluyor olabilir bu yüzden tutulan dropdown'ın açık
	 * olup olmadığı da ayrıca kontrol edilmelidir.
	 * 
	 * @type {Dropdown}
	 */
	this.activeChild = null;

	/**
	 * Dropdown'ın kapanma kilididir. True olursa dropdown kapatılmaya çalışılsa
	 * bile kapanmayacaktır. Alt menülerin, ekrana geldiğinde ana dropdown'ı ekranda
	 * tutabilmesi için gereken bir mekanizmadır.
	 * 
	 * @type {Boolean}
	 */
	this.isLocked = false;

	/**
	 * Menüdeki seçenekleri tutar.
	 * @type {Array}
	 */
	this.items = [];

	/**
	 * Temsil edilen açılır menüyü ekrana getiren tetikleyici buton görevi
	 * gören elementi tutar.
	 * 
	 * @type {jQuery}
	 */
	this.trigger = trigger || $( '<div></div>' );

	/**
	 * Dropdown ekrandan taşmışsa hangi taraftan taştığını söyler.
	 * @type {String}
	 */
	this.overflow = null;

	/**
	 * Açılır menü için benzersiz bir ID değeri tutar.
	 * @type {Integer}
	 */
	this.id = ( new Date ).getTime();

	/**
	 * dropdown örneklenirken gönderilen ayarları genişletip saklar.
	 * @type {Object}
	 */
	this.option = $.extend( 
	{
		// varsayılan popup yönü
		align: 'bottom-right',
		// bir dropdown kendi alt dropdownları açılınca kapanmamalı
		puffy: false,
		// her bir dropdown ekrandaki tek menü olmalı
		single: true
	}, o );

	/**
	 * Döküman içinden bir iskelet gönderilmediği durumlar için varsayılan html
	 * iskeleti tutar.
	 * 
	 * @type {Object}
	 */
	this.skeleton = this.skeletor.apply( this );

	/**
	 * Tüm dialoglar için aynı stili kullanacağımızdan bir tane
	 * dialog adında isim alanı tanımlayıp ona özel çalışan bir
	 * anonim stil arayüzü örneği tutar.
	 * 
	 * @type {Anonstyle}
	 */
	this.stylize = Anonstyle.new( 'dropdown' );

	/**
	 * Olay dinleyicileri tutar.
	 * @type {Object}
	 */
	this.listener = 
	{
		/**
		 * Tetikleyici görevi görmesi istenen
		 * elemente tıklandığında tetiklenir.
		 */
		onTargetClick: function()
		{
			// uzun bekleme sayacına gerek yok, dursun
			clearTimeout( root.longWaitTimer );
			// açıksa kapansın kapalıysa açılsın
			root.toggle();
			// link ise herhangi birşey açmasın
			return false;
		},

		/**
		 * Tetikleyici element üzerine mouse ile gelince tetiklenir.
		 */
		onMouseOver: function()
		{
			if( ! root.longWaitTimer ) root.longWaitTimer = 0;

			clearTimeout( root.longWaitTimer );

			root.longWaitTimer = setTimeout( function()
			{
				root.open();
			}, 2500 );
		},

		/**
		 * Tetikleyici üzerinden mouse çekildiğinde tetiklenir.
		 */
		onMouseLeave: function()
		{
			clearTimeout( root.longWaitTimer );
		},

		/**
		 * Mobil cihazlarda aktif olan ve önceki menüye dönüşü
		 * sağlayan butona tıklandığında tetiklenir.
		 * 
		 * @return {Boolean}
		 */
		onBackButtonClick: function()
		{
			root.close();
			return false;
		},

		/**
		 * Dropdown menünün kullandığı popup
		 * ekrana geldiğinde tetiklenir.
		 */
		onPopupOpen: function()
		{
			// popup açıldığına göre dropdown da açılmış demektir
			// open adında bir olayı ateşleyelim ki dışarıdan programlanabilsin
			$( root ).trigger( 'open' );
			// popup ekrana gelmişse açılır menü de ekranda demektir
			root.isOpen = true;
		},

		/**
		 * Dropdown menünün kullandığı popup
		 * ekrandan gittiğinde tetiklenir.
		 */
		onPopupClose: function()
		{
			// dropdown için close isimli olayı tetikleyelim
			$( root ).trigger( 'close' );
			// popup gizlenmişse açılır menü de gizlenmiştir
			root.isOpen = false;
		},

		/**
		 * Menü popup'ı amaçlanan konuma yerleştirildiğinde
		 * ekrandan taşıyorsa tetiklenir. Ayrıca ekrandan boyutu
		 * değiştiğinde taşma durumu ortadan kalkmışsa yine
		 * tetiklenir ancak overflow değeri undefined olur.
		 *
		 * @param {Popup}  popup    taşma durumuna konu olan popup nesnesi
		 * @param {String} overflow taşma yaşanan taraf adı [top,bottom,left,right]
		 */
		onPopupOverflow: function( evt, popup, overflow )
		{
			if( overflow )
			
				root.skeleton.popup.addClass( 'overflow-' + overflow );
			
			else 

				root.skeleton.popup.removeClass( 'overflow-' + root.overflow );

			root.overflow = overflow;
		},

		/**
		 * Pencere kaydırıldığında tetiklenir.
		 */
		onWindowScroll: function()
		{
			root.close();
		},

		/**
		 * Ekran içinde bir noktaya tıklandığında tetiklenir.
		 */
		onWindowClick: function( e )
		{
			var isClickedOnDropdown = false;

			$( '.dropdown' ).each( function()
			{
				if( this.contains( e.target ))

					isClickedOnDropdown = true;
			});

			if( isClickedOnDropdown )

				return;

			// tüm dropdownları kapatalım
			$( window.dropdowns ).each( function()
			{
				this.isLocked = false;
				this.close();
			});
		},

		/**
		 * Pencere içinde bir tuşa basıldığında tetiklenir.
		 */
		onWindowKeyDown: function( e )
		{
			if( e.keyCode == 27 )

				// tüm dropdownları kapatalım
				$( window.dropdowns ).each( function()
				{
					this.isLocked = false;
					this.close();
				});
		},

		/**
		 * Dropdown'da bulunan form elementi
		 * submit edildiğinde tetiklenir.
		 */
		onDropdownFormSubmit: function()
		{
			return false;
		},

		/**
		 * Olay dinleyicileri attach eder.
		 */
		attach: function()
		{
			// mobil için gereken olay dinleyicileri attach edelim
			root.skeleton.goback
				.off( 'click' )
				.on( 'click', root.listener.onBackButtonClick );

			// dropdown'daki form olayı
			root.skeleton.form
				.off( 'submit' )
				.on( 'submit', this.onDropdownFormSubmit );

			// tetikleyici olayları
			root.trigger
				.off( 'click', this.onTargetClick )
				.off( 'mouseenter', this.onMouseOver )
				.off( 'mouseleave', this.onMouseLeave )
				.on( 'click', this.onTargetClick )
				.on( 'mouseenter', this.onMouseOver )
				.on( 'mouseleave', this.onMouseLeave );

			if( this.isAttached )

				return;

			// pencere olayları
			$( window )

				.on( 'scroll', this.onWindowScroll )
				.on( 'keydown', this.onWindowKeyDown);

			// pencerenin click olayını global anlamda bir defalığına dinlemeliyiz
			// yani tüm dropdownlar adına bir tane listener yeterli
			if( ! Dropdown.isClickListeningForDropdowns )
			{
				$( window )
					.on( 'mousedown', this.onWindowClick );

				Dropdown.isClickListeningForDropdowns = true;
			}

			// popup olayları
			$( root.skeleton.popup )
				.on( 'open', this.onPopupOpen )
				.on( 'close', this.onPopupClose )
				.on( 'overflow', this.onPopupOverflow );

			this.isAttached = true;
		}
	}

	/**
	 * Gerekli ayarlamaları yapıp menünün
	 * ekrana gelmesini sağlar.
	 */
	this.open = function()
	{
		// zaten açıksa işleme gerek yok
		if( this.isOpen )

			return;

		// dropdown bir önceki seferde taşma sorunu yaşamış olabilir
		// ancak bir sonraki açılışında bir başka taşma sorunu da
		// yaşayabilir sorun yaşanmaya da bilir bu yüzden temiz bir
		// başlangıç yapmak için bir önceki taşmanın classını
		// temizlememiz gerekiyor
		if( this.overflow )
		{
			this.skeleton.popup.removeClass( 'overflow-' + this.overflow );
			this.overflow = null;
		}

		// anonim stillerimizi set edelim
		this.stylize.push( 'all', this.styles );
		// tetikleyiciye bir durum classı ekleyelim
		this.trigger.addClass( 'active' );

		// popup ekrana gelsin
		this.skeleton.popup.show();

		// bu dropdown bir sub menü ise yani başka bir dropdownın seçeneği
		// tarafından açılabilmekteyse üst menüyü kilitleyelim ki kapanmasın
		if( parent = this.parent )

			parent.isLocked = true;

		// dropdown olaylarını attach edelim
		this.listener.attach();

		// seçeneklerin olayları silindi, yeniden attach etmeliyiz
		$( this.items ).each( function()
		{
			this.listener.attach();
		});
	}

	/**
	 * Açılır menünün ekrandan kaybolmasını sağlar.
	 */
	this.close = function()
	{
		// zaten kapalıysak veya kapatma işlemi kilitlenmişse işlem yok
		if( ! this.isOpen || this.isLocked )
		{
			return;
		}

		if( parent = this.parent )

			parent.isLocked = false;

		// popupı gizleyelim
		this.skeleton.popup.hide();
		
		// stilleri temizleyebiliriz
		root.stylize.destroy( 'all' );
		// tetikleyici durum classını silelim
		this.trigger.removeClass( 'active' );

		// seçeneklerin olaylarını dinlemeyi bırakacağız
		$( this.items ).each( function()
		{
			this.listener.dettach();
		});

		this.activeChild = null;
	}

	/**
	 * Çocuktan ebeveyne zincirleme kapatma yapar.
	 */
	this.bubbleClose = function()
	{
		if( this.isLocked )

			return;

		// temsil ettiğimiz dropdownı kapatalım
		this.close();

		// bir sub menüysek bizim ebeveynimizde de bubleClose çalışsın
		if( parent = this.parent )

			parent.bubbleClose();
	}

	/**
	 * Açılır menü ekrandaysa gizler, gizli
	 * durumdaysa ekrana getirir.
	 */
	this.toggle = function()
	{
		this[ this.isOpen? 'close' : 'open' ]();
	}

	/**
	 * Kurulum işlemini gerçekleştirir.
	 */
	this.init = function()
	{
		this.listener.attach();

		// global dropdown listesine kaydedelim
		if( ! window.dropdowns )

			window.dropdowns = [];

		window.dropdowns.push( this );
	}

	this.init();
}

define(
[
	'system/machine/anonstyle',
	'./skeleton',
	'./item',
	'./superior',
	'./separator',
	'./checkbox',
	'./radio',
	'./prompt',
	'./special'
],
function()
{
	return Dropdown;
});
