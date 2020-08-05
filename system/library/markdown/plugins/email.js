define(
[
	"system/core/type",
	"./base-plugin",

],
function( Type, BasePlugin )
{
	return Type( "Email" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki user@domain.ext ile eşleşen blokları seçer.
		 * @type {RegExp}
		 */
		selection: /(?:(?:[^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(?:\".+\"))@(?:(?:[^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/g,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} email eşleşen e-posta
		 * @return {String}
		 */
		render: function( email )
		{
			return '<a target="_blank" rel="_nofollow" href="mailto:' + email + '">'+ email + "</a>";
		}
	});
});
