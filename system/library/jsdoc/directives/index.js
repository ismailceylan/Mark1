define(
[
	"./empty-line",
	
	// @directive {[type]} [name] [desc]
	"./param",
	
	// @directive {[type]} [desc]
	"./throws",
	"./return",

	// @directive {[type]}
	"./type",

	// @directive [value]
	"./method",
	"./module",
	"./created",
	"./author",
	"./name",
	"./default",

	// @directive
	"./descriptor",

	// plain text
	"./plain-text",
	
],
function()
{
	return arg( arguments );
});
