define( function()
{
	/**
	 * Bir restful arayüzü oluşturur. Bu arayüz belirtilen endpoint ile çalışacak
	 * şekilde yapılandırılmış olur. İlgili endpointe post, get, delete gibi her
	 * tür metot gönderilebilir, yanıtlar dinlenebilir, hata ve istisna yönetimi
	 * bu arayüz üzerinde sağlanır, böylece başka yerlerde her seferinde ajax isteği
	 * oluşturmak ve gelen sonuçları işlemek gerekmez.
	 * 
	 * @param {String} resource arayüzün çalışacağı restful end point (resource) adı
	 * @event done       başarılı bir sonuç alındığında oluşur
	 * @event exception  400, 401, 404 sonuçları alındığında oluşur
	 * @event fail       exception olayını tetiklemeyen başarısız bir sonuç alındığında oluşur
	 * @event error      bağlantı hatası gibi durumlarda oluşur
	 * @event finish     istek bir şekilde tamamlandığında oluşur
	 * @event status-xxx sunucudan bir durum kodu döndüğünde oluşur
	 */
	return window.Rest = function Rest( resource )
	{
		// ana etki alanını yedekleyelim
		var root = this;

		/**
		 * Restful endpoint (resource) adı.
		 * @type {String}
		 */
		this.resource = resource;

		/**
		 * Restful kaynağını url formatında tutar.
		 * @type {String}
		 */
		this.uri = app.api( resource );

		/**
		 * Bağlantı halindeki ajax nesnesini tutar.
		 * @type {jQuery}
		 */
		this.connection = null;

		/**
		 * Bağlantı durumunu tutar. Genellikle geç yanıt veren durumlar
		 * sırasında pending değerini döndüreceği için kullanışlıdır.
		 * 
		 * @type {String}
		 */
		this.status = 'ready';

		/**
		 * Son işlemdeki istek parametreleri.
		 * @type {Object}
		 */
		this.data = null;

		/**
		 * progress eventi üzerinden elde edilen teslim edildiği
		 * bilinen en son byte sayısını tutar. Her progress eventi
		 * vuruşunda kaç tane yeni byte'ın teslim edildiği bilgisini
		 * hesaplamak için gerekli ve kullanışlıdır.
		 * 
		 * @type {Number}
		 */
		this.lastBytes = 0;

		/**<
		 * Arayüzün kendisine ait olay dinleyicileri bir arada tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Ajax isteği başarısız olursa veya sunucu başarısızlık anlamına gelen
			 * bir http status code döndürürse tetiklenir. Dönen bilgileri derleyerek
			 * bir istisna durumu varsa fail durumunu bu callbacke yönlendirir. Bağlantı
			 * ile ilgili durumlardaysa fail callbacki çalıştırılır.
			 * 
			 * @param {event} e http sonuçlarını tutan event object
			 */
			onFailExtendUserFail: function( e )
			{
				var status = e.status;

				switch( status )
				{
					case 400:
					case 401:
					case 404:
					case 405:
					case 409:
					
						e = eval( '(' + e.responseText + ')' ) || {};

						var statusExceptions = 
						{
							"400": 'BadRequestException',
							"401": 'AuthException',
							"404": 'NotFoundException',
							"405": 'MethodNotAllowedException',
							"409": 'Conflict'
						}

						if( ! e.exception )

							e.exception = statusExceptions[ status ];

						var evt =
						{
							name: e.exception,
							message: e.errors
						}

						if( evt.name == 'ValidationException' && e.error )

							evt.error = e.error;

						$( root ).trigger( 'exception', evt );

						break;

					// bazen 200 durum kodu dönse de fail durumu
					// tetiklenebiliyor handle edelim
					case 200:

						$( root ).trigger( 'done' );
						break;

					default:

						$( root ).trigger( 'fail', e );
						break;
				}
			},

			/**
			 * Hata oluştuğunda tetiklenir.
			 */
			onError: function()
			{
				$( root ).trigger( 'error' );
			},

			/**
			 * Türü, yapısı ve sonucu farketmeksizin bir ajax isteği bittiğinde
			 * tetiklenir.
			 */
			onRequestEnd: function( content, statusText, xhr )
			{
				root.status = 'ready';
				root.lastBytes = 0;

				$( root ).trigger( 'finish' );
				$( root ).trigger( 'status-' + root.connection.status );
			}
		}

		/**
		 * Temsil edilen restful endpointe verilen datayı adı verilen metotla
		 * ajax isteği üzerinden teslim eder.
		 * 
		 * @param {String} method istek metodu [get,post,delete,put,patch]
		 * @param {Object} data   istek değişkenleri
		 */
		this.request = function( method, data )
		{
			this.status = 'pending';
			this.data = data;

			// varsayılan ajax ayarları
			var conn =
			{
				url: this.uri,
				dataType: 'json',
				data: data || {},
				type: method
			}

			// data parametresi bir FormData ise binary biçimde form gönderilmek
			// isteniyor varsayacağız böylece ajax ayarlarında bir-iki değişiklik gerekecek
			if( FormData && data instanceof FormData )
			{
				conn.processData = false;
				conn.contentType = false;
				
				conn.xhr = function()
				{
					// explorer ve diğer tarayıcılar için uygun ajax modülünü örnekleyelim
					var xhr = XMLHttpRequest
						? new XMLHttpRequest()
						: new ActiveXObject( 'Microsoft.XMLHTTP' );

					// Upload progress
					xhr.upload.addEventListener( 'progress', function( evt )
					{
						// event içinde bu event sırasında teslim edilen net byte sayısı
						// bulunmuyor ki çoğu yerde gerekli olan bilgi de budur aslında
						// bu yüzden burada biz hesaplarsak bu sorunu da tüm framework
						// çevrelerinde çözmüş olacağız
						evt.lastLoaded = evt.loaded - root.lastBytes;
						root.lastBytes = evt.loaded;

						$( root ).trigger( 'progress', evt );
					}, false );
					
					// xhr ı kendimize göre genişlettik şimdi bu haliyle
					// jQuery'e teslim edelim artık işin geri kalanı ona ait
					return xhr;
				}
			}

			// bağlantıyı kuralım
			this.connection = $.ajax( conn )

				// restful başarılıysa direkt callbacke aktarabiliriz
				.done( function( e )
				{
					$( root ).trigger( 'done', e );
				})
				// ajax bağlantı hatası oluşmuşsa kendi handle metodunu kullanacağız
				.fail( this.listener.onFailExtendUserFail )
				// hata türünden durumlar
				.error( this.listener.onError )
				// istek sonlandığında ilgili callbacke aktaralım
				.always( this.listener.onRequestEnd );
		}

		/**
		 * Devam etmekte olan işlemi iptal eder.
		 */
		this.abort = function()
		{
			this.connection.abort();
			this.status = 'ready';
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir get isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.get = function( data )
		{
			data = data || {};

			this.request( 'GET', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir post isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.post = function( data )
		{
			this.request( 'POST', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir delete isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.delete = function( data )
		{
			this.request( 'DELETE', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir put isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.put = function( data )
		{
			this.request( 'PUT', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir patch isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.patch = function( data )
		{
			this.request( 'PATCH', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir head isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.head = function( data )
		{
			this.request( 'HEAD', data );
		}

		/**
		 * Verilen değişkenlerle temsil edilen
		 * endpointe bir head isteği gönderir.
		 * 
		 * @param {Object} data istekle birlikte gönderilecek değişkenler
		 */
		this.options = function( data )
		{
			this.request( 'OPTIONS', data );
		}
	}
});
