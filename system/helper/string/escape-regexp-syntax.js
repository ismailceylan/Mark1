define( function()
{
	/**
	 * Temsil edilen string ifade içinde regular expressions söz dizimi
	 * oluşturmak için kullanılan özel karakterler geçiyorsa bunların
	 * önüne ters bölü (\) işareti yerleştirerek işlem karakteri değil
	 * de göründüğü gibi kalmasını sağlar.
	 * 
	 * @param {String} source öncelenecek ifade
	 * @return {String}
	 */
	return function escapeRegExpSyntax( source )
	{
		return source.replace( /(\.|\:|\?|\*|\+|\-|\[|\]|\(|\)|\{|\}|\$|\^|\/|\\|\|)/mg, "\\$1" );
	}
});
