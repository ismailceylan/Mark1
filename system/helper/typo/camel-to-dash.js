define(
[
	"../string/trim2",

],
function( trim )
{
	/**
	 * Verilen fooBarBaz şeklindeki bir stringi
	 * foo-bar-baz şekline getirip döndürür.
	 * 
	 * @param {String} source kaynak veri
	 * @return {String}
	 */
	return function camel2dash( source )
	{
		if( ! is( source, "string" ))

			throw TypeError( app.lang.firstArgMustStr );

		source = source.replace( /([A-Z]{1})/g, function( bigboy )
		{
			return "-" + bigboy.toLowerCase();
		});

		return trim( source, "-" );
	}
});
