define(
[
	"../../core/type",
	"./traits/io-calculateable",
	"./traits/hit-miss-countable",
	"./row",
	"./row-list",
	
],
function( Type, IOCalculateable, HitMissCountable, Row, RowList )
{
	/**
	 * Bir tabloyu temsil eder.
	 */
	return Type( "Table" ).use( IOCalculateable, HitMissCountable ).prototype(
	{
		/**
		 * Kurulumu yapar.
	 	 * @param {String} name tablonun erişim anahtarı
		 */
		construct: function( name )
		{
			this.name = name;
			this.rows = RowList.new( this );
		},

		/**
		 * Bu tabloya sahip olan veritabanı.
		 * @type {Database}
		 */
		parent: null,

		/**
		 * Tablo adı.
		 * @type {String}
		 */
		name: null,

		/**
		 * Satır kümesi.
		 * @type {RowList}
		 */
		rows: null,

		/**
		 * Tablodaki satır sayısı.
		 * @type {Number}
		 */
		items: 0,

		/**
		 * Başarılı anahtar erişimleri sayısı.
		 * @type {Number}
		 */
		hit: 0,

		/**
		 * Başarısız anahtar erişimleri sayısı.
		 * @type {Number}
		 */
		miss: 0,

		/**
		 * Başarılı erişimlerde okunan toplam byte sayısı.
		 * @type {Number}
		 */
		read: 0,

		/**
		 * Toplam saklanan safi verinin byte sayısı.
		 * @type {Number}
		 */
		write: 0,

		/**
		 * Bu tablo altında bir anahtar oluşturur.
		 * 
		 * @param {String} name anahtar adı
		 * @param {mixed} value anahtar değeri
		 * @param {Number} life anahtar ömrü
		 * @return {Row}
		 */
		createRow: function( name, value, life )
		{
			var row = Row.new( name, life );
				row.setValue( value );

			this.items++

			return this.rows.add( row );
		},

		/**
		 * Adı verilen anahtarın olup olmadığını söyler.
		 * 
		 * @param {String} name anahtar adı
		 * @return {Boolean}
		 */
		hasRow: function( name )
		{
			return this.rows.has( name );
		},

		/**
		 * Adı verilen anahtarı döndürür.
		 * 
		 * @param {String} name anahtar adı
		 * @return {Row|undefined}
		 */
		getRow: function( name )
		{
			return this.rows.get( name );
		},

		/**
		 * Adı verilen anahtarı siler. Geriye sildiği
		 * öğenin değerini döndürür.
		 * 
		 * @param {String} name silinecek anahtar adı
		 * @return {mixed|undefined}
		 */
		forget: function( name )
		{
			if( ! this.hasRow( name ))

				return;

			var row = this.getRow( name );

			// öğe üzerinde varsa sayacı sıfırlayalım
			clearTimeout( row.timer );

			// öğeyi silelim
			this.rows.remove( name );

			this.items--

			return row.value;
		},

		/**
		 * Temsil edilen saklama alanında adı verilen anahtarın değerini
		 * sayısal olarak hesaplayıp günceller.
		 * 
		 * @param {String} name değeri sayısal olarak arttırılacak anahtar
		 * @param {Number} add mevcut değere eklenecek sayı
		 * @return {Number}
		 */
		increase: function( name, add )
		{
			// öğe mevcut değilse veya ömrü bitmişse
			if( ! this.hasRow( name ))

				return;
			
			var row = this.getRow( name );
			// bu anahtar okuma istatistiklerini günceller
			var value = row.getValue();

			// anahtar değeri sayısal değilse sıfıra eşitleyelim
			if( ! row.value.isNumeric())

				value = 0;

			row.setValue( value += parseInt( add, 10 ));

			return value;
		},

		/**
		 * Bu tabloyu boşaltır.
		 */
		truncate: function()
		{
			this.rows.each( function( row )
			{
				// sayaçları durduralım
				row.observe( undefined );
			});

			this.items =
			this.hit =
			this.miss =
			this.read =
			this.write = 0;
		}
	});
});
