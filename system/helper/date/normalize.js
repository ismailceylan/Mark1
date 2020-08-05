define(
[
	"./config",

],
function( config )
{
	/**
	 * Verilen milisaniye cinsinden sürenin yıl, ay, gün, saat, dakika,
	 * saniye ve milisaniye cinsinden değerini hesaplayıp döndürür.
	 * 
	 * @param {Number} miliseconds hesaplanacak milisaniye cinsinden zaman değeri
	 * @return {Object}
	 */
	return function normalize( miliseconds )
	{
		var result = {}
		var timeStack = [];
		var MS = config.miliseconds;
		var units = Object.keys( MS );

		function calcTimeStack( sec )
		{
			var stack = timeStack.slice( 0 );

			stack.unshift( sec );

			return stack.reduce( function( a, b )
			{
				return a - b;
			});
		}

		units.forEach( function( unit, i )
		{
			var ms = MS[ unit ];
			var calculated = calcTimeStack( miliseconds ) / ms;

			if( i < units.length )

				calculated = Math.floor( calculated );

			timeStack.push( calculated * ms );
			result[ unit ] = calculated;
		});

		return result;
	}
});
