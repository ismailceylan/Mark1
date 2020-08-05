define(
[
	"./unix-time-to-date-time",

],
function( unixTime2DateTime )
{
	/**
	 * Verilen saniye cinsinden zamanı tarih
	 * olarak render edip döndürür.
	 *
	 * @param {Integer} unixTime saniye cinsinden unix time
	 * @return {String}
	 */
	return function unixTime2Date( unixTime )
	{
		return ( unixTime || undefined ) &&
			unixTime2DateTime( unixTime ).split( " " ).slice( 0, 3 ).join( " " );
	}
});
