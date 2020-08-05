define( function()
{
	/**
	 * Verilen urldeki dosyaya mevcut pencere içinde link vererek
	 * kaydetme penceresinin açılmasını zorlar. Aslında bunun için
	 * sunucunun gerekli headerları veriyor olması gerekir, bu metot
	 * sadece o dosyaya link verir.
	 * 
	 * @param {String}   url     indirilecek dosya urlsi
	 * @param {Function} onError iframe hedefi hata verdiğinde çalıştırılır
	 */
	return function download( url, onError )
	{
		var frame = $( '<iframe></iframe>' );
			frame.attr( 'src', app.baseurl( url ));
			frame.hide();

			frame.on( 'load', function()
			{
				var json = $( this ).contents().find( 'body' ).text();
					json = JSON.parse( json );

				if( json.exception )

					onError( json );
			});

		$( document.body ).append( frame );
	}
});
