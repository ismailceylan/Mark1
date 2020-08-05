define(
[
	"system/core/trait",
	"./typeable",

],
function( Trait, Typeable )
{
	/**
	 * "@directive {[type]} [name] [desc]" türü desenler için destek verici
	 *   metotlar sağlar.
	 *
	 * @module system/library/jsdoc/directives/traits/type-name-desc-matches
	 * @method TypeNameDescMatches
	 * @author Ismail Ceylan
	 * @created 2020-06-04T20:57:12+0300
	 */
	return Trait( "TypeNameDescMatches" ).use( Typeable ).prototype(
	{
		/**
		 * Direktifle eşleşen düzenli ifade.
		 *
		 * @name pattern
		 * @type {RegExp}
		 * @default /@(.*?)\s+{(.*)}\s+(.*?)\s+(.*)/
		 */
		pattern: /@(.*?)\s+{(.*)}\s+(.*?)\s+(.*)/,

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T21:00:18+0300
		 */
		match: function( line )
		{
			var matches = line.match( this.pattern );

			// eşleşme yoksa veya bu direktife refere eden bir satır değilse
			if( ! matches || matches[ 1 ].toLowerCase() != this.label )

				return;

			this.value = matches[ 4 ];
			this.name = matches[ 3 ];
			this.isAccepted = true;

			this.parseTypeSection( matches[ 2 ]);
		}
	});
});
