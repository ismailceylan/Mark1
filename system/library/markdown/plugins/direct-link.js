define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "DirectLink" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki <url> veya url ile eşleşen blokları seçer.
		 * @type {RegExp}
		 */
		selection: /(?:< *)*((?:ftp|https?):\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))(?: *>)*/g
	});
});
