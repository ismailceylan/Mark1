define(
[
	"./application",
	
],
function( ApplicationExtender )
{
	return function()
	{
		// application.js genişleticisi
		ApplicationExtender.call( app );
	}
});
