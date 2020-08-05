define(
[
	"./is-hex-color",
	"./hex-to-luminanace",

],
function( isHexColor, hexColor2Luminanace )
{
	/**
	 * Verilen iki renk kodunun kontrast oranını hesaplayıp döndürür.
	 * 
	 * @param {String} rgb1 hexadecimal renk kodu
	 * @param {String} rgb2 hexadecimal renk kodu
	 * @return {Number}
	 */
	return function contrast( rgb1, rgb2 )
	{
		if( ! isHexColor( rgb1 ))

			throw new TypeError( "1. argüman geçerli bir hexadecimal renk kodu bekliyor: " + rgb1 );

		if( ! isHexColor( rgb2 ))

			throw new TypeError( "2. argüman geçerli bir hexadecimal renk kodu bekliyor: " + rgb2 );

		var lum1 = hexColor2Luminanace( rgb1 );
		var lum2 = hexColor2Luminanace( rgb2 );
		var brightest = Math.max( lum1, lum2 );
		var darkest = Math.min( lum1, lum2 );
		
		return ( brightest + 0.05 ) / ( darkest + 0.05 );
	}
});
