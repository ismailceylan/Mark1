define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "ListItem" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ** ile başlayıp ** ile biten aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /^(?:[0-9]+\.|[+\-\*]) (.*?)$/mg,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} item eşleşen liste satırı
		 * @return {String}
		 */
		render: function( full, item )
		{
			return "<li>" + this.convert2Markdown( item ) + "</li>";
		}
	});
});
