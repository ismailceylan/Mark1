define(
[
	"system/core/type",
	"./base-plugin",
    "system/helper/string/slug",
    
],
function( Type, BasePlugin, slug )
{
	return Type( "Header" ).extends( BasePlugin ).prototype(
	{
		/**
		 * Dökümandaki # ile başlayan satırları seçer.
		 * @type {RegExp}
		 */
		selection: /^(#+) +(.*?) *(?:\{ *\# *(.*?) *\})*$/mg,

		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full tam eşleşme
		 * @param {String} level başlık girinti karakterleri (#)
		 * @param {String} title başlık metni
		 * @param {String} id başlığın IDsi
		 * @return {String}
		 */
		render: function( full, level, title, id )
		{
			var slg = slug( title ).toLowerCase();
			var hash = "#" + slg;
			var max = 6;

			title = this.convert2Markdown( title );
			level += "#";
			
			// id = id
			// 	? ' id="' + id + '"'
			// 	: "";

			id = ' id="' + slg + '"';

			var tag = "h";

			if( level.length <= max )

				tag += level.length;

			else
			{
				tag += max;
				title = level.slice( max ) + title;
			}

			return "<" + tag + id + ' class="header">' +
						title +
						'<a to="' + hash + '" class="fa fa-fw fa-link"></a>' +
				   "</" + tag + ">";
		}
	});
});
