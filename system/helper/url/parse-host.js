define(
[
	"system/library/caching/cache",

],
function( Cache )
{
	/**
	 * Verilen "subdomain.sub...domain.ext" yapısına uygun host dizilimini
	 * parçalarına ayırarak nesne olarak döndürür.
	 * 
	 * @param {String} full host tanımı
	 * @return {Object}
	 */
	return function parseHost( full )
	{
		return Cache.new( "rendered hosts" ).remember( full, Infinity, function()
		{
			var host =
			{
				orig: full,
				subdomains: [],
				domain: "localhost",
				ext: null
			}

			// localhost değilse parçalayacağız
			if( full != "localhost" )
			{
				var domainParts = full.split( "." );

				// son parça uzantıdır
				host.ext = domainParts.pop();
				// son parça domaindir
				host.domain = domainParts.pop();
				// kalan parçalar alt domainlerdir
				host.subdomains = domainParts;
			}

			return host;
		});
	}
});
