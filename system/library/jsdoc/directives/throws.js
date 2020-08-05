define(
[
	"system/core/type",
	"./directive",
	"./traits/type-desc-matches",

],
function( Type, Directive, TypeDescMatches )
{
	/**
	 * Throws direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/throws
	 * @method Throws
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:56:12+0300
	 */
	return Type( "Throws" ).extends( Directive ).use( TypeDescMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default throws
		 */
		label: "throws",

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
		 * @default false
		 */
		multipleTypes: false
	});
});
