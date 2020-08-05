define(
[
	'require',
	'text!./css/style.css',
	'text!./view/summary.xml',
	// 'system/helper/file',
	'system/machine/list',
	'system/machine/rest',
	'system/machine/anonstyle'
],
function( require, styles, summary, fileHelper )
{
	// stilleri ekleyelim
	Anonstyle.new().push( 'all', styles );

	/**
	 * Verilen bir element içinde verilen dosyaların izlenmesini
	 * ve yönetilmesini sağlayacak bir arayüz oluşturur. Bu arayüzden
	 * dosyaların türleri, tarihleri, boyutları, fotoğrafsa önizlemeleri
	 * görülebilir, listeden çıkartılabilir, ayarlarla bir endpoint
	 * verilmişse upload eklentisi üzerinden ilgili endpointe yüklenmesi
	 * sağlanabilir. Çeşitli temaları destekler.
	 * 
	 * @param {jQuery}   target dosyaların yansıtılacağı hedef element
	 * @param {FileList} files  dosya listesi
	 * @param {Object}   o      eklenti ayarları
	 */
	window.fileMonitoring = fileMonitoring = function( target, files, o )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Monitör için benzersiz bir ID değeri.
		 * @type {Integer}
		 */
		this.id = ( new Date ).getTime();

		/**
		 * Listedeki dosyaların toplam byte sayısı.
		 * @type {Number}
		 */
		this.totalBytes = 0;

		/**
		 * Yüklemesi tamamlanmış toplam byte sayısı.
		 * @type {Number}
		 */
		this.totalLoadedBytes = 0;

		/**
		 * Hedef element.
		 * @type {jQuery}
		 */
		this.target = target;

		/**
		 * Dosyalar.
		 * @type {List}
		 */
		this.files = new List( 'file-monitoring-' + this.id );

		/**
		 * Yükleme işlemlerinde görev alacak rest arayüzlerini tutar.
		 * @type {Array}
		 */
		this.jet = [];

		/**
		 * Yükleme kuyruğu.
		 * @type {Array}
		 */
		this.job = [];

		/**
		 * Eklenti ayarlarını tutar.
		 * @type {Object}
		 */
		this.option = $.extend(
		{
			// varsayılan tema
			theme: 'hamburger',
			// özet bölümü [no,yes,selector]
			summary: 'no',
			// yüklemenin yapılacağı restful endpoint adı
			uploadEndpoint: 'media',
			// seçilir seçilmez yüklemenin başlayıp başlamayacağı
			uploadAuto: 'no',
			// bir yükleme bittiğinde izlenecek işlem [none,remove]
			onUploaded: 'none',
			// aynı anda upload edilecek maksimum dosya sayısı
			simultaneousJobs: 1
		}, o );

		/**
		 * İskelet parçalarını tutar.
		 * @type {Object}
		 */
		this.skeleton = new ( function( summary )
		{
			this.body = target;

			// özet aktifse yerleştirelim
			if( root.option.summary != 'no' )
			{
				this.summary = $( summary );
				
				if( root.option.summary == 'yes' )
				
					target.before( this.summary );

				else

					$( root.option.summary ).html( this.summary );

				this.totalBytes = this.summary.find( '.total' );
				this.completedBytes = this.summary.find( '.completed' );
				this.progress = this.summary.find( '.progress-bar' );
			}
		})( summary );

		/**
		 * Olay dinleyicileri tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Bir upload başarılı veya başarısız bittiğinde tetiklenir.
			 */
			onFinish: function()
			{
				// bu metot jet motorunun finish olayını dinleyen bir listener
				// metottur bu yüzden de this sözcüğü ilgili jet motoruna çıkar
				// dolayısıyla onun tüm metotlarını kullanabiliriz kuyrukta
				// sırasını bekleyen bir dosyayı alıp işini bitirdiğini söyleyen
				// bu jet motoruna vererek devinimli yüklemeyi sürdürmüş oluruz
				if( file = root.job.pop())

					this.post( file );
			},

			/**
			 * Bir yükleme başarılı olunca tetiklenir.
			 * @param {Object} e sunucudan dönen yüklenmiş dosyanın bilgileri
			 */
			onUploaded: function( evt, e )
			{
				// yüklenen dosyaya ulaşalım
				var file = this.data.get( 'binary' );

				// dosyayı sunucudan dönen bilgilere push edelim
				e.file = file;
				
				// eklentinin ana iskeleti üzerinde olayı trigger edelim
				root.skeleton.body.trigger( 'uploaded', e );
			},

			/**
			 * Veri gönderildikçe tetiklenir.
			 * @param {ProgressEvent} e yükleme bilgileri
			 */
			onProgress: function( evt, e )
			{
				root.totalLoadedBytes += e.lastLoaded;
				
				var file = this.data.get( 'binary' );
					file.loaded = e.loaded;

				// ajaxın hesapladığı ile native file nesnesinde bulunan
				// dosyadaki byte sayısı farklı oluyor bu yüzden
				// de yükleme bilgilerinde tuhaflıklar oluşur bunu yok etmek
				// için bir seferlik ajaxtaki bilgiyi dikkate almamız gerekiyor 
				if( ! file.progressed )
				{
					var diff = file.size - e.total;
						diff = diff < 0? Math.abs( diff ) : 0;
					
					root.totalBytes += diff;

					if( root.option.summary != 'no' )

						root.skeleton.totalBytes.text( fileHelper.size( root.totalBytes ));

					file.progressed = true;
					file.size = e.total;
				}

				// ana göstergeyi güncelleyelim
				if( root.option.summary != 'no' )
				{
					var percent = root.totalLoadedBytes * 100 / root.totalBytes;

					root.skeleton.completedBytes.text( fileHelper.size( root.totalLoadedBytes ));
					root.skeleton.progress.css({ width: percent.toFixed( 3 ) + '%' });
				}
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				// tüm jet motorlarına ilgili olayları set edelim
				$( root.jet ).each( function()
				{
					$( this )

						.on( 'finish', root.listener.onFinish )
						.on( 'done', root.option.theme.listener.onUploaded )
						.on( 'done', root.listener.onUploaded )
						.on( 'progress', root.option.theme.listener.onProgress )
						.on( 'progress', root.listener.onProgress );
				});
			}
		}

		/**
		 * Verilen dosyaları listeye ilave eder.
		 * @param {FileList} files seçilen dosyalar listesi
		 */
		this.addFiles = function( files )
		{
			// verilen dosyaları dosya adı ve lastmodified
			// bileşimi bir isimle listeye ilave edeceğiz
			$( files ).each( function()
			{
				var time = new Date;

				root.files.append
				(
					this.name + '-' + this.lastModified, // isim
					this,    // değer
					0,       // yaşam süresi
					'rename' // çakışma durumunda otomatik bir isim alarak listeye girsin
				);

				if( ! this.errors || ( this.errors && this.errors.length == 0 ))
				{
					root.totalBytes += this.size;

					// otomatik upload modu aktifse hiç themaya
					// bu işi bırakmadan burada upload başlatalım
					if( root.option.uploadAuto == 'yes' && ! this.hasOwnProperty( 'uploaded' ))

						root.upload( this );
				}
			});

			// özet göstergesi aktifse istatistikleri güncelleyelim
			if( this.option.summary != 'no' )
			{
				var percent = root.totalLoadedBytes * 100 / root.totalBytes;

				this.skeleton.totalBytes.text( fileHelper.size( root.totalBytes ));
				this.skeleton.progress.css({ width: percent.toFixed( 3 ) + '%' });
			}

			// dosyaları ekledik theme'ya teslim edebiliriz
			root.option.theme.draw( this.files );
		}

		/**
		 * Verilen bir dosyayı upload kuyruğuna yerleştirir, devam etmekte
		 * olan bir upload süreci mevcutsa başka bir işlem yapmaz ancak
		 * tüm jet motorları atıl durumdaysa kuyruğu alıp işleyecek süreç
		 * durmuş olacağı için bir tane jet seçilerek dosya buna verilir.
		 * 
		 * @param {File} file restful endpointe teslim edilecek dosya
		 */
		this.upload = function( file )
		{
			// dosya önceden yüklenmiş olabilir
			if( file.hasOwnProperty( 'uploaded' ))

				return;

			// upload durumunu ayarlayalım
			file.uploaded = false;

			// dosyayı kuyruğa form elemanı olarak yerleştirelim
			var form = new FormData;
				form.append( 'binary', file );
				file = form;

			// jet motorlarının hepsini atıl varsayalım
			var jetFinded = false;

			// jetleri denetleyelim
			for( var i = 0, l = this.jet.length; i < l; i++ )
			{
				var jet = this.jet[ i ];

				// motorlardan biri atılsa hemen teslim edelim
				if( jet.status == 'ready' )
				{
					jet.post( file );
					jetFinded = true;
					break;
				}
			}

			// dosya için bir jet bulamamışsak kuyruğa ekleyelim
			if( ! jetFinded )

				// dosyayı kuyruğa atalım
				this.job.push( file );
		}

		/**
		 * Verilen dosyanın yüklemesini iptal eder.
		 * 
		 * @param {File}   file iptal edilecek dosya
		 * @event {cancel} verilen dosya üzerinde tetiklenir
		 */
		this.cancel = function( file )
		{
			// dosya üzerinde oncancel olay dinleyicisi mevcutsa bunu çalıştıralım
			$( file ).trigger( 'cancel' );

			// dosyayı listeden çıkartalım
			this.files.remove( file.name + '-' + file.lastModified );

			// byte sayılarını güncelleyelim
			this.totalBytes -= file.size;
			this.totalLoadedBytes -= file.loaded || 0;

			// özet göstergesi aktifse istatistikleri güncelleyelim
			if( this.option.summary != 'no' )
			{
				var percent = this.totalLoadedBytes * 100 / this.totalBytes;

				this.skeleton.totalBytes.text( fileHelper.size( this.totalBytes ));
				this.skeleton.progress.css({ width: percent.toFixed( 3 ) + '%' });
			}

			// dosyada uploaded özelliği varsa upload metoduna uğramış
			// demektir bu durumda kuyrukta da olabilir bir jet üzerinde
			// upload oluyor da olabilir bunları da yok edelim
			if( file.hasOwnProperty( 'uploaded' ))
			{
				// önce kuyruğa bakalım
				for( var i = 0; i < this.job.length; i++ )
				{
					var job = this.job[ i ];

					if( job.ID == file.ID )
					{
						delete this.job[ i ];
						this.job.length--
					}
				}

				// jetlere bakalım
				$( this.jet ).each( function()
				{
					if( this.data && this.data.get && this.data.get( 'binary' ).ID == file.ID )

						this.abort();
				});
			}
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			// önce temayı yükleyelim
			require([ './theme/' + this.option.theme + '/main' ], function( theme )
			{
				// gereken sayıda jet motorunu oluşturalım
				for( var j = 0; j < root.option.simultaneousJobs; j++ )

					root.jet.push( new Rest( root.option.uploadEndpoint ));

				// ana ayarlardaki tema adını temanın kendisiyle değiştirelim
				root.option.theme = ( new theme( root ).init());
				// verilen dosyalar listeye append edilsin
				root.addFiles( files );
				// olayları dinleyelim
				root.listener.attach();
			});
		}
	}

	/**
	 * [fileMonitoring eklentisinin jQuery ile kullanım kısayoludur. Seçili
	 * tüm elementlerin üzerinde verilen dosya listesi verilen ayarlarla
	 * izlenebiliyor olacaktır.
	 * 
	 * @param  {FileList} files dosya listesi
	 * @param  {Object}   o     eklenti ayarları
	 * @return {jQuery}
	 */
	$.fn.fileMonitoring = function( files, o )
	{
		this.each( function()
		{
			var el = $( this );

			// element üzerinde zaten kurulu isek
			// dosyaları append etmeliyiz
			if( already = el.data( 'file-monitoring' ))

				return void already.addFiles( files );

			// data-* düzeninden ayarları elde edelim
			o = $.extend( o, el.data());

			var instance = new fileMonitoring( el, files, o );
				instance.init();

			el.data( 'file-monitoring', instance );
		});

		return this;
	}
});
