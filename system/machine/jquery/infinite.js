define(
[
	"system/helper/object/clearify",
	'./scroll',
	'system/machine/rest'
],
function( clearify )
{
	window.Infinite = Infinite = function( options )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Kaynak akışının sonuna gelinip gelinmediğini tutar.
		 * @type {Boolean}
		 */
		this.eos = false;

		/**
		 * Eklenti ayarları.
		 * @type {Object}
		 */
		this.options = $.extend(
		{
			// kaydırılan alan ile içeriğin duracağı alan
			// farklı olursa diye içerik alanı
			content: null,
			// içerik üretmesi, sayfalama yapması beklenen 
			// bir restful endpoint adı
			resource: null,
			// restfula gönderilecek parametreler listesi
			get:
			{
				// sayfa numarasının belli bir
				// değerden başlaması istenirse diye
				page: null
			},
			// kaydırılabilir element
			el: null,
			// görevi, json içeriği parametre olarak alıp
			// html/jquery sonuç döndürmek olan bir metod
			drawer: function(){}
		},
		options );

		/**
		 * Mevcut sayfa numarasını tutar.
		 * @type {Number}
		 */
		this.page = this.options.get.page || 1;

		/**
		 * Kaydırma işlemini içerikle besleyecek şekilde
		 * dizayn edilmiş bir restful özkaynağı ile çalışacak
		 * biçimde ayarlanmış bir rest arayüzü tutar.
		 * 
		 * @type {Rest}
		 */
		this.scene = new Rest( this.options.resource );

		/**
		 * Sonsuz kaydırma yapabilen yapının iskeleti.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			this.scrollable = root.options.el;
			this.content = root.options.content;
		}

		/**
		 * Olay dinleyici metotları tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Sonsuz kaydırma özelliğine sahip olacak hedef element
			 * kaydırıldıkça tetiklenir.
			 * 
			 * @param {Object} e kaydırma bilgilerini tutar
			 */
			onTargetScroll: function( e )
			{
				clearTimeout( root.scrollTimer );

				root.scrollTimer = setTimeout( function()
				{
					// yukarı doğru scroll hareketi olursa sayfa yine de 
					// belli bir yüzde miktarında yukarıdan kaydırılmış olabileceği
					// için içerik çağrılacaktır bunu istemeyiz yukarıya tekrar göz
					// atma durumunda yeni sayfalara ihtiyaç yoktur
					root.scrollDirection = e.scroll.top - ( root.lastScrollEnd || 0 );
					root.lastScrollEnd = e.scroll.top;

					// kaydırılabilir içeriğin en sonuna
					// ulaşmaya belli bir miktar kalmışsa
					if( e.scroll.toEnd <= 400 && root.scrollDirection > 0 )

						// yeterince kaydırma yapıldı demektir
						// yeni içerik alıp alanı besleyelim
						root.listener.onEnoughScroll();
				},
				80 );
			},

			/**
			 * Sayfa yeterince kaydırılınca tetiklenir.
			 */
			onEnoughScroll: function()
			{
				// içerik sonu durumu ile karşılaşmamışsak ve zaten bir istek
				// yapılmamış, yanıt beklenmiyorsa isteğimizi yapalım
				if( ! root.eos && root.scene.status == 'ready' )
					
					root.scene.get( clearify( root.options.get ));
			},

			/**
			 * Yeni içerik başarıyla elde edildiğinde tetiklenir.
			 * @param {Object} json restful endpoint tarafından üretilen kaynak bilgileri
			 */
			onRestSuccess: function( json )
			{
				// içeriği kullanıcı tanımlı drawer metoduna geçirelim
				if( root.options.drawer )

					root.skeleton.content.append
					(
						root.options.drawer( json.result.data, root.page )
					);
					
				// mevcut sayfayı indirdik diğerine geçelim
				root.options.get.page = ++root.page
			},

			/**
			 * Sunucu içerik yok yanıtı verdiğinde tetiklenir.
			 */
			onRestNoContent: function()
			{
				if( root.page > 1 )

					$( root ).trigger( 'end' );

				else

					$( root ).trigger( 'empty' );
			},

			/**
			 * Rest isteği başarılı veya başarısız
			 * tamamlandığında tetiklenir.
			 */
			onRestFinish: function()
			{
				var conn = this.connection;

				switch( conn.status )
				{
					case 200:
						root.listener.onRestSuccess( conn.responseJSON );
						break;

					case 204:
						root.listener.onRestNoContent();
						break;
				}
			},

			/**
			 * Rest isteği başarısız olunca tetiklenir.
			 */
			onRestError: function()
			{
				$( root ).trigger( 'error' );
			},

			/**
			 * Listener metotları dinlenecek olaylara attach eder.
			 */
			attach: function()
			{
				// scroll olayını dinleyelim
				root.skeleton.scrollable
					.scroll( root.listener.onTargetScroll );

				// rest olaylarını dinleyelim
				$( root.scene )
					.on( 'error', root.listener.onRestError )
					.on( 'finish', root.listener.onRestFinish );
			},

			/**
			 * Olayları dinlemeyi durdurur.
			 */
			dettach: function()
			{
				root.skeleton.scrollable.off( 'scroll' );

				// rest olaylarını dinleyelim
				$( root.scene )
					.off( 'error', root.listener.onRestError )
					.off( 'finish', root.listener.onRestFinish );
			}
		}

		/**
		 * Kurulumu yok eder.
		 */
		this.destroy = function()
		{
			this.listener.dettach();
			this.options.el.infinite = null;
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();

			// sayfa numarası sıfır atanmış ise hedef alanda
			// hiç içerik yok demektir bu yüzden ateşleme yapmalıyız
			if( this.options.get.page == 1 )

				this.listener.onEnoughScroll();
		}
	}

	$.fn.infinite = function( o )
	{
		var instanceForSingleEl;

		this.each( function()
		{
			var el = $( this );

			// data-get-* restful filtreleme yapısını object haline getirelim
			var get = {}
			var tmp = el.data();

			for( var i in tmp )
			{
				if( i.substr( 0, 3 ) == 'get' )

					get[ i.substr( 3 )] = tmp[ i ];
			}

			var options = $.extend(
			{
				el: el,
				resource: el.data( 'resource' ),
				get: get
			}, o );

			var handler = new Infinite( options );
				handler.init();

			el[ 0 ].infinite = instanceForSingleEl = handler;
		});

		// tek eleman üzerinde işlem yapılmışsa
		// geriye infinite arayüzünü döndürebiliriz
		return instanceForSingleEl;
	}

	return Infinite;
});
