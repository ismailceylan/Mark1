define(
[
	"system/library/url",
	"system/helper/url/is-external",

],
function( URL, isExternal )
{
	return function()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Bir önceki state.
		 * @type {String}
		 */
		this.prev = null;

		/**
		 * Mevcut state.
		 * @type {String}
		 */
		this.current = null;

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Geçmişte geri gidildiğinde tetilenir.
			 */
			onWindowPopState: function()
			{
				// mevcut uri set edelim
				app.setUri( URL());
				// rotalar baştan sona taransın
				app.singleton( "route" ).hit( document.URL );

				$( app ).trigger( "urichange", app.uri );
			},

			/**
			 * pushState üzerinden işlemesi istenen
			 * bir linke tıklandığında tetiklenir.
			 */
			onAnchorClick: function()
			{
				var package;
				var anchor = $( this );

				// linkte trigger verilmişse sayfa açmak yerine
				// bir eklentiyi çalıştırmak istiyor demektir
				if( package = anchor.attr( "trigger" ))
			
					$( app ).trigger( "package:" + package, anchor.data());

				else

					// pushState olarak hedefe gidilsin
					app.navigate.open( this.href );
				
				// tıklama işi bitti browser handle etmesin
				return false;
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				$( window )
					.on( "popstate", this.onWindowPopState );
			}
		}

		/**
		 * URLyi verilen segmente ayarlar.
		 * @param {String} state sayfanın gitmesi istenen url
		 */
		this.open = function( state )
		{
			// tarayıcı zaten verilen state üzerinde ise işleme gerek yok
			if( window.history.state == state )

				return;

			// yeni verilen state eski state ile aynı ise
			// bu isteği bir state push ederek değil history
			// alanında geri giderek sağlayalım
			// if( state == this.prev )

			// 	return app.redirect.back();

			// mevcutta tutulan state bir öncekine devretmeli
			this.prev = this.current;
			// yeni state güncelde durmalı
			this.current = state;

			// tarayıcıdaki state yığınına ekleme yapalım
			window.history.pushState( state, null, state );
			// uri güncellensin
			app.setUri( new URL );
			// routelar baştan sona taransın
			app.singleton( "route" ).hit( document.URL );

			$( app ).trigger( "urichange", app.uri );
		}

		/**
		 * Verilen bir düğüm içindeki linkleri bulup tıklandığında
		 * browser tarafından handle edilmesine engel olarak
		 * hedef adresi pushState yapısı olarak handle eder.
		 * 
		 * @param {String,jQuery} node içinde link bulunan bir html düğümü
		 */
		this.linkify = function( node )
		{
			$( node ).find( "a[href],a[to]" ).each( function()
			{
				// link blank ise işleme gerek yok
				// link external ise işleme gerek yok
				if( this.target == "_blank" || ( this.href && isExternal( this.href )))

					return;

				var anchor = $( this );

				// linkte "to" parametresi varsa bu sayfa içindeki
				// bir elemente focus işlemi yapmak istiyordur bu
				// durumda tıklama olayını browsera bırakacağız
				if( anchor.attr( "to" ) !== undefined )
				
					return anchor.attr( "href", anchor.attr( "to" ));

				anchor
					// linklerin click olayını iki kez dinlememek için temizleyelim
					.off( "click", root.listener.onAnchorClick )
					// linklerin click olayını handle edelim
					.on( "click", root.listener.onAnchorClick );
			});
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();
			return this;
		}

		this.init();
	}
});
