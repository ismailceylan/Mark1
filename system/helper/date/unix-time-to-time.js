define(
[
	"./unix-time-to-date-time",

],
function( unixTime2DateTime )
{
	/**
	 * Verilen saniye cinsinden zamanın saat ve dakikasını
	 * zaman damgası olarak döndürür.
	 *
	 * @param {Integer} unixTime saniye cinsinden unix time
	 * @return {String}
	 */
	return function unixTime2Time( unixTime )
	{
		return ( unixTime || undefined ) &&
			unixTime2DateTime( unixTime ).split( " " )[ 3 ];
	}
});
