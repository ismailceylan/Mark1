define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Default direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/default
	 * @method Default
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:52:34+0300
	 */
	return Type( "Default" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default default
		 */
		label: "default"
	});
});
