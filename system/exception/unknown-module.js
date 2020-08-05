define( function()
{
	return function UnknownModule( modulePath )
	{
		/*
		 *---------------------------------------------------------------
		 * Error Name
		 *---------------------------------------------------------------
		 *
		 * İstisna için bir isim belirler.
		 * 
		 */
		this.name = "UnknownModule";

		/*
		 *---------------------------------------------------------------
		 * Error Message
		 *---------------------------------------------------------------
		 *
		 * İstisnayı açıklayan mesajı render edip ayarlar.
		 * 
		 */
		this.message = app.lang.render( "moduleNotExists",
		{
			file: modulePath + ".js"
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
