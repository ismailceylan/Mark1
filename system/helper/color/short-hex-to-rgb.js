define(
[
	"./full-hex-to-rgb",

],
function( fullHex2RGB )
{
	/**
	 * Üç kanalı da tekrar eden hexadecimal karakterlerden oluştuğu için
	 * sadeleştirilerek toplamda 3 karakterle temsil edilen hexadecimal
	 * ifadenin rgb karşılığını döndürür.
	 * 
	 * @param {String} shortHex 3 karakterli hexadecimal renk kodu
	 * @return {Object}
	 */
	return function shortHex2RGB( shortHex )
	{
		return fullHex2RGB(
			shortHex.split( "" )
				.map( function( hex )
				{
					return hex.repeat( 2 );
				})
				.join( "" )
		);
	}
});
