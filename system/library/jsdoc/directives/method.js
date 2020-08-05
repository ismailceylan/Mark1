define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Method direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/method
	 * @method Method
	 * @author Ismail Ceylan
	 * @created 2020-06-04T01:00:47+0300
	 */
	return Type( "Method" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default method
		 */
		label: "method"
	});
});
