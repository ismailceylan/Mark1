define( function()
{
	/**
	 * Verilen dizideki ardışık elemanları key ve value değerler
	 * olarak ele alır ve bunları bir nesneye yerleştirip döndürür.
	 * 
	 * @param {Array} haystack bir dizi
	 * @return {Object}
	 */
	return function arrAssoc( haystack )
	{
		var assoc = {};

		for( var i = 0; i < haystack.length; i += 2 )
		{
			var key = haystack[ i ];
			var value = haystack[ i + 1 ];

			if( ! key || ! value )

				break;

			assoc[ key ] = value;
		}

		return assoc;
	}
});
