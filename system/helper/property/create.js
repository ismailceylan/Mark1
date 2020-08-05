define(
[
	"../type/is",

],
function( is )
{
	/**
	 * Verilen nesne üzerine yeni bir özellik ekler.
	 * 
	 * @param {Object} targetObj yeni özelliğin ekleneceği nesne
	 * @param {String} propName yeni özelliğin ismi
	 * @param {mixed} val yeni özelliğin değeri
	 * @param {String} opt yeni özelliğin yapısı (readonly hidden)
	 * @param {Function} getter özelliğe erişildiğinde işletilecek bir metot
	 * @param {Function} setter özelliğe değer yazılmaya çalışıldığında işletilecek bir metot
	 * @return {@val}
	 */
	return function create( targetObj, propName, val, opt, getter, setter )
	{
		// yapısal ayarlar
		var options =
		{
			value: val
		}

		if( opt )
		{
			// readonly
			if( opt.indexOf( "readonly" ) == -1 )

				options.writable = true;

			if( opt.indexOf( "hidden" ) > -1 )

				options.enumerable = false;
		}

		getter && ( options.get = getter );
		setter && ( options.set = setter );

		if(( "writable" in options || "value" in options ) && ( "get" in options || "set" in options ))
		{
			delete options[ "writable" ];
			delete options[ "value" ];
		}

		if( ! is( targetObj, "array" ))
			
			targetObj = [ targetObj ];

		targetObj.forEach( function( obj )
		{
			Object.defineProperty( obj, propName, options );
		});

		return val;
	}
});
