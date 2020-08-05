define(
[
	"./create",

],
function( create )
{
	/**
	 * Verilen nesne üzerinde adı verilen özelliği oluşturur. Oluşturulan
	 * property enumerable değildir ve üzerine yazılamaz.
	 *
	 * Geriye verilen değer döndürülür.
	 * 
	 * @param {Object|Array} targetObj hedef nesne
	 * @param {String} newPropertyName yeni özelliğin adı
	 * @param {mixed} value özelliğin değeri
	 * @return {@value}
	 */
	return function concrete( targetObj, newPropertyName, value )
	{
		return create( targetObj, newPropertyName, value, "readonly hidden" );
	}
});
