define(
[
	"../type/is",

],
function( is )
{
	/**
	 * Verilen dizi içinden isEmpty testi
	 * karşısında true sonuç verecek öğeleri temizler.
	 * 
	 * @param {Array} haystack bir dizi
	 * @return {Array}
	 */
	return function arrClearify( haystack )
	{
		return haystack.filter( function( val )
		{
			return ! is( val, "empty" );
		});
	}
});
