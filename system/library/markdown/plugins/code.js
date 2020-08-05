define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Code" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki `code` ile eşleşen aralıkları seçer.
		 * @type {RegExp}
		 */
		selection: /``\s*([\w\W]*?)\s*``|`\s*([\w\W]*?)\s*`/g,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} codes kod bloğu
		 * @return {String}
		 */
		render: function( full, code1, code2 )
		{
			return '<code class="inline">' + ( code1 || code2 ).replace( /\n/g, "" ) + "</code>";
		}
	});
});
