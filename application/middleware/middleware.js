define(
[
	"system/core/middleware",

],
function( Middleware )
{
	return Type( "CoolOne" ).extends( Middleware ).prototype(
	{
		boot: function( next )
		{
			next();
		}
	});
});
