define( function()
{
	/**
	 * Verilen nesnede bulunan özellikleri ve değerlerini verilen karakterle birbirinden
	 * ayrılmış gruplar haline getirip string katarı olarak döndürür.
	 * 
	 * @param {Object} obj string katarı haline dönüştürülecek nesne
	 * @param {String} delimiter grup ayırma karakteri
	 * @param {String} itemDelimiter anahtar=değer çiftleri içinde kullanılan ayırıcı karakter (varsayılan "=")
	 * @return {String}
	 */
	return function serializeKeyValue( obj, delimiter, itemDelimiter )
	{
		if( ! obj || ! delimiter )

			return "";

		itemDelimiter = itemDelimiter || "=";

		var r = [];

		for( var key in obj )
		
			r.push( key + itemDelimiter + obj[ key ].toString().trim());
		
		return r.join( delimiter );
	}
});
