define(
[
	"./create-object-property",

],
function( createObjectProperty )
{
	/**
	 * Verilen nesnenin özellikleri callback metoduna tek tek geçirilir ve o anda taranan
	 * özelliğin yeni değeri için metottan dönen değer kullanılır. undefined dönerse
	 * herhangi bir işlem yapılmaz.
	 * 
	 * @param {Object} obj özellikleri taranacak nesne
	 * @param {Function} callback özellikleri tarayacak nesne
	 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
	 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
	 * @return {Object}
	 */
	return function map( obj, callback, thisArg )
	{
		var i = 0;

		for( var key in obj )
		
			obj[ key ] = callback.call(
				thisArg || createObjectProperty( key, obj[ key ]),
				key,
				obj[ key ],
				i++,
				obj
			);

		return obj;
	}
});
