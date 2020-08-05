require.config({ packages: [

	/*
	|--------------------------------------------------------------------------
	| Örnek Kullanım
	|--------------------------------------------------------------------------
	|
	| Bu config dosyasında application/packages dizinindeki paket tanımları
	| yapılmalıdır. Bu dosya sistem tarafından yüklendiği için burada kaydı
	| bulunan bir paket herhangi bir yerde sadece adı verilerek require
	| edilebilme özelliği kazanır, bütün package yolunu her package yüklerken
	| yazmak gerekmez. Buraya kaydedilmeyen package modülleri tam yolu verilerek
	| yine yüklenebilir.
	|
	| Örn: { name: 'kısa ad', location: 'tam yolu', main: 'package içinde bir yol/varsayılanı /main.js' }
	| Örn: { name: 'weather', location: 'application/package/weather' }
	| Örn: { name: 'color-picker', location: 'app/package/color-picker', main: 'core/index' }
	|
	| require([ 'weather', 'color-picker' ], function( weather, cp )
	| {
	|		// paketler yüklendi kullanıma hazır
	| });
	|
	*/

]});
