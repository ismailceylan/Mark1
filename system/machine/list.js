define( function()
{
	/**
	 * Listeler oluşturur.
	 * 
	 * @param  {String} namespace listenin ana adı, elemanlar bu isim altında toplanır
	 * @param  {String} mode      liste mevcutsa ne yapılacağını söyler [once|undefined]
	 * @param  {String} hidden    true gelirse liste oluşturulur ancak ana window nesnesine eklenmez yerel kullanım için idealdir
	 */
	return window.List = function List( namespace, mode, hidden )
	{
		// tüm listeleri tutacak olan nesne tanımlı değilse oluşturalım
		if( ! window.lists )

			window.lists = { length: 0 }

		// etki alanını yedekleyelim
		var root = this;

		/**
		 * Atanan isim alanını scope içine de kopyalayalım
		 * @type {String}
		 */
		this.namespace = namespace

		/**
		 * İsim alanı altındaki elemanların sıralamasını tutar.
		 * @type {Array}
		 */
		this.items = [];

		/**
		 * Elemanları tutar.
		 * @type {Object}
		 */
		this.list = {};

		/**
		 * Bu isim alanı altında kaç eleman olduğu bilgisini tutar.
		 * @type {Number}
		 */
		this.length = 0;

		/**
		 * Liste elemanları arasında sırayla ilerleme sağlanabilmesi için gereken
		 * bayrak tutucu değişkendir.
		 * @type {Number}
		 */
		this.cursor = 0;

		/**
		 * Cursor'ın listenin sonunda olup olmadığını söyler.
		 * @type {Boolean}
		 */
		this.eol = false;

		/**
		 * Cursur'ın listenin başında olup olmadığını söyler.
		 * @type {Boolean}
		 */
		this.sol = true;

		/**
		 * Cursor pozisyonuna bakarak listenin başında ve sonunda olma durumlarını
		 * tutan değişkenleri günceller. Liste başı ve sonunu ayarlamak yeterli,
		 * listenin ortalarında olduğumuzu tespit etmek için liste sonu ve liste başı
		 * false değer veriyorsa listenin ortalarındayız demektir.
		 */
		this.calc_cursor = function()
		{
			// cursor eleman sayısından fazla veya eşitse liste sonundayız demektir
			if( this.cursor >= this.length - 1 )
			{
				this.eol = true;
				this.sol = false;
			}
			// cursor, sıfıra eşit veya küçükse liste başındayız demektir
			else if( this.cursor <= 0 )
			{
				this.eol = false;
				this.sol = true;
			}
		}

		/**
		 * Listenin başına bir eleman ekler.
		 * 
		 * @param  {String} name listeye eklenecek elemanın ismi
		 * @param  {mixed}  item liste sonuna eklenecek herhangi bir veri
		 * @param  {Number} life öğenin yaşam süresini ayarlar süresi dolan değer döndürülmez
		 * @return {Boolean}
		 */
		this.prepend = function( name, item, life )
		{
			// eleman önceden tanımlanmamışsa tanımlayacağız
			if( ! this.list[ name ])
			{
				this.list[ name ] =
				{
					value: item,
					birth: ( new Date ).getTime(),
					life: life || 0
				}
				
				this.items.unshift( name );
				this.length++

				return true;
			}

			return false;
		}

		/**
		 * Listenin sonuna bir eleman ekler.
		 *
		 * @param  {String} name listeye eklenecek elemanın ismi
		 * @param  {mixed}  item liste sonuna eklenecek herhangi bir veri
		 * @param  {Number} life öğenin yaşam süresini milisaniye cinsinden ayarlar, süresi dolan değer döndürülmez
		 * @param  {String} onConflict çakışma durumunda izlenecek yöntem [rename,overwrite,skip]
		 * @return {Boolean}
		 */
		this.append = function( name, item, life, onConflict )
		{
			// gönderilen parametreleri analiz edip yeniden anlamlandıralım
			if( name && ! item )
			{
				// direkt listeye eklenecek eleman isimsiz olarak gönderilebilir
				// bu durumda isim alanındaki eleman değerini item değişkenine
				// atıp kendimiz bir isim üreteceğiz ve listede başka eleman
				// bunu kullanmamalı
				item = name;
				name = 'item-' + this.items.length;
			}

			// itemi kaydedilebilir formatına sokalım
			item =
			{
				value: item,
				birth: ( new Date ).getTime(),
				life: life || 0
			}

			// eleman önceden tanımlanmamışsa tanımlayacağız
			if( ! this.has( name ))
			{
				this.list[ name ] =	item;
				this.items.push( name );
				this.length++

				return true;
			}
			else
			{
				// eleman tanımlı, bu aşamada çakışma durumunda
				// izlenecek yöntemleri handle etmeye başlayabiliriz
				if( onConflict == 'overwrite' )
				{
					// çakışma durumunda mevcut olanın üzerine yazacağız
					this.list[ name ] = item;
				}
				else if( onConflict == 'rename' )
				{
					// çakışma durumunda yeni nesne adını benzersiz bir isimle kaydedeceğiz
					name += '-' + this.items.length;
					
					this.list[ name ] = item;
					this.items.push( name );
					this.length++
				}
			}

			return false;
		}

		/**
		 * Adı verilen elemanı hayattaysa döndürür. Ömrü dolmuşsa listeden siler ve döndürmez. Eleman
		 * bulunamazsa undefined döner.
		 * 
		 * @param  {String} name döndürülecek elemanın adı
		 * @return {mixed}
		 */
		this.get = function( name )
		{
			// isim tanımsız ise tüm elemanları array olarak döndürelim
			if( name == undefined )
			{
				var r = [];

				this.items.map( function( item )
				{
					r.push( root.list[ item ].value );
				});

				return r;
			}
			// numara verilmişse bunu index numarası kabul edelim
			else if( typeof( name ) == 'number' )
			{
				name = 'item-' + name;

				if( this.has( name ))

					return this.list[ name ].value;
			}
			// isim tanımlıysa ilgili ismi arayacağız
			else if( typeof( name ) == 'string' )
			{
				// istenen eleman mevcutsa işleme geçelim yoksa veya ömrü bitmişse
				// has metodu durumla ilgilenecektir
				if( this.has( name ))
				{
					item = this.list[ name ];

					// eleman hala hayatta olduğu için değerini döndürebiliriz
					return item.value;
				}
			}
		}

		/**
		 * Verilen isim veya pozisyondaki elemanı siler.
		 * 
		 * @param  {mixed} item eleman adı veya pozisyonu
		 * @return {Boolean}
		 */
		this.remove = function( item )
		{
			var name;

			// eleman adı verilmişse isim olarak silelim
			if( typeof( item ) == 'string' )
			{
				name = item;
			}
			else if( typeof( item ) == 'number' )
			{
				name = this.items[ item ];
			}

			// silinecek elemanın adını bulduğumuza göre eleman listede
			// mevcutsa sileceğiz
			if( el = this.get( name ))
			{
				// eleman listede mevcut silinemezse false dönelim
				if( ! delete el ) return false;

				// bu satıra gelinmişse başarılı olmuşuz demektir true dönelim
				return true;
			}

			// bu satıra gelinmişse istenen eleman listede bulunamamış demektir
			return false;
		}

		/**
		 * Listede cursor'ın işaret ettiği indexten bir sonrakini döndürür. Zaten son elemana
		 * gelinmiş ve next çağrılmışsa undefined döner.
		 * 
		 * @return {mixed}
		 */
		this.next = function()
		{
			var r = undefined;

			// öncelikle cursor'ı sonraki konuma taşıyalım
			this.cursor++

			// istenen elemanın konumu eleman sayısından az ise
			if( this.cursor <= this.length - 1 )
			{
				r = this.list[ this.items[ this.cursor ]].value;
			}
			// istenen pozisyon eleman sayısından fazlaysa aralık dışı istek olduğu için cursorı
			// tekrar bir geri alacağız
			else
			{
				this.cursor--
			}

			// liste başı-sonu durumlarını güncelleyelim
			this.calc_cursor();

			return r;
		}

		/**
		 * Listede cursor'ın işaret ettiği indexten bir öncekini döndürür. Zaten ilk elemana
		 * gelinmiş ve prev çağrılmışsa undefined döner.
		 * 
		 * @return {mixed}
		 */
		this.prev = function()
		{
			var r = undefined;

			// öncelikle cursor'ı 1 geri konuma taşıyalım
			this.cursor--

			// istenen elemanın konumu sıfırıncı elemandan az olamaz
			if( this.cursor < 0 )
			{
				this.cursor++
			}
			// istenen elemanın konumu sıfırdan büyük ise değer döndürebiliriz eleman sayısını
			// aşma korkumuz yok çünkü cursor geri doğru gidiyor
			else
			{
				r = this.list[ this.items[ this.cursor ]].value;
			}
			
			// liste başı-sonu durumlarını güncelleyelim
			this.calc_cursor();

			return r;
		}

		/**
		 * Listenin sonundaki elemanı döndürüp listeden kaldırır.
		 * 
		 * @return {mixed} listenin son elemanı döndürülür
		 */
		this.pop = function()
		{
			var value = this[ name = this.items.pop( )].value;

			delete this.list[ name ];

			this.length--;
			this.calc_cursor();

			return value;
		}

		/**
		 * Listenin başındaki elemanı döndürüp listeden kaldırır.
		 * 
		 * @return {mixed} listenin ilk elemanı döndürülür
		 */
		this.shift = function()
		{
			var value = this.list[ name = this.items.shift( )].value;

			delete this.list[ name ];

			this.length--;
			this.calc_cursor();

			return value;
		}

		/**
		 * Listenin tüm elemanlarını dönerek ilgili callback'a aktarır ve listeden
		 * kaldırır. Listenin hangi tarafından başlanacağı belirtilmelidir.
		 *
		 * @param  {String}   from  elemanların listenin hangi tarafından getirilmeye başlanacağı [asc|desc]
		 * @param  {Function} cback elemanların gönderileceği işlev
		 * @return {void}
		 */
		this.flush = function( from, cback )
		{
			var now = ( new Date ).getTime();

			while( this.items.length > 0 )
			{
				var pos   = from == 'asc'? 'shift' : 'pop';
				var name  = this.items[ pos ]();
				var item  = this.list[ name ];

				if( item )
				{
					// istenen eleman mevcut, ömür verilmişse ömrü dolmuş mu bakalım
					// ömür verilmemişse döndürebiliriz başka kontrole gerek yok
					if( item.life == 0 || item.birth + item.life + 1 >= now )
					{
						cback.call( item.value );
						//delete this.items[ name ];
						this.length--
					}
				}	
			}
		}

		/**
		 * Listenin tüm elemanlarını verilen callbacka göndererek çalıştırır. Flush metodundan
		 * farkı başlangıç tarafı varsayılan olarak ilk elemandan sonuncuya doğrudur. Ayrıca
		 * elemanlar listeden silinmez.
		 * 
		 * @param {Function} {cback} liste elemanının gönderileceği anonim metod
		 */
		this.each = function( cback )
		{

			var now = ( new Date ).getTime();

			this.items.map( function( item, i )
			{
				var item = root.list[ item ];

				if( item )
					
					// istenen eleman mevcut, ömür verilmişse ömrü dolmuş mu bakalım
					// ömür verilmemişse döndürebiliriz başka kontrole gerek yok
					if( item.life == 0 || item.birth + item.life + 1 >= now )
					
						cback.call( item.value, i );
			});
		}

		/**
		 * Adı verilen eleman listedeyse true değilse false döner. Elemanın ömrü varsa ve dolmuşsa
		 * listeden kaldırılır ve yokmuş gibi false döner.
		 * 
		 * @param  {Mixed} name kontrol edilecek elemanın adı veya pozisyonu
		 * @return {Boolean}
		 */
		this.has = function( name )
		{
			var el;

			// isim değil de numara gönderilmişse belli bir index isteniyor demektir
			if( typeof( name ) == 'number' )
			{
				// ilgili indexte bir eleman mevcut ise bakalım
				if( this.items[ name ])
				{
					el = this.list[ this.items[ name ]];
				}
			}
			else
			{
				el = this.list[ name ];
			}

			// istenen isimde veya pozisyonda bir element yoksa işleme gerek yok
			// false dönebiliriz
			if( el == undefined ) return false;

			// eleman tanımlı ve ömür tanımlanmış, bakalım doldmuş mu
			if( el.life )
			{
				if( el.life + el.birth <= ( new Date ).getTime( ))
				{
					delete el;
					return false;
				}
			}

			// eleman tanımlı ve ömür tanımlanmamışsa direkt true dönebiliriz
			return true;
		}

		/**
		 * İsim alanını boş hale getirir.
		 */
		this.empty = function()
		{
			this.items.map( function( item, i )
			{
				delete root.list[ item ];
				root.length--
			});

			this.items = [];
		}

		/**
		 * Kurulumu gerçekleştirir.
		 */
		this.init = function()
		{
			// isim alanının eğer mevcutsa önceki örneği isteniyor, yani tek örnek ile
			// çalışmak istenmişse bunu sağlayalım
			if( mode == 'once' && window.lists[ namespace ] && ! hidden )

				return window.lists[ namespace ];

			// isim alanı kullanıma müsait değilse bu scopetan ayrılıp
			// yeni belirlediğimiz isim alanı üzerinden yürüyeceğiz
			if( window.lists[ namespace ] && ! hidden )
			{
				// isim alanı daha önce kullanılmış. constructor ve closure yapılarıyla
				// çalıştığımız için bu durum sorun değil ancak eski namespace üzerine
				// yazmamak için bu yeni girişimi eskisinden ayıracağız ancak bu durumu
				// 3. partiler bilmeyecek, yani iki ayrı eklenti örneğin "test" isimli
				// alanı kullanabiliyor olacaklar, bu alanların çakışmasını önleyecek şey
				// new operatörüyle kurucunun örneğini istemeleri olacak böylece biz içeride
				// aynı isim alanlarını birbirinden ayırıp farklı alanlara yazarken dışarıdaki
				// eklentiler bunu düşünmeyecek çünkü closure ları farklı. new operatörü
				// kullanılmadan kurulum yapılsa bile biz bunu tespit edip onu da kendi
				// içimizde new operatörünü kullanarak bertaraf edeceğiz dolayısıyla
				// işler sorunsuz yürüyebilecek
				namespace      =
				root.namespace = namespace + ( new Date()).getTime();
			}

			// öncelikle yazdığımız bu eklenti kurucu görev üstlenen bir librarydir ve
			// closure alanını kullanır dolayısıyla new operatörüyle çağırılmalıdır
			// ancak biraz esneklik katıp bunu zorunlu tutmayacağız burada tespit edip
			// 3. kullanıcıya hissettirmeden kendimiz halledeceğiz
			if( ! ( this instanceof List ))

				return new List( namespace, mode, hidden );

			if( ! hidden )
			{
				// isim alanımızı temsilen scopu atayalım
				window.lists[ namespace ] = root;

				// ana listeyi güncelleyelim
				window.lists.length++
			}
		}

		// new operatörü kullanılmamışsa vb ihtimallerde init değer döndürdüğü için
		// ondan dönen değeri burada da döndürerek dışarıya iletmemiz gerekiyor
		return this.init();
	}
});
