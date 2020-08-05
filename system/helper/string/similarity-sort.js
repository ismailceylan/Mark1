define(
[
	"system/library/metaphone/index",
	"system/library/levenshtein/index",
	
],
function( metaphone, levenshtein )
{
	/**
	 * Verilen sözcükler kümesindeki sözcükleri verilen sözcüğe
	 * en benzeyenden en az benzeyene doğru sıralayıp döndürür.
	 * 
	 * @param {String} needle kaynak sözcük
	 * @param {Array} haystack sözcük havuzu
	 * @return {Array}
	 */
	return function similaritySort( needle, haystack )
	{
		var pool = [];
		var needleMetaphone = metaphone( needle );

		haystack.forEach( function( item, i )
		{
			pool.push( new Number( levenshtein( needleMetaphone, metaphone( item ))));
			pool[ i ].word = item;
		});

		return pool.sort();
	}
});
