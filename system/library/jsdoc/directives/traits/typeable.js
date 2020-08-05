define(
[
	"system/core/trait",

],
function( Trait )
{
	/**
	 * Type notasyonunu işlemeyi sağlayan yardımcı traittir. Type bölümlerinde
	 *   türler "|" işaretiyle birbirinden ayrılarak çoklu biçimde deklare
	 *   edilebilir. Direktifler kendi type alanlarının çoklu olup olmadığını
	 *   belirlerler ve bu trait buna bakarak type alanını işler. İsimlendirme
	 *   için direktif multiple desteği veriyorsa "types" vermiyorsa "typeName"
	 *   değeri kullanılır. Yani bu traiti kullanan direktiflerin type değerine
	 *   erişmek için bu iki isimden biri kullanılır.
	 *
	 * @module system/library/jsdoc/directives/traits/typeable
	 * @method Typeable
	 * @author Ismail Ceylan
	 * @created 2020-06-06T19:10:49+0300
	 */
	return Trait( "Typeable" ).prototype(
	{
		/**
		 * Temsil edilen direktifin type değerini parse eder ve direktif üzerine
		 *   uygun bir isimle yerleştirir.
		 *
		 * @method parseTypeSection
		 * @param {String} type type alanı
		 * @author Ismail Ceylan
		 * @created 2020-06-06T19:16:39+0300
		 */
		parseTypeSection: function( type )
		{
			// varsayılan type adı ve değeri
			var name = "typeName";

			// çoklu tür desteği isteniyorsa bunu handle edelim
			if( this.multipleTypes )
			{
				name = "types";
				type = type.split( "|" );
			}

			this[ name ] = type;
		}
	});
});
