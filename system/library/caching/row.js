define(
[
	"../../core/type",
	"./traits/io-calculateable",
	"./traits/hit-miss-countable",
	"../../helper/date/now",
	"../../helper/number/random-hexadecimal",

],
function( Type, IOCalculateable, HitMissCountable, now, randHex )
{
	/**
	 * Bir satırı temsil eder.
	 */
	return Type( "Row" ).use( IOCalculateable, HitMissCountable ).prototype(
	{
		/**
		 * Kurulumu yapar.
		 * 
		 * @param {String} name satırın erişim anahtarı
		 * @param {Number} life anahtar ömrü
		 */
		construct: function( name, life )
		{
			this.name = name || randHex();
			this.life = life || Infinity;
			this.birth = now();

			this.observe( life );
		},
		
		/**
		 * Bu anahtarı barındıran tablo referansı.
		 * @type {Table}
		 */
		parent: null,

		/**
		 * Tablo adı.
		 * @type {String}
		 */
		name: null,
		
		/**
		 * Anahtarın değeri.
		 * @type {mixed}
		 */
		value: null,

		/**
		 * Anahtar değerinin uzunluğu.
		 * @type {Number}
		 */
		length: 0,

		/**
		 * Anahtarın oluşturulma zamanı.
		 * @type {Number}
		 */
		birth: 0,

		/**
		 * Anahtarın ömrü.
		 * @type {Number}
		 */
		life: null,

		/**
		 * Anahtar ömrü için bir geri sayısı.
		 * @type {Number}
		 */
		timer: null,

		/**
		 * Anahtara başarılı erişim sayısı.
		 * @type {Number}
		 */
		hit: 0,

		/**
		 * Anahtardan okunan byte sayısı.
		 * @type {Number}
		 */
		read: 0,

		/**
		 * Anahtara yazılan byte sayısı.
		 * @type {Number}
		 */
		write: 0,

		/**
		 * Kendinden önce gelen anahtar.
		 * @type {Row}
		 */
		before: null,

		/**
		 * Kendinden sonra gelen anahtar.
		 * @type {Row}
		 */
		after: null,

		/**
		 * Öğenin değerini ve ömrünü yeniden düzenler.
		 * 
		 * @param {mixed} value bir değer
		 * @param {Number} life ömür
		 * @return {@value}
		 */
		rewrite: function( value, life )
		{
			this.setValue( value );
			this.observe( life );

			return value;
		},

		/**
		 * Veriyi bu anahtara yazar.
		 * 
		 * @param {mixed} data yazılacak bir veri
		 * @return {@data}
		 */
		setValue: function( data )
		{
			this.length = 0;

			try
			{
				this.length = JSON.stringify( data ).length;
			}
			catch( e )
			{}

			this.addWrites( this.length );

			return this.value = data;
		},

		/**
		 * Bu anahtarın tuttuğu veriyi döndürür.
		 * @return {mixed}
		 */
		getValue: function()
		{
			this.addReads( this.length );
			this.addHit( 1 );
			
			return this.value;
		},

		/**
		 * Bu anahtar için verilen ömür sonsuz değilse ömrü dolduğunda
		 * otomatik silinebilmesi için bir geri sayıcı oluşturur.
		 *
		 * @param {Number} life anahtarın ömrü
		 * @return {undefined|Number}
		 */
		observe: function( life )
		{
			life = life || Infinity;
			
			// önceki gerisayımları durduralım
			clearTimeout( this.timer );

			// yaşam süresi sonsuz ise işleme gerek yok
			if( life === Infinity )

				return;

			var root = this;

			return this.timer = setTimeout( function()
			{
				root.parent.forget( root.name );
			},
			life );
		},

		/**
		 * Anahtarın hala hayatta olup olmadığını söyler.
		 * @returns {Boolean}
		 */
		isAlive: function()
		{
			return this.birth + this.life > now();
		},

		/**
		 * Bu anahtarın ömrü sınırlıysa kalan ömrünü milisaniye cinsinden verir.
		 * @return {Number}
		 */
		getRemainingLifeTime: function()
		{
			if( this.life == Infinity )

				return Infinity;

			return this.life - ( now() - this.birth );
		}
	});
});
