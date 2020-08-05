define( function()
{
	/**
	 * Bir stringdeki sözcüklerin ilk harflerini büyük yapar.
	 * 
	 * @param {String} str işlenecek ifade
	 * @return {String}
	 */
	return function capitalize( str )
	{
		var words = str.split( " " );

		for( var i = 0, l = words.length; i < l; i++ )
		
			words[ i ] = words[ i ][ 0 ].toUpperCase() + words[ i ].slice( 1 );

		return words.join( " " );
	}
});
