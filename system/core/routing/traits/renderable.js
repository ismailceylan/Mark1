define(
[
	"system/core/trait",

],
function( Trait )
{
	return Trait( "Renderable" ).prototype(
	{
		/**
		 * Dahil olduğu sınıfın içindeki rota yığınlarını döngüye sokup
		 * türlere yapması gereken işlemin sinyalini gönderir. Böylece
		 * rotalar basit metotlarla önbellek alanında kullanıma hazır
		 * biçimde toplanmış olurlar.
		 */
		renderRoutes: function()
		{
			if( this.routesRendered )

				return;

			this.stack.forEach( function( item )
			{
				item.inherit();

				// öğe rotaysa kendini cachelesin
				if( item.is( "Route" ))

					item.store();

				// öğe bir rota grubuysa altındaki rotaları
				// render etsin (ki onu da bu metot yapacak)
				else if( item.is( "RouteGroup" ))

					item.renderRoutes();
			});

			this.routesRendered = true;
		}
	});
});
