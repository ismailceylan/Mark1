define(
[
	"../argument/arg",

],
function( arg )
{
	/**
	 * Verilen mesaj(lar)ı konsola yazıp bir
	 * hata fırlatarak çalışmayı durdurur.
	 * 
	 * @param {Array} ...msg mesajlar
	 * @throws {Error} her durumda fırlatılır
	 */
	return function dd( msg )
	{
		console.log.apply( console, arg( arguments ));
		throw Error( "Stack Trace" );
	}
});
