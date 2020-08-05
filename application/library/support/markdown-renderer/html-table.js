define(
[
	"system/core/trait",
	"system/helper/array/clearify",
	
],
function( Trait, clearify )
{
	return Trait( "HTMLTable" ).prototype(
	{
		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} table tablo eşleşmesi
		 * @return {String}
		 */
		Table: function( table )
		{
			var root = this;

			/**
			 * Tablo sözdizimindeki ilk satırın sütun başlıklarını
			 * tanımladığını varsayıp bu bölümdeki hücre isimlerini
			 * dizi olarak döndürür. Orijinal tablo sözdizimindeki
			 * ilgili alanı olduğu yerden kaldırır.
			 * 
			 * @return {Array}
			 */
			var getHeaders = function()
			{
				var headers = [];

				table = table.replace( /\|(.*)\|\n*/, function( full )
				{
					headers = clearify( full.split( / *\| */ ));

					return "";
				});

				return headers;
			}

			/**
			 * Tablo sözdizimindeki ilk satırın sütun altındaki hücre
			 * içeriklerinin hizalanma bilgisini tanımladığını varsayıp
			 * hizalama isimlerini dizi olarak döndürür.
			 * 
			 * @return {Array}
			 */
			var getAlignments = function()
			{
				var alignments = [];

				table = table.replace( /\|(.*)\|\n*/, function( full )
				{
					alignments = clearify( full.split( / *\| */ )).map( function( alignment )
					{
						var matches = alignment.match( /(:)?\-+(:)?/ );

						return makeAlignmentName( matches[ 1 ], matches[ 2 ]);
					});

					return "";
				});

				return alignments;
			}

			/**
			 * Sağ ve sol hizalama karakteri kullanımına bağlı olarak
			 * css için uygun bir pozisyonlama komutu üretir.
			 * 
			 * @param {String} left sol hizalama karakteri veya boş string
			 * @param {String} right sağ hizalama karakteri veya boş string
			 * @return {String}
			 */
			var makeAlignmentName = function( left, right )
			{
				// :----
				if( left && ! right )

					return "";

				// ----:
				else if( ! left && right )

					return ' style="text-align: right"';

				// :----:
				else if( left && right )

					return ' style="text-align: center"';

				// -----
				else

					return "";
			}

			/**
			 * Tablo sözdiziminin kalan bütün satırlarının tablo içeriği
			 * olduğunu varsayıp satır ve sütunlar olarak işler ve hücre
			 * içeriğini dizi haline getirip döndürür.
			 * 
			 * @return {Array}
			 */
			var getContents = function()
			{
				var lines = [];

				root.convert2Markdown( table ).replace( /\|(.*)\|\n*/g, function( line )
				{
					lines.push( clearify( line.split( / *\| */ )));
				});

				return lines;
			}

			/**
			 * Tablonun başlık alanını render edip döndürür.
			 * 
			 * @param {Array} headers başlıklar
			 * @param {Array} alignments hizalamalar
			 * @return {String}
			 */
			renderHeader = function( headers, alignments )
			{
				headers = headers.map( function( header, i )
				{
					return "<th" + alignments[ i ] + ">" + header.trim() + "</th>";
				})
				.join( "" );

				return "<thead><tr>" + headers + "</tr></thead>";
			}

			/**
			 * Tablonun içerik alanını render edip döndürür.
			 * 
			 * @param {Array} lines satır ve sütunlar
			 * @param {Array} alignments hizalamalar
			 * @return {String}
			 */
			renderContent = function( lines, alignments )
			{
				lines = lines.map( function( line )
				{
					line = line.map( function( cell, i )
					{
						return "<td" + alignments[ i ] + ">" + cell.trim() + "</td>";
					})
					.join( "" );

					return "<tr>" + line + "</tr>";
				})
				.join( "" );

				return "<tbody>" + lines + "</tbody>";
			}

			var headers = getHeaders();
			var alignments = getAlignments();

			return '<table class="table table-bordered table-striped table-hover">'+
						renderHeader( headers, alignments ) +
						renderContent( getContents(), alignments ) +
				   "</table>";
		}
	});
});
