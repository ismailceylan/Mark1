define( function()
{
	/**
	 * Verilen nesnedeki öğe sayısını verir.
	 * 
	 * @param {Object} obj bir nesne
	 * @return {Number}
	 */
	return function length( obj )
	{
		return Object.values( obj ).length;
	}
});
