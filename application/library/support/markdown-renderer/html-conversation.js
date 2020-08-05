define(
[
	"system/core/trait",

],
function( Trait )
{
	return Trait( "HTMLConversation" ).prototype(
	{
		/**
		 * Dökümanda rastlanan bir tane eşleşmeyi alır
		 * ve bu bilgiyi HTML olarak render edip döndürür.
		 * 
		 * @param {String} full tam eşleşme
		 * @return {String}
		 */
		Conversation: function( full )
		{
			// ana etki alanı
			var root = this;

			/**
			 * Dökümanda rastlanan bir tane eşleşmeyi alır
			 * ve bu bilgiyi HTML olarak render edip döndürür.
			 * 
			 * @param {String} full tam eşleşme
			 * @param {String} meta meta bilgileri içeren blok
			 * @param {String} messageBody mesaj gövdesi
			 * @return {String}
			 */
			var renderMessages = function( full, meta, messageBody )
			{
				/**
				 * Verilen meta bilgiler bloğunda bulunan meta
				 * bilgileri ayrıştırıp nesne halinde döndürür.
				 * 
				 * @param {String} meta meta bilgiler
				 * @return {Object}
				 */
				function parseMeta( meta )
				{
					var i = 0;
					var pattern = / *([a-z\s\u00c0-\u017f]+) *([><])? *([\w\s\u00c0-\u017f]+)?/ig;
					var m = {};

					meta.trim().replace( pattern, function( full, name, pos, short )
					{
						short = ( short || "" ).trim();

						m[ short ] =
						{
							name: name.trim(),
							position: makePosition( pos )
						}

						if( i === 0 )
						
							i = m[ "_first" ] = m[ short ];
					});

					return m;
				}

				/**
				 * Verilen pozisyon karakteri için bir pozisyon adı üretir.
				 *
				 * > için "right"
				 * diğer her şey için "left"
				 * 
				 * üretir.
				 * 
				 * @param {String} char pozisyon karakteri
				 * @return {String}
				 */
				function makePosition( char )
				{
					if( char == ">" )

						return "right";

					return "left";
				}

				/**
				 * Her satırda bir tane olarak verilen mesaj gövdesini
				 * parse edip mesaj dizisi olarak döndürür. Dizinin her
				 * bir elemanı bir mesajı ve meta bilgilerini içerir.
				 * 
				 * @param {String} body mesajlar
				 * @return {Object}
				 */
				function parseMessages( body )
				{
					var messages = [];
					var pattern = /^(.*?)? *([>:<]) *(.*)$|^(.*)$/;

					getLines( body ).map( function( line )
					{
						var message;

						line.replace( pattern, function( full, short, pos, text, onlyText )
						{
							if( onlyText !== undefined )
							
								text = onlyText;

							message = 
							{
								text: root.convert2Markdown( text, root.rules.message ),
								name: findName( short || "" ),
								position: findPosition( pos, short )
							}
						});

						messages.push( message );
					});

					return messages;
				}

				/**
				 * Verilen mesaj gövdesindeki alt alta yazılmış
				 * olan mesajları dizi olarak döndürür.
				 * 
				 * @param {String} body mesaj gövdesi
				 * @return {Array}
				 */
				function getLines( body )
				{
					return body.trim().split( /\s*\n\s*/ );
				}

				/**
				 * Verilen kısa isim için meta alanda bir tanımlama bulunursa
				 * buradaki tam ismi, bulamazsa verilen short ismin bir tam isim
				 * olduğunu varsayıp bunu döndürür.
				 * 
				 * @param {String} short kısa veya tam isim
				 * @return {String}
				 */
				function findName( short )
				{
					return meta[ short ] && meta[ short ].name || short;
				}

				/**
				 * Verilen bir pozisyon karakteri tanımlı değilse varsayılan
				 * pozisyon, pozisyon karakteri meta alanda tanımlanan pozisyonu
				 * istiyorsa bunu, tanımlı değilse yine varsayılan pozisyonu,
				 * pozisyon karakteri ">" veya "<" ise bunlara özel pozisyon
				 * adını döndürür.
				 * 
				 * @param {String} pos bir pozisyon karakteri
				 * @param {String} short kısa veya tam isim
				 * @return {String}
				 */
				function findPosition( pos, short )
				{
					// pozisyon karakteri tanımlanmamışsa
					if( ! pos )

						// short da tanımlanamaz direkt üretip döndürelim
						return makePosition( pos );

					var info = meta[ short ] || {};

					// pozisyon karakteri varsayılanı kullan diyorsa
					if( pos == ":" )

						// varsa meta alandan, yoksa üretip döndürelim
						return info.position || makePosition( pos );

					// diğer pozisyon karakterleri overwrite anlamına geliyor
					return makePosition( pos );
				}

				var body = "";
				var meta = parseMeta( meta );
				var messages = parseMessages( messageBody );

				messages.forEach( function( current, i )
				{			
					var before = messages[ i - 1 ];
					var after  = messages[ i + 1 ];

					var sameBefore = before && before.name == current.name;
					var sameAfter = after && current.name == after.name;
					var orders =
					{
						only:  ! sameBefore && ! sameAfter,
						first: ! sameBefore,
						last:  ! sameAfter && sameBefore,
						middle:  sameBefore && sameAfter
					}

					var msgClass = []

					for( var order in orders )
					{
						if( orders[ order ])

							msgClass.push( order );
					}

					var user;

					if( ! sameBefore && current.name )
					
						user = '<div class="user">'+
		 							'<strong>' + current.name + '</strong>'+
			 					'</div>';

			 		else

			 			user = "";

					body += '<div class="msg align-' + current.position + '">'+
	 							user +
								'<p class="' + msgClass.join( " " ) + '">' + current.text + '</p>'+
							'</div>';
				});

				return body;
			}

			return '<div class="dia">' +
						full.replace( /^@(.*)([\w\W]+?)^@$/mg, renderMessages ) +
				   "</div>";
		}
	});
});
