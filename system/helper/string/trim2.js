define(
[
	"./escape-regexp-syntax",
	
],
function( escapeRegExpSyntax )
{
	/**
	 * Verilen özel bir stringi temizler.
	 * 
	 * @param {String} source temizlenecek ifade
	 * @param {String} trim temizlenmesi istenen karakterler
	 * @return {String}
	 */
	return function trim2( source, trim )
	{
		// kesilecekler arasına | yerleştirelim
		trim = trim.split( "" ).join( "|" );
		// kesilecekleri \\ ile önceleyelim
		trim = escapeRegExpSyntax( trim );

		// kesilecek karakterler hazır, regex ifadesine dönüştürelim
		var rx = new RegExp( "^(" + trim + ")*|(" + trim + ")*$", "img" );

		// replace edip döndürebiliriz
		return source.replace( rx, "" );
	}
});
