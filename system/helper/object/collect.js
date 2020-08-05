define( function()
{
	/**
	 * Verilen nesne içinde verilen ön ek ile başlayan propertyler ve değerleri yeni
	 * bir nesneye yerleştirilip döndürülür. Yeni nesnedeki property isimlerinin
	 * önünde prefix bulunmasın isteniyorsa son parametre true olmalıdır. Son
	 * parametre varsayılan olarak false kabul edilir.
	 * 
	 * @param {String} propertyPrefix ön ek
	 * @param {Object} obj bir nesne
	 * @param {Boolean} shouldDropPrefixes ön eklerin atılıp atılmayacağı
	 * @return {Object}
	 */
	return function collect( propertyPrefix, obj, shouldDropPrefixes )
	{
		var stack = {}

		for( var prop in obj )
		{
			if( prop.slice( 0, propertyPrefix.length ) == propertyPrefix )

				stack
				[
					shouldDropPrefixes
						? prop.slice( propertyPrefix.length )
						: prop
				] = obj[ prop ];
		}

		return stack;
	}
});
