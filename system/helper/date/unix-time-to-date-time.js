define(
[
	"i18n!system/language/nls/date",

],
function( L )
{
	/**
	 * Verilen saniye cinsinden zamanı tarih
	 * ve saat olarak render edip döndürür.
	 *
	 * @param {Integer} unixTime saniye cinsinden unix time
	 * @return {String}
	 */
	return function unixTime2DateTime( unixTime )
	{
		var date = new Date( unixTime * 1000 );
		var months = L.fullMonthNames;

		return date.getDate() + ' ' +
			   months[ date.getMonth()] + ' ' +
			   date.getFullYear() + ' ' +
			   ( '0' + date.getHours()).slice( -2 ) + ':' +
			   ( '0' + date.getMinutes()).slice( -2 );
	}
});
