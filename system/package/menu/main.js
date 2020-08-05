define(
[
	'text!./css/menu.css',
	'system/core/view',
	'system/machine/anonstyle'
],
function( styles, View )
{
	/**
	 * Genel amaçlı ekranın sağı, solu altı veya üzerinde yer
	 * alabilen kolayca açılıp kapatılabilen menüler yaratır.
	 * 
	 * @param {Object} o menü öznitelikleri
	 */
	return window.Menu = Menu = function( o )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Menünün açık olup olmadığı.
		 * @type {Boolean}
		 */
		this.isOpen = false;

		/**
		 * Menü için benzersiz bir ID değeri.
		 * @type {Integer}
		 */
		this.id = ( new Date ).getTime();

		/**
		 * Öznitelikler.
		 * @type {Object}
		 */
		this.option = $.extend(
		{
			// konum (left, top left, bottom right gibi)
			align: 'left',
			// menünün gövdeyi itekleyip iteklemeyeceği
			push: false,
			// eklenecek css sınıfları
			cssClasses: '',
			// pozisyonlar
			left: 0,
			top: 0,
			bottom: null,
			right: null
		}, o );

		/**
		 * Stil yönetim arayüzü.
		 * @type {Anonstyle}
		 */
		this.stylize = Anonstyle.new( 'menu' );

		/**
		 * İskelet.
		 * @type {View}
		 */
		this.view = View.new( '<div class="menu" name="menu"></div>', function()
		{
			this.$root
				.attr( 'id', 'menu-' + root.id )
				.addClass( root.option.cssClasses );
		});

		/**
		 * Hizalanacak hedefe göre kullanıcı ölçütünü de hesaba ekleyerek
		 * menünün nihai pozisyon değerlerini hesaplayıp döndürür. Dönen
		 * değer jQuery ile bir elemente css metoduyla uygulanabilir yapıda
		 * olacaktır.
		 *
		 * @return {Object}
		 */
		this.calcPositions = function()
		{
			var o = root.option;
			var align = o.align.split( ' ' );
			var r =
			{
				left: o.left,
				top: o.top,
				bottom: o.bottom,
				right: o.right
			};

			$( align ).each( function()
			{
				switch( this.toString().toLowerCase())
				{
					case 'left':
						r.left = o.left || 0;
						r.right = 'unset';
						break;

					case 'right':
						r.left = 'unset';
						r.right = o.right || 0;
						break;

					case 'top':
						r.top = o.top || 0;
						r.bottom = 'unset';
						break;

					case 'bottom':
						r.top = 'unset';
						r.bottom = o.bottom || 0;
						break;
				}
			});

			return r;
		}

		/**
		 * Menüyü açar.
		 * 
		 * @param {Integer} width        menü genişliği
		 * @param {Integer} height       menü yüksekliği
		 * @param {Integer} marginTop    menünün yukarıdan sahip olacağı boşluk
		 * @param {Integer} marginRight  menünün sağdan sahip olacağı boşluk
		 * @param {Integer} marginBottom menünün aşağıdan sahip olacağı boşluk
		 * @param {Integer} marginLeft   menünün soldan sahip olacağı boşluk
		 * @event {open} pencere ekrana geldiğinde tetiklenir.
		 */
		this.show = function( width, height, marginTop, marginRight, marginBottom, marginLeft )
		{
			var body  = this.view.$root;
			var sizes = {};

			if( width )
			{
				// width değeri yerine col-x-x ifadesi de gelebilir
				if( /col-(xs|sm|md|lg|xl)-([1-9]+)/.test( width ))

					body.addClass( width );

				else this.option.width = sizes.width = width;
			}

			if( height ) sizes.height = height;
			if( marginTop ) sizes.marginTop = marginTop;
			if( marginLeft ) sizes.marginLeft = marginLeft;
			if( marginRight ) sizes.marginRight = marginRight;
			if( marginBottom ) sizes.marginBottom = marginBottom;

			body.css( sizes );

			// stilleri dökümana ekleyelim
			this.stylize.push( 'all', styles );
			// iskeleti gövdeye gömelim
			$( '#body' ).prepend( body.css( this.calcPositions()));

			// body push edilecekse yapalım
			if( root.option.push )
			{
				if( root.option.align.indexOf( 'right' ) > -1 )
				
					$( 'body' ).css({ marginLeft: -1 * this.option.width });
				
				else if( root.option.align.indexOf( 'left' ) > -1 )

					$( 'body' ).css({ marginLeft: this.option.width });

				
				body.css({ marginTop: 0 });
			}

			// eklenti seviyesinde bir olay tetikleyelim
			$( root ).trigger( 'open' );
			// eklenti durumunu güncelleyelim
			root.isOpen = true;
		}

		/**
		 * Menüyü kapatır.
		 */
		this.hide = function()
		{
			var body = this.view.$root;
			
			// dökümandan silelim
			body.remove();

			// body push edilmişse bunu geri alalım
			if( root.option.push )

				$( 'body' ).css({ marginLeft: 0 });

			// stilleri silelim
			root.stylize.destroy( 'all' );
			// eklenti seviyesinde bir olay tetikleyelim
			$( root ).trigger( 'close' );
			// eklenti durumunu güncelleyelim
			root.isOpen = false;
		}

		/**
		 * Menu açıksa gizler, gizliyse açar.
		 * 
		 * @param {Integer} width        menü genişliği
		 * @param {Integer} height       menü yüksekliği
		 * @param {Integer} marginTop    menünün yukarıdan sahip olacağı boşluk
		 * @param {Integer} marginRight  menünün sağdan sahip olacağı boşluk
		 * @param {Integer} marginBottom menünün aşağıdan sahip olacağı boşluk
		 * @param {Integer} marginLeft   menünün soldan sahip olacağı boşluk
		 */
		this.toggle = function( width, height, marginTop, marginRight, marginBottom, marginLeft )
		{
			this.isOpen
				? this.hide()
				: this.show( width, height, marginTop, marginRight, marginBottom, marginLeft );
		}

		/**
		 * Kurulumunu yapar.
		 */
		this.init = function()
		{
			return this;
		}
	}
});
