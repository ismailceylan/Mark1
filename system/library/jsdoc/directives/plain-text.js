define(
[
	"system/core/type",
	"./directive",
	"./traits/plain-text-matches",

],
function( Type, Directive, PlainTextMatches )
{
	/**
	 * Düz yazıları temsil eder.
	 *
	 * @module system/library/jsdoc/directives/text
	 * @method PlainText
	 * @author Ismail Ceylan
	 * @created 2020-06-04T01:00:47+0300
	 */
	return Type( "PlainText" ).extends( Directive ).use( PlainTextMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default plain text
		 */
		label: "plain text"
	});
});
