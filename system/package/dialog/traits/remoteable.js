define(
[
	"system/core/trait",

],
function( Trait )
{
	return Trait( "Remoteable" ).prototype(
	{
		/**
		 * Bir dialog örneğini alarak bu dialog üzerinde çalışmak
		 * üzere gelişmiş bir remote arayüzü sağlar.
		 *
		 * @param {String} url içeriğin alınacağı http adresi
		 * @param {Function} callback uzak kaynak indirilip dialog içine yansıtıldıktan sonra tetiklenir
		 */
		remote: function( url, callback )
		{
			// dialog etki alanı
			var dialog = this;

			/**
			 * Olay dinleyiciler.
			 * @type {Object}
			 */
			var listener = 
			{
				/**
				 * Uzak kaynak hazır olduğunda tetiklenir.
				 * @param {String} xml uzaktaki kaynağın döndürdüğü içerik
				 */
				onRemoteReady: function( xml )
				{
					// dönen kaynakta title, content ve buttonset isimleriyle
					// işaretlenmiş alanlar bulunmalıdır bu alanları alıp kullanırız
					var view = View.new( xml );

					var body = $( xml );
					var title = body.find( 'title' );
					var content = body.find( 'content' );
					var buttons = body.find( 'buttonset' ).find( '*' );

					// dialoğun görünüm modunu standart yapalım
					dialog.state( view.$root.attr( 'data-state' ));

					// dönen içerikte title etiketi mevcutsa
					// dialog başlığını buradan elde edebiliriz
					if( view.has( 'title' ))

						dialog.title( view.$title.html());

					// dönen içerikte content etiketi mevcutsa buradaki
					// içerikten dialog gövdesini oluşturabiliriz 
					if( view.has( 'content' ))

						dialog.body( view.$content.html());

					// dönen içerikte buttonlar mevcutsa bunlardan da dialoğun
					// footer kısmındaki işlev butonlarını elde edebiliriz
					if( view.has( 'buttons' ))
					{
						// dialoğun butonlar yerleşen kısmı olan
						// action bölümünü tamamen sıfırlayalım
						dialog.action().destroy();

						// her butonu tek tek ekleyelim
						view.$buttons.each( function()
						{
							dialog.action( this ).push();
						});
					}
					// uzak kaynakta herhangi bir buton tanımlanmamışsa
					// dialoğu uzak kaynağa göre yeniden oluşturduğumuz
					// için tüm action kısmını gizleyebiliriz
					else

						dialog.view.$footer.hide();

					callback.call( dialog );
				}
			}

			/**
			 * Verilen url'yi isteyip içeriğini analiz edilmek üzere ilgili
			 * işleve aktarır. Önbellekleme yeteneğine sahip olduğundan aynı
			 * url'yi ikinci defa indirmez.
			 * 
			 * @param {String} url içeriğin alınacağı bağlantı
			 */
			var download = function( url )
			{
				// dialoğu yükleniyor görünümüne getirelim
				dialog.setStateLoading();

				// içeriği indirmek için require ve text eklentisi kullanacağız
				require([ 'text!' + url ], listener.onRemoteReady );
			}

			// pencereyi açalım
			dialog.open();

			// indirmeyi başlatalım
			download( url );
		}
	});
});
