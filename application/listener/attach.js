define(
[
	"application/listener/app",
	
],
function( AppListeners )
{
	return function()
	{
		AppListeners.call( app );
	}
});
