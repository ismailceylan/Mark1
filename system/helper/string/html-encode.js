define( function()
{
	/**
	 * Verilen string içinde geçen html'e özgü özel
	 * işaretlerin html karşılıklarını kodlayıp döndürür.
	 * 
	 * @param {String} target kodlanacak string
	 * @return {String}
	 */
	return function htmlencode( target )
	{
		// \u00A0-\u9999
		return target.replace( /[<>\&]/img, function( i )
		{
			return "&#" + i.charCodeAt( 0 ) + ";";
		});
	}
});
