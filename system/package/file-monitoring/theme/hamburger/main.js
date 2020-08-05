define(
[
	'text!./view/item.xml',
	'text!./css/style.css',
	// 'system/helper/file',
	// 'system/helper/platform',
	'system/machine/anonstyle'
],
function( item, styles, fileHelper, platformHelper )
{
	// stilleri yerleştirelim
	Anonstyle.new( 'file-monitor-hamburger-theme' ).push( 'all', styles );

	/**
	 * Temayı temsil eden metot. Parametre olarak file-monitoring
	 * kurucusunun örneğini alır.
	 * 
	 * @param {fileMonitoring} parent temanın uyumlu biçimde çalışacağı monitoring nesnesi
	 * @param {Object}         o      ayarlar
	 */
	return function( parent, o )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Ayarlar.
		 * @type {Object}
		 */
		this.option = $.extend(
		{

		}, o );

		/**
		 * Dosya okuma işlemleri için bir web worker tutar.
		 * @type {Worker}
		 */
		this.photoReader = app.worker( 'system/photo-reader' );

		/**
		 * Tema iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			this.item = $( item );

			parent.skeleton.body.addClass( 'tm-hamburger' );
		}

		/**
		 * Olay dinleyicileri tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Web Worker tarafından hazırlanan seçilen dosyanın
			 * url olarak set edilebilir base64 datası hazır
			 * olduğunda tetiklenir.
			 * 
			 * @param {MessageEvent} e web worker tarafından üretilen bir message eventi
			 */
			onReadyThumbData: function( e )
			{
				var readed = e.data;
				// dosyayı seçelim
				var item = parent.skeleton.body.find( '#' + readed.ID );
				// itemdeki iconu kaldırıp yerine img yerleştireceğiz
				var thumb = $( '<img>' ).attr( 'src', readed.base64 );

				item.find( '.ico-area' ).html( thumb );
			},

			/**
			 * Bir dosyanın upload butonuna tıklandığında tetiklenir.
			 */
			onUploadClick: function()
			{
				var item = $( this ).parent().parent().parent();
				var file = item.data( 'file' );

				parent.upload( file );

				return false;
			},

			/**
			 * İptal butonuna tıklandığında tetiklenir.
			 */
			onCancelClick: function()
			{
				var item = $( this ).parent().parent().parent();
				var file = item.data( 'file' );

				parent.cancel( file );
				item.remove();

				return false;
			},

			/**
			 * Dosya sunucuya gönderildikçe tetiklenir.
			 * @param {ProgressEvent} e dosya upload ile ilgili bilgileri içeren bir nesne
			 */
			onProgress: function( evt, e )
			{
				var file = this.data.get( 'binary' );
				var item = parent.skeleton.body.find( '#' + file.ID );
				var percent = e.loaded * 100 / e.total;

				if( ! this.anotherProgress )
				{
					var file = this.data.get( 'binary' );
					var item = parent.skeleton.body.find( '#' + file.ID );

					file.size = e.total;
					item.find( '.filesize span' ).text( fileHelper.size( e.total ));
					this.anotherProgress = true;
				}

				item.find( '.progress-bar' ).css({ width: percent.toFixed( 3 ) + '%' });
			},

			/**
			 * bir dosya sunucuya başarıyla yüklendiğinde
			 * tetiklenir.
			 */
			onUploaded: function()
			{
				var file = this.data.get( 'binary' );
				var item = parent.skeleton.body.find( '#' + file.ID );

					file.uploaded = true;
					item.find( '.status' ).html( '' );
					item.find( '.progress-bar' )
						.removeClass( 'progress-bar-warning' )
						.addClass( 'progress-bar-success' );
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				// workerdan gelen mesajları dinleyelim
				root.photoReader.onmessage = this.onReadyThumbData;
			}
		}

		/**
		 * Temsil edilen dosyaları tek tek şablonla birleştirip
		 * ana hedefe yerleştirir, fonksiyonelliği sağlayan
		 * olay dinleyicileri attach eder.
		 *
	 	 * @param {List} files bütün dosyaları tutan listenin son hali
		 */
		this.draw = function( files )
		{
			files.each( function( i )
			{
				if( this.isDrawed )

					return;

				var fext = this.name.split( '.' ).pop();
				var item = root.skeleton.item.clone();
				var title = item.find( 'h3' );
				var filesize = item.find( '.filesize span' );
				var filesizeLabel = item.find( '.filesize b' );
				var lastmod = item.find( '.lastmod span' );
				var lastmodLabel = item.find( '.lastmod b' );
				var toolbar = item.find( '.status' );
				var remove = toolbar.find( '.remove' );
				var upload = toolbar.find( '.upload' );
				var icoArea = item.find( '.ico-area' );
				var ext = icoArea.find( 'p' );
				var progress = item.find( '.progress' );
				var progressBar = item.find( '.progress-bar' );

				item.data( 'file', this );
				title.text( this.name );
				filesize.text( fileHelper.size( this.size ));
				lastmod.text( this.lastModifiedDate.toUTCString());
				ext.text( fext );

				if( ! this.isDrawed )
				{
					item.attr( 'id', this.ID );
					this.isDrawed = true;
				}

				// dosya seçici dosya için hata listesi oluşturmuş olabilir
				// böyle bir şey varsa dosyayı hata görüntüleme modunda
				// ekrana yansıtacağız hata mesajlarını da içinde göstereceğiz
				if( this.errors && this.errors.length && this.errors.length > 0 )
				{
					var errors = $( '<ul></ul>' ).addClass( 'error-list' );

					$( this.errors ).each( function()
					{
						var err = $( '<li></li>' ).text( this );
						errors.append( err );
					});

					item.addClass( 'has-error' );
					toolbar.remove();
					progress.after( errors ).remove();
					icoArea.remove();
				}
				else
				{
					// butonları dinleyelim
					upload.on( 'click', root.listener.onUploadClick );
					remove.on( 'click', root.listener.onCancelClick );

					// önizleme yapılabilecek dosya uzantıları tarayıcıya
					// göre değişebildiği için önce bunu ayarlayalım
					var previewables = [ 'jpg', 'jpeg', 'bmp', 'gif', 'png' ];

					// webp formatını destekleyen tarayıcılarda bu dosyayı da önizleyebilelim
					if([ 'chrome', 'edge', 'vivaldi', 'safari', 'opera' ]
							.indexOf( platformHelper.browser()) > -1 )

						previewables.push( 'webp' );

					if( previewables.indexOf( fext ) > -1 )

						root.photoReader

							// dosyayı verelim binary okuması tamamlandığında timestamp
							// değeriyle birlikte bu worker bir mesaj yayınlayacaktır
							.postMessage(
							{
								method: 'read',
								params: [ this.ID, this ]
							});
				}

				parent.skeleton.body.prepend( item );
			});
		}

		/**
		 * Tema kurulumunu yapar.
		 */
		this.init = function()
		{
			this.listener.attach();

			return this;
		}
	}
});
