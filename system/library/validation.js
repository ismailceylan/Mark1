define(
[
	'i18n!system/language/nls/validation',
	// 'system/helper/object',
	// 'system/helper/date',
	// 'system/helper/string',
	'system/machine/list'
],
function( localize, ObjectHelper, DateHelper )
{
	return function Validation( inputs, rules )
	{
		// etki alanını yedekleyelim
		var root = this;

		/**
		 * Her validation kendi özel ayarlarıyla çalışabilmeli. Bunun
		 * için de hepsinin kendine özel IDsi olmak zorunda. Bu IDyi tutar.
		 * 
		 * @type {Number}
		 */
		this.id = DateHelper.now();

		/**
		 * Kontrol edilecek inputları tutar.
		 * @type {list}
		 */
		this.inputs = {}

		/**
		 * Hata iletilerini tutar.
		 * @type {Object}
		 */
		this.messages = {}

		/**
		 * Ayar listesini tutar.
		 * @type {Object}
		 */
		this.options = Object.assign(
		{
			/**
			 * Hiç kural bulunamazsa uygulanacak kurallar.
			 * @type {String}
			 */
			rules: 'trim',

			/**
			 * Kural sözdiziminde iki kuralı birbirinden ayıran karakter.
			 * @type {String}
			 */
			separator: '|'
		},
		{
			rules: rules
		});

		/**
		 * Kontrol edilecekler listesine yeni bir input ilave eder.
		 *
		 * @param {string} name input adı
		 * @param {mixed} {input} ilave edilecek input
		 */
		this.add = function( name, input )
		{
			this.inputs[ name ] = input;
		}

		/**
		 * Kontrol işlemlerini başlatır. Bir input ismi verilirse sadece ona
		 * özel bir kontrol işlemi ve hata bulursa "error" eventi tetiklenir.
		 * İsim verilmezse kayıtlı tüm inputlar kontrol edilir.
		 *
		 * @param  {String}  {name}   kontrolü yapılacak inputun name parametresi
		 * @param  {Boolean} {silent} true gelirse kontrol işlemi sonucunda herhangi bir olay tetiklenmez
		 * @return {Boolean}
		 */
		this.run = function( name, silent )
		{
			// kurulum yapılsın
			this.init();

			/**
			 * this sözcüğünden inputun DOM referansı alınabildiği sürece
			 * ilgili input için kontrol sürecini başlatan ve olumsuz test
			 * sonuçlarını error nesnesine kaydeden ana metoddur. Geriye birşey
			 * döndürmez. Sonuçları error nesnesinden istememiz gerekir.
			 */
			var worker = function( name, input )
			{
				var rules;
				var value = input.value;
				var def = input.default;
				
				name = input.name;

				// inputa uygulanacak kural kümesini elde edelim
				rules = ( rules = input.rules )
					? rules
					: root.options.rules;

				// her kural bir dizi elemanı olsun
				rules = rules.split( root.options.separator );

				// validator arayüzü barındırdığı doğrulama metodlarına bir sözdizimini
				// tanıyıp tanımadıklarını sorabilir, komutları ve input verisini validator
				// arayüzüne tek tek teslim edeceğiz, ilgilenen bir metod varsa kontrol işlemi
				// orada başlatılır yoksa işlem yapılmaz
				rules.map( function( rule )
				{
					// kuralı ayrıştırıcı metoda gönderip işlenmesini sağlıyoruz
					if( ! root.validator.exec( rule, value, def ).status )

						// input değeri ilgili rule testinden geçemediği için 
						// hata arayüzüne bir hata ilave ediyoruz
						root.error.add( name, rule );
				});
			}

			// isim verilmişse ilgili isme sahip input için, verilmemişse
			// kaydedilmiş tüm inputlar için kontrol başlatacağız
			if( name !== undefined )
			{
				if( input = this.inputs[ name ])
					
					// worker metodunu inputun bir metoduymuş gibi
					// olmasını yani this sözcüğüyle inputun kendisine
					// erişebilecek şekilde çağıralım
					worker( input.name, input );
			}
			else
				// her input için çalışma yapacağız. this.inputs bir list arayüzü
				// ve her bir elemanı DOM ağacında bulunan native input (veya select vs)
				// elementi. each metodu da her adımında callbacki bu elemanın alt
				// metodu gibi çalıştırır yani callback içinde this sözcüğü bizi direkt
				// ilgili liste elemanına (yani input, select vs her neyse artık) çıkarır
				// bu yüzden worker'ı direkt each metoduna gönderebiliriz
				ObjectHelper.each( this.inputs, worker );

			// tüm inputların tüm kurallarının işlenmesi tamamlandı
			// şimdi error arayüzünden mevcut hata sayısını soralım
			// ve hata mevcutsa validator seviyesinde bir error eventi tetikleyelim
			// bu eventi dinleyen listenerlara error arayüzünün scope'unu 
			// göndereceğiz yani listener ilk parametresinden direkt error
			// arayüzünün iç etki alanına (scope) refere edecek böylece listener
			// içinden each gibi metodlara erişerek az önce kaydedilen hataları tek
			// tek dönmek ve bunlara özel işlem yapmak mümkün olabilecek
			// listener içinde this sözcüğü de validation nesnesi iç etki alanına
			// refere edecek
			if( this.error.length > 0 && ! silent )

				$( root ).trigger( 'error', this.error );

			// hata arayüzünden toplam hata sayısına bakarak genel bir sonuç döndürelim
			return this.error.length == 0;
		}

		/**
		 * Adı verilen kural için bir çeviri cümlesi saklar. Cümleyi işleyip
		 * error olayına göndermek ilgili metodun işidir. Burada bir işlem
		 * yapılmaz.
		 * 
		 * @param {String} rule tercüme edilecek kural adı (required, url vs.)
		 * @param {String} message input adı verilen kuralı sağlayamadığında döndürülecek
		 * uyarı metni (%s ifadesi değişkenleri mesaj içine döşemekte kullanılır başka
		 * biçimlendirme parametresi yoktur sadece %s kullanılıyor)
		 * @return {this}
		 */
		this.translate = function( rule, message )
		{
			// cümleyi direkt saklıyoruz
			this.messages[ rule ] = message;
			return this;
		}

		/**
		 * Doğrulama komutlarını ve bunların yönetim arayüzünü tutan nesne. Komut
		 * sözdizimi, komut yorumlayıcılar ve yeni komutların kaydedilmesini 
		 * sağlayan özellikleri barındırır.
		 * 
		 * @type {Object}
		 */
		this.validator = new ( function()
		{
			// etki alanı
			var self = this;

			/**
			 * Doğrulama işlevlerini tutar. Böylece bu metodlar için güvenli bir
			 * bölge oluşmuş olur ve tek tek gezilmeleri problem oluşturmaz.
			 * 
			 * @type {Object}
			 */
			this.core = 
			{
				/**
				 * Inputun boş olmamasını garanti eder.
				 * @type {Object}
				 */
				required:
				{
					accept: function( rule )
					{
						return rule == 'required';
					},

					control: function( value )
					{
						return value.trim() != '';
					}
				},

				/**
				 * Input verisinin url deseniyle eşleşmesini sağlar.
				 * @type {Object}
				 */
				url: 
				{
					/**
					 * Kabul ettiğimiz bir rule için true veya false döndüren işlevdir.
					 * exec metodu buradan dönen yanıta göre bize veriyi kontrol ettirir 
					 * veya ettirmez. Bir nevi; kuralın sözcüsü gibi görev görür.
					 * 
					 * @param  {String} {rule} kabul edip etmediğimiz sorulan kural sözcüğü
					 * @return {Boolean}
					 */
					accept: function( rule )
					{
						return rule == 'url'
					},

					/**
					 * Kuralın test işlemini yapan metodudur. Kendisine gelen input verisini
					 * test edip geriye true veya false döndürmesi gerekir.
					 * 
					 * @param  {String} {value} kontrol edilecek veri
					 * @return {Boolean}
					 */
					control: function( value )
					{
						return (
							/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/img
						).test( value );
					}
				},

				/**
				 * Input verisinin uzunluğunun istenen sınırlarda olmasını garantiler.
				 * 
				 *   - min-length[4]   = inputun en az 4 karakter içermesini garanti eder.
				 *   - exact-length[4] = inputun tam olarak 4 karakter içermesini garanti eder.
				 *   - max-length[4]   = inputun en fazla 4 karakter içermesini garanti eder.
				 *   
				 * @type {Object}
				 */
				length:
				{
					// dinamik bir rule sözdizimi olduğu için ortak bir regex daha iyi olur
					pattern: /^(min|max|exact)-length\[\s*(\d+)\s*\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result    = this.pattern.exec( rule );
						var condition = result[ 1 ];
						var length    = parseInt( result[ 2 ], 10 );

						switch( condition.toLowerCase())
						{
							case 'min': return value.length >= length;
							case 'max': return value.length <= length;
							case 'exact': return value.length == length;
						}
					}
				},

				/**
				 * Input değerinin numeric olmasını garantiler.
				 * 
				 *   - numeric = inputun kayan noktalı veya tam sayı herhangi bir sayı olmasını garantiler
				 *   - number  = inputun tam sayı olmasını garantiler
				 *   - float   = inputun kayar noktalı bir sayı olmasını garantiler (.2 gibi belirtimler geçerlidir)
				 *   - decimal = float ile aynı özelliği taşır, iki isim birbirinin yerine kullanılabilir
				 *   
				 * @type {Object}
				 */
				numeric:
				{
					accept: function( rule )
					{
						return [ 'numeric', 'float', 'decimal', 'number' ].indexOf( rule ) > -1;
					},

					control: function( value, rule )
					{
						var isNumber = /^[\-|\+]*[0-9]+$/.test( value );
						var isFloat  = /^[\-|\+]*\d*\.(\d+){0,1}$/.test( value );

						switch( rule.toLowerCase())
						{
							case 'number': return isNumber;

							case 'decimal':
							case 'float': return isFloat;
							
							case 'numeric': return isNumber || isFloat;
						}
					}
				},

				/**
				 * Input değerinin integer olmasını garanti eder. Bit
				 * tabanı parametre olarak belirtilebilir.
				 * 
				 *   - uint[8] = 8 bitlik unsigned integer kontrolü yapar. ( 0-256 arasındaki herhangi bir sayı)
				 *   -  int[8] = 8 bitlik   signed integer kontrolü yapar. ( -127 ile +127 arasındaki herhangi bir sayı)
				 *   
				 * @type {Object}
				 */
				integer:
				{
					pattern: /^(u)*int\[(\d+)\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result     = this.pattern.exec( rule );
						var isUnsigned = result[ 1 ] == 'u';
						var base       = parseInt( result[ 2 ], 10 );
						var umax       = Math.pow( 2, base );
						var umin       = 0;
						var smax       = ( umax / 2 ) - 1;
						var smin       = - smax;

						// önce input değeri number mı kontrol edelim
						if( self.core.numeric.control( value, 'number' ))
						{
							value = parseInt( value, 10 );

							// şimdi signed integer için kontrol edelim
							if( ! isUnsigned )
							
								// input değeri signed aralığındaysa test başarılı
								return value >= smin && value <= smax;
							
							// kural unsigned için yazılmış
							return value >= umin && value <= umax;
						}
						else

							// input numeric değil
							return false;
					}
				},

				/**
				 * Input değerinin nümerik ve belirtilen sayıdan büyük veya küçük
				 * olmasını garanti eder. Inputun float veya number olması (yani numeric)
				 * yeterlidir. Bunlardan sadece biri olsun isteniyorsa ayrıca rule
				 * olarak belirtilmelidir.
				 * 
				 *   - greater[-10] = input değerinin -10'dan büyük herhangi bir sayı olmasını garanti eder
				 *   - less[20]     = değerin 20'den daha küçük olması garantilenir
				 *   
				 * @type {Object}
				 */
				greather_less:
				{
					pattern: /^(greater|less)\[(\-*\+*\d+)\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result = this.pattern.exec( rule );
						var dir    = result[ 1 ];
						var limit  = parseInt( result[ 2 ]);

						// input rakam sayı vs değilse kontrol başarısız olmalı
						if( ! self.core.numeric.control( value, 'numeric' ))

							return false;

						// input değerini integer türüne dönüştürelim
						value = parseInt( value, 10 );

						if( dir == 'greater' )

							return value > limit;
						
						if( dir == 'less' )

							return value < limit;
					}
				},

				/**
				 * Inputun istenen değere eşit olmasını garantiler. Bu bir sayı
				 * olabileceği gibi bir ifade de olabilir.
				 * 
				 * @type {Object}
				 */
				equal:
				{
					pattern: /^equal\[(.*?)\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result = this.pattern.exec( rule );
						var target = result[ 1 ].toLowerCase();

						return value == target;
					}
				},

				/**
				 * Input değerinin verilen parametrelerden herhangi biriyle
				 * eşleşmesini garantiler.
				 * 
				 * @type {Object}
				 */
				list:
				{
					pattern: /^in_list\[(.*?)\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result = this.pattern.exec( rule );
						var list = result[ 1 ].toLowerCase().split( ',' );

						return list.indexOf( value.toLowerCase()) > -1;
					}
				},

				/**
				 * Input değerinin name parametresi verilen diğer input ile
				 * aynı değerde olmasını garantiler.
				 * 
				 * @type {Object}
				 */
				matches:
				{
					pattern: /^matches\[(.*?)\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result = this.pattern.exec( rule );
						var name = result[ 1 ];

						// hedef input mevcut değerleri karşılaştıralım
						if( target = root.inputs.get( 'prompt-' + name ))
						{
							if( target.val() == value ) 

								return true;
						}
						else
						{
							console.error( name + ' adında bir input bulunamadı.' );
							return false;
						}
					}
				},

				/**
				 * Inputun sadece alfabe harfleri ve istenirse onlara ilave
				 * olarak başka karakterler ilave edilebilir. parametre yoluyla
				 * hepsinin kombinasyonları eklenebilir.
				 * 
				 *   - alpha                = sadece latin alfabetik karakterlerin olmasına izin verir.
				 *   - alpha[dash]          = alfabetikler ve alttire (_), tire (-) işaretlerine izin verir.
				 *   - alpha[number]        = alfabetikler ve sayılara (nokta dahil değildir) izin verir.
				 *   - alpha[turkish]       = türkçe karakterleri içeren latin harfleri
				 *   - alpha[space]         = boşluk (space, tab vb.) dahil alfabetikler
				 *   - alpha[space,turkish] = örneğin ad ve soyadı tek seferde isteyen bir inputun doğrulanması için kullanılabilir.
				 *   
				 * @type {Object}
				 */
				alpha:
				{
					pattern: /^alpha(\[(.*?)\])*$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var result = this.pattern.exec( rule );
						var params = result[ 2 ]
							? result[ 2 ].split( ',' )
							: [];

						// parametreleri boşluklardan temizlememiz gerekiyor
						for( var i = 0; i < params.length; i++ )
						
							params[ i ] = params[ i ].trim();

						var hasDash    = params.indexOf( 'dash'    ) > -1;
						var hasNumber  = params.indexOf( 'number'  ) > -1;
						var hasTurkish = params.indexOf( 'turkish' ) > -1;
						var hasSpace   = params.indexOf( 'space'   ) > -1;

						var alpha = '^([a-z<extend>]+)*$';
						var extend = '';

						if( hasDash )

							extend += '\\-_';

						if( hasNumber )

							extend += '0-9';

						if( hasTurkish )

							extend += 'çğıöşüÇĞİÖŞÜ';

						if( hasSpace )

							extend += '\\s';

						alpha = alpha.replace( '<extend>', extend );

						return ( new RegExp( alpha, 'i' )).test( value );
					}
				},

				/**
				 * Inputun hexadecimal değer tutmasını garanti eder. Karakter sayısı
				 * olarak limit verilebilir.
				 * 
				 *   - hex     = inputun tamamen hexadecimal olmasını sağlar.
				 *   - hex[10] = inputun en fazla 10 hexadecimal karakter olmasını sağlar.
				 *   
				 * @type {Object}
				 */
				hex:
				{
					pattern: /^hex(\[([0-9]+)\])*$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var length = parseInt( this.pattern.exec( rule )[ 2 ], 10 );

						length = isNaN( length )
							? value.length
							: length;

						return /^[a-f0-9]+$/i.test( value ) && value.length <= length;
					}
				},

				/**
				 * Inputun renk kodu içerdiğini garanti eder.
				 * 
				 *   - color[hex]  = inputta # ile 3 veya 6 digitlik renk kodu olmasını garanti eder.
				 *   - color[rgb]  = inputta rgb(0,5,255) formatında renk kodu olmasını garanti eder. kanalların 0-255 aralığında olması da garantilenir. fazla boşluklar (space, tab vs) işleyişi bozmaz.
				 *   - color[rgba] = kuralları rgb gibidir. rgba(0,5,255,0.4) veya rgba(0,5,255) biçimi garantilenir. ayrıca alpha değerinin 0-1 aralığında olması garantilenir.
				 *   
				 * @type {Object}
				 */
				color: 
				{
					pattern: /^color\[(hex|rgb|rgba|ascii)+\]$/i,

					accept: function( rule )
					{
						return this.pattern.test( rule );
					},

					control: function( value, rule )
					{
						var target = this.pattern.exec( rule )[ 1 ];

						switch( target.toLowerCase( ))
						{
							case 'rgb':
							case 'rgba':  return this.rgb( value, target );
							case 'hex':   return this.hex( value );
						}
					},

					hex: function( value )
					{
						return /^#[a-f0-9]{3,6}$/i.test( value );
					},

					rgb: function( value, target )
					{
						var result = /^(rgb|rgba)+\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(.*?))*\)$/i.exec( value );

						if( ! result ) return false;

						var method = result[ 1 ];
						var red    = parseInt(   result[ 2 ], 10 );
						var green  = parseInt(   result[ 3 ], 10 );
						var blue   = parseInt(   result[ 4 ], 10 );
						var alpha  = parseFloat( result[ 6 ], 10 );

						return (
							( red   < 0 || red   > 255 ) ||
							( green < 0 || green > 255 ) ||
							( blue  < 0 || blue  > 255 ) ||
							( alpha < 0 || alpha > 1   ) ||
							( method == 'rgb' && result[ 6 ]) ||
							( target == 'rgb' && method == 'rgba' )
						) ? false : true;
					}
				},

				/**
				 * Inputun geçerli bir e-posta adresi tutması garantilenir.
				 * @type {Object}
				 */
				email:
				{
					accept: function( rule )
					{
						return rule == 'email';
					},

					control: function( value, rule )
					{
						return /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/.test( value );
					}
				}
			}

			/**
			 * Verilen sözdizimini işlemeyi kabul eden metoda ilgili değeri iletir.
			 * 
			 * @param  {String} {rule}    sözdizimi
			 * @param  {String} {value}   kontrol edilecek input değeri
			 * @param  {String} {default} inputun data-default ile belirlenmiş varsayılan
			 *                            değeridir. tanımlıysa required testinde inputun
			 *                            değeri buna eşit olamaz.
			 * @return {}
			 */
			this.exec = function( rule, value, def )
			{
				var method;

				rule = rule.toString();

				// rule ile belirtilen metod bulunamazsa varsayılan olarak geriye true döneceğiz
				var r = true;

				// tüm metodları gezelim
				for( var i in this.core )
				{
					// sözdizimini kabul eden olursa adını dışarı çıkaracağız
					if( this.core[ i ].accept && this.core[ i ].accept( rule ))
					{
						method = i;
						break; // kuralı işlemeyi kabul eden ilk eşleşmede döngüden çıkıyoruz
					}
				}

				// method adını bulmuşsak veriyi kontrol ettirelim
				if( this.core[ method ])

					r = this.core[ method ].control( value, rule, def );

				// metod adını bulamamışsak istenen rule desteklenmiyor demektir
				else
				{
					// ancak bunu bir de veride (yani string nesnesinde) adı geçen metod varsa ona
					// orada bulamazsak global blokta verilen isimde bir metod arayalım bulursak 1
					// tane parametre opsiyonel olacak şekilde çalıştıralım
					var result = /^(.*?)(\[(.*?)\])*$/i.exec( rule );
					var method = result[ 1 ];
					var param  = result[ 3 ];

					// value string'inde ilgili metodu arıyoruz
					if( value[ method ])

						value = value[ method ]( param );

					// global window nesnesinde ilgili metodu arıyoruz
					else if( global[ method ])

						value = global[ method ]( param );

					else

						console.error( method + ' metodu bulunamadı.' );
				}

				// kontrol sonucunu döndürelim
				return {
					status: r,
					value: value
				}
			}
		});

		/**
		 * Input hatalarını toparlayıp yönetmeyi sağlayan temiz bir arayüz
		 * sağlar. Aynı zamanda hata durumunda listenerlara da bu nesne
		 * gönderileceği için dışarıda da kullanımı olacak.
		 * 
		 * @type {Object}
		 */
		this.error = new function()
		{
			/**
			 * Mevcut hata sayısını tutar.
			 * @type {Number}
			 */
			this.length = 0;

			/**
			 * Hataları tutar.
			 * @type {Object}
			 */
			this.items = {};

			/**
			 * Adı verilen input değeri rule ile belirtilen testi geçemiyor anlamına gelen
			 * bir hata kaydı oluşturur.
			 * 
			 * @param {String} {name} inputun name parametresinde geçen ad
			 * @param {String} {rule} inputa uygulanan (ve başarısız olan) test adı
			 */
			this.add = function( name, rule )
			{
				// öncelikle rule sözdizimini işlememiz gerekiyor
				// deyimin kökü ve parametrelerini parçalarına bölmeliyiz ki
				// bu hatayı alıp görsel olarak sunacak olan callback bu işlem için
				// uğraşmasın. Örneğin: alpha[ turkish , space,numeric ] için rule: "alpha"
				// ve params['turkish','space','numeric'] gibi)
				var result = /^(.*?)(?:\[(.*?)\])*$/i.exec( rule );
				var params = [];
				
				rule = result[ 1 ];

				if( result[ 2 ])
				
					result[ 2 ].split( ',' ).map( function( item )
					{
						params.push( item.trim());
					});

				// input hata listemize ilk defa girecekse bir kayıt oluşturalım
				if( ! this.items[ name ])
				{
					this.items[ name ] = 
					{
						// hata kaydımızda inputun jQuery ile dökümanda seçili hali bulunsun
						input: root.inputs[ name ],
						// inputa özel tutulan başarısız testler listesine ilgili test adını ilave edelim
						errors: [
						{
							rule: rule,
							params: params
						}]
					}
				}
				// input daha önceden bir başka testten geçemediği için zaten bir kaydı mevcut
				// sadece aşılmayan yeni test bilgilerini ilave edeceğiz
				else
				{
					this.items[ name ].errors.push(
					{
						rule: rule,
						params: params
					});
				}

				// her halükarda toplam tespit edilen hata sayısını bir arttıralım
				this.length++
			}

			/**
			 * Mevcut hataları verilen callback'a geçirerek gezer.
			 * @param {Function} {callback} çalıştırılacak callback [ input .. rule ]
			 */
			this.each = function( callback )
			{
				// her inputu dönelim
				ObjectHelper.each( this.items, function( name, input )
				{
					// inputtaki her hatayı dönelim
					input.errors.map( function( errors )
					{
						var rule    = errors.rule;
						var params  = errors.params;
						var message = root.messages
							? root.messages[ rule ]
							: '';

						callback.call(
						{
							name: name,
							input: input.input,
							rule: rule,
							params: params,
							message: message.assign(
							{
								name: name,
								rule: rule,
								params: params.join( ', ' )
							})
						});
					});
				});
			}

			/**
			 * Hata arayüzünde depolanmış hata dökümlerini silip
			 * yeniden kontrol için hazır hale getirir.
			 */
			this.empty = function()
			{
				// hata listesini boşaltalım
				this.items = {};
				// hata sayısını sıfırlayalım!
				this.length = 0;
			}
		}

		/**
		 * Kontrol arayüzünün kurulumunu gerçekleştirir.
		 */
		this.init = function()
		{
			// listeye inputları tek tek ekleyelim, bu ilk çalışmamız değilse döngü
			// yine çalışacaktır ancak list arayüzü zaten olan bir elemanı eklemeyeceği
			// için mükerrer input oluşmayacaktır
			if( inputs && ( inputs instanceof jQuery ))
		
				inputs.each( function()
				{
					root.add( this );
				});

			else if( is( inputs, "array" ))

				// listeye inputları tek tek ekleyelim, bu ilk çalışmamız değilse döngü
				// yine çalışacaktır ancak list arayüzü zaten olan bir elemanı eklemeyeceği
				// için mükerrer input oluşmayacaktır
				inputs.map( function( input )
				{
					root.add( input.name, input );
				});

			// hata arayüzünü sıfırlıyoruz (ilk defa çalışmıyorsak hatalar mevcut olabilir)
			this.error.empty();
		}
	}
});
