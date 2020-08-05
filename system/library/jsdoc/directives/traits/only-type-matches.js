define(
[
	"system/core/trait",
	"./typeable",

],
function( Trait, Typeable )
{
	/**
	 * "@directive {[type]}" deseni konusunda destek verici metotlar sağlar.
	 *
	 * @module system/library/jsdoc/directives/traits/only-type-matches
	 * @method OnlytypeMatches
	 * @author Ismail Ceylan
	 * @created 2020-06-04T14:15:58+0300
	 */
	return Trait( "OnlytypeMatches" ).use( Typeable ).prototype(
	{
		/**
		 * Sadece 1 tane type tutan direktiflerle eşleşen düzenli ifade.
		 *
		 * @name pattern
		 * @type {RegExp}
		 * @default /@(.*?)\s+(.*)/
		 */
		pattern: /@(.*?)\s+{(.*)}/,

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T14:17:28+0300
		 */
		match: function( line )
		{
			var matches = line.match( this.pattern );

			// eşleşme yoksa veya bu direktife refere eden bir satır değilse
			if( ! matches || matches[ 1 ].toLowerCase() != this.label )

				return;
			
			this.isAccepted = true;
			this.parseTypeSection( matches[ 2 ]);
		}
	});
});
