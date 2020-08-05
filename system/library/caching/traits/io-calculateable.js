define(
[
	"../../../core/trait",

],
function( Trait )
{
	return Trait( "IOCalculateable" ).prototype(
	{
		/**
		 * Yazılan byte sayısına ekler.
		 * @param {Number} add eklenecek sayı
		 */
		addWrites: function( add )
		{
			this.write += add;
			this.parent && this.parent.addWrites( add );
		},

		/**
		 * Okunan byte sayısına ekler.
		 * @param {Number} add eklenecek sayı
		 */
		addReads: function( add )
		{
			this.read += add;
			this.parent && this.parent.addReads( add );
		}
	});
});
