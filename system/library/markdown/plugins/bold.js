define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Bold" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ** ile başlayıp ** ile biten aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /\*\*(.*?)\*\*|\_\_(.*?)\_\_/g,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} asteriksed çift * işaretiyle sarmalanmış metin
		 * @param {String} underscored çift _ işaretiyle sarmalanmış metin
		 * @return {String}
		 */
		render: function( full, asteriksed, underscored )
		{
			return "<strong>" + this.convert2Markdown(( asteriksed || underscored || "" ).trim()) + "</strong>";
		}
	});
});
