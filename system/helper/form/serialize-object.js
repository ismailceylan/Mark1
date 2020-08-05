define( function()
{
	/**
	 * Seçili formların inputlarını native javascript
	 * nesnesi içinde toplayıp döndürür.
	 *
	 * @param {jQuery} from <form> elementi
	 * @param {Object} append sonuca ilave edilecek nesnelerdir, form
	 * içinde aynı isimde input mevcutsa input geçersiz olur
	 * @return {Object}
	 */
	return function serializeAsObject( form, append )
	{
		var items = form.serializeArray();
		var r = {};

		/**
		 * Birden fazla form seçilmiş olabilir. Hepsinin
		 * inputlarını tek nesnede birleştirelim
		 */
		form.each( function()
		{
			$( items ).each( function()
			{
				r[ this.name ] = this.value;
			});
		});

		return $.extend( r, append || {});
	}
});
