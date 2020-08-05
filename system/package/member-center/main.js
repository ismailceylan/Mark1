define(
[
	'require',
	'dialog'
],
function( require )
{
	return ( new ( function()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Kullanıcı ekranlarının yansıtılacağı
		 * dialog penceresi.
		 * 
		 * @type {Dialog}
		 */
		this.dialog = new Dialog;

		/**
		 * Genel amaçlı olay dinleyicileri bir arada tutar.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Dinlenecek olaylara olay dinleyicileri attach eder.
			 */
			attach: function()
			{

			}
		}

		/**
		 * Adı verilen sahneyle birlikte
		 * kullanıcı işlem merkezini açar.
		 * 
		 * @param {String} scene açılacak modül (sayfa veya ekran) adı
		 */
		this.open = function( scene )
		{
			// sistemdeki öntanımlı sahnelerin adını package yoluna dönüştürelim
			var scenePath = './scene/';

			if([ 'login', 'signup' ].indexOf( scene ) > -1 )

				scenePath += scene + '/main';

			else

				scenePath = scene;

			// sahne iskeletini yükleyelim
			require([ scenePath ], function( scene )
			{
				scene.init();
			});
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			return this;
		}
	})).init();
});
