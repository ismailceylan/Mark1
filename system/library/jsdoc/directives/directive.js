define(
[
	"system/core/type",
	"./directive",

],
function( Type, Directive )
{
	/**
	 * Genel direktifleri temsil eder.
	 *
	 * @module system/library/jsdoc/directives/directive
	 * @method Directive
	 * @author Ismail Ceylan
	 * @created 2020-06-04T01:00:47+0300
	 */
	return Type( "Directive" ).prototype(
	{
		/**
		 * Direktif değeri.
		 *
		 * @name value
		 * @type {String}
		 * @default null
		 */
		value: null,

		/**
		 * Direktifin verilen satırı işlemeyi kabul edip etmediğini söyler.
		 *
		 * @name isAccepted
		 * @type {Boolean}
		 * @default false
		 */
		isAccepted: false,

		/**
		 * Kurulumu yapar.
		 *
		 * @method construct
		 * @param {String} line bir döküman satırı
		 * @author Ismail Ceylan
		 * @created 2020-06-04T03:40:53+0300
		 * @private
		 */
		construct: function( line )
		{
			this.match( line );
		},

		/**
		 * Verilen bir direktifin değerini bu direktifin değeriyle birleştirir.
		 *
		 * @method concat
		 * @param {Directive} directive bir direktif
		 * @author Ismail Ceylan
		 * @created 2020-06-04T03:04:07+0300
		 * @inherited
		 */
		concat: function( directive )
		{
			var spacer;
			var value;

			// uzun satırı alt satırdan girintiyle devam ettirmeler
			if( directive.value.slice( 0, 2 ) == "  " )
			{
				spacer = " ";
				value = directive.value.slice( 2 );
			}
			// girintisi olmayan gerçekten yeni bir satır olan metinler
			else
			{
				spacer = "\n";
				value = directive.value;
			}

			this.value += spacer + value;
		}
	});
});
