define(
[
	"../../core/type",
	"./traits/io-calculateable",
	"./traits/hit-miss-countable",
	"./table-list",
	"./table",

],
function( Type, IOCalculateable, HitMissCountable, TableList, Table )
{
	/**
	 * Bir veritabanını temsil eder.
	 */
	return Type( "Database" ).use( IOCalculateable, HitMissCountable ).prototype(
	{
		/**
		 * Kurulumu yapar.
	 	 * @param {String} name veritabanının erişim anahtarı
		 */
		construct: function( name )
		{
			this.name = name;
			this.tables = TableList.new( this );
		},

		/**
		 * Temsil edilen veritabanı adı.
		 * @type {String}
		 */
		name: null,

		/**
		 * Bu veritabanını yöneten cache sınıfı.
		 * @type {Cache}
		 */
		manager: null,

		/**
		 * Veritabanı adı.
		 * @type {String}
		 */
		name: name,

		/**
		 * Veritabanındaki tablolar.
		 * @type {TableList}
		 */
		tables: null,

		/**
		 * Veritabanındaki tablo sayısı.
		 * @type {Number}
		 */
		items: 0,

		/**
		 * Toplam başarılı erişimler.
		 * @type {Number}
		 */
		hit: 0,

		/**
		 * Toplam başarısız erişimler.
		 * @type {Number}
		 */
		miss: 0,

		/**
		 * Toplam okunan byte sayısı.
		 * @type {Number}
		 */
		read: 0,

		/**
		 * Toplam yazılan byte sayısı.
		 * @type {Number}
		 */
		write: 0,

		/**
		 * Bu veritabanı altında bir tablo oluşturur.
		 * 
		 * @param {String} name tablo adı
		 * @return {Table}
		 */
		createTable: function( name )
		{
			this.items++
			return this.tables.add( Table.new( name ));
		},

		/**
		 * Adı verilen tablonun olup olmadığını söyler.
		 * 
		 * @param {String} name tablo adı
		 * @return {Boolean}
		 */
		hasTable: function( name )
		{
			return this.tables.has( name );
		},

		/**
		 * Adı verilen tabloyu döndürür. Henüz yoksa oluşturup döndürür.
		 * 
		 * @param {String} name tablo adı
		 * @return {Table}
		 */
		getTable: function( name )
		{
			if( this.hasTable( name ))

				return this.tables.get( name );

			return this.createTable( name );
		}
	});
});
