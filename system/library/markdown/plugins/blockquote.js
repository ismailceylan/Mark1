define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Blockquote" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki > ile başlayıp yeni satıra geçişlerle biten
		 * ve peş peşe bu şekilde tekrar eden grupları seçer.
		 * 
		 * @type {RegExp}
		 */
		selection: /^(> *(.*)[\r\n]?)+/mg,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} quotes eşleşme
		 * @return {String}
		 */
		render: function( quotes )
		{
			quotes = quotes.replace( /^> */mg, "" );

			return "<blockquote>" + this.convert2Markdown( quotes.trim()) + "</blockquote>";
		}
	});
});
