define( function()
{
	/**
	 * Metinsel ifadenin içinde yeni satır karakteri olup olmadığını sınar.
	 * @param {String} str sınanacak metinsel ifade
	 * @return {Boolean}
	 */
	return function isSingleLine( str )
	{
		return ! /\r|\n/mg.test( str );
	}
});
