define(
[
	"system/core/trait",
	"./typeable",

],
function( Trait, Typeable )
{
	/**
	 * "@directive {[type]} [desc]" türü desenler için destek verici metotlar
	 *   sağlar.
	 *
	 * @module system/library/jsdoc/directives/traits/type-desc-matches
	 * @method TypeDescMatches
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:57:53+0300
	 */
	return Trait( "TypeDescMatches" ).use( Typeable ).prototype(
	{
		/**
		 * Direktifle eşleşen düzenli ifade.
		 *
		 * @name pattern
		 * @type {RegExp}
		 * @default /@(.*?)\s+{(.*)}\s+(.*)/
		 */
		pattern: /@(.*?)\s+{(.*)}\s+(.*)/,

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T12:58:18+0300
		 */
		match: function( line )
		{
			var matches = line.match( this.pattern );

			// eşleşme yoksa veya bu direktife refere eden bir satır değilse
			if( ! matches || matches[ 1 ].toLowerCase() != this.label )

				return;

			this.value = matches[ 3 ];
			this.isAccepted = true;

			this.parseTypeSection( matches[ 2 ]);
		}
	});
});
