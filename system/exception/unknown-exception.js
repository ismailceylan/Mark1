define( function()
{
	return function UnknownException( exceptionName, exceptionPath )
	{
		/*
		 *---------------------------------------------------------------
		 * Error Name
		 *---------------------------------------------------------------
		 *
		 * İstisna için bir isim belirler.
		 * 
		 */
		this.name = "UnknownException";

		/*
		 *---------------------------------------------------------------
		 * Error Message
		 *---------------------------------------------------------------
		 *
		 * İstisnayı açıklayan mesajı render edip ayarlar.
		 * 
		 */
		this.message = app.lang.render( "unknownException",
		{
			name: exceptionName,
			path: exceptionPath
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
