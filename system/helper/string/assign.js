define( function()
{
	/**
	 * Verilen bir kaynak içinde runtime içinde tanımlı bulunan bir JSON içindeki
	 * nesnelerin isimlerini string olarak kullanmayı sağlar. Kaynak işlendikten
	 * sonra yeni halinde değişken referansları gitmiş yerlerine değişkenlerin
	 * değeri yazılı hali gelir.
	 * 
	 * @param {String} source işlenecek kaynak metin
	 * @param {Object} assignments değişkenler
	 * @return {String}
	 */
	return function assign( source, assignments )
	{
		assignments = assignments || {};

		if( ! is( source, "string" ))

			throw new TypeError( app.lang.render( "firstArgMustStr",
			{
				current: type( source )
			}));

		if( ! is( assignments, "object" ))

			throw new TypeError( app.lang.render( "secArgMustObj",
			{
				current: type( assignments )
			}));

		for( var name in assignments )
		
			source = source.replace(
				new RegExp( "\\{\\{\\s*" + name + "\\s*\\}\\}", "gm" ),
				assignments[ name ]
			);

		return source;
	}
});
