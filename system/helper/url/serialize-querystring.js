define(
[
	"../string/serialize-key-value",

],
function( serializeKeyValue )
{
	window.serializeKeyValue = serializeKeyValue;
	/**
	 * Verilen bir nesnenin elemanlarını anahtar, değerlerini de değişken
	 * değeri olarak kullanıp querystring biçiminde dizilimini döndürür.
	 * 
	 * @param {Object} obj kaynak nesne
	 * @return {String}
	 */
	return function serializeQuerystring( obj )
	{
		var r = serializeKeyValue( obj, "&" );

		return r
			? "?" + r
			: "";
	}
});
