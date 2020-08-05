define( function()
{
	/**
	 * Verilen bir modül için responsive modlarını arar ve ekranın
	 * o anki durumu için en uygun olan modun kurulumunu yapar. Ekran
	 * boyu değişirse mevcut modu destroy edip yenisini init eder. Bu
	 * yüzden her modül kendi init ve destroy metotlarını barındırmalıdır.
	 * Ayrıca verilen modül instance'ında kendi require etki alanı
	 * bulundurmalıdır. Nesne yapısı module->screenHandler şeklinde
	 * gerçekleşir.
	 * 
	 * @param {Object} package   require ile yüklenen bir modulün kendisi
	 * @param {Array}  supported paketin desteklediği mod isimlerinin küçükten büyüğe sıralı listesi
	 * @event change		     ekran modu hangisi olursa olsun değiştiğinde tetiklenir
	 * @event handled            ekran modunu ele alan handler mevcutsa ve başarılı biçimde
	 *        				     yüklenebilmişse tetiklenir
	 * @event initialized        bir handler yüklenmiş ve kurulumu her neyse bunu tamamladığını
	 *        					 bildiren ready isimli olayı gerçekleştirmişse tetiklenir
	 * @event screenModeChange   mevcut ekran modu (xl,sm vs) değiştiğinde tetiklenir
	 */
	return Responsive = function Responsive( package, supported )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Ekran genişliğinin ait olduğu grup adını tutar.
		 * @type {String}
		 */
		this.currentMode = null;

		/**
		 * Verilen package için mevcut ekran boyutunu handle eden nesne.
		 * @type {Object}
		 */
		this.currentHandler = null;

		/**
		 * Ekran modlarını küçükten büyüğe sıralı biçimde tutar.
		 * @type {Array}
		 */
		this.modes = [ 'xs', 'sm', 'md', 'lg', 'xl' ];

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Ekran boyutu değiştiğinde tetiklenir.
			 */
			onWindowResize: function()
			{
				// resize işleminin her adımına ihtiyacımız yok bir defa
				// tetiklense yeterli bu yüzden fazladan çağrıları yok sayalım
				clearTimeout( root.resizeTimer );

				root.resizeTimer = setTimeout( function()
				{
					// yeni bir kontrol başlatalım
					root.check();
				}, 50 );
			},

			/**
			 * Olay dinleyicileri siler.
			 */
			dettach: function()
			{
//				$( window ).off( 'resize', this.onWindowResize );
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
//				$( window ).on( 'resize', this.onWindowResize );
			}
		}

		/**
		 * Ekran genişliğini belli bir kalıp içinde sınayıp bir gruba
		 * yerleştirmeye çalışır. Çözünürlüğün denk düştüğü grubun adını
		 * döndürür.
		 * 
		 * @return {String}
		 */
		this.detectMode = function()
		{
			var mode;
			var width = $( window ).width();

			// xs modu
			if( width < 768 )
			
				mode = 'xs';

			else if( width > 767 && width < 993 )

				mode = 'sm';

			else if( width > 992 && width < 1200 )

				mode = 'md';

			else if( width > 1199 && width < 1600 )

				mode = 'lg';

			else if( width > 1599 )

				mode = 'xl';

			return mode;
		}

		/**
		 * Adı verilen moddan önce gelen bir modun
		 * adını döndürür. Zaten en baştaki verilmişse
		 * tanımsız döner.
		 * 
		 * @param  {String} mode bir küçüğü istenen modun adı
		 * @return {String}
		 */
		this.lower = function( mode )
		{
			// ilk mod verilmişse undefined dönelim
			if( this.modes[ 0 ] == mode )

				return undefined;

			return this.modes[ this.modes.indexOf( mode ) - 1 ];
		}

		/**
		 * Verilen bir ekran modunun, diğerinden büyük olup olmadığını sınar. Modlardan
		 * herhangi biri tanınmıyorsa undefined döner.
		 * 
		 * @param {String} from bir ekran modu
		 * @param {String} to bir ekran modu
		 * @return {Boolean}
		 */
		this.isGreater = function( from, to )
		{
			var fromIndex = this.modes.indexOf( from );
			var toIndex = this.modes.indexOf( to );

			if( fromIndex == -1 || toIndex == -1 )

				return undefined;

			return fromIndex > toIndex;
		}

		/**
		 * Verilen bir ekran modunun, diğerinden küçük olup olmadığını sınar. Modlardan
		 * herhangi biri tanınmıyorsa undefined döner.
		 * 
		 * @param {String} from bir ekran modu
		 * @param {String} to bir ekran modu
		 * @return {Boolean}
		 */
		this.isLower = function( from, to )
		{
			var fromIndex = this.modes.indexOf( from );
			var toIndex = this.modes.indexOf( to );

			if( fromIndex == -1 || toIndex == -1 )

				return undefined;

			return fromIndex < toIndex;
		}

		/**
		 * Verilen bir ekran modunun, diğerine eşit olup olmadığını sınar. Modlardan
		 * herhangi biri tanınmıyorsa undefined döner.
		 * 
		 * @param {String} from bir ekran modu
		 * @param {String} to bir ekran modu
		 * @return {Boolean}
		 */
		this.isEqual = function( from, to )
		{
			var fromIndex = this.modes.indexOf( from );
			var toIndex = this.modes.indexOf( to );

			if( fromIndex == -1 || toIndex == -1 )

				return undefined;

			return fromIndex == toIndex;
		}

		/**
		 * Ekran düzenini kontrol ederek değişiklik
		 * algılarsa yeni bir kurulum başlatır.
		 */
		this.check = function()
		{
			// ekran modunu bulalım
			var mode = this.detectMode();

			// mevcut ekran modu ile az önce elde ettiğimiz mode
			// aynıysa ekran genişliği değişmemiş demektir
			if( mode == this.currentMode )

				return;

			this.currentMode = mode;

			// package mevcut ekran genişliğini handle eden bir
			// moda sahip değilse bu genişlikten daha azını handle
			// eden bir mod araştıralım, mesela ekran lg ise ama
			// package en büyük md handle ediyorsa o zaman bu lg
			// olan ekranda md modunu çalıştırmalıyız
			if( supported.indexOf( this.currentMode ) == -1 )
			{
				// package mevcut ekran genişliğini handle etmiyor
				// bu yüzden mevcut ekran modunu bir küçültüp tekrar
				// denemeliyiz
				var lower = this.currentMode;
				var changed = false;

				for( var i = 0; i < supported.length; i++ )
				{
					lower = this.lower( lower );

					if( supported.indexOf( lower ) > -1 )
					{
						this.currentMode = lower;
						changed = true;
						break;
					}
				}

				if( ! changed )
				{
					console.warn( 'The package didn\'t even handled that mode: ' + this.currentMode );
					return;
				}
			}

			// modu bulduk bir event tetikleyelim
			$( this ).trigger( this.currentMode );
			$( this ).trigger( 'change', [ this.currentMode ]);

			// app seviyesinde olay tetikleyelim
			if( app.currentScreenGroup != this.currentMode )

				$( app ).trigger( 'screenModeChange', [ app.currentScreenGroup = this.currentMode ]);

			// ilgili modu yüklemeyi direkt deneyelim
			package.require([ './screen/' + this.currentMode + '/main' ], function( mode )
			{
				// handler bir object değilse ve constructor ise burada örnekleyelim
				if( mode instanceof Function )

					mode = new mode;

				// bir önceki handler ile yenisi aynıysa işleme gerek yok
				if( root.currentHandler === mode )

					return;

				// handler'a parenti bir özellik olarak kaydedersek
				// handler içinden parent'i include etmeye gerek kalmayacaktır
				// ayrıca parent'i object değil de constructor olan handler'lar
				// bu yolu denedikleri zaman ellerine parent object değil parent
				// constructor geçeceğinden sorun olacaktır, bu yüzden basitçe
				// her handler parent isimli özelliğine erişirse parent modül
				// örneğine erişebilsin diye burada kaydedelim
				mode.parent = package;

				// ekranı en son handle eden handlerın
				// yok edicisi varsa çalıştıralım izleri yok edilsin
				if( root.currentHandler && root.currentHandler.destroy )

						root.currentHandler.destroy();

				// yeni modu kuralım
				if( mode && mode.init )
				{
					// belki modül ready olayı tetikliyorsa bunu
					// initialized olarak dışarıya yansıtacağız
					$( mode ).on( 'ready', function()
					{
						$( root ).trigger( 'initialized', mode );
					});
					
					mode.init();
				}

				root.currentHandler = mode;

				$( root ).trigger( 'handled', [ mode, root.currentHandler ]);
			});
		}

		/**
		 * Kurulumu kaldırır.
		 */
		this.destroy = function()
		{
			this.listener.dettach();
			
			if( this.currentHandler && this.currentHandler.destroy )

				this.currentHandler.destroy();
			
			this.currentMode =
			this.currentHandler = null;
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			// olayları dinleyelim
			this.listener.attach();
			// kontroller başlasın
			this.check();
		}

		this.init();
	}
});