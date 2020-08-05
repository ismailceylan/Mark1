define( function()
{
	/**
	 * Verilen string'i url üzerinde taşınabilir hale dönüştürüp döndürür.
	 * 
	 * @param {String} source dönüştürülecek ifade
	 * @return {String}
	 */
	return function transportable( source )
	{
		return btoa( source ).replace( /\//g, "-" );
	}
});
