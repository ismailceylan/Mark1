define( function()
{
	/**
	 * Browserda veri saklamayı sağlar. Browser destekliyorsa html5 storage apisini,
	 * desteklemiyorsa cookie kullanır. Veri saklanırken Cookie limitlerini düşünmek
	 * gerekmez, cookie limitini aşan veriler sıralı biçimde başka çerezlere bölünür
	 * okunurken tek parça olarak tekrar döndürülür.
	 * 
	 * @param  {String} name veriyi tutacak değişken adı
	 * @return {Function}    geriye, adı verilen değişkene özel çalışacak fonksiyonelliği tutan bir nesne döner
	 */
	return window.Keep = function Keep( name )
	{
		// ana etki alanı
		var root = this;

		// kütüphane fonksiyon olarak çalıştırılmamalı, örneklenmeli
		if( ! ( this instanceof Keep ))

			return new Keep( name );

		/**
		 * Sistemin html5 storage mimarisi destekleyip desteklemediği.
		 * @type {Boolean}
		 */
		this.isHTML5 = window.Storage? true : false;

		/**
		 * Saklama noktası olarak cookie kullanılacağı zaman çerez başına
		 * aşılmaması gereken byte cinsinden bir limit değeri. 4kb değerini
		 * aşmaması tavsiye edilmektedir.
		 * 
		 * @type {Integer}
		 */
		this.cookie_limit = 3.8 * 1024;

		/**
		 * Bir veriyi saklar.
		 * 
		 * @param {Mixed} data saklanacak veri
		 * @param {Integer} ttl verinin ömrü (varsayılanı 5 yıldır)
		 * @param {Boolean} overwrite veri mevcutsa üzerine yazılıp yazılmayacağı
		 */
		this.it = function( data, ttl, overwrite )
		{
			// veri zaten mevcutsa ve üzerine yazma kapalıysa (soft mode)
			// işlem yapmamıza gerek yok çıkacağız
			if( this.me() && overwrite === false )

				return;

			// html5 destekleniyorsa oraya yazalım
			if( this.isHTML5 )
			{
				var node = {};
					
					// life
					if( ttl )

						node.l = ttl;
					
					// birth
					node.b = Math.round(( new Date()).getTime() / 1000 );
					// user data
					node.d = data;

				try
				{
					localStorage.setItem( name, JSON.stringify( node ));
				}
				catch( e )
				{
					console.error( 'Local Storage is overloaded.' );
				}
			}
			// çereze bilgi yazarak işlemimizi halledelim
			else
			{
				var now     = new Date();
				var expires = ttl? ttl * 1000 : ( 5 * 52 * 7 * 24 * 60 * 60 ) * 1000;
					now.setTime( now.getTime() + expires );
					expires = now.toUTCString();

				// bu isimdeki çerez ve partlarını tamamen silelim
				this.not();

				// veri bir çerez boyunu aşıyorsa çerezi kaç parçada saklayacağız bulalım
				var total_parts = Math.ceil( data.length / this.cookie_limit );

				for( var i = 0; i < total_parts; i++ )
				{
					sliced  = data.substr( i * this.cookie_limit, this.cookie_limit );
					cname   = name + '-' + i;
					cdata   = '=' + sliced + '; ';
					expires = 'expires=' + expires;

					document.cookie = cname + cdata + expires;
				}
			}
		}

		/**
		 * Saklanan veri ömrü dolmamışsa döndürülür, döndürülecek veri yoksa null döner.
		 * @return {Mixed} [String|NULL]
		 */
		this.me = function()
		{
			if( this.isHTML5 )
			{
				var data  = localStorage.getItem( name );

				if( data == null )

					return null;

				data = JSON.parse( data );

				if( data.l )
				{
					var now  = ( new Date ).getTime() / 1000;
				
					if( data.b + data.l < now )
					{
						localStorage.removeItem( name );
						return null;
					}
				}

				return data.d;
			}
			else
			{
				// tüm çerezleri browserdan alalım
				var cookies = document.cookie.split( ';' );

				// hiç çerez yoksa işi uzatmıyoruz
				if( cookies.length == 0 ) return null;

				// şimdi adı verilen çerez tek parçadan oluşmuyor olabilir
				// tüm parçalarını okuyalım
				var data = '';

				cookies.map( function( cookie, i )
				{
					keypairs = cookie.trim().split( '=' );
					cname    = keypairs.shift();
					value    = keypairs.join( '=' );

					// çerez bizim aradığımız ise değerini toparlayalım
					if( cname.substr( 0, name.length ) == name )

						data += value;
				});

				return data == ''? null : data;
			}
		}

		/**
		 * Değişkeni saklama alanından kaldırır.
		 */
		this.not = function()
		{
			if( this.isHTML5 )
			{
				localStorage.removeItem( name );
			}
			else
			{
				// tüm çerezleri browserdan alalım
				var cookies = document.cookie.split( ';' );

				// hiç çerez yoksa işi uzatmıyoruz
				if( cookies.length == 0 ) return null;

				cookies.map( function( cookie, i )
				{
					keypairs = cookie.trim().split( '=' );
					cname    = keypairs.shift();
					value    = keypairs.join( '=' );

					// çerez bizim aradığımız ise silelim
					if( cname.substr( 0, name.length ) == name )

						document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
				});
			}
		}
	}
});
