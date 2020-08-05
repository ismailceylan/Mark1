define(
[
	"../type/is",
	"./filter",

],
function( is, filter )
{
	/**
	 * Verilen nesnede bulunan isEmpty sınamasına true yanıt verebilecek durumdaki
	 * öğeleri nesneden siler. Döndürülen nesne yeni bir nesnedir.
	 * 
	 * @param {Object} obj bir nesne
	 * @return {Object}
	 */
	return function clearify( obj )
	{
		return filter( obj, function( key, val )
		{
			return ! is( val, "empty" );
		});
	}
});
