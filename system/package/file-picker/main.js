define(
[
	'text!./css/style.css',
	'i18n!./language/nls/general',
	// 'system/helper/file',
	'system/machine/anonstyle'
],
function( styles, localize, fileHelper )
{
	// stilleri dökümana ilave edelim
	Anonstyle.new( 'file-picker' ).push( 'all', styles );

	// dil girdilerini sisteme ekleyelim
	lang({ filePickerGeneral: localize });

	/**
	 * Browser uyumluluğunu da dikkate alarak mümkün olan en iyi dosya seçme
	 * deneyimini sunmak için arayüzler oluşturup bu arayüze fonksiyonellik sağlar.
	 * 
	 * @param {Object} trigger dosya seçici bir buton veya dosyaların drop edileceği alan
	 * @param {Object} o       eklenti ayarları
	 */
	window.FilePicker = FilePicker = function( trigger, o )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Kaç tane dosya seçimi yapıldığını tutar.
		 * @type {Number}
		 */
		this.times = 0;

		/**
		 * Şimdiye kadar seçilmiş dosyaları tutar.
		 * @type {Array}
		 */
		this.history = {}

		/**
		 * Ayarları tutar.
		 * @type {Object}
		 */
		this.option = $.extend(
		{
			// dosyanın input adı olarak kullanılacak isim
			name: 'binary',
			// izin verilen formatlar
			allowed: 'jpg,jpeg',
			// izin verilen boyut limiti (byte)
			maxSize: 0
		}, o );

		/**
		 * Tarayıcının drag, drop, dosya listeleri ve dosya okuma
		 * gibi html5 özelliklerini destekleyip desteklemediğini söyler.
		 * 
		 * @type {Boolean}
		 */
		this.isModern = ( function()
		{
			var div = $( '<div></div>' )[ 0 ];
			var dragSupport = 'draggable' in div || ( 'ondragstart' in div && 'ondrop' in div );
			var formDataSupport = 'FormData' in window;
			var fileReaderSupport = 'FileReader' in window;
			var fileListSupport = 'FileList' in window;

			return dragSupport && formDataSupport && fileReaderSupport && fileListSupport;
		})();

		/**
		 * İskeleti tutar.
		 * @return {Object}
		 */
		this.skeleton = new function()
		{
			this.body    = trigger;
			this.message = $( '<p></p>' ).html( lang( 'filePickerGeneral.' + ( root.isModern? 'modernMessage' : 'primitiveMessage' )));
			this.input   = $( '<input>' ).attr( 'type', 'file' ).attr( 'multiple', '' ).attr( 'name', root.option.name );

			this.message.find( 'a' ).append( this.input );
			this.body.append( this.message );
		}

		/**
		 * Olay dinleyicileri tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Dosya seçici trigger, file türünde bir inputsa ve dosya
			 * seçimi yapılırsa tetiklenir.
			 *
			 * @event {change} dosya seçildiğinde kurucu element üzerinde tetiklenir
			 * @event {change} dosya seçildiğinde file-picker üzerinde tetiklenir
			 */
			onFileInputChange: function()
			{
				var files = this.files;

				// uzantı kontrolü yapalım
				files = root.checkFormat( this.files );
				files = root.checkSize( files );
				files = root.checkAlready( files );

				// dosyalara ID kazandıralım
				$( files ).each( function()
				{
					this.ID = root.createID();
					// dosyalara iptal ajanı yerleştirelim
					$( this ).on( 'cancel', root.listener.onFileCancel );
				});

				trigger.trigger( 'change', { files: files });
				$( root ).trigger( 'change', { files: files });

				return false;
			},

			/**
			 * Dosya seçiçi trigger elementi üzerine masaüstünden
			 * dosya(lar) bırakılırsa tetiklenir.
			 *
			 * @event {change} dosya seçildiğinde kurucu element üzerinde tetiklenir
			 * @event {change} dosya seçildiğinde file-picker üzerinde tetiklenir
			 */
			onDrop: function( e )
			{
				var fileList = e.originalEvent.dataTransfer.files;

				// uzantı kontrolü yapalım
				fileList = root.checkFormat( fileList );
				fileList = root.checkSize( fileList );
				fileList = root.checkAlready( fileList );

				trigger.removeClass( 'drag-enter' );

				// dosya yoksa işlem yok
				if( fileList.length == 0 )

					return;

				// dosyalara ID kazandıralım
				$( fileList ).each( function()
				{
					this.ID = root.createID();

					// dosyalara iptal ajanı yerleştirelim
					$( this ).on( 'cancel', root.listener.onFileCancel );
				});

				trigger.trigger( 'change', { files: fileList });
				$( root ).trigger( 'change', { files: fileList });

				return false;
			},

			/**
			 * Trigger üzerinde sürükleme modunda
			 * kalındığı sürece tetiklenir.
			 */
			onDragOver: function()
			{
				if( ! trigger.hasClass( 'drag-enter' ))

					trigger.addClass( 'drag-enter' );

				return false;
			},

			/**
			 * Trigger içine birşeyler sürüklendiğinde tetiklenir.
			 */
			onDragEnter: function()
			{
				// triggere css sınıfı verelim
				trigger.addClass( 'drag-enter' );
			},

			/**
			 * Sürükleme işlemi trigger içinden çıktığında tetiklenir.
			 */
			onDragLeave: function()
			{
				clearTimeout( this.dragLeaveTimer );

				this.dragLeaveTimer = setTimeout( function()
				{
					trigger.removeClass( 'drag-enter' );
				},
				1500);
			},

			/**
			 * Pencere içinde herhangi bir sürükleme olunca tetiklenir.
			 */
			onWindowDragOver: function()
			{
				if( ! trigger.hasClass( 'expand' ))
				
					trigger.addClass( 'expand' );
			},

			/**
			 * Dosya seçildiğinde (input veya sürükle-bırak) tetiklenir.
			 * @param {Object} e olay bilgileri ve dosya listesi
			 */
			onFileSelect: function( evt, e )
			{
				// bize bağımlı olan bir file-monitoring yerleşimi
				// mevcutsa bunun üzerine file-monitoring eklentisini
				// kurup seçilen dosyaları da teslim edelim
				$( '[data-for="' + trigger.attr( 'id' ) + '"]' ).fileMonitoring( e.files );
			},

			/**
			 * Bir dosya nesnesine attach edilmiş cancel eventi trigger
			 * edildiğinde tetiklenir.
			 */
			onFileCancel: function()
			{
				// dosyanın history içindeki kaydını kaldıralım böylece
				// listeden kaldırılmış bir dosya için tekrar seçildiğinde
				// bu zaten listede gibi saçma bir hata vermemiş oluruz
				delete root.history[ this.name + '-' + this.lastModified ];
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				root.skeleton.input.on( 'change', this.onFileInputChange );

				trigger
					.on( 'drag', this.onFileDrop )
					.on( 'dragenter', this.onDragEnter )
					.on( 'dragleave', this.onDragLeave )
					.on( 'dragover', this.onDragOver )
					.on( 'drop', this.onDrop )

				$( window ).on( 'dragover', this.onWindowDragOver );

				$( root ).on( 'change', this.onFileSelect );
			}
		}

		/**
		 * Benzersiz bir ID değeri oluşturup döndürür.
		 * @return {String}
		 */
		this.createID = function()
		{
			var ID = ( new Date ).getTime() + '' + this.times;

			this.times++

			return ID;
		}

		/**
		 * Verilen dosya listesi içinde sadece izin verilen
		 * formata uyanların kalmasını sağlar.
		 * 
		 * @param  {FileList} files seçilmiş dosyalar listesi
		 * @return {FileList}
		 */
		this.checkFormat = function( files )
		{
			var allowed = root.option.allowed.split( ',' );

			$( files ).each( function()
			{
				var ext = this.name.split( '.' ).pop();

				if( ! this.errors )

					this.errors = [];

				if( allowed.indexOf( ext ) == -1 )

					this.errors.push
					(
						lang( 'filePickerGeneral.unallowedFormatDetected',
						{
							allowed: allowed.join( ', ' )
						})
					);
			});

			return files;
		}

		/**
		 * Verilen dosya listesi içinde sadece izin verilen dosya
		 * büyüklüğünü aşmayan dosyaların kalmasını sağlar.
		 * 
		 * @param  {FileList} files seçilmiş dosyalar listesi
		 * @return {FileList}
		 */
		this.checkSize = function( files )
		{
			var maxSize = root.option.maxSize;

			if( maxSize == 0 )

				return files;

			$( files ).each( function()
			{
				if( ! this.errors )

					this.errors = [];

				if( this.size > maxSize )

					this.errors.push
					(
						lang( 'filePickerGeneral.unallowedSizeDetected',
						{
							oversize: fileHelper.size( this.size - maxSize ).replace( ' ', '' ),
							maxsize: fileHelper.size( maxSize ).replace( ' ', '' )
						})
					);

				else if( this.size == 0 )

					this.errors.push( lang( 'filePickerGeneral.emptyFileDetected' ));
			});

			return files;
		}

		/**
		 * Seçilen dosyaların zaten daha önceden seçilip seçilmediğini
		 * kontrol eder. Zaten seçilmişlerse hata kaydı eklenir.
		 * 
		 * @param  {FileList} files yeni seçilmiş dosyalar listesi
		 * @return {FileList}
		 */
		this.checkAlready = function( files )
		{
			$( files ).each( function()
			{
				var name = this.name + '-' + this.lastModified;
	
				if( ! this.errors )

					this.errors = [];

				if( root.history[ name ])

					this.errors.push( lang( 'filePickerGeneral.doubleSelectDetected' ));

				else

					root.history[ name ] = true;
			});

			return files;
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();
		}
	}

	$.fn.filePicker = function( o )
	{
		this.each( function()
		{
			var el = $( this );

			// data-* düzeninden ayarları elde edelim
			o = $.extend( o, el.data());

			var instance = new FilePicker( el, o );
				instance.init();

			el.data( 'file-picker', instance );
		});

		return this;
	}

	$( '[data-toggle="file-picker"]' ).filePicker();
});
