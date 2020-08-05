define(
[
	"./config",

],
function( config )
{
	/**
	 * Verilen hexadecimal renk kodunun geçerli olup olmadığını
	 * söyler. Alpha kanallı kodlamayı destekler.
	 * 
	 * @param {String} hex sınanacak hexadecimal renk kodu
	 * @return {Boolean}
	 */
	return function isHexColor( hex )
	{
		return config.hexadecimalRGBAPattern.test( hex );
	}
});
