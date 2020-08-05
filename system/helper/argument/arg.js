define( function()
{
	/**
	 * Verilen arguments nesnesinin öğelerini
	 * dizi değişkene dönüştürüp döndürür.
	 * 
	 * @param {Arguments} args argüman listesi
	 * @return {Array}
	 */
	return function arg( args )
	{
		return Array.prototype.slice.call( args || []);
	}
});
