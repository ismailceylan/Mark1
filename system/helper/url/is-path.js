define(
[
	"../string/is-single-line",

],
function( isSingleLine )
{
	/**
	 * Verilen parametrenin dizin olup olmadığını sınar.
	 * 
	 * @param {String} pathOrString sınanacak veri
	 * @return {Boolean}
	 */
	return function isPath( pathOrString )
	{
		return isSingleLine( pathOrString );
	}
});
