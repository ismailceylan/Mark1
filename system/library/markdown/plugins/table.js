define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Table" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki
		 *
		 * | Syntax      | Description | Test Text     |
		 * | :---        |    :----:   |          ---: |
		 * | Header      | Title       | Here's this   |
		 * | Paragraph   | Text        | And more      |
		 *
		 * tablo yapılarını seçer.
		 * 
		 * @type {RegExp}
		 */
		selection: /^(?:\| *(?:.*)[\r\n]?)+/mg
	});
});
