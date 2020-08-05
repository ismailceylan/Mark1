/*
 *---------------------------------------------------------------
 * Cache
 *---------------------------------------------------------------
 *
 * Nesneler üzerinde cache mekanizmaları oluşturmak için genel
 * bir arayüz yapısı sağlar.
 * 
 */
define(
[
	"../../core/type",
	"./database",
	"./table",

],
function( Type, Database, Table )
{
	/**
	 * Cache mekanizması sağlar.
	 */
	return Type( "Cache" ).prototype(
	{
		/**
		 * Kurulumu yapar.
		 * 
		 * @param {String} tableName kullanılacak saklama alanı adı
		 * @param {String} dbName veritabanı adı
		 * @param {Object} storage saklama alanı
		 * @return {Cache}
		 */
		construct: function( tableName, dbName, storage )
		{
			this.tableName = tableName;
			this.dbName = dbName || "<MemoryCache>";
			this.storage = storage || app;

			if( ! this.isDatabaseExist())
			
				this.createDatabase();
		
			this.table = this.database.getTable( tableName );	
		},

		/**
		 * Temsil edilen saklama alanı.
		 * @type {String}
		 */
		tableName: null,

		/**
		 * Sınıfın global nesne üzerinde kullanacağı değişken adı.
		 * @type {Symbol}
		 */
		dbName: null,

		/**
		 * Saklama ortamını tutar.
		 * @type {Object}
		 */
		storage: null,

		/**
		 * Veritabanı.
		 * @type {Database}
		 */
		database: null,

		/**
		 * Tablo;
		 * @type {Table}
		 */
		table: null,

		/**
		 * Veritabanının saklama alanı içinde bulunup bulunmadığına bakar.
		 * @return {Boolean}
		 */
		isDatabaseExist: function()
		{
			if( ! ( this.dbName in this.storage ))

				return false;

			this.database = this.storage[ this.dbName ];

			return true;
		},

		/**
		 * Veritabanını oluşturur.
		 */
		createDatabase: function()
		{
			this.database =
			this.storage[ this.dbName ] = Database.new( this.dbName );

			this.database.manager = this;
		},

		/**
		 * Temsil edilen saklama alanına bir öğe ekler.
		 * 
		 * @param {String} name eklenecek öğenin adı
		 * @param {mixed} value saklanacak değer
		 * @param {Number} life verinin ömrü
		 * @param {Boolean} overwrite anahtar mevcutsa üzerine yazılıp yazılmayacağı
		 * @return {undefined|@value}
		 */
		set: function( name, value, life, overwrite )
		{
			// anahtarın mevcut olduğu durumlar
			if( this.table.hasRow( name ))
			{
				// üzerine yazılmayacaksa işleme gerek yok
				if( ! overwrite )

					return;

				// üzerine yazalım
				return this.table.getRow( name ).rewrite( value, life );

			}

			// anahtar mevcut değil
			return this.table.createRow( name, value, life ).value;
		},

		/**
		 * Temsil edilen saklama alanına bir öğe ekler. Zaten bu isimde bir
		 * öğe varsa üzerine yazmaz.
		 *
		 * Sadece tek parametre verilirse verilen değer otomatik üretilmiş
		 * bir isim altında saklanır.
		 * 
		 * @param {String} name eklenecek öğenin adı
		 * @param {mixed} value saklanacak değer
		 * @param {Number} life verinin ömrü
		 * @return {false|mixed}
		 */
		add: function( name, value, life )
		{
			if( arguments.length === 1 )
			{
				value = name;
				name = undefined;
			}

			return this.set( name, value, life, false );
		},

		/**
		 * Temsil edilen saklama alanına bir öğe ekler. Zaten bu isimde bir
		 * öğe varsa üzerine yazar.
		 *
		 * Sadece tek parametre verilirse verilen değer otomatik üretilmiş
		 * bir isim altında saklanır.
		 * 
		 * @param {String} name eklenecek öğenin adı
		 * @param {mixed} value saklanacak değer
		 * @param {Number} life verinin ömrü
		 * @return {false|mixed}
		 */
		put: function( name, value, life )
		{
			if( arguments.length === 1 )
			{
				value = name;
				name = undefined;
			}
			
			return this.set( name, value, life, true );
		},

		/**
		 * Temsil edilen saklama alanından adı verilen anahtarı döndürür. Anahtar
		 * hayatta değilse ikincil kaynağa bakılır.
		 * 
		 * 1- Varsayılan değer
		 * get( anahtar, varsayılan )
		 * 
		 * 2- Callback ile varsayılan üretimi
		 * get( anahtar, Function )
		 *
		 * 3 - Varsayılan değerin direkt dönmesi
		 * get( anahtar, değer )
		 * 
		 * @param {String} name değeri döndürülecek anahtar adı
		 * @param {mixed} def anahtar mevcut olmadığında döndürülecek bir değer
		 * @returns {mixed}
		 */
		get: function( name, def )
		{
			if( this.table.hasRow( name ))

				return this.table.getRow( name ).getValue();
			
			this.table.addMissed( 1 );

			if( def instanceof Function )

				return def.call( this );
			
			return def;
		},

		/**
		 * Adı verilen anahtarı temsil edilen saklama alanından siler ve değerini
		 * döndürür.
		 * 
		 * @param {String} name silinecek anahtarın adı
		 * @return {mixed}
		 */
		forget: function( name )
		{
			return this.table.forget( name );
		},

		/**
		 * Temsil edilen saklama alanında adı verilen anahtarın değerini
		 * yükseltir. Anahtar o anda değer olarak sayısal bir şey tutmuyorsa
		 * ikinci parametre değeri neyse (veya onun varsayılanı) ile eşitlenir.
		 * 
		 * İkinci parametre belirtilmezse varsayılan olarak 1 eklenir.
		 * 
		 * Geriye anahtarın son yükseltme işleminden sonraki değeri döner.
		 * 
		 * @param {String} name değeri sayısal olarak arttırılacak anahtar
		 * @param {Number} add mevcut değere eklenecek sayı
		 * @return {Number}
		 */
		increment: function( name, add )
		{
			return this.table.increase( name, add || 1 );
		},

		/**
		 * Temsil edilen saklama alanında adı verilen anahtarın değerini
		 * azaltır. Anahtar o anda değer olarak sayısal bir şey tutmuyorsa
		 * değeri ikinci parametrede verilen değerin negatif hali olur.
		 * 
		 * İkinci parametre belirtilmezse varsayılan olarak 1 düşülür.
		 * 
		 * Geriye anahtarın son eksiltme işleminden sonraki değeri döner.
		 * 
		 * @param {String} name değeri sayısal olarak azaltılacak anahtar
		 * @param {Number} add mevcut değerden eksiltilecek sayı
		 * @return {Number}
		 */
		decrement: function( name, add )
		{
			return this.incdec( name, -1 * ( add || 1 ));
		},

		/**
		 * Temsil edilen saklama alanına adı verilen anahtarı ekler. Değer olarak
		 * da verilen callback çalıştırılarak döndürdüğü sonuç kullanılır.
		 * 
		 * Bundan sonraki çağrılarda anahtarın ömrü dolmadığı sürece artık
		 * callback değil önbellekten anahtar değeri döndürülür.
		 * 
		 * @param {String} name saklanacak veya mevcutsa değeri döndürülecek anahtar
		 * @param {Number} life anahtar saklanacaksa sahip olacağı ömür
		 * @param {Function} source anahtar mevcut değilse yeni oluşturulacak olan
		 * anahtarın değerini besleyecek bir metot
		 * @param {Function} processor önbellekten getirilen öğeyi işleyecek
		 * bir metot
		 * @return {mixed}
		 */
		remember: function( name, life, source, processor )
		{
			var data;

			// anahtar mevcut ve ömrü dolmamışsa
			if( data = this.get( name ))
			{
				// data elimizde bunu işleyecek bir önişlemci metot
				// verilmişse bunun içinden geçirip öyle döndürelim
				if( processor && is( processor, "function" ))

					return processor.call( this, data );

				// data cache'ten elde edildi döndürelim
				return data;
			}

			// data cache'te yok veri kaynağı bir metotsa call
			// edip saklanacak değeri üretmesini sağlayalım
			if( is( source, "function" ))

				// ürettiği değeri kendi üzerine yazabiliriz
				source = source.call( this );

			return this.add( name, source, life );
		},

		/**
		 * Temsil edilen tablodaki tüm girdileri siler.
		 */
		clean: function()
		{
			this.table.truncate();
		},

		/**
		 * Temsil edilen tabloda kaç eleman olduğunu söyler.
		 * @return {Number}
		 */
		length: function( length )
		{
			return this.table.rows.length;
		},

		/**
		 * Temsil edilen tabloya en son eklenen anahtarın değerini verir. Son
		 * eklenen bir şey yoksa veya anahtarın ömrü dolmuşsa undefined döner.
		 * 
		 * @return {mixed}
		 */
		getLast: function()
		{
			var last;

			if( last = this.table.rows.last )

				return this.get( last.name );
		},

		/**
		 * Temsil edilen tabloya ilk eklenen anahtarın değerini verir. İlk
		 * eklenen bir şey yoksa veya anahtarın ömrü dolmuşsa undefined döner.
		 * 
		 * @return {mixed}
		 */
		getFirst: function()
		{
			var first;

			if( first = this.table.rows.first )

				return this.get( first.name );
		},

		/**
		 * Temsil edilen alandaki tüm öğeleri tek tek verilen callback'e
		 * geçirerek döngü oluşturmayı sağlar.
		 * 
		 * @param {Function} callback öğeleri parametre olarak alacak bir metot
		 */
		each: function( callback )
		{
			return this.table.rows.each( callback );
		},

		/**
		 * Temsil edilen alandaki tüm öğeleri tek tek verilen callback'e
		 * geçirerek döngü oluşturur. Bu metot içinden undefined değer döndürülürse
		 * sonraki öğeye geçilir. Bunun dışında herhangi bir değer dönülürse
		 * döngü tamamen kesilir ve return edilen bu değer de geriye döner.
		 * 
		 * @param {Function} callback öğeleri parametre olarak alacak bir metot
		 * @returns {mixed}
		 */
		search: function( callback )
		{
			return this.table.rows.search( callback );
		}
	});
});
