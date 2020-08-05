define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "HorizontalRule" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ***, --- veya ___ ile başlayan satırları seçer. Ayrıca
		 * bu karakterler kullanılarak - Başlık -- yapısıyla uyuşan satırları
		 * da seçer.
		 * 
		 * @type {RegExp}
		 */
		selection: /^ *[*_\-]{4,} *$|^ *[*_\-]+ *(.*?) *[*_\-]{4,} *$/mg,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} title başlık metni
		 * @return {String}
		 */
		render: function( full, title )
		{
			title = title || "";

			return '<div class="hr">'+
						'<h5>' + this.convert2Markdown( title ) + '</h5>'+
				   '</div>';
		}
	});
});
