define(
[
	"system/core/type",
	"./directive",

],
function( Type, Directive )
{
	/**
	 * Boş satırları handle eder.
	 *
	 * @module system/library/jsdoc/directives/empty-line
	 * @method EmptyLine
	 * @author Ismail Ceylan
	 * @created 2020-06-05T00:15:47+0300
	 */
	return Type( "EmptyLine" ).extends( Directive ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default empty line
		 */
		label: "empty line",

		/**
		 * Direktif değeri.
		 *
		 * @name value
		 * @type {String}
		 * @default \n
		 */
		value: "",

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-05T00:15:07+0300
		 */
		match: function( line )
		{
			if( ! is( line, "empty" ))

				return;

			this.isAccepted = true;
		}
	});
});
