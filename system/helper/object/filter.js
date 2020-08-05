define(
[
	"./create-object-property",

],
function( createObjectProperty )
{
	/**
	 * Verilen nesnenin özellikleri callback metoduna tek tek geçirilir ve metottan true veya
	 * false değerler beklenir. Her olumlu geri dönüş karşısında o anki taranan nesne özelliği
	 * yığına eklenir ve tüm nesne tarandıktan sonra geriye biriktirilen yığın döner.
	 * 
	 * @param {Object} obj özellikleri taranacak nesne
	 * @param {Function} callback özellikleri tarayacak nesne
	 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
	 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
	 * @return {Object}
	 */
	return function filter( obj, callback, thisArg )
	{
		var stack = {};
		var i = 0;

		for( var key in obj )

			if( callback.call(
				thisArg || createObjectProperty( key, obj[ key ]),
				key,
				obj[ key ],
				i++,
				obj
			) === true )

				stack[ key ] = obj[ key ];

		return stack;
	}
});
