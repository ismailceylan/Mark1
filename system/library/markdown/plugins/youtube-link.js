define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "YoutubeLink" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki https://youtu.be/ID veya https://youtube.com/watch?v=ID
		 * linkleriyle eşleşen metinleri seçer.
		 * 
		 * @type {RegExp}
		 */
		selection: /(?:< *)*https?\:\/\/(?:www\.)?youtu(?:be)?\.(?:com|be)\/(?:watch\?)?\S*(?:v=)?([-_a-zA-Z0-9]{11})\S*(?:> *)*/img,	});
});
