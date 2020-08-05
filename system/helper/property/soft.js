define(
[
	"./create",

],
function( create )
{		
	/**
	 * Verilen nesne üzerinde adı verilen özelliği oluşturur. Oluşturulan
	 * property enumerable değildir ama üzerine yazılabilir.
	 *
	 * Geriye verilen değer döndürülür.
	 * 
	 * @param {Object|Array} targetObj hedef nesne
	 * @param {String} newPropertyName yeni özelliğin adı
	 * @param {mixed} value özelliğin değeri
	 * @return {@value}
	 */
	return function soft( targetObj, newPropertyName, value )
	{
		return create( targetObj, newPropertyName, value, "hidden" );
	}
});
