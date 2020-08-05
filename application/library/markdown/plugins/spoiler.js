define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Spoiler" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki
		 * 
		 * \\\\ film hakkında
		 * spoiler içeren bilgiler
		 * ////
		 *
		 * yapısıyla eşleşen blokları seçer
		 * 
		 * @type {RegExp}
		 */
		selection: /^ *\\{4,} *(.*)? *$\s*([\w\W]+?)\s*^ *\/{4,} *$/gm
	});
});
