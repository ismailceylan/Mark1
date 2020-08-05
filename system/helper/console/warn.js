define(
[
	"../argument/arg",

],
function( arg )
{
	/**
	 * Console.warn metodunun kısayoludur.
	 * @param {Array} ...msg mesajlar
	 */
	return function warn( msg )
	{
		console.warn.apply( console, arg( arguments ));
	}
});
