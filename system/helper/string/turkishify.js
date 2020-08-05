define( function()
{
	/**
	 * Verilen bir string içindeki SSS veya ggg gibi karakterleri noktalı Türkçe karakter haline
	 * dönüştürüp döndürür.
	 * 
	 * @param  {String} str kaynak string
	 * @return {String}
	 */
	return function turkishify( str )
	{
		var chars =
		[
			[ "ç", "ccc", "Ç", "CCC" ],
			[ "ğ", "ggg", "Ğ", "GGG" ],
			[ "ı", "iii", "İ", "III" ],
			[ "ö", "ooo", "Ö", "OOO" ],
			[ "ş", "sss", "Ş", "SSS" ],
			[ "ü", "uuu", "Ü", "UUU" ]
		];

		$( chars ).map( function( i, group )
		{
			var small = new RegExp( group[ 1 ], "mg" );
			var big   = new RegExp( group[ 3 ], "mg" );

			str = str.replace( small, group[ 0 ]);
			str = str.replace( big,   group[ 2 ]);
		});

		return str;
	}
});
