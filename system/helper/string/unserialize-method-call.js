define(
[
	"../argument/deft",
	"../object/map",
	"./unserialize-key-value",

],
function( deft, map, unserializeKeyValue )
{
	/**
	 * "method:param1,param2...|another:param1,..." yapısına uygun string katarı haline
	 * getirilmiş string tabanlı parametrelerle metot çağrısı gösterimlerini parçalayıp
	 * native nesne olarak döndürür.
	 * 
	 * @param {String} source işlenecek string sözdizimi
	 * @param {String} delimiter "method:params...|another:params..." gruplarını birbirinden ayıran karakter (varsayılan "|")
	 * @param {String} itemDelimiter "method:params" çiftleri içinde kullanılan ayırıcı karakter (varsayılan ":")
	 * @param {String} argDelimiter argümanları ayırmak için kullanılacak ayırıcı karakter (varsayılan ",")
	 * @return {Object}
	 */
	return function unserializeMethodCall( source, delimiter, itemDelimiter, argDelimiter )
	{
		delimiter     = deft( delimiter, "|" );
		itemDelimiter = deft( itemDelimiter, ":" );
		argDelimiter  = deft( argDelimiter, "," );

		if( ! source )

			return {}

		// önce key value olarak parse edelim
		return map( unserializeKeyValue( source, delimiter, itemDelimiter ), function()
		{
			if( ! this.value )

				return;

			return this.value.split( argDelimiter );
		});
	}
});
