define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Link" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki [label](url "title") ile eşleşen blokları seçer.
		 * @type {RegExp}
		 */
		selection: /\[\s*(.*?)\s*\]\(\s*(.*?)(?:\s*"(.*?)"\s*)*\s*\)/g
	});
});
