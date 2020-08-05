define(
[
	"../argument/arg",

],
function( arg )
{
	/**
	 * Dizi ile veya nesne olarak isimleriyle vrilen renkleri paketleyip
	 * hexadecimal olarak kodlayıp döndürür. Alpha kanallı kodlama desteklenir.
	 * 
	 * @param {Array} colors... renkler
	 * @return {String}
	 */
	return function RGB2Hex( colors )
	{
		if( ! colors )

			return;

		if( arguments.length > 1 )
		{
			var args = arg( arguments );

			colors =
			{
				red:   args[ 0 ],
				green: args[ 1 ],
				blue:  args[ 2 ],
				alpha: args[ 3 ]
			}
		}

		var decimal;

		if( colors.alpha !== undefined )

			decimal = ( colors.red   * 16777216 ) +
					  ( colors.green * 65536    ) + 
					  ( colors.blue  * 256      ) +
					  ( colors.alpha * 255      );

		else

			decimal = ( colors.red   * 65536 ) +
					  ( colors.green * 256   ) +
					  ( colors.blue          );

		return parseInt( decimal, 10 ).toString( 16 );
	}
});
