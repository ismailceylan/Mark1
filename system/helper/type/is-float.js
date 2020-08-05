define(
[
	"./is-numeric",

],
function( isNumeric )
{
	/**
	 * Verilen değerin küsüratlı sayı olup olmadığını söyler. Number
	 * tür doğrulaması yapmaz. Yani number dışındaki türler sınanırsa
	 * false döndürülür.
	 * 
	 * @param {mixed} variable sınanacak bir değer
	 * @return {Boolean}
	 */
	return function( variable )
	{
		if( ! isNumeric( variable ))

			return false;

		return Math.floor( variable ) < variable;
	}
});
