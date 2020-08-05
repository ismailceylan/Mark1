define(
[
	"./type/is",
	"./type/type",
	"./type/is-empty",
	"./type/is-numeric",
	"./type/is-float",
	"./type/is-primitive",
	"./type/is-nameable",
	"./type/config",

],
function( is, type, isEmpty, isNumeric, isFloat, isPrimitive, isNameable, config )
{
	return {
		is: is,
		type: type,
		isEmpty: isEmpty,
		isNumeric: isNumeric,
		isFloat: isFloat,
		isPrimitive: isPrimitive,
		isNameable: isNameable,
		config: config
	}
});
