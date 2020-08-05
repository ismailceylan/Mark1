define( function()
{
	/**
	 * İkili verisi verilen dosyayı gif ve animasyonlu gif olarak test eder. İki koşulu da
	 * sağlamıyorsa false döner.
	 * 
	 * @param  {String} binary test edilecek ikili dosya verisi
	 * @return {Boolean}
	 */
	return function isAnimatedGif( binary )
	{
		var i, len, 
			arr = new Uint8Array( binary ),
			length = arr.length,
			frames = 0;

		// make sure it's a gif (GIF8)
		if( arr[ 0 ] !== 0x47 || arr[ 1 ] !== 0x49 || arr[ 2 ] !== 0x46 || arr[ 3 ] !== 0x38 )
		
			return false;

		// ported from php http://www.php.net/manual/en/function.imagecreatefromgif.php#104473
		// an animated gif contains multiple "frames", with each frame having a 
		// header made up of:
		// * a static 4-byte sequence (\x00\x21\xF9\x04)
		// * 4 variable bytes
		// * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
		// We read through the file til we reach the end of the file, or we've found 
		// at least 2 frame headers
		for( i = 0, len = length - 9; i < len, frames < 2; ++i )
		{
			if
			(
				arr[ i     ] === 0x00 &&
				arr[ i + 1 ] === 0x21 &&
				arr[ i + 2 ] === 0xF9 &&
				arr[ i + 3 ] === 0x04 &&
				arr[ i + 8 ] === 0x00 && 
			  ( arr[ i + 9 ] === 0x2C || arr[ i + 9 ] === 0x21 )
			)

				frames++

			if( frames > 1 || i > 250000 )

				break;
		}

		return frames > 1;
	}
});
