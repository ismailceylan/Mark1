define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Module direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/module
	 * @method Module
	 * @author Ismail Ceylan
	 * @created 2020-06-04T01:00:47+0300
	 */
	return Type( "Module" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default module
		 */
		label: "module"
	});
});
