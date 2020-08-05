define(
[
	"system/helper/string/trim2",

],
function( trim )
{
	return function BadControllerReference( controllerName )
	{
		/*
		 *---------------------------------------------------------------
		 * Error Name
		 *---------------------------------------------------------------
		 *
		 * İstisna için bir isim belirler.
		 * 
		 */
		this.name = "BadControllerReference";

		/*
		 *---------------------------------------------------------------
		 * Error Message
		 *---------------------------------------------------------------
		 *
		 * İstisnayı açıklayan mesajı render edip ayarlar.
		 * 
		 */
		this.message = app.lang.render( "controllerNotExists",
		{
			file: "application/controller/" + trim( controllerName, "/" ) + ".js"
		});

		/*
		 *---------------------------------------------------------------
		 * Returning Error Object
		 *---------------------------------------------------------------
		 *
		 * Handle ettiğimiz error nesnesini geriye döndüreceğiz ki böylece
		 * bu metot call edildiği noktada hemen throw edilebilsin.
		 * 
		 */
		return this;
	}
});
