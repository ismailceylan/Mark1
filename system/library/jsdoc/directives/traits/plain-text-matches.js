define(
[
	"system/core/trait",

],
function( Trait )
{
	/**
	 * Boş olmayan satırları düz metin olarak kabul edip bununla ilgili yardımcı
	 *   metotlar sağlar.
	 *
	 * @module system/library/jsdoc/directives/traits/plain-text-matches
	 * @method PlainTextMatches
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:37:46+0300
	 */
	return Trait( "PlainTextMatches" ).prototype(
	{
		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T12:39:27+0300
		 */
		match: function( line )
		{
			// hiç karakter içermiyorsa
			if( is( line, "empty" ))

				return;
			
			this.value = line;
			this.isAccepted = true;
		}
	});
});
