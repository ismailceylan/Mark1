define(
[
	"../argument/arg",

],
function( arg )
{
	/**
	 * Verilen mesaj(lar)ı konsola yazdırıp
	 * bir uyarı verdirerek devam eder.
	 * 
	 * @param {Array} ...msg mesajlar
	 */
	return function d( msg )
	{
		console.log.apply( console, arg( arguments ));
		console.warn( "Stack Trace" );
	}
});
