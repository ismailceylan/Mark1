define(
[
	"./date/config",
	"./date/elapsed",
	"./date/is-same-day",
	"./date/ms-to-time",
	"./date/normalize",
	"./date/now",
	"./date/unix-time-to-date-time",
	
	"./date/unix-time-to-date",
	"./date/unix-time-to-time",

],
function
(
	config, elapsed, isSameDay, ms2Time, normalize, now, unixTime2DateTime,
	unixTime2Date, unixTime2Time
)
{
	return {
		config: config,
		elapsed: elapsed,
		isSameDay: isSameDay,
		ms2Time: ms2Time,
		normalize: normalize,
		now: now,
		unixTime2DateTime: unixTime2DateTime,
		unixTime2Date: unixTime2Date,
		unixTime2Time: unixTime2Time
	}
});
