define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Photo" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ![label](ID "title") ile eşleşen blokları seçer.
		 * @type {RegExp}
		 */
		selection: /!\[\s*(.*?)\s*\]\(\s*([0-9]{1,11})(?:\s*"([\w\W]+?)"\s*)*\s*\)/g
	});
});
