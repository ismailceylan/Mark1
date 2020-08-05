define(
[
	"system/core/type",
	"system/core/controller",

],
function( Type, Controller )
{
	/**
	 * Profil sayfasının handle eden controller'dır.
	 * @type {Object}
	 */
	return Type( "Welcome" ).extends( Controller ).prototype(
	{
		/**
		 * Controller kurulumunu yapar.
		 */
		construct: function()
		{
			// pencere başlığı
			app.title( "Welcome! - " + app.config.config.sitename );
		},

		/**
		 * Controller'ı destroy eder.
		 */
		destroy: function()
		{

		},

		/**
		 * Anasayfaya istek geldiğinde tetiklenir.
		 */
		index: function()
		{

		}
	});
});
