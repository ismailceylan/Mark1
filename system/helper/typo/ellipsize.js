define( function()
{
	/**
	 * Verilen string'i en fazla limit kadar uzunlukta olmasını sağlar.
	 * 
	 * @param {String} str kısaltılacak string
	 * @param {Number} length en fazla uzunluk
	 * @return {String}
	 */
	return function ellipsize( str, length )
	{
		if( str.length <= length )

			return str;

		var l = str.slice( 0, length / 2 ).trim();
		var r = str.slice( str.length - ( length / 2 )).trim();

		if( l.length + r.length + 3 >= str.length )

			return str;

		return ( l + "..." + r ).toString();
	}
});
