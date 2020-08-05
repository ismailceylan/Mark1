define(
[
	"../../core/type",

],
function( Type )
{
	/**
	 * Tablo kümelerini temsil eder.
	 */
	return Type( "TableList" ).prototype(
	{
		/**
		 * Kurulumu yapar.
	 	 * @param {Database} database bu listeye sahip olan veritabanı
		 */
		construct: function( database )
		{
			this.database = database;
			this.tables = {}
		},

		/**
		 * Veritabanı.
		 * @type {Database}
		 */
		database: null,

		/**
		 * Tablolar.
		 * @type {Object}
		 */
		tables: null,

		/**
		 * Tablo sayısı.
		 * @type {Number}
		 */
		length: 0,

		/**
		 * Verilen tabloyu listeye ekler.
		 * 
		 * @param {Table} table bir tablo
		 * @return {Table}
		 */
		add: function( table )
		{
			this.length++
			table.parent = this.database;
			
			return this.tables[ table.name ] = table;
		},

		/**
		 * Adı verilen tablonun olup olmadığını söyler.
		 * 
		 * @param {String} name tablo adı
		 * @return {Boolean}
		 */
		has: function( name )
		{
			return name in this.tables;
		},

		/**
		 * Adı verilen tabloyu döndürür.
		 * 
		 * @param {String} name tablo adı
		 * @return {Table|undefined}
		 */
		get: function( name )
		{
			return this.tables[ name ];
		}
	});
});
