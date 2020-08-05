define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Duyoji" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki .. wow .. yapısına uygun ifadeleri seçer.
		 * @type {RegExp}
		 */
		selection: /\.\. *(.*?)(?: *> *(.*?))* *\.\./g
	});
});
