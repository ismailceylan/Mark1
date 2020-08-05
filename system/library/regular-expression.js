define(
[
	"system/helper/object",
	"system/helper/string/frequency",
	
],
function( ObjectHelper, frequency )
{
	/**
	 * Verilen bir isimli düzenli ifadeyi temsil eden bir arayüz sağlar. Bu ifade
	 * üzerinde isimli kurallar tanımlanabilir veya varsayılan olarak herhangi bir
	 * isimli kuralın herhangi bir şeyle eşleşmesi sağlanabilir.
	 *
	 * Verilen veri üzerinde sağlanan eşleşmeler yakalama sözdiziminde verilen
	 * isimlerle elde edilebilir.
	 * 
	 * @param {String} namedPattern isimlendirilmiş yakalama grupları içeren bir sözdizimi
	 */
	return function RegularExpression( namedPattern )
	{
		if( ! ( this instanceof RegularExpression ))

			return new RegularExpression( namedPattern );

		// ana etki alanı
		var root = this;

		/**
		 * Yakalama sözdizimi.
		 * @type {String}
		 */
		this.namedPattern = namedPattern.replace( /(\/)/g, "\\$1" ).replace( /(\?(\?))/g, "\\$2" );

		/**
		 * İsimlendirilmiş parça yakalayıcılarla eşleşen ifade.
		 * @type {RegExp}
		 */
		this.capturer = /\{(\w+)(\?)?\}/;

		/**
		 * Herhangi bir şey ile eşleşen ifade.
		 * @type {RegExp}
		 */
		this.any = /(?:.*)/;

		/**
		 * İsim kural çiftleri.
		 * @type {Object}
		 */
		this.namedRules = {}

		/**
		 * Verilen isim için kullanılacak düzenli ifadeyi kaydeder. İlk parametrede
		 * property: RegExp şeklinde birden fazla özelliğe sahip olan nesne verilirse
		 * topluca ekleme yapılabilir.
		 *
		 * Kuralın RegExp kısmında birden fazla parantez grubu bulunuyor olabilir. Normalde
		 * grup bulunmuyor kabul edilirerek buna uygun bir işleyiş gerçekleşir ancak durum
		 * farklıysa üçüncü parametrede verilen düzenli ifadenin kaçıncı grubu ilgili ismin
		 * olması gereken değeri içerecekse o sayı girilmelidir.
		 *
		 * Eğer RegExp değerlere targetGroup adında bir property eklenmişse bu değer
		 * bu yoksa, 3. parametreden gelen değer, bu da yoksa 1 kullanılır.
		 *
		 * Toplu eklemelerde targetGroup değerinin düzenli ifadelere daha önceden verilmiş
		 * olması gerekir.
		 * 
		 * @param {String|Object} name bir isim
		 * @param {RegExp} pattern bir düzenli ifade
		 * @param {Number} targetGroup düzenli ifade içinden kullanılması istenen grubun konumu
		 * @return {this}
		 */
		this.rule = function( name, pattern, targetGroup )
		{
			if( ! name )

				return this;
			
			if( is( name, "object" ))
			
				return ObjectHelper.each( name, this.rule, this );

			this.namedRules[ name ] = pattern;

			return this;
		}

		/**
		 * Adı verilen kuralı döndürür.
		 * 
		 * @param {String} name değeri istenen kural
		 * @return {undefined|RegExp}
		 */
		this.getRule = function( name )
		{
			if( this.namedRules[ name ])

				return this.namedRules[ name ];
		}

		/**
		 * Varsayılan sonuç nesnesini üretir.
		 * @return {Object}
		 */
		this.makeEmptyResult = function()
		{
			return {
				pattern: null,
				namedPattern: this.namedPattern,
				source: null,
				data: {}
			}
		}

		/**
		 * Verilen RegExp ifadeyi string e dönüştürüp
		 * dışını parantez ile sarmalar ve döndürür.
		 * 
		 * @param {RegExp} regExp dönüştürülecek düzenli ifade
		 * @param {String} optionalMatch eşleşen değer
		 * @return {String}
		 */
		this.packRegExp = function( regExp, optionalMatch )
		{
			return "(" + regExp.source + ")" + ( optionalMatch == "?" ? optionalMatch : "" );
		}

		/**
		 * Verilen hedef string içinde bulunan ilk yakalama deyimi yerine
		 * verilen bir RegExp sözdizimini yerleştirip döndürür.
		 * 
		 * @param {String} target düzenlenecek string
		 * @param {RegExp} regExp düzenli ifade
		 * @param {String} optionalMatch eşleşen değer
		 * @return {String}
		 */
		this.rebuildPattern = function( target, regExp, optionalMatch )
		{
			return target.replace(
				this.capturer,
				this.packRegExp( regExp || this.any, optionalMatch ));
		}

		/**
		 * Temsil edilen sözdiziminde bulunan isimli yakalama gruplarının yerlerine onların
		 * düzenli ifadelerini yerleştirip nihai çalıştırılabilir bir RegExp üretir. Ayrıca
		 * bu düzenli ifade içinde meydana gelen grupların pozisyon numaralarını eskiden
		 * yerlerinde duran isimlerde toplar ve bütün bu bilgiyi bir nesne içine koyup
		 * döndürür.
		 *
		 * "{slug}-{id}/?{channel?}" sözdizimi için
		 * 
		 * {
		 * 		pattern: /^([a-z0-9-]+)-([0-9]{1,11})/?(\/?(wiki|article))?$/,
		 * 		slug: 1,
		 * 		id: 2,
		 * 		channel: 4
		 * }
		 * 
		 * @return {Object}
		 */
		this.getNormalized = function()
		{
			var nm = this.makeEmptyResult();

			nm.pattern = this.onEachCapture( this.namedPattern, function( name, position )
			{
				nm.data[ name ] = position;
			});

			nm.pattern = new RegExp( nm.pattern );

			return nm;
		}

		/**
		 * Verilen string ifade içinde kalmayana kadar yakalama deyimlerini arar
		 * ve bulduğu bilgileri callback metoduna geçirip ondan dönen değerlerle
		 * ilgili string ifadeyi günceller. Artık yakalama deyimi kalmadığında
		 * ilgili string ifadenin son hali döner.
		 * 
		 * @param {String} finalPattern işlenecek sözdizimi
		 * @param {Function} dataFiller sözdiziminin içindeki yakalama deyimlerini işleyecek bir metot
		 * @return {String}
		 */
		this.onEachCapture = function( finalPattern, dataFiller )
		{
			var match, groupStack = 0;

			while( match = finalPattern.match( this.capturer ))
			{
				var rule,
					name = match[ 1 ];

				if( rule = this.getRule( name ))
				
					groupStack += rule.targetGroup || frequency( rule.source, "(" );

				dataFiller.call( this, name, ++groupStack );

				finalPattern = this.rebuildPattern( finalPattern, rule, match[ 2 ]);
			}

			return "^" + finalPattern + "$";
		}

		/**
		 * Yakalama söz diziminde geçen isimli yakalama deyimlerindeki isimleri
		 * alır ve bunları boş bir nesnenin propertyleri yapar. Bunların değer
		 * kısmına da verilen veri üzerinde bir düzenli ifade çalıştırarak
		 * eşleşme sağladığı noktalardan elde eder. Geriye bu nesne döndürülür.
		 * 
		 * @param {String} target eşleşme aranacak veri
		 * @return {Object|undefined}
		 */
		this.capture = function( target )
		{
			var match,
				nm = this.getNormalized();

			if( ! ( match = target.match( nm.pattern )))

				return;

			nm.data = ObjectHelper.map( nm.data, function( name, position )
			{
				return match[ position ];
			});

			nm.source = target;

			return nm;
		}
	}
});
