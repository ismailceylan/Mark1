/*
| -----------------------------------------------------------------------
| Popover by Ismail CEYLAN
| -----------------------------------------------------------------------
| Bu jQuery eklentisi sayfada istenen elemente hizalı biçimde popup açar
| ve popuptan temel farkı hiza merkezinde ilgili elementi işaret eden
| bir ok işareti barındırmasıdır. Popupın kapatılması için yapılması gereken
| hedef etikete tekrar tıklanmasıdır.
|
| -----------------------------------------------------------------------
| Kurulum
| -----------------------------------------------------------------------
| $( selector, selector ).popover({ to: el, align: 'bottom' ...});
|
|	veya
|
| var popup = new popover({ to: el, align: 'bottom' ...});
|
|	veya
|
| <a href="#" data-toggle="popover"
|			  data-align="right"
|			  
|			  data-title="Test"
|			  data-text="Lorem ipsum" veya data-body="#el"
|
|			  veya
|
|			  data-remote="test/source.html">Kullanıcı Bilgileri</a>
|
| -----------------------------------------------------------------------
| Gereksinimler
| -----------------------------------------------------------------------
|
| Aşağıdaki koşullar script'in çalışması için gereklidir;
|
| 1. jQuery 2.1.1
| 2. Popup
|
*/
define(
[
	// 'system/helper/position',
	'text!system/styles/popover.css',
	'./popup',
	'system/machine/anonstyle'
],
function( helperPosition, styles )
{
	window.Popover = Popover = function( o )
	{
		/**
		 * Kurucu metodumuzun etki alanını yedekleyelim.
		 * @type {handler}
		 */
		var root = this;

		/**
		 * Eklenti ayarlarını tutar.
		 * @type {Object}
		 */
		this.options = $.extend(
		{
			align: 'bottom',
			arrow_align: '',
			arrow_zindex: 0 /* ok işaretinin ait olduğu popupın zindex değerine göre fazlası veya azı*/
		}, o );

		/**
		 * İşlem arayüzünün iskeletini dom nesneleri olarak yeniden düzenler.
		 * @type {Object}
		 */
		this.skeleton = new ( function()
		{
			// popover in işaretçisini tutar
			this.arrow = $( '<div class="popover-arrow"></div>' );
			// yönetilebilir popup örneğini tutar
			this.popup = new Popup(
			{
				to:    root.options.to,
				align: root.options.align,
				puffy: root.options.puffy
			});

			// iskeleti popup içine gönderebiliriz
			this.popup.addClass( 'module popover' );

			// popup nesnesine temsil ettiğimiz popover nesnesini refere edelim
			// böylece popup yönetim arayüzü popupı değil bizi popover nesnesini
			// kaale alacaktır mesela popup hide metodu popupı gizlerken popover arrowu
			// ekranda kalabilir ancak popover hide metodu hepsini gizleyecektir
			this.popup.role = root;

			// ok işaretine varsa class tanımı ekleyelim
			if( root.options.class_prefix )
			{
				this.arrow.addClass( root.options.class_prefix + '-arrow' );
				this.popup.addClass( root.options.class_prefix );
			}

			Anonstyle.new( 'popover' ).push( 'all', styles );
		})();

		/**
		 * Ok işaretinin z index değeri kendi popupımızın değerinde olmalı ve arayüzün
		 * diğer parçalarıyla uyumlu çalışabilmeli.
		 */
		this.skeleton.popup.layer.attach( function( z )
		{
			root.skeleton.arrow.css({ 'z-index': z + root.options.arrow_zindex });
		});

		/**
		 * Popover arayüzünü ekrana getirir.
		 */
		this.show = function()
		{
			// popupı görünür yapalım
			this.skeleton.popup.show();
			this.skeleton.popup.$.after( this.skeleton.arrow );

			// ok konumunu popup üzerinden güncelleyelim
			this.skeleton.arrow.css
			(
				helperPosition.alignment
				(
					this.options.arrow_align,
					this.skeleton.popup.$,
					this.skeleton.arrow
				)
			);
		}

		/**
		 * Arayüzü gizler.
		 */
		this.hide = function()
		{
			// popupı gizlemek yeterli
			this.skeleton.popup.hide();
			// ok işaretini kaldıralım
			this.skeleton.arrow.remove();
		}

		/**
		 * Arayüz açıksa gizler, gizliyse açar.
		 */
		this.toggle = function( callback )
		{
			if( this.skeleton.popup.reg.isopen())
			{
				this.hide();
				if( callback ) callback( 'hide' );
			}
			else
			{
				this.show();
				if( callback ) callback( 'show' );
			}
		}

		/**
		 * Verilen tarafın tersini döndürür.
		 * 
		 * @param  {String} side taraf adı [top,left,right,bottom,start,end]
		 * @return {String}
		 */
		this.reverse_side = function( side )
		{
			var r;

			[[ 'top', 'bottom' ],[ 'left', 'right' ],[ 'start', 'end' ]].map( function( item, i )
			{
				if( side == item[ 0 ]) r = item[ 1 ];
				if( side == item[ 1 ]) r = item[ 0 ];
			});

			return r;
		}

		/**
		 * Ok işaretinin olması gereken konumu popup için dışarıdan verilen
		 * pozisyona bakarak çıkarmaya çalışır.
		 */
		this.arrow_side = function()
		{
			if( this.options.arrow_align != '' )

				return;

			var side = '';
			var pos  = this.options.align.split( '-' );

			switch( pos.length )
			{
				// cephe ortası konumlandırma
				case 1: side = this.reverse_side( pos[ 0 ]); break;

				// cephe ve kenarlı konumlandırma
				// top-left bottom-right gibi
				case 2:
					pos[ 0 ] = this.reverse_side( pos[ 0 ]);
					side     = pos.join( '-' );
					break;

				// start-end cephe ve kenarlı konumlandırma
				// start-top-right veya end bottom-left gibi
				case 3:
					pos[ 2 ] = this.reverse_side( pos[ 2 ]);
					side     = pos.join( '-' );
					break;
			}

			this.skeleton.arrow.addClass( this.options.arrow_align = side );
		}

		/**
		 * Temsil edilen popover nesnesine ve arrow elementlerine verilen css
		 * sınıfını ekler.
		 * 
		 * @type {String}
		 */
		this.addClass = function( className )
		{
			this.skeleton.arrow.addClass( className );
			this.skeleton.popup.addClass( className );
		}

		/**
		 * Temsil edilen popover nesnesine ve arrow elementlerinden verilen css
		 * sınıfını siler.
		 * 
		 * @type {String}
		 */
		this.removeClass = function( className )
		{
			this.skeleton.arrow.removeClass( className );
			this.skeleton.popup.removeClass( className );
		}

		/**
		 * Popover kurulumunu gerçekleştirir.
		 */
		this.init = function()
		{
			// ok işaretinin olması gereken konumu popup için dışarıdan verilen
			// pozisyona bakarak çıkarmaya çalışalım
			this.arrow_side();
		}

		this.init();
	}

	/**
	 * jQuery küresel nesnesine seçili elemanları ayrı ayrı popover yapabilecek
	 * yeteneği verir.
	 */
	$.fn.popover = function( o )
	{
		this.each( function()
		{
			var el = $( this ),
				opt;

				opt = o
					? {
						to: o.el,
						align: el.align
					  }
					: {
						to: el,
						align: el.data( 'align' )
					  }

			var popup = new Popover( opt );
				this.popover = popup;
		});
	}

	$( function()
	{
		$( '[data-role=popover]' ).popover();
	});

	return Popover;
});
