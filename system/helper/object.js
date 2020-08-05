define(
[
	"./object/clearify",
	"./object/clone",
	"./object/collect",
	"./object/create-object-property",
	"./object/each",
	"./object/filter",
	"./object/length",
	"./object/map",
	"./object/reverse",
	"./object/search",

],
function( clearify, clone, collect, createObjectProperty, each, filter, length, map, reverse, search )
{
	return {
		clearify: clearify,
		clone: clone,
		collect: collect,
		createObjectProperty: createObjectProperty,
		each: each,
		filter: filter,
		length: length,
		map: map,
		reverse: reverse,
		search: search
	}
});
