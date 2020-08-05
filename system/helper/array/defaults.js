define(
[
	"../type/is",
	"../argument/arg",

],
function( is, arg )
{
	/**
	 * Temsil edilen dizinin ilk öğesinden başlanarak verilen
	 * varsayılanlara sahip olması sağlanır ve dizi döndürülür.
	 *
	 * Ekleme işlemleri orijinal dizi üzerinde yapılır, yeni bir
	 * dizide değil.
	 *
	 * ```js
	 * arrDefaults([ "a" ], "a", "b", "c" )
	 * // ["a","b","c"]
	 *
	 * arrDefaults([ "a" ], [ "a", "b", "c" ])
	 * // ["a","b","c"]
	 * ```
	 * 
	 * @param {Array} target varsayılanlarla doldurulacak dizi
	 * @param {mixed} defaults... varsayılan öğeler
	 * @return {Array}
	 */
	return function arrDefaults( target, defaults )
	{
		var args = arg( arguments );
		
		target = args.shift();
		defaults = is( defaults, "array" )
			? defaults
			: args;

		args.forEach( function( def, i )
		{
			if( target[ i ] === undefined )

				target[ i ] = def;
		});

		return target;
	}
});
