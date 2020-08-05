define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "OrderedList" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ** ile başlayıp ** ile biten aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /^([0-9]+\. (.*)[\n]{0,1})+/mg,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} item eşleşen liste satırları
		 * @return {String}
		 */
		render: function( full )
		{
			return "<ol>" + this.convert2Markdown( full ) + "</ol>";
		}
	});
});
