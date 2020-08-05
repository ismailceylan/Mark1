define(
[
	"./is-hex-color",
	"./contrast",

],
function( isHexColor, contrast )
{
	/**
	 * Verilen hexadecimal bir renk kodu siyahla beyaza göre daha yüksek
	 *   kontrast oranı yakalıyorsa geriye siyah rengin hexadecimal renk kodu
	 *   döndürülür. Beyaz için bu durum geçerliyse beyaz rengin kodu
	 *   döndürülür.
	 *
	 * @type {String}
	 */
	return function getBlackOrWhite4Hex( hexColor )
	{
		if( this instanceof String )

			hexColor = this;

		if( ! isHexColor( hexColor ))

			throw TypeError( "1. argüman geçerli bir hexadecimal renk kodu bekliyor: " + hexColor );

		var contrast4White = contrast( hexColor, "fff" );
		var contrast4Black = contrast( hexColor, "000" );

		if( Math.abs( contrast4White - contrast4Black ) < 3.25 )

			return "fff";

		if( contrast4Black > contrast4White )

			return "000";

		return "fff";
	}
});
