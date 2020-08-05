define(
[
	"system/core/type",
	"./directive",
	"./traits/type-name-desc-matches",

],
function( Type, Directive, TypeNameDescMatches )
{
	/**
	 * Param direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/param
	 * @method Param
	 * @author Ismail Ceylan
	 * @created 2020-06-04T20:55:41+0300
	 */
	return Type( "Param" ).extends( Directive ).use( TypeNameDescMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default param
		 */
		label: "param",

		/**
		 * Bu direktifin çok sefer tanımlanabilir olduğunu deklare eder.
		 *
		 * @name multiple
		 * @type {Boolean}
		 * @default true
		 */
		multiple: true,

		/**
		 * Bu direktifin tür bölümünde çoklu türler tanımlanıp
		 *   tanımlanamayacağını deklare eder.
		 *
		 * @name multipleTypes
		 * @type {Boolean}
		 * @default true
		 */
		multipleTypes: true
	});
});
