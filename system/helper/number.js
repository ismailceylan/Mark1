define(
[
	"./number/increase",
	"./number/limit",
	"./number/randomize",
	"./number/random-hexadecimal",

],
function( increase, limit, randomize, randomHexadecimal )
{
	return {
		increase: increase,
		limit: limit,
		randomize: randomize,
		randomHexadecimal: randomHexadecimal
	}
});
