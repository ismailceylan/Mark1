define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Italic" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki * ile başlayıp * ile biten aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /\*(.*?)\*|\_(.*?)\_/g,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} asteriksed * işaretiyle sarmalanmış metin
		 * @param {String} underscored _ işaretiyle sarmalanmış metin
		 * @return {String}
		 */
		render: function( full, asteriksed, underscored )
		{
			return "<em>" + this.convert2Markdown(( asteriksed || underscored || "" ).trim()) + "</em>";
		}
	});
});
