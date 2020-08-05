define(
[
	"./create-object-property",

],
function( createObjectProperty )
{
	/**
	 * Verilen nesnenin özellikleri üzerinde tek tek verilen callback metodunu çalıştırır.
	 *
	 * @thisArg parametresi tanımlıysa geriye her zaman bu döndürülür. Bu tanımlı değilse
	 * döngü false veriler kırılmışsa geriye false döner. Bu da olmamışsa geriye undefined
	 * döner.
	 * 
	 * @param {Object} obj özellikleri taranacak nesne
	 * @param {Function} callback özellikleri tarayacak metot
	 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
	 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
	 * @return {@thisArg|false|undefined}
	 */
	return function each( obj, callback, thisArg )
	{
		var i = 0;
		var r = undefined;

		for( var key in obj )
		{
			var context = thisArg || createObjectProperty( key, obj[ key ]);

			if( callback.call( context, key, obj[ key ], i++, obj ) === false )
			{
				r = false;
				break;
			}
		}

		return thisArg || r;
	}
});
