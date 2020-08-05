define(
[
	'./scene-manager',
	'system/core/view'
],
function( SceneManager, View )
{
	/**
	 * Verilen DOM nesnelerini bir sahne olarak ele alır ve bu sahneler
	 * üzerinde mesaj gösterim sistemi için uygun yardımcı metotlar sağlar.
	 *
	 * @param {jQuery} target sahnelerin yerleştirileceği hedef element
	 * @param {Object} scenes sahne isimleri ve sahnelerin (string veya jQuery veya DOM) kendisi
	 */
	return function DisplayMessages( target, scenes )
	{
		// ana etki alanı
		var root = this;

		/**
		 * Varsayılan hedef.
		 * @type {jQuery}
		 */
		this.target = target;

		/**
		 * Sahneler.
		 * @type {Object}
		 */
		this.scenes = scenes;

		/**
		 * Varsayılan mesaj ekranı için bir iskelet yapısıdır.
		 * @type {String}
		 */
		var defaultDisplayMessageSkeleton =
			'<div class="display-message">' +
				'<i class="fa fa-fw" name="icon"></i>' +
				'<p name="message"></p>' +
			'</div>';

		/**
		 * Tüm sahneleri tek tek verilen callback'e geçirir.
		 * @param {Function} callback her seferinde bir sahne alacak metot
		 */
		this.each = function( callback )
		{
			for( var sceneName in scenes )

				callback( scenes[ sceneName ], sceneName );
		}

		/**
		 * Tüm mesaj sahnelerinin hide metodunu tetikler.
		 * @return {DisplayMessages}
		 */
		this.hide = function()
		{
			this.each( function( scene )
			{
				scene.hide();
			});

			return this;
		}

		/**
		 * Adı verilen sahneyi görünür yapar.
		 * 
		 * @param {String} name sahne adı
		 * @param {Object} options sahne ayarları
		 * @param {jQuery} target hedef
		 * @return {sceneManager}
		 */
		this.show = function( name, options, target )
		{
			var scene = scenes[ name ];

			if( ! scene )
			
				throw new Error( 'Bilinmeyen DisplayMessages sahnesi: ' + name );

			return scene.show( options, target || this.target );
		}

		/**
		 * Adı verilen sahneyi klanlayıp verilen
		 * isimde başka bir sahne olarak saklar.
		 * 
		 * @param {String} from klonlanacak sahnenin adı
		 * @param {String} to klonlanan yeni sahnenin adı
		 * @return {sceneManager}
		 */
		this.clone = function( from, to )
		{
			var scene = scenes[ from ];

			if( ! scene )

				throw new Error( 'Bilinmeyen DisplayMessages sahnesi klonlanmaya çalışıldı: ' + from );

			return scenes[ to ] = new SceneManager
			(
				this,
				to,
				View.new( scenes[ from ].scene.raw )
			);
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			// sahneler arasına default olanı ekleyelim
			scenes.default = defaultDisplayMessageSkeleton;

			// her sahneyi sceneManager ile örnekleyelim
			this.each( function( scene, name )
			{
				scenes[ name ] = new SceneManager
				(
					this,
					name,
					View.new( $( '<tmp></tmp>' ).append( scene ).html())
				);
			});
		}

		this.init();
	}
});
