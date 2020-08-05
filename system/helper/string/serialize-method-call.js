define(
[
	"../argument/deft",
	"../object/each",
	
],
function( deft, each )
{
	/**
	 * Verilen nesnede bulunan özellikleri ve değerlerini verilen karakterle birbirinden
	 * ayrılmış gruplar haline getirip string katarı olarak döndürür.
	 * 
	 * @param {Object} obj string katarı haline dönüştürülecek nesne
	 * @param {String} delimiter grup ayırma karakteri ( varsayılan "|")
	 * @param {String} itemDelimiter "method:params" çiftleri içinde kullanılan ayırıcı karakter (varsayılan ":")
	 * @param {String} argDelimiter argümanları ayırmak için kullanılacak karakter (varsayılan ",")
	 * @return {String}
	 */
	return function serializeMethodCall( obj, delimiter, itemDelimiter, argDelimiter )
	{
		if( ! obj )

			return "";

		delimiter     = deft( delimiter, "|" );
		itemDelimiter = deft( itemDelimiter, ":" );
		argDelimiter  = deft( argDelimiter, "," );

		var r = [];

		each( obj, function()
		{
			// her bir parametre string türüne dönüşmeli
			this.value = this.value.map( function( value )
			{
				return value.toString().trim();
			});

			r.push( this.key + itemDelimiter + this.value.join( argDelimiter ));
		});
		
		return r.join( delimiter );
	}
});
