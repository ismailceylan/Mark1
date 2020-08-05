define(
[
	"../type/is",

],
function( is )
{
	/**
	 * Verilen nesne ile aynı özelliklere sahip yeni bir nesne döndürür.
	 * 
	 * @param {Object} obj klonlanacak nesne
	 * @return {Object}
	 */
	return function objectClone( item )
	{
		if( ! item )

			return item;

		if( is( item, "array" ))
		{
			var clone = [];

			for( var i = 0; i < item.length; i++ )
					
				clone[ i ] = objectClone( item[ i ]);

			return clone;
		}
		else if( is( item, "object" ))
		{
			var clone = {};

			for( var prop in item )

				if( item.hasOwnProperty( prop ))
					
					clone[ prop ] = objectClone( item[ prop ]);

			return clone;
		}
		else
		
			return item;
	}
});
