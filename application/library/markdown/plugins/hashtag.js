define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Hashtag" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki #hashtag ile eşleşen blokları seçer.
		 * @type {RegExp}
		 */
		selection: /(^|\s)#([a-z\d\u00c0-\u017f\-_]+)/ig
	});
});
