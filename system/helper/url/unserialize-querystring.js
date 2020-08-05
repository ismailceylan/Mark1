define(
[
	"../string/unserialize-key-value",

],
function( unserializeKeyValue )
{
	/**
	 * Düzgün biçimde dizilmiş bir querystring
	 * ifadeyi native nesne haline getirir.
	 * 
	 * @param {Object} str kaynak nesne
	 * @return {Object}
	 */
	return function unserializeQuerystring( str )
	{
		return unserializeKeyValue( str, "&" );
	}
});
