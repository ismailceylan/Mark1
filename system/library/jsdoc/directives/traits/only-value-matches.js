define(
[
	"system/core/trait",

],
function( Trait )
{
	/**
	 * "@directive [value]" deseni konusunda destek verici metotlar sağlar.
	 *
	 * @module system/library/jsdoc/directives/traits/only-value-matches
	 * @method OnlyValueMatches
	 * @author Ismail Ceylan
	 * @created 2020-06-04T11:54:23+0300
	 */
	return Trait( "OnlyValueMatches" ).prototype(
	{
		/**
		 * Sadece 1 tane değer tutan direktiflerle eşleşen düzenli ifade.
		 *
		 * @name pattern
		 * @type {RegExp}
		 * @default /@(.*?)\s+(.*)/
		 */
		pattern: /@(.*?)\s+(.*)/,

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T01:04:38+0300
		 */
		match: function( line )
		{
			var matches = line.match( this.pattern );

			// eşleşme yoksa veya bu direktife refere eden bir satır değilse
			if( ! matches || matches[ 1 ].toLowerCase() != this.label )

				return;
			
			this.value = matches[ 2 ];
			this.isAccepted = true;
		}
	});
});
