define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Author direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/author
	 * @method Author
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:52:34+0300
	 */
	return Type( "Author" ).extends( Directive ).use( OnlyValuesMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default author
		 */
		label: "author"
	});
});
