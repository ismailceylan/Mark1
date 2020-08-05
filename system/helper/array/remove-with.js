define( function( remove )
{
	/**
	 * Verilen dizi içindeki öğelerden, verilen diğer dizideki öğelerle hem
	 * pozisyonu hem de değeri eşleşenleri siler ve dizinin son halini döndürür.
	 * 
	 * @param {Array} haystack elemanları silinecek dizi
	 * @param {Array} remover eşleştiği elemanları silecek dizi
	 * @return {Array|undefined}
	 */
	return function arrRemoveWith( haystack, remover )
	{
		return haystack.filter( function( item, i )
		{
			if( item !== remover[ i ])

				return item;
		});
	}
});
