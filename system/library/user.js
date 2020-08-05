define(
[
	'system/library/auth',
	'system/machine/keep'
],
function( auth )
{
	return ( new function()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Yetki işlerinden sorumlu arayüz.
		 * @type {Auth}
		 */
		this.auth = auth;

		/**
		 * Cihaz üzerinde saklanan kullanıcı
		 * bilgilerini temsil eden arayüz.
		 * 
		 * @type {Keep}
		 */
		this.storage = Keep( 'user' );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * Kullanıcı başarıyla giriş yaptığında tetiklenir.
			 */
			onAuthorized: function()
			{
				// kullanıcı bilgilerini cihaza kaydedelim
				root.storage.it( root.auth.user );
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				$( root.auth )
					.on( 'done', this.onAuthorized );
			}
		}

		/**
		 * Temsil edilen kullanıcının statüsünü verir.
		 *
		 *  guest = ziyaretçi
		 *  member = üye
		 *  admin = yönetici
		 *  owner = sahip
		 *  
		 * @return {String}
		 */
		this.type = function()
		{
			// oturum açmamışsa ziyaretçidir
			if( ! auth.login())

				return 'guest';

			// oturum açıksa öncelikli durumlara bakalım
			else
			{
				var userType = this.get( 'type' );

				// kullanıcı tipi tanımsızsa member demektir
				if( ! userType )

					return 'member';

				// tip tanımlıysa onu verelim
				return userType;
			}
		}

		/**
		 * Adı verilen kullanıcı bilgisini döndürür.
		 * 
		 * @param {String} key bilgi adı
		 * @param {Mixed} def bilgi mevcut değilse döndürülecek bir değer
		 * @return {Mixed}
		 */
		this.get = function( key, def )
		{
			var user = this.storage.me();

			if( user.hasOwnProperty( key ))

				return user[ key ];

			else

				return def;
		}

		/**
		 * Kullanıcıya bilgi yazar. Geriye yazılan değer döner.
		 * 
		 * @param {String} key bilgi adı
		 * @param {Mixed} value yazılacak değer
		 * @param {Boolean} overwrite üzerine yazılıp yazılmayacağı
		 * @param {Mixed}
		 */
		this.set = function( key, value, overwrite )
		{
			var user = this.storage.me();

			if( user.hasOwnProperty( key ) && overwrite === false )

				return;

			user[ key ] = value;

			this.storage.it( user );
			return value;
		}

		/**
		 * Kullanıcı türü fark etmeksizin bir jeton döndürür.
		 * @return {String}
		 */
		this.token = function()
		{
			// cihazdan deneyelim
			var token = this.get( 'token' );

			// cihazda yoksa
			if( ! token )
				
				// ziyaretçi jetonunu al, cihaza da yaz, hep bu kullanılsın
				token = this.set( 'token', app.config.site.api.guest_token );

			return token;
		}

		/**
		 * Kurulumu yapar.
		 * @type {User}
		 */
		this.init = function()
		{
			// cihazda kullanıcı nesnesi yoksa oluşturalım
			Keep( 'user' ).it( this.auth.user || {}, 0, false );

			return this;
		}
	})
	.init();
});
