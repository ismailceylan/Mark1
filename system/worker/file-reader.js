/**
 * Yerel dosya okuma işlemleri yapar.
 * @param {FileList|Array} files okunacak dosyalar
 */
var Reader = function( files )
{
	// ana etki alanı
	var root = this;

	/**
	 * İşleme alınmış dosyayı tutar.
	 * @type {File}
	 */
	this.currentFile = null;

	/**
	 * Okunacak dosya kuyruğu.
	 * @type {Array}
	 */
	this.queue = [];

	/**
	 * Okunması tamamlanmış dosyalar.
	 * @type {Array}
	 */
	this.done = [];

	/**
	 * Html5 dosya okuma apisi.
	 * @type {FileReader}
	 */
	this.reader = new FileReader;

	/**
	 * Olay dinleyicileri tutar.
	 * @type {Object}
	 */
	this.listener = 
	{
		/**
		 * Bir dosya okunduğunda tetiklenir.
		 * @param {ProgressEvent} e dosyanın okunma olayına ait bilgileri tutan nesne
		 */
		onLoad: function( e )
		{
			self.postMessage(
			{
				on: 'load',
				value: e.target.result,
				file: root.currentFile,
				total: root.queue.length + root.done.length,
				left: root.queue.length
			});

			// mevcut dosyayı tamamlananlar listesine ekleyelim
			root.done.push( root.currentFile );
			// okuyucuya sonraki dosyaya geçmesi için sinyal gönderelim
			root.readNext();
		},

		/**
		 * Dinlenecek olaylara dinleyici metotları attach eder.
		 */
		attach: function()
		{
			root.reader.onload = this.onLoad;
		}
	}

	/**
	 * Kuyruğun sonuna bir dosya ekler.
	 * @param {File} file eklenecek dosya
	 */
	this.append = function( file )
	{
		this.queue.push( file );
		this.readNext();
	}

	/**
	 * Kuyruğun başına bir dosya ekler.
	 * @param {File} file eklenecek dosya
	 */
	this.prepend = function( file )
	{
		this.queue.unshift( file );
		this.readNext();
	}

	/**
	 * Kuyruğu sıfırlar.
	 */
	this.reset = function()
	{
		this.currentFile = null;
		this.queue = [];
		this.done = [];
	}

	/**
	 * Dosya okuması yapar.
	 */
	this.readNext = function()
	{
		// dosya okuyucusu hazırsa
		if([ 0, 2 ].indexOf( this.reader.readyState ) > -1 )
		{
			// kuyrukta dosya varsa
			if( this.currentFile = this.queue.shift())
			{

				this.reader.readAsDataURL( this.currentFile );
			}
		}
	}

	/**
	 * Kurulumu yapar.
	 */
	this.init = function()
	{
		this.listener.attach();

		for( var i = 0; i < files.length; i++ )

			this.queue.push( files[ i ]);
	}

	this.init();
}

var reader;

/**
 * Ebeveny taraftan mesaj geldikçe tetiklenir.
 * @param {MessageEvent} event mesajı gönderme olayını temsil eden nesne
 */
self.onmessage = function( event )
{
	var data = event.data;
	var command = data[ 0 ];
	var param = data[ 1 ];

	if( command == 'init' )
	
		reader = new Reader( param );

	else
	
		reader[ command ].apply( reader, param );
}
