define(
[
	'system/machine/rest'
],
function()
{
	/**
	 * rest eklentisini kullanarak login, logout gibi
	 * yetkilendirme işlemleri için bir arayüz sağlar.
	 */
	return ( new ( function()
	{
		// etki alanını yedekleyelim
		var root = this;

		/**
		 * Restful endpointlerini tutar.
		 * @type {Object}
		 */
		this.scenes =
		{
			/**
			 * Restful tarafında login işlemlerini yöneten endpoint ile
			 * çalışmak üzere ayarlanmış bir rest arayüzü tutar.
			 * 
			 * @type {Rest}
			 */
			login: new Rest( 'user/login' ),

			/**
			 * Restful tarafından logout işlemlerini yöneten endpoint ile
			 * çalışmak üzere ayarlanmış bir rest arayüzü tutar.
			 * 
			 * @type {Rest}
			 */
			logout: new Rest( 'user/logout' )
		}

		/**
		 * Kullanıcı bilgileri.
		 * @type {Object}
		 */
		this.user = null;

		/**
		 * Eklenti olaylarını bir arada tutar.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * Login olma girişimi başarılı olunca tetiklenir.
			 *
			 * @param {Object} e   endpointten dönen sonuç bilgilerini tutan json nesnesi
			 */
			onLoginDone: function( evt, e )
			{
				// kullanıcı bilgilerini istemciye yazalım
				root.user = e.user;

				// eklenti seviyesinde bir olay tetikleyelim
				$( root ).trigger( 'done' );
				// uygulama seviyesinde bir olay tetikleyelim
				$( app ).trigger( 'login' );
			},

			/**
			 * Login olma girişimi sonucunda endpoint bir
			 * istisna oluşturursa tetiklenir.
			 *
			 * @param {Object} exc endpointten dönen exception bilgilerini tutan json nesnesi
			 */
			onLoginException: function( evt, exc )
			{
				// her ihtimale karşı bir başarısız oturum girişimi
				// cihazda saklanan mevcut oturum bilgilerini silsin
				root.user = null;

				$( root ).trigger( 'exception', exc );
				$( app  ).trigger( 'loginException', exc );
			},

			/**
			 * Login olma girişimi sırasında ağ veya sunucuyla ilgili
			 * bir sorun nedeniyle iletişim başarısız olursa tetiklenir.
			 *
			 * @param {Object} e   xmlhttprequest nesnesinin ürettiği olay bilgileri
			 */
			onLoginFail: function( evt, e )
			{
				$( root ).trigger( 'fail', e );
				$( app  ).trigger( 'loginFail', e );
			},

			/**
			 * Login olma girişimi başarılı veya başarısız
			 * tamamlandığında teiklenir.
			 */
			onLoginFinish: function()
			{
				$( root ).trigger( 'finish' );
				$( app  ).trigger( 'loginFinish' );
			},

			/**
			 * Eklenti olaylarını dinlenecek noktalara attach eder.
			 */
			attach: function()
			{
				$( root.scenes.login )

					.on( 'done', root.listener.onLoginDone )
					.on( 'exception', root.listener.onLoginException )
					.on( 'fail', root.listener.onLoginFail )
					.on( 'finish', root.listener.onLoginFinish )
			}
		}

		/**
		 * Parametreler verilirse oturum açmayı dener, parametre verilmezse istemcinin oturum
		 * durumu boolean olarak döndürür.
		 * 
		 * @param  {String} email geçerli bir e-posta adresi
		 * @param  {String} pwd   geçerli bir parola
		 * @return {Boolean} 
		 */
		this.login = function( email, pwd )
		{
			// oturum açma modunu handle edelim
			if( email && pwd )
			{
				// endpointe isteği direkt gönderelim
				this.scenes.login.post(
				{
					email: email,
					pwd: pwd
				});
			}
			// oturum sorgulama modu
			else

				return this.user
					? true
					: false;
		}

		/**
		 * Cihazdaki oturum bilgilerini temizler, oturumu kapatır.
		 */
		this.logout = function()
		{
			// önce saklanan verileri silelim
			this.user = null;

			// restful endpointe istekte bulunalım
			this.scenes.logout.post();
			// app seviyesinde bir olay tetikleyelim
			$( app ).trigger( 'logout' );
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();
			return this;
		}
	}))
	.init();
});
