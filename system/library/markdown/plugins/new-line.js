define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "NewLine" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki ** ile başlayıp ** ile biten aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /\n/gm,

		/**
		 * Yeni satır eşleşmelerinin olduğu noktalara yerleştirilecek
		 * sabit bir yer tutucu isim üretir. Böylece derleme anında
		 * tek replace işlemiyle bütün satır boşlukları geri yerlerine
		 * koyulabilir.
		 * 
		 * @return {Object}
		 */
		placeholder: function()
		{
			return {
				string: ":new-line:",
				pattern: /:new-line:/g
			};
		},

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @return {String}
		 */
		render: function()
		{
			return "<br>\n";
		}
	});
});
