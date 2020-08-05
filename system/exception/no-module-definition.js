define( function()
{
	return function NoModuleDefiniton( controllerName )
	{
		/*
		 *---------------------------------------------------------------
		 * Error Name
		 *---------------------------------------------------------------
		 *
		 * İstisna için bir isim belirler.
		 * 
		 */
		this.name = "NoModuleDefiniton";

		/*
		 *---------------------------------------------------------------
		 * Error Message
		 *---------------------------------------------------------------
		 *
		 * İstisnayı açıklayan mesajı render edip ayarlar.
		 * 
		 */
		this.message = app.lang.noModuleDefiniton;

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
