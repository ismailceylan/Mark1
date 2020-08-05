define(
[
	"../type/is",

],
function( is )
{
	/**
	 * Yeni bir nesne içine verilen nesnenin verilerini özellik,
	 * özelliklerini de veri yaparak yerleştirir ve döndürür.
	 * 
	 * @param {Object} obj yapısı terine çevrilecek nesne
	 * @return {Object}
	 */
	return function reverse( obj )
	{
		var reversed = {};

		if( ! is( obj, "object" ))

			return reversed;

		for( var prop in obj )

			reversed[ obj[ prop ]] = prop;

		return reversed;
	}
});
