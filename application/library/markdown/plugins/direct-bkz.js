define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "DirectBKZ" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki (: başlık) yapısına uygun ifadeleri seçer.
		 * @type {RegExp}
		 */
		selection: /\(\s*:\s*(.*?)\s*\)/gm
	});
});
