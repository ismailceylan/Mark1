define(
[
	"../type/is",
	"../argument/arg",

],
function( is, arg )
{
	return function lang()
	{
		var args = arg( arguments );

		// ilk argüman bir object ise dil girdileri
		// push edilmek isteniyor demektir
		if( is( args[ 0 ], "object" ))
		{
			for( var name in args[ 0 ])
			{
				var items = args[ 0 ][ name ];

				if( is( items, "object" ))
					
					// girdileri uygulama üzerine extends edelim
					app.language[ name ] = items;
			}

			return;
		}

		// bir dil girdisi isteniyor demektir
		var parts = args[ 0 ].split( '.' );
		var group = parts[ 0 ];
		var item  = parts[ 1 ];

		var pool = app.language[ group ];

		var str = pool.root && pool.root[ item ]
			? pool.root[ item ]
			: pool[ item ] || null;

		// ikinci parametre bir object ise string değer tutan
		// propertylere string içinden isimleriyle erişebilmek
		// için bir fonksiyonellik verelim
		if( args[ 1 ] && args[ 1 ] instanceof Object )

			for( prop in args[ 1 ])

				str = str.replace(
					new RegExp( "\\{" + prop + "\\}", "img" ),
					args[ 1 ][ prop ]
				);

		return str;
	}
});
