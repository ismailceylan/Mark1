define(
[
	"./create-object-property",

],
function( createObjectProperty )
{
	/**
	 * Verilen nesnenin özellikleri callback metoduna tek tek geçirilir ve metottan true
	 * dönmesi beklenir. Bu olduğunda o anda metoda geçirilmiş olan nesne özelliğinin
	 * bilgileri bu mettotan geriye döndürülür.
	 *
	 * {
	 * 		key: 'PropertyName',
	 * 		value: 'PropertyValue'
	 * }
	 * 
	 * @param {Object} obj özellikleri taranacak nesne
	 * @param {Function} callback özellikleri tarayacak metod
	 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
	 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
	 * @return {Object|undefined}
	 */
	return function search( obj, callback, thisArg )
	{
		var i = 0;

		for( var key in obj )
		{
			var context = thisArg || createObjectProperty( key, obj[ key ]);

			switch( callback.call( context, key, obj[ key ], i++, obj ))
			{
				case true: return context;
				case false: break;
			}
		}
	}
});
