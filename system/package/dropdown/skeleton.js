define(
[
	'text!system/package/dropdown/css/style.min.css',
	'system/machine/pop/popup'
],
function( styles )
{
	// iskeleti oluşturalım
	var skeleton = '<div>' +
						'<form>'+
							'<ul></ul>' +
							'<button class="btn btn-md btn-warning">Kapat</button>' +
						'</form>'+
				   '</div>';

	/**
	 * Stilleri tutar.
	 * @type {String}
	 */
	Dropdown.prototype.styles = styles;

	/**
	 * Açılır menü iskeletini parçalar halinde tutar.
	 */
	Dropdown.prototype.skeletor = function()
	{
		var root = this;

		return new function()
		{
			// açılır menüyü komple seçelim
			this.body = $( skeleton );
			// form
			this.form = this.body.find( 'form' );
			// seçenek listesini komple seçelim
			this.list = this.body.find( 'ul' );
			// mobil sürüm için önceki menüye dön butonu
			this.goback = this.body.find( 'button' );

			// seçenek listesini tutacak olan popup örneğini tutalım
			this.popup = new Popup(
			{
				to: root.trigger || document.body,
				align: root.option.align,
				puffy: root.option.puffy
			});

			this.popup.addClass( 'dropdown' );

			if( root.option.cssPrefix )

				this.popup.addClass( root.option.cssPrefix );

			// şimdi seçenek listesini popup içine gönderebiliriz
			this.popup.append( this.body );
		}
	}
});
