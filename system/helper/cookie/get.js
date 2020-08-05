define(
[
	"../string/unserialize-key-value",

],
function( unserializeKeyValue )
{
	/**
	 * Parametre olarak verilen veya kullanıcıda kayıtlı çerezleri okur, parçalar ve
	 * nesne haline getirip döndürür.
	 *
	 * @param {String} cookie istenen bir cookie değişkeni
	 * @param {String} cookies cookie katarı olarak ele alınması istenen bir string
	 * @return {Object|String|undefined}
	 */
	return function get( cookie, cookies )
	{
		cookies = cookies || document.cookie;

		if( ! cookies )

			return undefined;

		var r = unserializeKeyValue( cookies, "; " );

		return cookie
			? r[ cookie ]
			: r;
	}
});
