define(
[
	"../../core/type",
	"../../helper/object/each",

],
function( Type, each )
{
	/**
	 * Anahtar kümelerini temsil eder.
	 */
	return Type( "RowList" ).prototype(
	{
		/**
		 * Kurulumu yapar.
	 	 * @param {Table} table bu listeye sahip olan tablo
		 */
		construct: function( table )
		{
			this.table = table;
			this.rows = {}
		},

		/**
		 * Bu listeye sahip olan tablo.
		 * @type {Table}
		 */
		table: null,

		/**
		 * Anahtarlar.
		 * @type {Object}
		 */
		rows: null,

		/**
		 * Bu listede kaç anahtar bulunduğunu söyler.
		 * @type {Number}
		 */
		length: 0,

		/**
		 * Tablodaki ilk öğe.
		 * @type {Row}
		 */
		first: null,

		/**
		 * Tablodaki son öğe.
		 * @type {Row}
		 */
		last: null,

		/**
		 * Verilen anahtarı listeye ekler.
		 * 
		 * @param {Row} row bir anahtar
		 * @return {Row}
		 */
		add: function( row )
		{
			row.parent = this.table;

			this.rows[ row.name ] = row;
			this.makeLinks( row );
			this.length++

			return row;
		},

		/**
		 * Adı verilen anahtarı siler.
		 * @param {String} name silinecek anahtarın adı
		 */
		remove: function( name )
		{
			var row = this.rows[ name ];

			// anahtarın sağında hiç öğe yoksa son anahtardır
			if( ! row.after )

				this.last = row.before;

			// anahtarın solunda hiç öğe yoksa ilk anahtardır
			if( ! row.before )

				this.first = row.after;

			// anahtarın solundaki öğeye sağdakini linkleyelim
			if( row.before )

				row.before.after = row.after;

			// anahtarın sağındaki öğeye solundakini linkleyelim
			if( row.after )

				row.after.before = row.before;

			delete this.rows[ name ];
			this.length--
		},

		/**
		 * Adı verilen anahtarın olup olmadığını söyler.
		 * 
		 * @param {String} name anahtar adı
		 * @return {Boolean}
		 */
		has: function( name )
		{
			return name in this.rows;
		},

		/**
		 * Adı verilen anahtarı döndürür.
		 * 
		 * @param {String} name anahtar adı
		 * @return {Row|undefined}
		 */
		get: function( name )
		{
			return this.rows[ name ];
		},

		/**
		 * Verilen anahtarın sağ ve solundaki öğeleri ayarlar.
		 * 
		 * @param {Row} row bir anahtar
		 * @return {Row}
		 */
		makeLinks: function( row )
		{
			// hiç öğe yoksa bunu hem ilk hem son yapalım
			if( this.length === 0 )
			{
				this.first =
				this.last = row;

				// sadece tek öğe olduğundan sağına ve soluna dokunmuyoruz
			}
			// bir öğe varsa
			else if( this.length > 0 )
			{
				// bu son öğe, sol tarafında şuan en sonda bulunan öğe kalacak
				row.before = this.last;
				// sol tarafımıza attığımız öğenin sağ tarafına kendimizi koyalım
				row.before.after = row;
				// öğeyi son öğe alanına linkleyelim
				this.last = row;
			}

			return row;
		},

		/**
		 * Temsil edilen anahtarlar üzerinde arama döngüsü çalıştırır. Callback
		 * içinden return edilen değeri geriye döndürür.
		 * 
		 * @param {Function} callback anahtarları alacak bir metot
		 * @return {mixed}
		 */
		search: function( callback )
		{
			var r;

			each( this.rows, function( name, row, i )
			{
				r = callback.call( this.table.parent.manager, row.value, i );

				if( r !== undefined )

					return false;
			},
			this );

			return r;
		}
	});
});
