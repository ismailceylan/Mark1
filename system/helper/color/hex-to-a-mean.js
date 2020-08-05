define(
[
	"../type/is",
	"../array/sum",
	"./hex-to-rgb",

],
function( is, sum, hex2RGB )
{
	/**
	 * Temsil edilen hexadecimal renk kodlamasındaki renk
	 * kanallarının decimal değerlerinin ortalamasını verir.
	 * 
	 * @param {String} hex hexadecimal formatlı rgb renk kodu
	 * @return {Number|undefined}
	 */
	return function hex2aMean( hex )
	{
		if( is( hex, "empty" ))

			return;

		return sum( Object.values( hex2RGB( hex ))) / 3;
	}
});
