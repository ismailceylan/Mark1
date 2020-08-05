define(
[
	"system/core/type",
	"./directive",
	"./traits/only-type-matches",

],
function( Type, Directive, OnlyTypeMatches )
{
	/**
	 * Type direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/type
	 * @method Type
	 * @author Ismail Ceylan
	 * @created 2020-06-04T14:12:24+0300
	 */
	return Type( "Type" ).extends( Directive ).use( OnlyTypeMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default type
		 */
		label: "type",

		/**
		 * Bu direktifin çok sefer tanımlanabilir olduğunu deklare eder.
		 *
		 * @name multipleTypes
		 * @type {Boolean}
		 * @default true
		 */
		multipleTypes: true
	});
});
