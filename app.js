require(
[
	"system/helper/global",
	"system/machine/jquery/core",

],
function()
{
	require(
	[
		"system/core/application",
		"system/core/routing/route-manager",
		"system/core/navigator",
		"system/library/url",
		"application/core/extends",
		"application/listener/attach",
		"application/route/web",
		"application/config/config",

		"application/config/package",
		"system/core/config",

	],
	function( Application, RouteManager, Navigator, URL, CoreExtender, Listeners, WebRoutes, appConfigs )
	{
		/*
		 *---------------------------------------------------------------
		 * Application
		 *---------------------------------------------------------------
		 *
		 * Uygulamayı temsil eden sınıfı örnekliyoruz. Global alanı
		 * kirletip durmaktansa bunu daha semantik bir yer olan app
		 * alt alanı içinde yapabiliriz.
		 * 
		 */
		window.app = new Application;

		/*
		 *---------------------------------------------------------------
		 * Configs
		 *---------------------------------------------------------------
		 *
		 * Application shell dediğimiz ve görevi uygulamanın bu tarafına
		 * (javascript) ait kodların yüklenmesi ve çalışmaya başlamasından
		 * sorumlu bölümünde aynı zamanda bazı ilksel konfigürasyonlar da
		 * bulunuyor olabilir. Bunları da uygulama nesnesi üzerinde olması
		 * gereken yere yerleştirelim.
		 * 
		 */
		app.config.site = window.site || null;

		// geliştirici konfigürasyonları
		app.config.config = appConfigs;

		/*
		 *---------------------------------------------------------------
		 * URL
		 *---------------------------------------------------------------
		 *
		 * Mevcut url'in parse edilmiş haline her zaman app nesnesi üzerinden
		 * ulaşılabilmeli. Sonuçta bir web uygulamasının url'i olur.
		 * 
		 */
		app.setUri( new URL );

		/*
		 *---------------------------------------------------------------
		 * Navigation System
		 *---------------------------------------------------------------
		 *
		 * Bu framework single page javascript uygulamaların yapısı gereği 
		 * sayfayı hiç yenilemeden ama browser history nesnesinde değişiklik
		 * yaparak gezinti yapmayı destekler. Böylece tarayıcının geri ve
		 * ileri butonları işlev göstermeye devam ederken oturum boyunca
		 * elde edilmiş önbelleklemeler korunacağı için sitede gezindikçe
		 * daha performanslı bir sörf deneyimi garantilenmiş olur.
		 * 
		 */
		app.navigate = new Navigator;

		/*
		 *---------------------------------------------------------------
		 * Extending System Core
		 *---------------------------------------------------------------
		 *
		 * Sistemin çekirdek tarafı kodlaması her zaman her koşulda yeterli
		 * gelmeyebilir. Örneğin static bir site kaynağının yolunu hesapla
		 * ması için bir fonksiyon gerekebilir. Bu fonksiyonu pekala yeni
		 * bir helper dosyasında tutabilir, gerektiği yerde yükleyip çağıra
		 * biliriz ancak belki de bu fonksiyonun app global nesnesi üzerinde
		 * durması mantıklı olabilir. Bu durumda yapılması gereken bir çekirdek
		 * genişleme paketi yazmak ve ilgili klasöre koymaktır. Burada daha
		 * her şey yeni başlıyorken bu çekirdek geliştirmeleri sisteme hemen
		 * yansıyacağı için de uygulamanın her yerinde bu değişikliğin geçerli
		 * olması sağlanmış olur.
		 * 
		 */
		CoreExtender();

		/*
		 *---------------------------------------------------------------
		 * Attaching Global Event Listeners
		 *---------------------------------------------------------------
		 *
		 * Sistem genelini ilgilendiren paketler arası olay dinleyicileri
		 * attach edelim. Örneğin watch eklentisinin global {app} nesnesi
		 * üzerindeki package:watch olayını dinlemesi gibi. Böylece app
		 * nesnesi olaylar için bir köprü görevi görür.
		 * 
		 */
		Listeners();

		/*
		 *---------------------------------------------------------------
		 * Routes
		 *---------------------------------------------------------------
		 *
		 * Bir tane rota yöneticisini örnekleyip bunu tekil alana kaydede
		 * rek bütün runtime oturumu boyunca bu örneği kullanacağız. Geliş
		 * tiriciye de bu yöneticiyi vererek kendi rotalarını tanımlamasını
		 * sağlayacağız.
		 * 
		 */
		var routeManager = app.singleton( "route", RouteManager.new());
		
		// geliştiricinin tanımladığı rotaları sisteme register edelim
		WebRoutes( routeManager );
		
		// mevcut url tanımlı rotalar havuzu içinde test edilsin eşleşme
		// sağlanırsa bu rotaya bağlı controller çalışsın
		routeManager.hit( document.URL );
	});
});
