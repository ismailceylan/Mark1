define(
[
	"system/library/regular-expression",
	
],
function( RegularExpression )
{
	/**
	 * Verilen isimli desen ile eşleşen veriden
	 * eşleşmeleri içeren bir nesne çıkarır.
	 * 
	 * @param {String} source veri kaynağı
	 * @param {String} namedPattern veri yakalama sözdizimi
	 * @param {Object} rules isimli desende geçen isimler için uygulanacak düzenli ifadeler
	 * @return {Object}
	 */
	return function extract( source, namedPattern, rules )
	{
		var result = RegularExpression( namedPattern ).rule( rules ).capture( source );

		return result
			? result.data
			: undefined;
	}
});
