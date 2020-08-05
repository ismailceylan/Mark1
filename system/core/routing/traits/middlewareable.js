define(
[
	"system/core/trait",
	"system/helper/string/unserialize-method-call",
	
],
function( Trait, unserializeMethodCall )
{
	return Trait( "Middlewareable" ).prototype(
	{
		/**
		 * Rotaya özel uygulanacak middleware'lere ekleme yapar.
		 * 
		 * @param {String} pushed yığına eklenecek middleware'ler
		 * @return {this}
		 */
		middleware: function( pushed )
		{
			Object.assign( this.middlewares, unserializeMethodCall( pushed ));
			return this;
		}
	});
});
