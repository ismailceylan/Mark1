define(
[
	"i18n!system/language/nls/date",
	"../object/each",
	"./normalize",

],
function( L, each, normalize )
{
	/**
	 * Verilen saniyeyi zaman gösterimi olarak yeniden düzenler.
	 * 
	 * @param {Object Integer} seconds işlenecek zamanın saniye cinsinden değeri
	 * @return {Object String}
	 */
	return function elapsed( ms )
	{
		if( ms == NaN || ms <= 1000 )

			return "az önce";

		var normal = normalize( ms );
		var names = [ L.year, L.month, L.day, L.hourShort, L.minShortest, L.secShortest, L.msShort ];
		var stack = [];

		each( normal, function( name, value, i )
		{
			if( name == "milisecond" )

				return;

			if( value > 0 )

				stack.push( value + names[ i ]);

			if( stack.length == 2 )

				return false;
		});

		return stack.join( ", " );
	}
});
