define(
[
	"../core/type",
	"../core/traits/assignable",
	"../helper/typo/camel-to-dash",
	"../helper/string/assign",
	"../helper/number/random-hexadecimal",

],
function( Type, Assignable, camel2dash, assign, randHex )
{
	/**
	 * Kendisine verilen stil kodlarını temsil eder, yönetir.
	 * 
	 * @param {String} namespace benzersiz bir isim (verilmezse rastgele oluşturulur)
	 * @event ready bir stil push edildiğinde tetiklenir.
	 */
	return window.Anonstyle = Type( "Anonstyle" ).use( Assignable ).prototype(
	{
		/**
		 * Kurulumsal işlemleri yapar.
		 */
		construct: function( namespace )
		{
			this.namespace = "anon-";

			if( namespace )

				this.namespace += camel2dash( namespace );

			else

				this.namespace += randHex();
		},

		/**
		 * Temsil edilen stil kodunun adı.
		 * @type {String}
		 */
		namespace: null,

		/**
		 * Adı verilen medya türü için kodları dökümana yazar.
		 * 
		 * @param {String} media media tür adı
		 * @param {Array} ...code css kod
		 */
		push: function( media, code )
		{
			var args = arg( arguments );
			media = args.shift();
			code = args;

			var target = this.getStyleElement( media );
			var members = this.getMembers( target );

			// bu stile bağımlılık varsa üzerine yazmıyoruz
			if( members > 0 )
			
				this.increaseMembers( target );
			
			else
			{
				if( members == 0 )

					$( 'head' ).append( target );

				target.text( this.compress( code.join( "\n" )));
				this.increaseMembers( target );
			}

			$( this ).trigger( "ready" );
		},

		/**
		 * Adı verilen medya türüne ait elementi dökümandan kaldırır
		 * stilleri siler. Ancak elemente bağımlı başka şeyler varsa
		 * bağımlı sayısını düşürüp bırakır.
		 *
		 * Dökümanda hiç bağımlılı kalmadığı için style elementi
		 * kaldırıldığında true döner. Yoksa bağımlı sayısını döner.
		 * 
		 * @param {String} media media tür adı
		 * @param {true|Number}
		 */
		destroy: function( media )
		{
			var target = this.getStyleElement( media );
			var members = this.getMembers( target );

			if( members > 1 )
			{
				this.increaseMembers( target, -1 );
				return members - 1;
			}

			target.attr( 'data-members', 0 ).remove();
			return true;
		},

		/**
		 * Verilen bir script elementinde bulunan members
		 * özelliğinin değerini sayısal dönüşümünü yaparak verir.
		 * 
		 * @param {jQuery} el bir script elementi
		 * @return {Number}
		 */
		getMembers: function( el )
		{
			return parseInt( el.attr( 'data-members' ));
		},

		/**
		 * Verilen bir script elementinde bulunan members
		 * özelliğinin değerine ekler veya çıkarma yapar.
		 * 
		 * @param {jQuery} el bir script elementi
		 * @param {Number} add eklenecek değer (varsayılan +1)
		 * @return {Number}
		 */
		increaseMembers: function( el, add )
		{
			add = add || 1;

			var val = this.getMembers( el ) + add;

			el.attr( 'data-members', val );

			return val;
		},

		/**
		 * Bu isim alanı için dökümanda önceden eklenmiş bir element varsa
		 * bunu yoksa bir tane yerleştirip bunun referansını döndürür.
		 * 
		 * @param {String} media media tür adı
		 * @return {jQuery}
		 */
		getStyleElement: function( media )
		{
			// önce bu nesne üzerinde arayalım
			return this.rememberAssigned( media, function()
			{
				var el;

				// önce dökümanda deneyelim
				if(( el = $( this.makeStyleElementSelector( media ))).length > 0 )

					return el;

				// dökümanda yok bir tane oluşturalım
				return this.createStyleElement( media );
			});
		},

		/**
		 * Bu isim alanı için dökümana bir tane uygun style
		 * elementi yerleştirip referansını döndürür.
		 * 
		 * @param {String} media media tür adı
		 * @return {jQuery}
		 */
		createStyleElement: function( media )
		{
			var style = $( '<style type="text/css"></style>' )

				.attr( 'data-members', 0 )
				.attr( 'media', media )
				.attr( 'id', this.namespace );

			$( 'head' ).append( style );

			return style;
		},

		/**
		 * Bu isim alanı için adı verilen medya türünü dökümanda
		 * seçmeyi sağlayacak olan sorgu sözdizimini oluşturur.
		 * 
		 * @param {String} media media tür adı
		 * @return {String}
		 */
		makeStyleElementSelector: function( media )
		{
			return assign( "head > #{{ id }}[media={{ media }}]",
			{
				id: this.namespace,
				media: media
			});
		},

		/**
		 * Verilen css kodundaki gereksiz ifadeleri temizler
		 * kodu dıkıştırır.
		 * 
		 * @param {String} code css kodu
		 * @return {String}
		 */
		compress: function( code )
		{
			return code

				.replace( /\s{2,}/mg, '' )
				.replace( /\/\*(.*?)\*\//mg, '' );
		},

	});
});
