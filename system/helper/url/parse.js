define(
[
	"system/library/caching/cache",
	"../object/clone",
	"../string/trim2",
	"./config",
	"./parse-host",
	"./unserialize-querystring",

],
function( Cache, clone, trim, config, parseHost, unserializeQuerystring )
{
	/**
	 * Verilen bir url yapısını parçalarına ayırıp döndürür.
	 * 
	 * @param {String} url parse edilecek url
	 * @return {Object|undefined}
	 */
	return function parse( url )
	{
		return clone( Cache.new( "parsed urls" ).remember( url, Infinity, function()
		{
			var parts = { orig: url }
			var matches = url.match( config.pattern );

			if( ! matches )

				return parts;

			parts.protocol = matches[ 2 ];
			parts.port = matches[ 4 ];
			parts.hash = matches[ 8 ];
			parts.host = parseHost( matches[ 3 ]);

			parts.query =
			{
				orig: matches[ 7 ],
				items: unserializeQuerystring( matches[ 7 ] || "" )
			}

			// dizinleri sağlı sollu kırpmamız yeterli
			parts.path = trim(( matches[ 5 ] || "" ) + ( matches[ 6 ] || "" ), "/" );

			return parts;
		}));
	}
});
