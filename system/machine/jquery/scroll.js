define( function()
{
	/*
	| -----------------------------------------------------------------------
	| Scroll by Ismail CEYLAN
	| -----------------------------------------------------------------------
	| Bu jQuery eklentisi, diğer eklentilerin kullanması için scroll olayını
	| mevcut yapıdan alıp biraz daha geliştirir.
	|
	| Örneğin normal scrol olayında yukarıdan piksel olarak uzaklık verilirken
	| eklenti ile bunun yüzde olarak miktarı hem aşağı hem yukarı boşluk için
	| hesaplanır. Ayrıca yapışkan elemanlar için de kullanılabilir.
	|
	| -----------------------------------------------------------------------
	| Kurulum
	| -----------------------------------------------------------------------
	| $( '.el' ).scroll( function( e )
	| {
	|		....
	| });
	| 
	|
	| -----------------------------------------------------------------------
	| Gereksinimler
	| -----------------------------------------------------------------------
	|
	| Aşağıdaki koşullar script'in çalışması için gereklidir;
	|
	| 1. jQuery 2.1.1
	|
	*/
	return $.fn.scroll = function( callback )
	{
		this.on( 'scroll', function( e )
		{
			// işlem yapılacak elementi seçelim
			var $this = $( this );
			var o     = { screen: {}, scroll: {}};

			// ekran ölçümlerini yansıtalım
			o.screen.height = $( window ).height();
			o.screen.width  = $( window ).width();

			// scroll miktarlarını yansıtalım
			o.scroll.top    = $this.scrollTop();
			o.scroll.left   = $this.scrollLeft();

			// window, document ve elementler için farklı hesaplamalar yapmak gerekiyor
			if( this === window )
			{
				o.target             = window;

				o.scroll.height      = $( document ).height();	// window scrollable yüksekliği döküman olarak ele alınsın
				o.scroll.width       = $( document ).width();	// window scrollable yüksekliği döküman olarak ele alınsın
				o.scroll.topPercent  = o.scroll.top  * 100 / ( o.scroll.height - o.screen.height );
				o.scroll.leftPercent = o.scroll.left * 100 / ( o.scroll.width  - o.screen.width  );
				o.scroll.toEnd       = o.scroll.height - o.scroll.top - o.screen.height;
			}
			else if( this === document )
			{
				o.target             = document;

				o.scroll.height      = $this.height();	// scroll yüksekliği direkt kendi yüksekliğidir
				o.scroll.width       = $this.width();	// scroll yüksekliği direkt kendi yüksekliğidir
				o.scroll.topPercent  = o.scroll.top  * 100 / ( o.scroll.height - o.screen.height );
				o.scroll.leftPercent = o.scroll.left * 100 / ( o.scroll.width  - o.screen.width  );
				o.scroll.toEnd       = o.scroll.height - o.scroll.top - o.screen.height;
			}
			else
			{
				o.target             = this;

				o.scroll.height      = $this.prop( 'scrollHeight' ); // scroll yüksekliği için native js nesnesi kullanılıyor
				o.scroll.width       = $this.prop( 'scrollWidth'  ); // scroll yüksekliği için native js nesnesi kullanılıyor
				o.scroll.topPercent  = o.scroll.top  * 100 / ( o.scroll.height - $this.height( ));
				o.scroll.leftPercent = o.scroll.left * 100 / ( o.scroll.width  - $this.width ( ));
				o.scroll.toEnd       = o.scroll.height - o.scroll.top - o.screen.height;
			}

			callback.call( this, o );
		});
	}
});
