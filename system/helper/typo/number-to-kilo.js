define( function()
{
	/**
	 * Verilen number türünden ifadeyi sadeleştirip
	 * bin, milyon gibi bir gösterime sokar.
	 *
	 * @param {Number} number kısaltılacak sayı
	 * @param {Number} startPoint kısaltmanın başlayacağı alt limit
	 * @param {Boolean} nameGroup birim isimlerinden kısa veya uzun olan grubun adı
	 * @return {String}
	 */
	return function n2k( number, startPoint, nameGroup )
	{
		startPoint = startPoint || 1000;

		// 10'luk sisteme dönüştürelim
		number = parseInt( number, 10 );

		// 1000'den küçükse işleme gerek yok
		if( number < startPoint )

			return number;

		// katları yazalım
		var names = 
		{
			short: [ "B", "M", "MR", "T", "K", "Sz" ],
			full: [ "Bin", "Milyon", "Milyar", "Trilyon", "Katrilyon", "Sonsuz" ]
		}

		// sayıyı 1000"den küçük olana kadar yuvarlamalıyız
		for( var i = 0; i < 10; i++ )
		{
			number /= 1000;

			if( number < 1000 )

				break;
		}

		// sayı tek haneli ve B grubundaysa bir tane de küsürat koyalım
		if( Math.floor( number ).toString().length == 1 )
		{
			// küsürat kısmı 0 şeklinde görünecekse
			// bulunması anlamsız olacaktır
			var remain = number - Math.floor( number );

			if( remain >= 0.1 )
			{
				number = number.toFixed( 1 );

				// küsürat yine de 0 olabilir ayar verelim
				if( number.toString().indexOf( ".0" ) > -1 )

					number = Math.round( number );
			}
			else
			{
				number = Math.floor( number );
			}
		}
		else
		{
			number = Math.round( number );
		}

		return number + names[ nameGroup || "short" ][ i ];
	}
});