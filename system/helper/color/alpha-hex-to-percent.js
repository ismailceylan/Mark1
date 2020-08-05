define( function()
{
	/**
	 * Özünde yüzdesel bir değer olup karışım oranını belirten alpha değeri
	 * hexadecimal sayılarla tanımlandığında yerine göre iki hex karakterden
	 * de oluşabilir tek karakterden de. Tek karakter olarak gelen alpha gösterimi
	 * "ff" şeklinde çiftlenir ve her halükarda çift olan bu sayı decimal olarak
	 * dönüştürülür. 256 adımlık bir skalada elde edilen değerin hangisine
	 * denk düştüğü hesaplanıp döndürülür.
	 * 
	 * @param {String} alphaHex alpha değerinin hexadecimal gösterimi
	 * @param {Number} sensivitiy küsuratlı değerlerde virgülden sonra istenen basamak sayısı
	 * @return {Number}
	 */
	return function alphaHex2Percent( alphaHex, sensitivity )
	{
		var percent = parseInt( alphaHex.padEnd( 2, alphaHex[ 0 ]), 16 ) / 255;

		if( sensitivity !== undefined )
		
			if( Math.floor( percent ) < percent )

				percent = parseFloat( percent.toFixed( sensitivity ));

		return percent;
	}
});
