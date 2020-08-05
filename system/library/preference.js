define(
[
	'system/machine/keep'
],
function()
{
	/**
	 * Kullanıcı tercihlerini cihaz üzerinde yöneten arayüzü
	 * sağlar. Tercihler tek tek kaydedilebileceği gibi, ilgili
	 * restful endpoint  üzerinden topluca da eşitlenebilir.
	 * Böylece her gerektiğinde sunucuya bağlanmaya gerek
	 * kalmaksızın pratik bir kullanım elde edilir.
	 *
	 * @type {Object}
	 */
	return ( new ( function()
	{
		var root = this;

		/**
		 * Tercihlerin cihaz üzerine kaydedilmesi işlemlerini
		 * handle eden kayıt yönetim arayüzünü tutar.
		 * 
		 * @type {Keep}
		 */
		this.keep = new Keep( 'preferences' );

		/**
		 * Adı ve değeri verilen bir tercihi saklar.
		 * 
		 * @param {String} name  tercih erişim adı
		 * @param {Mixed}  value tercih değeri
		 */
		this.set = function( name, value )
		{
			// tüm ayarları okuyalım
			var all = this.keep.me() || {};

			all[ name ] = value;

			// ayarları kaydedelim
			this.keep.it( all );
		}

		/**
		 * Adı verilen tercihi döndürür.
		 * 
		 * @param {String} name değeri istenen tercihin erişim adı
		 * @param {mixed} def varsayılan değer
		 * @return {Mixed}
		 */
		this.get = function( name, def )
		{
			return ( this.keep.me() || {})[ name ] || def;
		}

		/**
		 * Kurulumu yapar.
		 */
		this.init = function()
		{
			return this;
		}
	}))
	.init();
});
