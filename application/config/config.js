define(
{
	/*
	|--------------------------------------------------------------------------
	| Site başlığı
	|--------------------------------------------------------------------------
	|
	| Sitenin adıdır. Başlık alanı gibi bazı yerlerde gereklidir.
	|
	*/	
	sitename: "Mark-1",

	/*
	|--------------------------------------------------------------------------
	| Controller tetikleme mekanizması
	|--------------------------------------------------------------------------
	|
	| Controller'ların tetiklenmesi için bir girdiye ihtiyaçları vardır. Çoğu
	| durumda bu girdi URL olur ancak url, linke tıkla, bağlantı kurulsun sayfa
	| yüklensin, bağlantı kapansın yöntemiyle değişebileceği gibi bazen de tek
	| sayfadan oluşan web uygulamalarında bu işleyiş ajax tarafından sağlanacağı
	| için url değişmez ve dolayısıyla controller'lar tetikleme mekanizmasını
	| kaybetmiş olur. Ancak yardımcı driver'lar sayesinde controller'ları
	| tetikleyecek yeni mekanizmalar oluşturabiliriz.
	|
	| [url]
	| klasik yöntemdir. sayfa yüklenir, js yorumlanır, url okunur ve uygun controller
	| tetiklenir.
	|
	| [history]
	| tek sayfadan oluşan modern siteler için uygundur, uygulama ilk
	| çalıştığı sırada yine klasik yöntemle controller tetiklenir, ek olarak
	| pencerenin popstate eventi de dinlendiği için kullanıcı ileri-geri butonlarını
	| bile kullansa (linklere tıklamak da dahil) değişen url için uygun yeni controller
	| tetiklenir.
	|
	*/
	stateSource: "history"
});
