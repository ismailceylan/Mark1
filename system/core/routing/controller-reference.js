define(
[
	"system/helper/string/extract",
	
],
function( extract )
{
	/**
	 * "controller@method" şeklinde verilen sözdizimini parçalar
	 * ve elde ettiği parçaları isimleriyle düzenli biçimde saklar
	 * bir controller için düzgün bir referans sağlar.
	 * 
	 * @param {String} definitionString tanımlama sözdizimi
	 */
	return function ControllerReference( definitionString )
	{
		/**
		 * Temsil edilen controller adı.
		 * @type {String}
		 */
		this.controller = null;

		/**
		 * Temsil edilen controllera ait metot adı.
		 * @type {String}
		 */
		this.method = null;

		Object.assign( this, extract( definitionString, '{controller}@{method}' ));
	}
});
