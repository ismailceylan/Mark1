define( function()
{
	/**
	 * Verilen string ifade içindeki özel karakterleri
	 * önceler ve RegExp sözdizimine çevirip döndürür.
	 * 
	 * @param {String} pattern string türünde düzenli ifade
	 * @param {String} flags dzenli ifadenin özellik bayrakları
	 * @return {RegExp}
	 */
	return function toRegExp( pattern, flags )
	{
		return new RegExp( pattern, flags );
	}
});
