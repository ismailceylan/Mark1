define( function()
{
	/**
	 * Verilen iki değer arasında rastgele bir sayı üretir. Herhangi
	 * bir değer verilmezse rastgele bir sayı üretir.
	 * 
	 * @param {Integer} min minimum değer
	 * @param {Integer} max maksimum değer
	 * @return {Integer}
	 */
	return function randomize( min, max )
	{
		var rnd = Math.random();

		if( min >= 0 && max >= 0 )

			return Math.floor( rnd * max ) + min;

		return rnd;
	}
});
