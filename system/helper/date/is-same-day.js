define(
[
	"./unix-time-to-date",

],
function( unixTime2Date )
{
	/**
	 * İki saniye cinsinden zaman damgasının aynı
	 * takvim gününü işaret edip etmediğini söyler.
	 * 
	 * @param {Number} unixTime saniye cinsinden unix time
	 * @param {Number} anotherUnixTime saniye cinsinden unix time
	 * @return {Boolean}
	 */
	return function isSameDay( unixTime, anotherUnixTime )
	{
		return unixTime2Date( unixTime ) == unixTime2Date( anotherUnixTime );
	}
});
