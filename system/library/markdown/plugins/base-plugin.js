define(
[
	"system/core/type",

],
function( Type )
{
	return Type( "BasePlugin" ).prototype(
	{
		/**
		 * Kurulumu gerçekleştirir.
		 * 
		 * @param {Markdown} markdown markdown arayüzü
		 * @param {Object} rules ayarlamalar
		 */
		construct: function( markdown, rules )
		{
			this.markdown = markdown;
			this.rules = rules || {};

			this.search();
		},

		/**
		 * Plugin söz dizimiyle eşleşen parçaları olduğu yerden çıkarıp
		 * çıkardığı parçayı yine markdown ile işleyip markdown üzerinde
		 * saklar. Saklanan pozisyon numarası da dökümanda parçanın söküldüğü
		 * noktaya yerleştirilir. Markdown, son aşamada bu parçaları ait
		 * oldukları yerlere tekrar yerleştirir. Böylece diğer plugin'ler
		 * yetkisinin olmadığı plugin bloklarında değişiklik gerçekleştiremezler.
		 */
		search: function()
		{
			var root = this;

			this.markdown.raw = this.getRawDocument().replace( this.selection, function()
			{
				return root.cacheResult( root.makePlaceholder(), arg( arguments )).string;
			});
		},

		/**
		 * Bu eklentiyi çağıran markdown örneği üzerinde bulunan
		 * işlenmemiş (veya yarı işlenmiş) dökümanı döndürür. Bu
		 * eklenti döküman üzerinde bazı ön düzenleme işlemi
		 * tanımlamışsa bunların da döküman üzerinde çalıştırıldığından
		 * emin olur.
		 * 
		 * @return {String}
		 */
		getRawDocument: function()
		{
			var raw = this.markdown.raw;

			return ( this.prerender && this.prerender( raw )) || raw;
		},

		/**
		 * Verilen yer tutucu nesnesi ilk defa kullanılıyorsa
		 * bölümler yığınına ilave eder. Her halükarda yer
		 * tutucuyu geri döndürür.
		 * 
		 * @param {Object} placeholder yer tutucu
		 * @param {Array} args eşleşen düzenli ifade grupları
		 * @return {@placeholder}
		 */
		cacheResult: function( placeholder, args )
		{
			var sections = this.markdown.sections;

			// yer tutucu ilk defa kullanılıyorsa
			if( ! sections[ placeholder.string ])
			{
				// section sayısını güncelleyelim
				sections.length++
				// yer tutucu nesnesi içine render edilmiş plugin değerini verelim
				placeholder.rendered = this.getRendered( args );
				// yer tutucuyu ve değerini saklayalım
				sections[ placeholder.string ] = placeholder;
			}

			return placeholder;
		},

		/**
		 * Bu eklentinin düzenli ifadesi ile eşleşen kaç tane bölüm
		 * varsa hepsi için ayrı ayrı tetiklenir. Aldığı eşleşme
		 * bilgilerini uygun bir render metoduna geçirerek bir değer
		 * üretmesini sağlayıp bu değeri geri döndürür.
		 * 
		 * @param {Array} args eşleşen düzenli ifade grupları
		 * @return {String}
		 */
		getRendered: function( args )
		{
			return this.getRenderMethod().apply( this, args );
		},

		/**
		 * Bu eklentiyi çağıran markdown örneği üzerinde bir engine
		 * varsa ve bu engine içinde bu eklenti için bir render metodu
		 * tanımlıysa bunu, tanımlı değilse bu eklenti üzerinde render
		 * metodunu döndürür. Herhangi bir metot bulunamazsa istisna
		 * fırlatılır.
		 * 
		 * @return {Function}
		 */
		getRenderMethod: function()
		{
			var name = this.type.name;
			var engine = this.markdown.engine[ name ] || this.render;

			if( ! is( engine, "function" ))

				throw TypeError( name + " bileşenini işleyecek bir metot tanımlı değil." );

			return engine;
		},

		/**
		 * Bu eklenti kendisi bir placeholder sağlıyorsa bunu
		 * sağlamıyorsa otomatik bir tane oluşturup döndürür.
		 * Bir placeholder string ve pattern adında iki property
		 * tanımlayabilir.
		 * 
		 * @return {Object}
		 */
		makePlaceholder: function()
		{
			var sections = this.markdown.sections;

			if( this.placeholder )
			
				// plugin yer tutucu sağlıyorsa onu alalım
				return this.placeholder.call( this, sections.length );

			// kendimiz yer tutucuyu oluşturalım
			return {
				string: ":section-" + sections.length + ":"
			}
		},

		/**
		 * Verilen bir tutam markdown dökümanını
		 * işleyip işlenmiş halini döndürür.
		 * 
		 * @param {String} raw işlenecek markdown döküman
		 * @param {Object} rules bu eklentinin kuralları yerine
		 * kullanılacak kurallar
		 * @return {String}
		 */
		convert2Markdown: function( raw, rules )
		{
			rules = rules || this.rules;

			if( is( rules, "empty" ))

				return raw;

			return this.markdown.type
				.new( raw || "" )
				.rules( rules )
				.render( this.markdown.engine );
		}
	});
});
