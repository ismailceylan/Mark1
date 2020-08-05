define( function()
{
	/**
	 * Verilen string içinde geçen foo-bar-baz şeklinde kurgulanmış
	 * yapıları fooBarBaz şeklinde yeniden birleştirip döndürür.
	 * 
	 * @param {String} source kaynak veri
	 * @param {Boolean} isFirstCapitalized ilk harfin büyük olup olmayacağı
	 * @return {String}
	 */
	return function dash2camel( source, isFirstCapitalized )
	{
		var words = source.split( "-" );

		words.map( function( word, i )
		{
			if( ! isFirstCapitalized && i == 0 )

				return;
			
			words[ i ] = word.substr( 0, 1 ).toUpperCase() + word.substr( 1 );
		});

		return words.join( "" );
	}
});
