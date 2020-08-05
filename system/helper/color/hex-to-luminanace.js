define(
[
	"./is-hex-color",
	"./hex-to-rgb",

],
function( isHexColor, hex2RGB )
{
	/**
	 * Verilen hexadecimal renk kodunun
	 * parlaklık değeri hesaplayıp döndürür.
	 * 
	 * @param {String} hexColor hexadecimal renk kodu
	 * @return {Number}
	 */
	return function hex2Luminanace( hexColor )
	{
		if( ! isHexColor( hexColor ))

			throw TypeError( "Geçerli hexadecimal bir renk kodu bekleniyor: " + hexColor );

		hexColor = Object.values( hex2RGB( hexColor ));

		var a = hexColor.map( function( v )
		{
			v /= 255;

			return v <= 0.03928
				? v / 12.92
				: Math.pow(( v + 0.055 ) / 1.055, 2.4 );
		});

		return a[ 0 ] * 0.2126 + a[ 1 ] * 0.7152 + a[ 2 ] * 0.0722;
	}
});
