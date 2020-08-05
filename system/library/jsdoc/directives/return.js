define(
[
	"system/core/type",
	"./directive",
	"./traits/type-desc-matches",

],
function( Type, Directive, TypeDescMatches )
{
	/**
	 * Return direktifini temsil eder.
	 *
	 * @module system/library/jsdoc/directives/return
	 * @method Return
	 * @author Ismail Ceylan
	 * @created 2020-06-04T14:18:12+0300
	 */
	return Type( "Return" ).extends( Directive ).use( TypeDescMatches ).prototype(
	{
		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default return
		 */
		label: "return",

		/**
		 * Bu direktifin çok sefer tanımlanabilir olduğunu deklare eder.
		 *
		 * @name multiple
		 * @type {Boolean}
		 * @default false
		 */
		multiple: false,

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
