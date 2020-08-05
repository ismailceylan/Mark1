define(
[
	"system/helper/array/assoc",

	"system/helper/string/trim2",
	// "system/helper/array",
],
function( assoc, trim )
{
	/**
	 * Verilen gruplandırılmış string'i temsil eder.
	 * 
	 * @param {String} haystack gruplandırılmış metinsel bir ifade
	 * @param {String} seperator grupları birbirinden ayıran karakter
	 */
	return function StringGroup( haystack, seperator )
	{
		if( haystack instanceof StringGroup )

			return haystack;
		
		// ana etki alanı
		var root = this;

		/**
		 * Temsil edilen string ifade.
		 * @type {String}
		 */
		this.haystack = haystack;

		/**
		 * Grup ayırma karakteri.
		 * @type {String}
		 */
		this.seperator = seperator || ' ';

		/**
		 * Temsil edilen ifade içinde geçen grup sayısını verir.
		 * @return {Number}
		 */
		this.length = function()
		{
			return this.haystack.frequency( this.seperator ) + 1;
		}

		/**
		 * Toplam byte sayısını verir.
		 * @return {Number}
		 */
		this.size = function()
		{
			return this.haystack.length;
		}

		/**
		 * Temsil edilen ifadenin grupları içinde verilen değer ile
		 * eşleşen bir grup arar. Bulursa pozisyonunu döndürür
		 * bulamazsa -1 döner.
		 * 
		 * @param {String} needle aranan ifade
		 * @return {Number}
		 */
		this.indexOf = function( needle )
		{
			return trim( this.haystack, this.seperator ).split( this.seperator ).indexOf( needle );
		}

		/**
		 * Gruplandırılmış metinsel ifade içindeki değeri verilen grubu
		 * siler. Geriye string'in son halini döndürür.
		 * 
		 * @param {String} needle aranan ifade
		 * @return {String}
		 */
		this.remove = function( needle )
		{
			needle = ( "(\s*" + needle.escapeRegExpSyntax() + "\s*)" ).toRegExp( "mg" );

			return this.haystack =
			trim( this.haystack.replace( needle, this.seperator ), this.seperator );
		}

		/**
		 * Gruplandırılmış metinsel ifadeye verilen grubu ilave eder.
		 * 
		 * @param {String} needle aranan ifade
		 * @return {String}
		 */
		this.push = function( needle )
		{
			return this.haystack =
			trim( this.haystack, this.seperator ) + this.seperator + needle;
		}

		/**
		 * Gruplandırılmış metinsel ifadenin önüne verilen grubu yerleştirir.
		 * 
		 * @param {String} needle aranan ifade
		 * @return {String}
		 */
		this.unshift = function( needle )
		{
			return this.haystack =
			needle + this.seperator + trim( this.haystack, this.seperator );
		}

		/**
		 * Gruplandırılmış metinsel ifadenin en
		 * sonundaki grup elemanının değerini döndürür.
		 *
		 * @return {String}
		 */
		this.pop = function()
		{
			var groups = this.toArray();
			var last = groups.pop();

			this.haystack = groups.join( this.seperator );

			return last;
		}
		
		/**
		 * Gruplandırılmış metinsel ifadenin en
		 * başındaki grup elemanının değerini döndürür.
		 * 
		 * @return {String}
		 */
		this.shift = function()
		{
			var groups = this.toArray();
			var first = groups.pop();

			this.haystack = groups.join( this.seperator );

			return first;
		}

		/**
		 * Temsil edilen ifadenin gruplarını dizi halinde döndürür.
		 * @return {Array}
		 */
		this.toArray = function()
		{
			return trim( this.haystack, this.seperator ).split( this.seperator );
		}

		/**
		 * Temsil edilen grubu diziye dönüştürüp ardışık öğeleri
		 * anahtar değer şeklinde yeniden yapılandırıp döndürür.
		 * 
		 * @return {Object}
		 */
		this.assoc = function()
		{
			return assoc( this.toArray());
		}

		/**
		 * Her bir grubu verilen metoda geçen bir döngü oluşturur. Callback'ten
		 * false dönerse durur.
		 * 
		 * @param {Function} callback her bir grubu alacak bir metot
		 */
		this.each = function( callback )
		{
			var groups = this.toArray();

			for( var i = 0; i < groups.length; i++ )
			
				if( callback.call( root, groups[ i ]) === false )

					return;
		}

		/**
		 * Her bir grubu verilen callback'e geçip bundan dönen veriyi o
		 * grubun üzerine yazar. Geriye bu sınıfı döndürür.
		 * 
		 * @param {Function} callback her bir grubu alıp işleyecek bir metot
		 * @return {this}
		 */
		this.map = function( callback )
		{
			var groups = this.toArray();

			for( var i = 0; i < groups.length; i++ )
			
				groups[ i ] = callback.call( root, groups[ i ]);
			
			this.haystack = groups.join( this.seperator );

			return this;
		}

		/**
		 * Her bir grubu verilen callback'e geçip bundan dönen değeri o
		 * grubun yerine yazar. Eğer callback bir değer döndürmeyecek
		 * olursa veya undefined değer döndürürse o grup listede olmaz.
		 *
		 * Bu metot orijinal veri üzerinde işlem yapmaz. Geriye döndürdüğü
		 * değer yeni değerlerle oluşturulmuş bir StringGroup türünde
		 * nesnedir.
		 * 
		 * @param {Function} callback grupları işleyip filtreleyecek bir metot
		 * @return {StringGroup}
		 */
		this.reduce = function( callback )
		{
			var reduced = '';
			var groups = this.toArray();

			for( var i = 0; i < groups.length; i++ )
			{
				var r = callback.call( root, groups[ i ]);

				if( r !== undefined )

					reduced.push( r );
			}

			return new StringGroup( reduced.join( this.seperator ), this.seperator );
		}

		/**
		 * Her bir grubu verilen callback'e geçirip true yanıtını bekler. Bunu
		 * alırsa o adımdaki grup değeri buradan geriye döndürülür. Bu olmadıkça
		 * döngü son gruba kadar devam eder.
		 * 
		 * @param {Function} callback her bir grubu alıp arama yapacak metot
		 * @return {String|undefined}
		 */
		this.search = function( callback )
		{
			var groups = this.toArray();

			for( var i = 0; i < groups.length; i++ )
			
				if( callback.call( root, groups[ i ]) === true )

					return groups[ i ];
		}

		/**
		 * Verilen ayırıcı karakteri mevcut olanla değiştirir.
		 * 
		 * @param {String} seperator yeni bir ayırıcı karakter
		 * @return {this}
		 */
		this.format = function( seperator )
		{
			this.haystack = this.haystack.split( this.seperator ).join( seperator );
			this.seperator = seperator;

			return this;
		}

		/**
		 * Temsil edilen ifadenin son halini döndürür.
		 * @return {String}
		 */
		this.toString = function()
		{
			return this.haystack;
		}
	}
});
