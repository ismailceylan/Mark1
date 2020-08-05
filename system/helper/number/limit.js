define( function()
{
	/**
	 * Verilen değerin verilen limitler arasında olmasını
	 * sağlar. Değer limitin altındaysa min değeri, üzerindeyse
	 * max değeri, ikisinin arasındaysa val değeri döner.
	 * 
	 * @param  {Integer} val kaynak değer
	 * @param  {Integer} min alt limit
	 * @param  {Integer} max üst limit
	 * @return {Integer}
	 */
	return function limit( num, min, max )
	{
		return Math.min( Math.max( parseInt( num, 10 ), min ), max );
	}
});
