define( function()
{
	/**
	 * Çoklu yerel dosya okuma işçisini süren arayüzdür.
	 * 
	 * @param {FileList|Array} files dosya listesi
	 * @event done kuyrukta hiç dosya kalmadığında tetiklenir
	 * @event load bir dosya yüklendiğinde tetiklenir
	 */
	return function FileReadingQueue( files )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Okuma işlemini yapacak olan web işçisi.
		 * @type {Worker}
		 */
		this.worker = app.worker( 'file-reader' );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * İçşi tarafından bir mesaj yayınlandığında tetiklenir.
			 * @param {MessageEvent} event mesaj yayınını temsil eden olay nesnesi
			 */
			onWorkerMessage: function( event )
			{
				var data = event.data;

				switch( data.on )
				{
					case 'load':
						$( root ).trigger( 'load', data.value, data.file, data.total, data.left );
						break;

					case 'done':
						$( root ).trigger( 'done' );
				}
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				root.worker.onmessage = this.onWorkerMessage;
			}
		}

		/**
		 * Kuyruğun sonuna bir dosya ekler.
		 * @param {File} file eklenecek dosya
		 */
		this.append = function( file )
		{
			this.worker.postMessage([ 'append', file ]);
		}

		/**
		 * Kuyruğun başına bir dosya ekler.
		 * @param {File} file eklenecek dosya
		 */
		this.prepend = function( file )
		{
			this.worker.postMessage([ 'prepend', file ]);
		}

		/**
		 * Kuyruğu sıfırlar.
		 */
		this.reset = function()
		{
			this.worker.postMessage([ 'reset' ]);
		}

		/**
		 * Kuyruktaki dosyaları okumayı başlatır.
		 */
		this.read = function()
		{
			this.worker.postMessage([ 'readNext' ]);
		}

		/**
		 * Kurulumu gerçekleştirir.
		 */
		this.init = function()
		{
			this.listener.attach();
			this.worker.postMessage([ 'init', files ]);
		}

		this.init();
	}
});
