define( function()
{
	/**
	 * Kuyruklama arayüzü oluşturur. Array yerine javascript'in doğal bir
	 * davranışı olan nesne eşitlemesinde nesneyi değil referansını kopyalama
	 * işleyişini kullanarak sıra düzenini tuttuğu için array metotları olan
	 * pop, shift gibi hantal değildir. Her item kendinden önceki ve sonraki
	 * item için bir referans linki tuttuğu için işleyiş array sistemine göre
	 * daha performanslıdır.
	 */
	return window.Queue = function Queue()
	{
		// new operatörü kullanılmamışsa biz
		// burada kullanıp geriye bunu döndürelim
		if( ! ( this instanceof Queue ))

			return arguments.length
				? new Queue( arguments )
				: new Queue;

		var root = this;

		/**
		 * Kuyruk öğelerini tutar.
		 * @type {Object}
		 */
		this.pool = {}

		/**
		 * Kuyruğun son öğesine refere eder.
		 * @type {Object}
		 */
		this.last = null;

		/**
		 * Kuyruğun ilk öğesine refere eder.
		 * @type {Object}
		 */
		this.first = null;

		/**
		 * Kuyruktaki öğe sayısı.
		 * @type {Number}
		 */
		this.length = 0;

		/**
		 * Kuyruğa şimdiye kadar eklenmiş öğe sayısı.
		 * @type {Number}
		 */
		this.total = 0;

		/**
		 * Kuyruğa eklenecek bir öğeyi tutması gereken meta
		 * bilgilerle donatarak bir node haline getirir.
		 * 
		 * @param {Mixed} value öğe
		 * @return {Object}
		 */
		this.makeNode = function( value )
		{
			return {
				index: this.total,
				value: value,
				prev: null,
				next: null
			}
		}

		/**
		 * Pozisyon numarası verilen öğeyi döndürür. Öğe mevcut değilse ölümcül
		 * hata fırlatır.
		 * 
		 * @param {Number} index öğe adı/pozisyonu
		 * @return {Mixed}
		 */
		this.get = function( index )
		{
			var item = this.pool[ index ];

			if( item === undefined )

				throw Error( 'Unknown linked list index: ' + index );

			return item.value;
		}

		/**
		 * Pozisyonu verilen öğenin değerini değiştirir. Öğe mevcut değilse ölümcül
		 * hata fırlatır.
		 * 
		 * @param {Number} index yazılacak öğe konumu
		 * @param {Mixed} value öğeye yazılacak herhangi bir değer
		 * @return {Queue}
		 */
		this.set = function( index, value )
		{
			var item = this.pool[ index ];

			if( item === undefined )

				throw Error( 'Unknown linked list index: ' + index );

			item.value = value;

			return this;
		}

		/**
		 * Kuyruğun sonuna bir öğe ekler.
		 * 
		 * @param {Mixed} value kuyruğa eklenecek data
		 * @return {Queue}
		 */
		this.append = 
		this.push = 
		this.add = function( value )
		{
			// öğeye iç alanda benzersiz bir isim verelim
			var index = this.total;

			// öğeyi kendi adıyla havuza bir property olarak ekleyelim
			this.pool[ index ] = this.makeNode( value );

			// öğe havuzda ancak hangi sırada olduğu belirsiz
			// kuyruğa ilk defa bir öğenin eklendiği durumu handle edelim
			if( this.length <= 0 )

				// kuyrukta tek eleman varsa haliyle
				// ilk ve son eleman bu öğe olacaktır
				this.first =
				this.last = this.pool[ index ];

			// öğeyi push ettik yani kuyruğun en sonuna ekledik
			// bu yüzden artık kuyruğun son öğesi artık bu öğe
			else if( this.last )
			{
				// eklediğimiz öğeden önceki öğe olarak son elemanı linkleyelim
				this.pool[ index ].prev = this.last;

				// en son bu kısım çalışacak, artık kuyruğun
				// son öğesi az önce eklemiş olduğumuz öğe olsun
				this.last =
				// önce bu kısım çalışacak, bilinen son öğenin sağındaki
				// öğe olarak şimdi eklenen öğeyi referanslayalım
				this.last.next = this.pool[ index ];
			}

			// kuyruktaki öğe sayısını güncelleyelim
			this.length++
			this.total++

			// zincirleme metot kullanımı için kendimizi döndürelim
			return this;
		}

		/**
		 * Kuyruğun en başına bir öğe yerleştirir.
		 * 
		 * @param {Mixed} value kuyruğa eklenecek data
		 * @return {Queue}
		 */
		this.prepend = 
		this.unshift = function( value )
		{
			// öğeye iç alanda benzersiz bir isim verelim
			var index = this.total;
			
			// öğeyi kendi adıyla havuza bir property olarak ekleyelim
			this.pool[ index ] = this.makeNode( value );

			// öğe havuzda ancak hangi sırada olduğu belirsiz kuyruğa
			// ilk defa bir öğenin eklendiği durumu handle edelim
			if( this.length <= 0 )

				// kuyrukta tek eleman varsa haliyle
				// ilk ve son eleman bu öğe olacaktır
				this.first =
				this.last = this.pool[ index ];

			// öğeyi prepend ettik yani kuyruğun en başına ekledik
			// bu yüzden artık kuyruğun ilk öğesi artık ilk öğe değil
			else if( this.first )
			{
				// eklediğimiz öğenin sağında şuan en başta bulunan öğe kalacak
				this.pool[ index ].next = this.first;

				// son olarak bu kısım çalışacak, artık kuyruğun
				// ilk öğesi az önce eklemiş olduğumuz öğe olsun
				this.first =
				// önce bu kısım çalışacak, bilinen ilk öğenin solundaki
				// öğe olarak şimdi eklenen öğeyi referanslayalım
				this.first.prev = this.pool[ index ];
			}

			// kuyruktaki öğe sayısını güncelleyelim
			this.length++
			this.total++

			// zincirleme metot kullanımı için kendimizi döndürelim
			return this;
		}

		/**
		 * Kuyruğun sonundaki öğeyi kuyruktan çıkarıp döndürür.
		 * @return {Mixed}
		 */
		this.pop = function()
		{
			// hiç eleman yoksa işleme gerek yok
			if( this.length == 0 )

				return undefined;

			// döndüreceğimiz öğenin referansını sınıfın last
			// özelliğinde tutuyorduk bunu bir kenara alalım
			var r = this.last;
			// bu son öğe gidince onun yerine onun solunda bulunan
			// yani ondan önce gelen öğe geçecek onu da alalım
			var candidate = ( this.last && this.last.prev ) || null;

			// last öğe yoksa işleme gerek yok
			if( ! r )

				return undefined;

			// bir veliahtımız yoksa ancak ilk öğe tanımlıysa
			// veliahtımız haliyle bu ilk öğe olacak
			if( ! candidate && this.first )

				candidate = this.first;

			// kuyruğun son öğesini havuzdan kaldıralım
			delete this.pool[ r.index ];

			// öğe sayısını azaltalım
			this.length--
			// kuyruğun son elemanını bulduğumuz
			// veliaht olarak refere edelim
			this.last = candidate;

			// veliaht olarak son öğeden önceki bir öğeyi seçtik
			// bu kesin ancak bu durumda bu veliaht sağ tarafında
			// önceden atanan bir referansa sahip olacaktır ki
			// veliaht artık son öğe olduğu için kendi sağında öğe
			// olamaz bunu temizleyelim
			if( this.last )

				this.last.next = null;

			// son pop işlemi sonucunda kuyrukta hiç öğe
			// kalmamış olabilir bu durumda ilk ve son
			// öğeleri tutan property'leri sıfırlayalım
			if( this.length == 0 )

				this.first = 
				this.last = null;

			// son öğeyi dönelim
			return r.value;
		}

		/**
		 * Kuyruğun en başındaki öğeyi kuyruktan çıkartarak döndürür.
		 * @return {Mixed}
		 */
		this.shift = function()
		{
			if( this.length == 0 )

				return undefined;

			var r = this.first;
			var candidate = this.first.next || null;

			// last öğe yoksa işleme gerek yok
			if( ! r )

				return undefined;

			delete this.pool[ r.index ];

			if( ! candidate && this.last )

				candidate = this.last;

			this.length--
			this.first = candidate;

			if( this.first )

				this.first.prev = null;

			if( this.length == 0 )

				this.first = 
				this.last = null;

			return r.value;
		}

		/**
		 * Verilen değer ile birebir eşleşen ilk elemanın konumunu döndürür. Eşleşme
		 * bulunamazsa -1 değeri döndürülür. Teoride birden fazla eşleşme imkanı olsa bile
		 * ilk karşılaşılan eşleşme döndürülür.
		 * 
		 * @param {Mixed} value herhangi bir değer
		 * @return {Number}
		 */
		this.indexOf = function( value )
		{
			var r;

			this.map( function( index, val )
			{
				if( val == value )
				{
					r = index;
					return false;
				}
			});

			return r !== undefined
				? r
				: -1;
		}

		/**
		 * Verilen regular expression desenini eleman değerleri üzerinde test eder. Eşleşme
		 * bulursa [{index: Number, position: Number}] yapısında bir dizi döndürür. Hiç eşleşme
		 * bulamazsa -1 değeriyle döner. Eşleştirmeler string veya string'e dönüştürülebilir
		 * türden değerler tutan elemanlar üzerinde gerçekleşir. Böyle bir değere sahip
		 * olmayan elemanlar pas geçilir.
		 * 
		 * @param {RegExp} pattern düzenli ifade
		 * @return {-1|Array}
		 */
		this.search = function( pattern )
		{
			var result = [];
			var position;

			this.map( function( i, val )
			{
				if(( position = val.toString().search( pattern )) > -1 )

					result.push(
					{
						index: i,
						position: position
					});
			});

			return result.length
				? result
				: -1;
		}

		/**
		 * Kuyruktaki öğeleri baştan başlayıp tek tek verilen callbacke geçirir.
		 * 
		 * @param {Function} callback öğelerin geçirileceği bir callback(sıra no, düğüm değeri)
		 * @return {Queue}
		 */
		this.map =
		this.each = 
		this.foreach = function( callback )
		{
			// callback yoksa işlem yok
			if( ! callback || ! ( callback instanceof Function ))

				return this;

			// hiç eleman yoksa işlem yok
			if( this.length == 0 )

				return this;

			var current = this.first;

			do
			{
				// false döndürüldüğünde bunu döngüyü kır olarak yorumlayacağız
				if( callback( current.index, current.value ) === false )

					break;
			}
			while( current = current.next );

			return this;
		}

		/**
		 * Kuyruktaki tüm öğeleri stringe dönüştürüp
		 * birleştirir ve döndürür.
		 *
		 * @param  {String} divider iki öğe arasına yerleştirilmek istenen bir karakter kümesi
		 * @return {String}
		 */
		this.join = 
		this.implode = function( divider )
		{
			var r = '';
			divider = divider || '';

			this.map( function( i, value )
			{
				r += divider + value.toString();
			});

			return r.substr( divider.length );
		}

		// kurucuya direkt parametreler verilmişse her birini
		// öğe kabul edip listeye ilave edelim
		var args = Array.prototype.slice.call( arguments );

		// ilk öğe array değil de hala arguments ise kütüphane new operatörü
		// kullanılmadan çalıştırıldığı için kendi içimizde bunu bertaraf
		// ettiğimizde bu durumla karşılaşırız bu yüzden bir kontrol daha yapalım
		if( args[ 0 ] && args[ 0 ].callee && args[ 0 ].callee == Queue )

			args = Array.prototype.slice.call( args[ 0 ]);

		// parametreleri dönelim
		args.map( function( i )
		{
			// parametreyle örneklemede varsayılan
			// işlem kuyruğa push etmek olsun
			root.append( i );
		});
	}
});
