define( function()
{
	/*
	| -----------------------------------------------------------------------
	| zindex by Ismail CEYLAN
	| -----------------------------------------------------------------------
	| Bu eklentisi, ekran sıralamasını kullanan diğer eklentiler arasında
	| uyum oluşturmak için bir arayüz sağlar.
	|
	| -----------------------------------------------------------------------
	| Kurulum
	| -----------------------------------------------------------------------
	| 
	|
	| -----------------------------------------------------------------------
	| Gereksinimler
	| -----------------------------------------------------------------------
	|
	| Aşağıdaki koşullar script'in çalışması için gereklidir;
	|
	| 1. jQuery 2.1.1
	|
	*/

	/**
	 * Adı verilen isim alanına özel çalışacak
	 * bir zindex yönetim arayüzü sağlar.
	 * 
	 * @param {String} namespace bir isim alanı
	 */
	return window.Zindex = function Zindex( namespace )
	{
		// isim alanları listesini window nesnesi üzerinde
		// tutacağız henüz değişken tanımlı değilse bu ilk
		// istek demektir oluşturalım
		if( ! window.zindexes )

			window.zindexes =
			{
				length: 0,
				items: []
			}

		// isim alanı zaten listedeyse oradaki örneği döndürelim
		if( window.zindexes[ namespace ])

			return window.zindexes[ namespace ];

		/**
		 * Ana etki alanı
		 * @type {zindex}
		 */
		var root = this;

		/**
		 * Kullanıcı tanımlı isim alanı.
		 * @type {String}
		 */
		this.namespace = namespace;

		/**
		 * İki isim alanı arasında olması istenen uzaklık. Her
		 * isim alanı bu değerden 1 noksanı kadar pozisyon kullanabilir.
		 * 
		 * @type {Number}
		 */
		this.range = 10;

		/**
		 * Şu ana kadar z-index uzayından yer ayırtmış eklentilere
		 * de yer bırakmak amacıyla başlangıç sırası.
		 * 
		 * @type {Number}
		 */
		this.base = ( window.zindexes.length + 1 ) * this.range;

		/**
		 * İsim alanının üst sınırı.
		 * @type {Number}
		 */
		this.top = this.base + this.range - 1;

		/**
		 * Atlama veya geri sarmalarla birlikte ulaşılan son değeridir.
		 * Başlangıcı mantıken isim alanının başladığı nokta olmalıdır.
		 * 
		 * @type {Number}
		 */
		this.current = this.base;

		/**
		 * Bizden sonraki isim alanının başlangıç pozisyonu.
		 * @type {Number}
		 */
		this.nextdoorStart = this.base + this.range;

		/**
		 * Pozisyonu 1 ileri atar. Ancak bu yapıldığında bir
		 * sonraki isim alanının başlayacağı nokta işgal
		 * edilecekse hiçbir işlem yapmaz.
		 * 
		 * @return {Number}
		 */
		this.next = function()
		{
			if( this.current + 1 >= this.nextdoorStart )

				return this.current;

			// günceli bir arttırabiliriz
			this.current++;
			// callbackleri çalıştıralım
			this.relocate();

			return this.current;
		}

		/**
		 * Pozisyonu 1 geri atar. Zaten kendi hareket
		 * alanının başındaysa işlem yapmaz.
		 * 
		 * @return {Number}
		 */
		this.prev = function()
		{
			if( this.current == this.base )

				return this.current;

			// günceli bir azaltabiliriz
			this.current--;

			// callbackleri çalıştıralım
			this.relocate();

			return this.current;
		}

		/**
		 * Mevcut pozisyonu verilen adım kadar ileri atar. Pozitif
		 * veya negatif bir rakam alabilir. İlgili atlama işlemi
		 * ayrılan hareket alanının alt veya üst limitlerini aşıyorsa
		 * aşılan kısım yok edilir. Yani hesaplama, alt limitin
		 * altındaysa alt limit, üst limiti aşıyorsa üst limit
		 * değerleri aşılmaz.
		 * 
		 * @param  {Number} step atlama yapılacak miktar
		 * @return {Number}
		 */
		this.skip = function( step )
		{
			var c = this.current + step;

			if( c < this.base )

				return this.current = this.base;

			else if( c > this.top )

				return this.current = this.top;

			this.current = c;
			this.relocate();

			return this.current;
		}

		/**
		 * Bu isim alanı için güncel zindex değerini verilen
		 * callbacke geçirir. Ayrıca callback saklar ve bu isim
		 * alanı bir başka isim alanının önüne taşınacak olursa
		 * ilgili callback tekrar işletilir. Böylece tek harekette
		 * bütün arayüzün yapılandırması değiştirilmiş ve değişiklik
		 * arayüze yansıtılmış olur.
		 * 
		 * @param {Function} callback güncel zindex değerini alacak bir işlev
		 */
		this.attach = function( callback )
		{
			// ilk defa bir işlev iliştiriliyorsa
			// callback uzayını tanımlayalım
			if( ! this.attachments )

				this.attachments = [];

			// callbacki listeye ekleyelim
			this.attachments.push( callback );

			// callbacki güncel zindexi
			// alacak şekilde çalıştıralım
			callback( this.current );
		}

		/**
		 * Callback listesinde kayıtlı işlevler mevcutsa tümünü
		 * güncel zindexi alacak şekilde çalıştırır. Bu metod
		 * genellikle isim alanının zindex segmenti değiştirildiğinde
		 * kullanılır.
		 */
		this.relocate = function()
		{
			$( this.attachments || []).each( function()
			{
				this( root.current );
			});
		}

		/**
		 * İsim alanını belirtilen yönde kaydırır. Örneğin ana
		 * listeye bizden önce yer alacak bir isim alanı eklenmiş
		 * olabilir. Böyle bir durumda kendi pozisyon aralığımızı
		 * bir isim alanlık ileriye doğru revize etmemiz gerekir.
		 * Ekleme değil de silinme için de tersini yaparız. Bizden
		 * sonraki sıralamada bir değişiklik olduğunda bize güncelleme
		 * sinyali gelmez, ek bir kontrole gerek yoktur.
		 * 
		 * @param {String} direction revizeyi hangi yönde yapacağımızı söyler [prev|next]
		 */
		this.slide = function( direction )
		{
			// güncellenecek değişken isimlerini toparlayalım tüm
			// değişkenleri bir isim alanının boyu kadar arttırmak 
			// veya azaltmak bu isim alanını ilgili yöne doğru güncellemek demek
			var items = [ 'base', 'top', 'current', 'nextdoorStart' ];

			items.map( function( item, i )
			{
				root[ item ] += direction == 'prev'
					? root.range * -1
					: root.range;
			});

			// listedeki pozisyon numaramızı güncelleyelim
			this.id += direction == 'prev'
				? -1
				:  1;
		}

		/**
		 * Verilen sıra numarasının veya isim alanının istenen
		 * tarafına bu isim alanını taşır. Listenin en sonuna
		 * taşıma yapmak için çok büyük bir rakam yazılabilir.
		 * 
		 * @param {Mixed} target hedef elemanın sıra numarası veya adı [number|string|zindex]
		 */
		this.over = function( target )
		{
			// hedef olarak nesnenin direkt kendisi gönderilmişse
			// object türündeki bu hedeften namespace adını öğrenirsek
			// ana listede bulabiliriz
			target = target instanceof Zindex
				? target.namespace
				: target;

			position = window.zindexes[ target ].id;

			// konumumuz verilen hedef konumdan zaten
			// büyükse taşıma işlemine gerek yok
			if( this.id >= position )

				return;

			// listeyi tek tek gezip yeniden oluşturacağız
			var r = [];

			$( window.zindexes.items ).each( function( i )
			{
				// adım numarası kendi sıra numaramıza
				// gelmişse işlem yapmıyoruz
				if( i == root.id )

					return;

				// hedef konuma geldiğimize göre sıralamanın
				// esas kısmını burada yapacağız
				if( i == position )
				{
					// hedef elemanın önce gelmesi gerektiği
					// için listeye atıyoruz
					r.push( this );
					// hemen peşinden bizim gelmemiz gerektiği 
					// için kendimizi de ekliyoruz
					r.push( root );

					return;
				}

				// bu elemanın özel bir durumu yok sıradan ekleyeceğiz
				r.push( this );
			});

			// sıralaması değiştirilip yeniden birleştirilmiş
			// listeyi ana listeye eşitleyelim
			window.zindexes.items = r;

			// şimdi ana liste elemanlarının aralık değerlerini
			// listedeki yeni sıra numaralarına göre yeniden düzenleyelim
			$( window.zindexes.items ).each( function( i )
			{
				// güncel değeri doğru hesaplamak için net
				// değerini bulmamız lazım bu kendi grubu
				// içindeki hareketidir mesela normalde current
				// 25 ise ve aralık 10 ise currentin kendi grubu
				// içindeki net değeri 5 demektir
				this.current -= this.base;
				// pozisyon numarası ile aralığın çarpımı
				// isim alanının tabanını verir
				this.base = this.range * ( i + 1 );
				// şimdi current değerini yeni tabana
				// göre hesaplayabiliriz yeni tabana
				// currentin net değerini ilave edersek
				// currenti yeni gruba adapte etmiş oluruz
				this.current += this.base;
				// üst limit hesaplama yöntemi değişmez
				// yeni alt limite göre hesaplanabilir
				this.top = this.base + this.range - 1;
				// komşu başlangıcı da aynı yolla hesaplanabilir
				this.nextdoorStart = this.base + this.range;

				this.id = i;

				// kayıtlı tüm callbackleri çalıştıralım
				this.relocate();
			});
		}

		/**
		 * İsim alanını ve değerlerini listeden çıkartır. Listedeki
		 * eleman sayısı azaldığı için bu işlemden sonra yapılacak
		 * yeni bir isim alanı ayırma işleminde pozisyon aralıkları
		 * çakışacaktır çünkü sildiğimiz elemandan sonraki isim
		 * alanları hala eski pozisyon aralıklarına sahiptir. Bu
		 * durumu önlemek için listeden bir isim alanı kaldırıldığında
		 * ondan sonra gelen tüm isim alanlarından kendisini pozisyonlarını
		 * aşağı düşürecek biçimde adapte etmesi istenir.
		 */
		this.terminate = function()
		{
			// döngünün mod durumunu tutar. başlangıçta silinecek
			// elemanı arama modunda çalışır. bu bulunduğu anda
			// silinir ve mod slide olarak değişir. böylece bundan
			// sonraki elemanlara kendini adapte etmeleri için uyarı
			// gönderilebilir
			var mode = 'search';

			// silme işlemini yapabilmek için tüm listeyi dolaşmak zorundayız
			for( var ns in window.zindexes )
			{
				switch( mode )
				{
					case 'search':

						// arama modundayken silmek için aradığımız elemana
						// rastladık ve rastladığımız elemanı başarılı bir
						// şekilde silebilirsek
						if( ns && delete window.zindexes[ ns ])
						{
							// eleman sayısını güncelleyelim
							window.zindexes.length--;
							// modu değiştirelim
							mode = 'slide';
						}

						break;

					case 'slide':

						// silinen elemandan sonrakilere kendilerini geriye
						// doğru güncellemesi için sinyal yolluyoruz
						window.zindexes[ ns ].slide( 'prev' );
						break;
				}
			}
		}

		/**
		 * Eklenti kurulumunu yapar, oluşturulan
		 * isim alanını ana listeye kaydeder.
		 */
		this.init = function()
		{
			// bu isim alanının listedeki sıra numarasını kendi içine yazalım
			this.id = window.zindexes.length;

			// listede bizi temsil eden iki değişken olacak, birisi
			// bizim sıra numaramız yani id değeri, diğeri de bizim
			// namespace değerimiz. bu ikisinden biri listeden istenirse
			// bize ulaşır. diyelim ki listedeki sıramızı değiştirmek
			// istiyoruz geçmek istediğimiz pozisyondaki elemanı geçiçi
			// bir konuma alıp kendimizi yerine yazarız ardından geçici
			// alanda tuttuğumuz elemanı eski yerimize yazarız
			window.zindexes.items.push( this );
			window.zindexes[ namespace ] = this;

			window.zindexes.length++;
		}

		// kurulumu yapalım
		this.init();
	}
});
