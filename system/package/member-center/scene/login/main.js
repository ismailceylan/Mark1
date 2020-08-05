define(
[
	'system/library/auth',
	'member-center',
	'i18n!./language/nls/general'
],
function( auth, memberCenter, locale )
{
	// dil girdilerini sisteme katalım
	lang({ loginGeneral: locale });

	return new ( function()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Sahne adı.
		 * @type {String}
		 */
		this.name = 'login';

		/**
		 * Sahnenin oluşturulmasında kullanılacak olan prompt
		 * nesnesini tutar.
		 *
		 * @type {Dialog.prompt}
		 */
		this.prompt;

		/**
		 * İskelet parçalarını tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			this.username = $( '<input>' )
								.attr( 'name', "username" )
								.attr( 'data-label', lang( 'loginGeneral.username' ))
								.attr( 'data-rules', "required|email" );

			this.pwd      = $( '<input>' )
								.attr( 'type', "password" )
								.attr( 'name', "pwd" )
								.attr( 'data-label', lang( 'loginGeneral.password' ))
								.attr( 'data-rules', "required|min_length[6]" );

			this.remember = $( '<input>' )
								.attr( 'type', "checkbox" )
								.attr( 'name', "remember" )
								.attr( 'data-label', lang( 'loginGeneral.remember' ))
								.attr( 'data-rules', "in_list[on]" );
		}

		/**
		 * Olay dinleyicileri tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Prompt alanları kurallara uygun biçimde doldurulup
			 * OK butonuna basıldığında ve henüz dialog kapatılmadan
			 * önce tetiklenir.
			 *
			 * @param {Object} e {inputName: inputValue, ... } yapısında bir nesne 
			 */
			onDone: function( e )
			{
				// restfula post edelim
				auth.login( e.username, e.pwd, e.remember );

				// dialog kapanmasın
				return false;
			},

			/**
			 * Login işlemi başarılı olunca tetiklenir.
			 */
			onLoginDone: function()
			{
				root.fixPurchased();
				memberCenter.dialog.close();
			},

			/**
			 * Oturum açma girişimi istisna ile sonuçlandığında tetiklenir.
			 * @param {Object} exc istisna bilgileri
			 */
			onLoginException: function( evt, exc )
			{
				var err = root.prompt.skeleton.err;

				if( exc.name == 'AuthException' )

					err.text( exc.message );

				else if( exc.name == 'ValidationException' )
				{
					err.text( '' );

					exc.error.map( function( e, i )
					{
						if( i > 0 )

							err.append( '<br>' );
						
						err.append( e.message );
					});
				}
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				// elementler listenerları kaybetse de objectlerde bu olmaz
				// bu nedenle sadece bir defa attach edilmeleri yeterlidir
				if( this.attached )

					return;

				$( auth )
					.on( 'done', root.listener.onLoginDone )
					.on( 'exception', root.listener.onLoginException )
					.on( 'fail', root.listener.onLoginFail )
					.on( 'finish', root.listener.onLoginFinish );

				this.attached = true;
			}
		}

		/**
		 * Oturumu açık kullanıcının medya sayısı ile cihazda saklanan
		 * medya sayısı birbirini tutmuyorsa eşitleme girişiminde bulunur.
		 *
		 * @event purchased-fixed satın alınmış medyalar sunucudan güncellendiğinde
		 *        				  tetiklenir diğer bir deyişle satın alınmışlar
		 *        				  listesi kullanıcı için hazırsa tetiklenir.
		 * @event purchased-ready satın alınmış medya listesi sunucudan veya cihazdan
		 *        				  farketmeksizin kullanıma hazır durumdaysa tetiklenir.
		 */
		this.fixPurchased = function()
		{
			// oturum yoksa işlem yok
			if( ! auth.login())

				return;

			var sales = new Keep( 'sales' ).me();

			// cihazdaki satılan medyalar listesi kullanıcıya aitse
			if( sales && sales.user_id && sales.user_id == auth.data( 'id' ))
			{
				// kullanıcı bilgilerinde bulunan medya
				// sayısı ile cihazdaki aynıysa işlem yok
				if( sales && sales.length && sales.length == auth.data( 'buys' ))
				{
					$( app ).trigger( 'purchased-ready' );
					return;
				}
			}

			// cihazda ya satılanlar listesi yok ya da bu
			// kullanıcıya ait değiller sunucudan güncelleyelim
			var buyeds = new Rest( 'user/medias' );

			$( buyeds ).on( 'done', function( evt, e )
			{
				// sonuç mevcut, bunları işlememiz gerekiyor
				// sunucu da bunu işleyebilirdi ama orada her üyenin
				// bilgileri işlenecekken burada sadece tek kişinin
				// bilgisi işlenecek, kısacası sunucu yükünün birazını
				// kullanıcının işlemcisine devrediyoruz
				var medias = { length: 0, user_id: auth.data( 'id' )}

				$( e.medias ).each( function()
				{
					medias[ this[ 'm' ]] = 1;
					medias.length++
				});

				// bilgileri işledik cihaza kaydedebiliriz
				( new Keep( 'sales' )).it( medias );

				// app seviyesinde bir olay tetikleyelim
				$( app ).trigger( 'purchased-fixed' );
				$( app ).trigger( 'purchased-ready' );
			});

			buyeds.get();
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			// prompt nesnesini oluşturalım
			root.prompt = memberCenter.dialog.prompt
			(
				lang( 'loginGeneral.form_title' ),
				[
					root.skeleton.username,
					root.skeleton.pwd,
					root.skeleton.remember
				],
				this.listener.onDone
			);

			// olayları dinleyelim
			this.listener.attach();
		}
	});
});
