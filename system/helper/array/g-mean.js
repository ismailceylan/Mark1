define( function()
{
	/**
	 * Verilen dizideki sayısal değerlerin
	 * geometrik ortalamasını hesaplayıp döndürür.
	 *
	 * @return {Number}
	 */
	return function arrGMean( arr )
	{		
		var sum = 1.0;

		for( var i = 0; i < arr.length; i++ )

			sum *= arr[ i ] || 1;

		return Math.pow( sum, 1.0 / arr.length );
	}
});
