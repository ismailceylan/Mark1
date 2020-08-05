define( function()
{
	/**
	 * Temsil edilen dizi içindeki tüm değerlerin toplamını döndürür.
	 * 
	 * @param {Array} haystack bir dizi
	 * @return {mixed}
	 */
	return function arrSum( haystack )
	{	
		return haystack.reduce( function( a, b )
		{
			return a + b;
		});
	}
});
