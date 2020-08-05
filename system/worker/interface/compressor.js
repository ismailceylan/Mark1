define( function()
{
	/**
	 * Verilen sıkıştırılmamış veri için bir sıkıştırma arayüzü sağlar.
	 * 
	 * @param {String} data sıkıştırılacak veya açılacak veri
	 * @event done sıkıştırma işlemi bittiğinde tetiklenir
	 * @event progress sıkıştırma işlemi ilerledikçe tetiklenir
	 */
	return function Compressor( data )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Sıkıştırma işlemini yapacak olan web işçisi.
		 * @type {Worker}
		 */
		this.worker = app.worker( 'compress' );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * İçşi tarafından bir mesaj yayındanldığında tetiklenir.
			 * @param {MessageEvent} event mesaj yayınını temsil eden olay nesnesi
			 */
			onWorkerMessage: function( event )
			{
				var data = event.data;

				switch( data.on )
				{
					case 'progress':
						$( root ).trigger( 'progress', data.percent );
						break;

					case 'done':
						$( root ).trigger( 'done', data.value );
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
		 * Sıkıştırmayı başlatır.
		 */
		this.compress = function()
		{
			this.worker.postMessage([ 'compress', data ]);
		}

		/**
		 * Sıkıştırmayı başlatır.
		 */
		this.compressToBase64 = function()
		{
			this.worker.postMessage([ 'compressToBase64', data ]);
		}

		/**
		 * Geri çözmeyi başlatır.
		 */
		this.decompressFromBase64 = function()
		{
			this.worker.postMessage([ 'decompressFromBase64', data ]);
		}

		/**
		 * Sıkıştırmayı başlatır.
		 */
		this.compressToUTF16 = function()
		{
			this.worker.postMessage([ 'compressToUTF16', data ]);
		}

		/**
		 * Geri çözmeyi başlatır.
		 */
		this.decompressFromUTF16 = function()
		{
			this.worker.postMessage([ 'decompressFromUTF16', data ]);
		}

		/**
		 * Sıkıştırmayı başlatır.
		 */
		this.compressToUint8Array = function()
		{
			this.worker.postMessage([ 'compressToUint8Array', data ]);
		}

		/**
		 * Geri çözmeyi başlatır.
		 */
		this.decompressFromUint8Array = function()
		{
			this.worker.postMessage([ 'decompressFromUint8Array', data ]);
		}

		/**
		 * Sıkıştırmayı başlatır.
		 */
		this.compressToEncodedURIComponent = function()
		{
			this.worker.postMessage([ 'compressToEncodedURIComponent', data ]);
		}

		/**
		 * Geri çözmeyi başlatır.
		 */
		this.decompressFromEncodedURIComponent = function()
		{
			this.worker.postMessage([ 'decompressFromEncodedURIComponent', data ]);
		}

		this.listener.attach();
	}
});
