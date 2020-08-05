define(
[
	"./sum",

],
function( sum )
{
	/**
	 * Verilen dizideki sayısal değerlerin
	 * aritmetik ortalamasını hesaplayıp döndürür.
	 *
	 * @return {Number}
	 */
	return function arrAMean( arr )
	{
		return sum( arr ) / arr.length;
	}
});
