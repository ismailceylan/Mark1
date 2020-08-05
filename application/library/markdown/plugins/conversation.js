define(
[
	"system/core/type",
	"system/library/markdown/plugins/base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Conversation" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki @ ile başlayıp @ ile biten grupları seçer.
		 *
		 *  @ isim: kısayol | isim > kısayol | isim: kısayol
		 *  kısayol > mesaj
		 *  kısayol < mesaj
		 *  kısayol : mesaj
		 *  @
		 * 
		 * @type {RegExp}
		 */
		selection: /^@[\w\W]+?^@$/mg
	});
});
