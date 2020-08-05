define( function()
{
	/**
	 * Sahne yönetimi yapan arayüz.
	 *
	 * @param {DisplayMessages} displayMessages sahneleri temsil eden package nesnesi
	 * @param {String} name sahnenin adı
	 * @param {View} scene sahne iskeletini temsil eden bir View nesnesi
	 */
	return function SceneManager( displayMessages, name, scene )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Sahne adı.
		 * @type {String}
		 */
		this.name = name;

		/**
		 * Sahneyi temsil eden View.
		 * @type {View}
		 */
		this.scene = scene;

		/**
		 * Sahne durumu.
		 * @type {Boolean}
		 */
		this.isHidden = true;

		/**
		 * Mesaj sahnesini görünür yapar.
		 * 
		 * @param {Object} options sahne ayarları
		 * @param {jQuery} target sahnenin gösterileceği hedef (opsiyonel)
		 * @return {void|SceneManager}
		 */
		this.show = function( options, target )
		{
			// zaten ekrandaysa işlem yok
			if( ! this.isHidden )

				return this;

			target = target || displayMessages.target;

			// hedef yoksa işlem yok
			if( ! target )
			{
				console.warn( 'Mesaj göstermek için geçerli bir hedef belirtilmeli!' );
				return this;
			}

			// ayarları uygulayalım
			if( options )

				this.setOptions( options );

			// sahneyi hedefe yerleştirelim
			target.append( scene.$root );

			this.isHidden = false;

			return this;
		}

		/**
		 * Verilen ayarları uygular.
		 * @param {Object} options ayarlar
		 */
		this.setOptions = function( options )
		{
			options = $.extend(
			{
				icon: 'fa-bolt',
				message: 'Tanımsız durum!'
			},
			options );

			// simgeyi düzenleyelim
			if( scene.$icon )
			{
				scene.$icon
					.removeClass( scene.$icon.attr( 'data-current-icon' ))
					.addClass( options.icon )
					.attr( 'data-current-icon', options.icon );
			}

			// mesajı yerleştirelim
			if( scene.$message )
			
				scene.$message.text( options.message );
		}

		/**
		 * Mesaj sahnesini gizler.
		 * @return {SceneManager}
		 */
		this.hide = function()
		{
			// zaten gizliyse işlem yok
			if( this.isHidden )

				return this;

			scene.$root.remove();
			this.isHidden = true;

			return this;
		}

		/**
		 * Sahnede bulunan adı verilen bir elementin adı verilen
		 * bir olayına verilen olay dinleyici metodu attach eder.
		 * 
		 * @param {String} elName bir element adı
		 * @param {String} evtName olay adı
		 * @param {Function} listener olay dinleyici metot
		 * @return {SceneManager}
		 */
		this.on = function( elName, evtName, listener )
		{
			var el = scene.get( elName );

			if( ! el )
			{
				console.warn( 'Olay dinleyici atanacak ' + this.name +
					' isimli DisplayMessage sahnesindenki şu element mevcut değil: ' + elName );
				return this;
			}

			el.on( evtName, listener );
		}

		/**
		 * Sahnede bulunan adı verilen bir elementin adı verilen
		 * bir olayına verilen olay dinleyici metodu dettach eder.
		 * 
		 * @param {String} elName bir element adı
		 * @param {String} evtName olay adı
		 * @param {Function} listener olay dinleyici metot
		 * @return {SceneManager}
		 */
		this.off = function( elName, evtName, listener )
		{
			var el = scene.fetch( elName );

			if( ! el )
			{
				console.warn( 'Olay dinleyicisi silinecek ' + this.name +
					' isimli DisplayMessage sahnesindenki şu element mevcut değil: ' + elName );
				return this;
			}

			el.off( evtName, listener );
		}
	}
});
