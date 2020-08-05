define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Name direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/name
	 * @method Name
	 * @author Ismail Ceylan
	 * @created 2020-06-04T14:12:24+0300
	 */
	return Type( "Name" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default name
		 */
		label: "name"
	});
});
