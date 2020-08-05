define( function()
{
	/**
	 * Çalışılan tarayıcı adını küçük harflerle döndürür.
	 * @return {String|undefined}
	 */
	return function browser()
	{
		var ua = window.navigator.userAgent;

		if( ! ua )

			return;

		// sıralama önemlidir örneğin edge tarayıcısı useragent içinde
		// chrome sözcüğü içerdiği için önce chrome testini çalıştırmak
		// tarayıcının chrome olduğu sonucunu üretir ki bu da yanlış olur
		// bu yüzden önce fork projeleri test edip sonra esas projenin adı
		// test sırasına yazılırsa bu sorun çözülmüş olur
		var vendor = 
		{
			edge: /edge/img,
			chrome: /chrome/img,
			firefox: /firefox/img,
			ie11: /trident\/7\.0/img
		}

		for( var name in vendor )

			if( vendor[ name ].test( ua ))

				return name;
	}
});
