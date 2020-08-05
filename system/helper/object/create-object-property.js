define( function()
{
	/**
	 * Verilen anahtar ve değeri kullanarak özel bir nesne oluşturur.
	 * 
	 * @param {String} key property adı
	 * @param {mixed} value property değeri
	 * @return {Object}
	 */
	return function createObjectProperty( key, value )
	{
		var item =
		{
			key: key,
			value: value
		}

		return item;
	}
});
