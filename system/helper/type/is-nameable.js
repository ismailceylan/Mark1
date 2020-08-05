define( function()
{
	/**
	 * Verilen değerin javascript içinde native bir isim olarak
	 * kullanılıp kullanılamayacağını sınar.
	 * 
	 * @param {mixed} variable sınanacak değer
	 * @return {Boolean}
	 */
	return function( variable )
	{
		if( ! "String" == type( variable ))

			return false;
		
		return /^[a-z_$]{1}[a-z0-9_$]*$/i.test( variable );
	}
});
