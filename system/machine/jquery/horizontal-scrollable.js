define( function()
{
	window.HorizontalScrollable = HorizontalScrollable = function( options )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Ayarlar.
		 * @type {Object}
		 */
		this.options = $.extend(
		{
			/**
			 * Mouse tekerinin her adımında kaydırılacak miktar.
			 * @type {Number}
			 */
			wheelStep: 65,

			/**
			 * Mouse tekerinin hareket yönü ile kaydırma yönü arasındaki ilişki.
			 *
			 * normal: geleneksel kaydırma yönü, yani mouse'un önünden arkasına doğru olan
			 * kaydırma şekli içeriğin sağ taraftan sola doğru kaymasını sağlar.
			 * revert: geleneksel kaydırmanın tam tersini yapar.
			 * 
			 * @type {String}
			 */
			wheelDirection: 'normal'
		},
		options );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * Hedef element üzerindeyken mouse tekeri döndürüldükçe tetiklenir.
			 * @param {Object} evt olay nesnesi
			 */
			onMouseWheel: function( evt )
			{
				var options = root.options;
				var delta = evt.originalEvent.wheelDelta;
				var desiredDirection = options.wheelDirection;
				var direction = delta < 0
					? 'toright'
					: 'toleft';

				if( desiredDirection == 'revert' )

					direction = direction == 'toright'
						? 'toleft'
						: 'toright';

				var wheelStep = direction == 'toleft'
					? - options.wheelStep
					: options.wheelStep;

				options.el.stop().animate(
				{
					scrollLeft: options.el.scrollLeft() + wheelStep
				}, 60, 'swing' );

				evt.preventDefault();
				evt.returnValue = false;
				return false;
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				root.options.el
					.on( 'mousewheel', this.onMouseWheel );
			}
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();
		}
	}

	$.fn.horizontalScrollable = function( o )
	{
		var instanceForSingleEl;

		this.each( function()
		{
			var el = $( this );

			// önceden kurulmuşsa olayları attach etmek yeterli
			if( el[ 0 ].horizontalScroll )
			{
				el[ 0 ].horizontalScroll.listener.attach();
				return;
			}

			var options = $.extend(
			{
				el: el,
				wheelStep: el.data( 'wheel-step' )
			}, o );

			var handler = new HorizontalScrollable( options );
				handler.init();

			el[ 0 ].horizontalScroll =
			instanceForSingleEl = handler;
		});

		// tek eleman üzerinde işlem yapılmışsa
		// geriye infinite arayüzünü döndürebiliriz
		return instanceForSingleEl;
	}

	return HorizontalScrollable;
});
