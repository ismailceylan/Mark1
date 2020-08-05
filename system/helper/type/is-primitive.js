define( function()
{
	/**
	 * Verilen değerin primitive bir tür olup olmadığını söyler.
	 *
	 * Primitive türler;
	 * * null
	 * * undefined
	 * * boolean
	 * * string
	 * * number
	 * * symbol
	 * 
	 * @param {mixed} variable sınanacak değer
	 * @return {Boolean}
	 */
	return function( variable )
	{
		if( variable === null || variable === undefined )

			return true;

		return [ "String", "Number", "Boolean", "Symbol" ].indexOf( type( variable )) > -1;
	}
});
