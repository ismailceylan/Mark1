define(
[
	"./console/d",
	"./console/dd",
	"./console/log",
	"./console/warn",

],
function( d, dd, log, warn )
{
	return {
		d: d,
		dd: dd,
		log: log,
		warn: warn
	}
});
