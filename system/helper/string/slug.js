define(
[
	"../argument/deft",
	"./trim2"
	
],
function( deft, trim2 )
{
	/**
	 * Verilen ifade içinde geçen işaretleme karakterleri
	 * yerine verilen ayırıcı karakteri yerleştirip döndürür.
	 *
	 * @param {String} str işlenecek ifade
	 * @param {String} separator ayırıcı karakter
	 * @return {String}
	 */
	return function slug( str, separator )
	{
		separator = deft( separator, "-" );

		return trim2(
			str.replace( /[.?\-=\s)(*\\&/+'".,´ß€½£#!:|<>é¨`~%^@${[\]}_]+/ig, separator ),
			separator
		);
	}
});
