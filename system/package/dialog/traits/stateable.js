define(
[
	"system/core/trait",
	"system/library/string-group",

],
function( Trait, StringGroup )
{
	return Trait( "Stateable" ).prototype(
	{
		/**
		 * Dialog penceresini basit bir söz dizimi yardımıyla deyim yerindeyse
		 * şekilden şekilde sokar.
		 * 
		 * Örneğin alert pencereleri genelde genişliği ve yüksekliği az olan
		 * başlığa gerek duymayan, ekranın ortasında duran, buton çubuğu olan
		 * pencerelerdir. Bunu çizmek için olması gereken söz dizimi şöyle görünmeli;
		 *
		 * Dialog.state( 'hor-sm ver-sm action' );
		 *
		 * Örneğin bir içerik albümünü dialog içinde görüntülediğimiz bir senaryoyu
		 * düşünelim. Pencerenin ekranın tümünü kullanmasını, buton ve başlık çubuğu
		 * olmasını isteyebiliriz. Söz dizimi şöyle olmalı;
		 *
		 * Dialog.state( 'hor-lg ver-lg action title close' );
		 *
		 * Aslına bakılırsa dialog pencereleri ekranın tam ortasında 1 piksellik
		 * herhangi bir bileşeni olmayan kutulardır. Başlık çubuğu, buton çubuğu
		 * kapatma işlevi gören çarpı işareti gibi bileşenler ilk anda yoktur.
		 * Verilen her özellikle pencere biraz daha gelişir.
		 *
		 * Desteklenen sözdizimi komutları şunlardır;
		 *
		 * action   => pencereye işlev butonları yerleştirilebilen action çubuğu ekler
		 * title    => pencereye başlık çubuğu ekler
		 * close    => pencerede başlık çubuğu varsa içine kapatma butonu ekler
		 * circular => pencere gövdesine dönen loading animasyonu ekler
		 * 
		 * @param {String|StringGroup} commands geçerli komutlardan oluşan bir söz dizimi
		 */
		state: function( commands )
		{
			// dialog ana etki alanı
			var dialog = this;

			// boşlukla birbirinden ayrılmış komut grupları olarak ele alalım
			commands = new StringGroup( commands );

			// desteklenen dialog biçim komutları
			var map =
			{
		//       Komut       Method 
				title:      "title",
				close:      "close",
				action:     "action",
				footer:     "footer",
				circular:   "circular"
			}

			/**
			 * İşleyici metotları tutar.
			 * @type {Object}
			 */
			var worker = 
			{
				/**
				 * Tanımlı olmayan, bir handle metodu bulunmayan komut
				 * verildiğinde tetiklenir. İlgili komut css sınıfı olarak
				 * elemente set edilir.
				 * 
				 * @param {String} name css class adı
				 */
				addClass: function( name )
				{
					var el = dialog.view.$overlay;
					var current = el.data( 'cstate' );

						// komutlarla eklenen classların listesini tutalım
						// böylece resetlerken bunları direkt removeClass
						// metoduna verince silebiliriz
						el.data( 'cstate', ( current? current + ' ' : '' ) + name );

					// class yoksa ekler varsa eklemez
					// ek bir kontrole gerek yok
					el.addClass( name );
				},

				/**
				 * Başlık çubuğunu pencereye ilave eder.
				 */
				title: function()
				{
					dialog.view.$content.prepend( dialog.view.$titlebar );
				},

				/**
				 * Başlık çubuğundaki çarpı şeklinde
				 * kapatma butonunu ilave eder.
				 */
				close: function()
				{
					dialog.view.$titlebar.append( dialog.view.$close );
				},

				/**
				 * Buton çubuğunu ilave eder.
				 */
				action: function()
				{
					dialog.view.$footer.append( dialog.view.$action );
				},

				/**
				 * Footer çubuğunu ilave eder.
				 */
				footer: function()
				{
					dialog.view.$content.append( dialog.view.$footer );
				},

				/**
				 * Yükleniyor animasyonunu ilave eder.
				 */
				circular: function()
				{
					dialog.view.$body.html( dialog.view.$loading );
				}
			}

			/**
			 * İskelet yapısını sıfırlar, fabrika
			 * ayarlarına alır.
			 */
			var reset = function()
			{
				var el = dialog.view.$overlay;
				var cstate = el.data( 'cstate' );

				el.removeClass( cstate ).data( 'cstate', null );

				dialog.view.$titlebar.remove();
				dialog.view.$close.remove();
				dialog.view.$action.remove();
				dialog.view.$loading.remove();
			}

			// iskeleti sıfırlayalım
			reset();

			// mevcut komutu saklayalım
			dialog.currentState = commands;

			// her komutu gezelim
			commands.each( function( command )
			{
				var method;
				
				if( command[ 0 ] == '.' )

					// komut değil css class olarak ekleyelim
					worker.addClass( command.substr( 1 ));

				// komut desteklenenler listesindeyse işlem yapacağız
				else if( method = map[ command ])

					// komut adını metot adına çevirdik
					// bu metodu çalıştıralım
					worker[ method ]();
			});

			return dialog;
		},

		/**
		 * Dialog alanına her ekran boyutu için
		 * xs ölçeklendirme sağlar.
		 *
		 * @return {Dialog}
		 */
		setStateLoading: function()
		{
			this.state( 'circular .loading .col-lg-2 .col-lg-offset-5 .col-md-2'+
							'.col-md-offset-5 .col-sm-2 .col-sm-offset-5 '+
							'.col-xs-4 .col-xs-offset-4' );

			return this;
		}
	});
});
