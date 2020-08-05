define(
[
	"../typo/camel-to-dash",

],
function( camel2dash )
{
	/**
	 * Verilen parametreler doğrultusunda exception üretir. Environment olarak
	 * production ortamı ayarlıysa sadece düz Error örneği döndürür.
	 * 
	 * @param {String} exceptionName exception adı (BadControllerReference gibi)
	 * @param {Array} ...params adı verilen exception sınıfına geçirilecek parametreler
	 */
	return function Exception( exceptionName, params )
	{
		var error = new Error( exceptionName );
		var args = arg( arguments ).slice( 1 );

		if( app.config.site.environment == "production" )

			throw error;

		var exceptionPath = [ "system/exception/" + camel2dash( exceptionName )];
		
		var onReady = function( Exception )
		{
			throw Exception.apply( error, args );
		}

		var onError = function()
		{
			require([ "system/exception/unknown-exception" ], function( UnknownException )
			{
				throw UnknownException.call( error, exceptionName, exceptionPath );
			});
		}

		require( exceptionPath, onReady, onError );
	}
});
