define(
[
	"./property/concrete",
	"./property/create",
	"./property/soft",

],
function( concrete, create, soft )
{
	return {
		concrete: concrete,
		create: create,
		soft: soft
	}
});
