define( function()
{
	/**
	 * Verilen 6 karakterli hexadecimal ifadenin rgb karşılığını döndürür.
	 * 
	 * @param {String} fullhex 6 karakterli hexadecimal renk kodu
	 * @return {Object}
	 */
	return function fullHex2RGB( fullhex )
	{
		var decimal = parseInt( fullhex, 16 );

		return {
			red:   decimal >> 16 & 0xff,
			green: decimal >> 8  & 0xff,
			blue:  decimal       & 0xff
		}
	}
});
