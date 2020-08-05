define(
[
	"system/core/type",

],
function( Type )
{
	/**
	 * Döküman bloğunu temsil eder.
	 *
	 * @module system/library/jsdoc/sheet
	 * @method Sheet
	 * @author Ismail Ceylan
	 * @created 2020-06-04T01:20:15+0300
	 */
	return Type( "Sheet" ).prototype(
	{
		/**
		 * Verilen bir direktifi listeye ilave eder.
		 *
		 * @method add
		 * @param {Directive} directive bir direktif
		 * @author Ismail Ceylan
		 * @created 2020-06-04T02:31:37+0300
		 */
		add: function( directive )
		{
			var key = directive.label;

			// tek sefer tanımlananlar
			if( ! directive.multiple )

				return this[ key ] = directive;
	
			// çoklu tanımlanabilenler
			if( ! ( key in this ))

				this[ key ] = [];

			this[ key ].push( directive );
		}
	});
});
