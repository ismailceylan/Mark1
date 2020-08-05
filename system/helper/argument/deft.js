define( function()
{		
	/**
	 * Verilen değer undefined ise varsayılan değeri
	 * değilse verilen değerin kendisini döndürür.
	 * 
	 * @param {mixed} argValue herhangi bir değer
	 * @param {mixed} def varsayılan değer
	 * @return {mixed}
	 */
	return function deft( argValue, def )
	{
		return argValue === undefined
			? def
			: argValue;
	}
});
