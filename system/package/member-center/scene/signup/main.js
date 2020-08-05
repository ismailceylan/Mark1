define(
[
	'system/library/auth',
	'member-center',
	'i18n!./language/nls/general',
	'system/machine/rest'
],
function( auth, memberCenter, locale )
{
	// dil girdilerini sisteme katalım
	lang({ signupGeneral: locale });

	return new ( function()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Sahne adı.
		 * @type {String}
		 */
		this.name = 'signup';

		/**
		 * Sahnenin oluşturulmasında kullanılacak olan prompt
		 * nesnesini tutar.
		 *
		 * @type {Dialog.prompt}
		 */
		this.prompt;

		/**
		 * Signup için gerekli restful endpointleri üzerine
		 * açılmış arayüzleri bir arada tutar.
		 * 
		 * @type {Object}
		 */
		this.scene = 
		{
			/**
			 * Signup işlemlerini handle eden restful özkaynağı
			 * üzerinde çalışacak bir arayüz örneği.
			 * 
			 * @type {Rest}
			 */
			signup: new Rest( 'user' )
		}

		/**
		 * İskelet parçalarını tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			this.username = $( '<input>' )
								.attr( 'name', "username" )
								.attr( 'data-label', lang( 'signupGeneral.username' ))
								.attr( 'data-rules', "required|alpha[number,dash]|min_length[3]|max_length[30]" );

			this.email    = $( '<input>' )
								.attr( 'name', "email" )
								.attr( 'data-label', lang( 'signupGeneral.email' ))
								.attr( 'data-rules', "required|email" );

			this.pwd      = $( '<input>' )
								.attr( 'type', "password" )
								.attr( 'name', "pwd" )
								.attr( 'data-label', lang( 'signupGeneral.password' ))
								.attr( 'data-rules', "required|min_length[6]" );

			this.repwd    = $( '<input>' )
								.attr( 'type', "password" )
								.attr( 'name', "repwd" )
								.attr( 'data-label', lang( 'signupGeneral.repassword' ))
								.attr( 'data-rules', "required|min_length[6]|matches[pwd]" );
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
				root.scene.signup.post( e );

				// dialog kapanmasın
				return false;
			},

			/**
			 * Kayıt işlemi başarılı olunca tetiklenir.
			 */
			onSignupDone: function( e )
			{
				// login sahnesini açalım
				memberCenter.open( 'login' );
			},

			/**
			 * Kaydolma girişimi istisna ile sonuçlandığında tetiklenir.
			 * @param {Object} exc istisna bilgileri
			 */
			onSignupException: function( evt, exc )
			{
				var err = root.prompt.skeleton.err;

				if( exc.name == 'AuthException' )

					err.text( exc.message );

				else if( exc.name == 'ValidationException' )
				{
					err.text( '' );

					$( exc.error ).each( function()
					{
						root.prompt.setError( this.name, this.message );
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

				$( root.scene.signup )
					.on( 'done', root.listener.onSignupDone )
					.on( 'exception', root.listener.onSignupException )
					.on( 'fail', root.listener.onSignupFail )
					.on( 'finish', root.listener.onSignupFinish );

				this.attached = true;
			}
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			// prompt nesnesini oluşturalım
			root.prompt = memberCenter.dialog.prompt
			(
				lang( 'signupGeneral.form_title' ),
				[
					root.skeleton.username,
					root.skeleton.email,
					root.skeleton.pwd,
					root.skeleton.repwd
				],
				this.listener.onDone
			);

			// olayları dinleyelim
			this.listener.attach();
		}
	});
});
