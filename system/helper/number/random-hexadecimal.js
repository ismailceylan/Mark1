define(
[
	"./randomize"

],
function( randomize )
{
	/**
	 * Hexadecimal karakterlerden oluşan rastgele bir sayı üretir.
	 * @return {Strşng}
	 */
	return function randomHexadecimal()
	{
		return parseInt( randomize( 1, 999999999999999999 )).toString( 16 );
	}
});
