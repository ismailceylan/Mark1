define( function()
{
	/**
	 * Verilen değerin teorik olarak sayısal veya
	 * sayıya dönüştürülebilir olup olmadığını söyler.
	 * 
	 * @param {mixed} variable sınanacak bir değer
	 * @return {boolean}
	 */
	return function( variable )
	{
		return ! isNaN( variable );
	}
});
