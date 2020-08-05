define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Itabold" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki *** veya ___ ile başlayıp aynı
		 * şekilde biten aralıkları seçer.
		 * 
		 * @type {RegExp}
		 */
		// selection: /[\*|_]{3}(.*?)[\*|_]{3}/g,
		selection: /\*{3}(.*?)\*{3}|\_{3}(.*?)\_{3}/g,

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
			return "<strong><em>" + this.convert2Markdown(( asteriksed || underscored || "" ).trim()) + "</em></strong>";
		}
	});
});
