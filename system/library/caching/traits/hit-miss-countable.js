define(
[
	"../../../core/trait",

],
function( Trait )
{
	return Trait( "HitMissCountable" ).prototype(
	{
		/**
		 * Başarılı okumaları 1 arttırır.
		 * @param {Number} add eklenecek veya çıkarılacak miktar
		 */
		addHit: function( add )
		{
			this.hit += add;
			this.parent && this.parent.addHit( add );
		},

		/**
		 * Başarısızı okumaları 1 arttırır.
		 * @param {Number} add eklenecek veya çıkarılacak miktar
		 */
		addMissed: function( add )
		{
			this.miss += add;
			this.parent && this.parent.addMissed( add );
		}
	});
});
