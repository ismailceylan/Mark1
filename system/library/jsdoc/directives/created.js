define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Created direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/created
	 * @method Created
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:45:55+0300
	 */
	return Type( "Created" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default created
		 */
		label: "created"
	});
});
