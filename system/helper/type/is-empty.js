define( function()
{
	/**
	 * null, undefined, boş string veya beyaz boşluklar (space, new line vs)
	 * boş dizi ve boş object gibi verileri boş kabul edip kontrol eder.
	 *
	 * @param {mixed} variable sınanacak bir değer
	 * @return {Boolean}
	 */
	return function( variable )
	{
		if([ "Array", "Object" ].indexOf( type( variable )) > -1 )

			return Object.values( variable ).length === 0;

		return variable === undefined || variable === null || variable === 0 || variable.toString().trim() === "";
	}
});
