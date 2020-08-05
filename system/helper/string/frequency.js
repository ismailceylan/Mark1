define(
[
	"../type/is",
	"./escape-regexp-syntax",
	"./to-regexp",

],
function( is, escapeRegExpSyntax, toRegExp )
{
	/**
	 * Bir string içinde verilen karakterin veya
	 * karakter grubunun kaç defa geçtiğini söyler.
	 * 
	 * @param {String|RegExp|Array} haystack araştırılacak karakter kümesi
	 * @param {String} needle sayılacak karakter
	 * @return {Number}
	 */
	return function frequency( haystack, needle )
	{
		if( is( haystack, "regexp" ))

			haystack = haystack.source;

		else if( is( haystack, "array" ))

			haystack = haystack.toString();

		var diff = haystack.length - haystack.replace( toRegExp( escapeRegExpSyntax( needle ), "g" ), "" ).length;

		return diff / needle.length;
	}
});
