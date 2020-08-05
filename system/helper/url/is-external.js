define(
[
	"./parse"

],
function( parse )
{
	/**
	 * Verilen linkin en başından başlayıp bu sistemin kök url uzunluğu
	 * kadar karakteri keser ve yine kök url ile eşleştirir. Eşleşmezse
	 * verilen link bu site dışındaki bir yere refere ediyor der. Eşleşirse
	 * link bu sitedeki bir kaynağa refere ediyordur.
	 * 
	 * @param {String} url kontrol edilecek url
	 * @return {Boolean}
	 */
	return function isExternal( url )
	{
		return parse( url ).host.orig != app.uri.parts.host.orig;
	}
});
