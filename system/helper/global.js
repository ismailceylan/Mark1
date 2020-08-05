define(
[
	"./type/is",
	"./type/type",
	"./console",
	"./argument",
	"./exception",

],
function( is, type, Console, Argument, Exception )
{
	( function injector()
	{
		Argument.arg( arguments ).forEach( function( Helper )
		{
			for( var method in Helper )

				window[ method ] = Helper[ method ];
		});
	})
	( Console, Argument, Exception,
	{
		is: is,
		type: type
	});
});
