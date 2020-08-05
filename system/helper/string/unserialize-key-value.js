define(
[
	"../argument/deft",

],
function( deft )
{
	/**
	 * key=value{{DELIMITER}}key=value... yapısına uygun string katarı haline
	 * getirilmiş anahtar ve değer çiftlerini parçalayıp native nesne olarak
	 * döndürür.
	 * 
	 * @param {String} source anahtar değer çiftlerinin string hali
	 * @param {String} delimiter anahtar=değer gruplarını birbirinden ayıran karakter
	 * @param {String} itemDelimiter anahtar=değer çiftleri içinde kullanılan ayırıcı karakter (varsayılan "=")
	 * @return {Object}
	 */
	return function unserializeKeyValue( source, delimiter, itemDelimiter )
	{
		delimiter     = deft( delimiter, "<don't split anything>" );
		itemDelimiter = deft( itemDelimiter, "=" );

		var r = {};

		if( ! source )

			return r;

		source.split( delimiter ).map( function( item )
		{
			item = item.split( itemDelimiter );

			if( ! item.length == 2 )

				throw Error( "UnserializeKeyValue: Syntax error." );

			r[ item[ 0 ]] = item[ 1 ];
		});

		return r;
	}
});
