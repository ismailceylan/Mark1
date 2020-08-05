define(
[
	"system/core/trait",
	"system/helper/object/each",

],
function( Trait, each )
{
	return Trait( "Inheritable" ).prototype(
	{
		/**
		 * Ebevenyden alabileceği özellikleri alır.
		 */
		inherit: function()
		{
			this.inheritBy( this.inheritance );
		},

		/**
		 * Miras alınacak özellikleri onları nasıl
		 * miras alacağını bilen metotlara dağıtır.
		 *
		 * {
		 * 		inheriterMethod: [ property names ],
		 * 		...
		 * }
		 * 
		 * @param {Object} options miras özellikleri
		 */
		inheritBy: function( options )
		{
			var root = this;

			each( options, function( inheriter, properties )
			{
				root.inheritEach( properties, function( prop, context )
				{
					root[ inheriter ]( prop, context );
				});
			});
		},

		/**
		 * Adı verilen özellikler parent ve manager isimli alanlarda
		 * mevcutsa verilen miras alıcı metodu çalıştırır.
		 * 
		 * @param {Array} properties miras alınacak özellikler
		 * @param {Function} inheriter miras alma şeklini belirleyecek metot
		 */
		inheritEach: function( properties, inheriter )
		{
			var root = this;

			properties.forEach( function( prop )
			{
				[ 'parent', 'manager' ].forEach( function( context )
				{
					if( root[ context ] && root[ context ][ prop ])

						inheriter.call( this, prop, context );
				});
			});
		},

		/**
		 * Adı verilen özelliği adı verilen bağlamdan alıp bu grup üzerindeki
		 * aynı isimli özellik üzerine miras getirir.
		 * 
		 * @param {String} prop miras alınacak özellik adı
		 * @param {String} context miras alınacak bağlam adı (parent, manager)
		 */
		extendingInheritance: function( prop, context )
		{
			Object.assign( this[ prop ], this[ context ][ prop ]);
		},

		/**
		 * Adı verilen özelliği adı verilen bağlamdan alıp bu grup üzerindeki
		 * aynı isimli özellik üzerine ön ek ile eklemek yoluyla miras getirir.
		 * 
		 * @param {String} prop miras alınacak özellik adı
		 * @param {String} context miras alınacak bağlam adı (parent, manager)
		 */
		prefixingInheritance: function( prop, context )
		{
			this[ prop ] = ( this[ context ][ prop ] + '/' + this[ prop ]).trim2( '/' );
		}
	});
});
