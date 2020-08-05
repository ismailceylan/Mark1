define(
[
	"system/core/type",
	"./base-plugin",
	"system/helper/string/html-encode",

],
function( Type, BasePlugin, htmlencode )
{
	return Type( "FencedCode" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki
		 *
		 * ~~~
		 * ```language
		 * code
		 * ```
		 * ~~~
		 * 
		 * yapısıyla eşleşen blokları seçer.
		 * 
		 * @type {RegExp}
		 */
		selection: /^```(.*)?([\w\W]*?)^```|^~~~(.*)?([\w\W]*?)^~~~/gm,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır ve bu bilgiyi HTML olarak
		 *   render edip döndürür.
		 *
		 * @param {String} full eşleşmenin tamamı
		 * @param {String} language dil adı
		 * @param {String} codes kod bloğu
		 * @return {String}
		 */
		render: function( full, language1, code1, language2, code2 )
		{
			var language = ( language1 || language2 ) || "";
			var codes = code1 || code2;

			return '<pre class="' + language.trim() + '">'+
						'<code>' + htmlencode( codes.trim()) + "</code>"+
					"</pre>";
		}
	});
});
