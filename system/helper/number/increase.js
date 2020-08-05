define(
[
	"../type/is",

],
function( is )
{		
	/**
	 * Verilen değere eklenecek değeri ekleyip döndürür. Verilen değer
	 * tanımsızsa veya sayısal değilse sıfırdan başlamasını garanti eder.
	 * 
	 * @param {Number} from attırılacak taban değer
	 * @param {Number} add eklenecek değer
	 * @return {Number}
	 */
	return function increase( from, add )
	{
		if( ! is( from, "numeric" ))

			from = 0;

		return from + ( add || 1 );
	}
});
