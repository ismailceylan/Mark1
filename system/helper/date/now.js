define( function()
{
	/**
	 * Güncel zamanı unix zaman damgası olarak döndürür. True değer
	 * verilirse saniye, verilmezse milisaniye cinsinden değer döndürür.
	 * İkinci parametre, zamanın saniye cinsinden alınmak istendiğinde
	 * küsuratlı olacak sonucun virgülden sonra kaç basamağının alınacağını
	 * belirler. Belirtilmezse 0 varsayılır.
	 * 
	 * @param {Boolean} inSeconds zamanın saniye cinsinden olup olmayacağı
	 * @param {Number} flo zaman saniye cinsinden alınmak istendiğinde küsuratlı
	 * sonucun virgülden sonrali kaç basamağının alınacağı
	 * @return {Number}
	 */
	return function now( inSeconds, flo )
	{
		var time = ( new Date ).getTime();

		if( ! inSeconds )
		
			return time;

		return parseInt(( time / 1000 ).toFixed( flo || 0 ), 10 );
	}
});
