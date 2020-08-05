define(
[
	"./array/a-mean",
	"./array/assoc",
	"./array/clearify",
	"./array/defaults",
	"./array/g-mean",
	"./array/remove-with",
	"./array/remove",
	"./array/sum",

],
function( aMean, assoc, clearify, defaults, gMean, removeWith, remove, sum )
{
	return {
		aMean: aMean,
		assoc: assoc,
		clearify: clearify,
		defaults: defaults,
		gMean: gMean,
		removeWith: removeWith,
		remove: remove,
		sum: sum
	}
});
