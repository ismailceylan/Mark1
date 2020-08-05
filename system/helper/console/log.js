define(
[
	"../argument/arg",

],
function( arg )
{
	/**
	 * Console.log metodunun kısayoludur.
	 * @param {Array} ...msg mesajlar
	 */
	return function log( msg )
	{
		console.log.apply( console, arg( arguments ));
	}
});
