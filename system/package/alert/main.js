define(
[
	"text!./view/body.xml",
	"text!./css/style.min.css",
	"system/core/view",
	"system/library/string-group",
	"dialog",

	"system/machine/anonstyle"
],
function( skeleton, styles, View, StringGroup, Dialog )
{
	/**
	 * Verilen mesajı dialog penceresi içinde
	 * görüntüler. Basitçe alert kutuları oluşturur. 
	 * 
	 * @param {String} message pencerede görünecek mesaj
	 * @param {Function} onClose pencere kapandığında tetiklenecek işlev
	 * @param {Object} options ayarlar
	 */
	return function Alert( message, onClose, options )
	{
		if( ! ( this instanceof Alert ))

			return new Alert( message, onClose, options );

		// çok biçimli parametre yapısı kullanacağız şunlar desteklenecek
		// ( mesaj ), ( mesaj, onClose ), ( mesaj, onClose, options ) ve ( mesaj, options )
		if( is( onClose, 'object' ))
		{
			options = onClose;
			onClose = undefined;
		}

		// ana etki alanı
		var root = this;

		/**
		 * Pencere oluşturucu dialog arayüzü.
		 * @type {Dialog}
		 */
		this.dialog = new Dialog;

		/**
		 * Stil yönetim arayüzü.
		 * @type {Anonstyle}
		 */
		this.styles = Anonstyle.new( 'alert-' + this.dialog.id );

		/**
		 * İskelet.
		 * @type {View}
		 */
		this.view = View.new( skeleton,
		{
			message: message
		});

		/**
		 * Alert ayarları.
		 * @type {Object}
		 */
		this.options = $.extend(
		{
			/**
			 * Pencere başlığı.
			 * @type {String}
			 */
			title: null
		},
		options || {});

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener =
		{
			/**
			 * Dialog kapandığında tetiklenir.
			 */
			onDialogClosed: function()
			{
				root.listener.dettach();
				
				if( is( onClose, 'function' ))

					onClose.call( root.dialog );
			},

			/**
			 * Olay dinleyicileri attach eder.
			 */
			attach: function()
			{
				$( root.dialog )
					.on( 'closed', this.onDialogClosed );
			},

			/**
			 * Olay dinleyicileri dettach eder.
			 */
			dettach: function()
			{
				$( root.dialog )
					.off( 'closed', this.onDialogClosed );
			}
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			var construct = new StringGroup( this.view.$root.data( 'state' ));

			// başlık verilmemişse bu alan iskelette bulunmasın
			if( ! this.options.title )

				construct.remove( 'title' );

			else

				this.dialog.title( this.options.title );

			this.dialog.state( construct );

			this.dialog.view.$body.html( this.view.$root );

			this.styles.push( 'all', styles );

			this.listener.attach();

			this.dialog.action().draw( this.view.$buttons );
			this.dialog.open();
		}

		this.init();
	}
});
