define( function()
{
	/**
	 * Byte cinsinden verilen büyüklüğü okunabilir biçimde dönüştürür.
	 * 
	 * @param  {Object Integer} size hesaplanacak byte
	 * @param  {Boolean} isThousandBase baz alınacak birim sisteminin binlik olup olmadığı
	 * @return {Object String}
	 */
	return function filesize( size, isThousandBase )
	{
		var thresh = isThousandBase ? 1000 : 1024;

		if( Math.abs( size ) < thresh )

			return size + " Byte";

		var units = isThousandBase
			? [ "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb" ]
			: [ "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ];

		var u = -1;

		do
		{
			size /= thresh;
			++u;
		}
		while( Math.abs( size ) >= thresh && u < units.length - 1 );

		return size.toFixed( 2 ) + units[ u ];
	}
});
