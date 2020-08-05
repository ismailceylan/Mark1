define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "BKZ" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki (bkz: başlık) yapısına uygun ifadeleri seçer.
		 * @type {RegExp}
		 */
		selection: /\(\s*bkz\s*:\s*(.*?)\s*\)/gm
	});
});
