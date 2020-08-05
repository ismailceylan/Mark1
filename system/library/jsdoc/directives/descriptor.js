define(
[
	"system/core/type",
	"./directive",
	"./traits/only-value-matches",

],
function( Type, Directive, OnlyValuesMatches )
{
	/**
	 * Döküman bloğunda herhangi bir veri tutmayıp ismiyle o metot veya
	 *   değişkeninin meta bilgilerini tanımlayan direktifleri handle eder.
	 *
	 * Örneğin @readOnly veya @private gibi.
	 *
	 * @module system/library/jsdoc/directives/descriptor
	 * @method Descriptor
	 * @author Ismail Ceylan
	 * @created 2020-06-04T12:52:34+0300
	 */
	return Type( "Descriptor" ).extends( Directive ).prototype(
	{
		/**
		 * Bu direktifin çok sefer tanımlanabilir olduğunu deklare eder.
		 *
		 * @name multiple
		 * @type {Boolean}
		 * @default true
		 */
		multiple: true,

		/**
		 * Sadece direktiflerle eşleşen düzenli ifade.
		 *
		 * @name pattern
		 * @type {RegExp}
		 * @default /^@(.*)$/
		 */
		pattern: /^@(.*)$/,

		/**
		 * Direktif adı.
		 *
		 * @name label
		 * @type {String}
		 * @default descriptor
		 */
		label: "descriptor",

		/**
		 * Temsil edilen direktifi verilen satırla eşleştirmeye çalışır.
		 *
		 * @method match
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-05T01:25:13+0300
		 */
		match: function( line )
		{
			var matches = line.trim().match( this.pattern );

			// eşleşme yoksa
			if( ! matches )

				return;
			
			this.value = matches[ 1 ];
			this.isAccepted = true;
		}
	});
});
