define(
[
	'text!./css/style.min.css',
	'system/machine/anonstyle'
],
function( styles )
{
	/**
	 * Verilen soru cümlesini kullanarak Dialog penceresini soru cevap
	 * formuna uygun biçimde ekrana getirir. Kullanıcının seçtiği butona tıklandığında
	 * verilen callback kullanıcı seçimine genişletilerek çalıştırılır.
	 * 
	 * @param  {String}   question Dialog pencere gövdesinde görünecek soru cümlesi
	 * @param  {Function} onDone   Kullanıcı olumlu seçim yaptığında çalıştırılacak işlev
	 * @param  {Function} onCancel Kullanıcı olumsuz seçim yaptığında çalıştırılacak işlev
	 * @param  Object     o        Bazı ayarları tutar
	 * @return {void}
	 */
	Dialog.prototype.confirm = function( question, onDone, onCancel, o )
	{
		// dialog etki alanı
		var dialog = this;

		onDone   = onDone || function(){};
		onCancel = onCancel || function(){};
		question = question || '';
		
		// ayarları ilklendirelim
		o = $.extend(
		{
			title: null
		}, o );

		// alert iskeletini remote özelliğiyle yükleyelim
		this.remote( 'system/package/dialog/role/confirm/view/body.xml', function()
		{
			// başlık tanımlanmışsa set edelim
			o[ 'title' ]
				? dialog.title( o.title )
				: dialog.state( dialog.currentState.replace( ' title', '' ));

			// mesajı set edelim
			dialog.find( '.text' ).html( question.replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/mg, '<br>' ));

			// stilleri dökümana yazalım
			Anonstyle.new( 'confirm' ).push( 'all', styles );

			// herhangi bir butona basınca tetiklenecek
			// bir metot oluşturalım id değerine bakarak
			// callbacke yönlendirme yapabiliriz
			var onButtonClick = function()
			{
				this.id == 'OK'
					? onDone()
					: onCancel();
			}

			dialog.action( 'OK'     ).button.on( 'click', onButtonClick );
			dialog.action( 'cancel' ).button.on( 'click', onButtonClick );

			dialog.action().draw();
			dialog.open();
		});
	}
});
