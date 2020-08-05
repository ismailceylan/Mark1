define(
[
	"../argument/deft",
	"../type/is",
	"./normalize",

],
function( deft, is, normalize )
{
	/**
	 * Verilen saniye cinsinden zamanı zaman
	 * gösterimi olarak yeniden düzenler.
	 *
	 * Zaman Biçimlendiriciler
	 *   Y: yıl sayısı
	 *   MN: ay sayısı
	 *   D: gün sayısı
	 *   
	 *   hh: 01 iki basamak saat
	 *   h:   1 tek basamak saat
	 *   
	 *   M: 02 iki basamak dakika
	 *   m:  2 tek basamak dakika
	 *   
	 *   S: 03 iki basamak saniye
	 *   s:  3 tek basamak saniye
	 *
	 *   ms: 3 basamaklı milisaniye
	 * 
	 * @param {Number} miliseconds saniye cinsinden bir zaman
	 * @param {String} pattern zaman gösterim damgası (y m d H:M:S.ms)
	 * @param {Boolean} shortTerm true olursa zaman birim isimleri kısa
	 * gösterilir false olursa uzun gösterilir y=yıl, gün=g gibi
	 * @param {Boolean} noZero true olduğunda istenen bir değer
	 * sıfırsa dizgiye yerleştirilmez
	 * @return {String}
	 */
	return function ms2time( miliseconds, pattern, shortTerms, noZero )
	{
		// varsayılanlar
		shortTerms = deft( shortTerms, true );
		noZero = deft( noZero, true );
		pattern = deft( pattern, "hh:mm:ss" );

		if( noZero )

			pattern = "Y MN D hh:mm:ss";

		if( is( miliseconds, "empty" ))

			miliseconds = ( new Date ).getTime();

		if( is( miliseconds, "numeric" ))

			miliseconds = parseInt( miliseconds, 10 );

		else

			throw TypeError( "Milisaniye cinsinden geçerli bir sayısal değer bekleniyor: " + miliseconds );

		var normal = normalize( miliseconds );
		var terms =
		{
			y: [ "yıl", "y" ],
			mn: [ "ay", "a" ],
			d: [ "gün", "g" ],
			h: [ "saat", "sa" ],
			m: [ "dakika", "dk" ],
			s: [ "saniye", "sn" ],
			ms: [ "milisaniye", "ms" ]
		}

		function trimming( value )
		{
			if( noZero && value < 1 )

				return "";

			return value;
		}

		function naming( group, value )
		{
			if( ! value )

				return value;

			if( ! shortTerms )

				value += " ";

			return value + terms[ group ][ shortTerms? 1 : 0 ];
		}

		function padding( value )
		{
			return value.toString().padStart( 2, "0" );
		}

		function nt( group, value )
		{
			return naming( group, trimming( value ));
		}

		function np( group, value )
		{
			return naming( group, padding( value ));
		}

		var replacementMap =
		[
			[ "Y", nt( "y", normal.year )],
			[ "MN", nt( "mn", normal.month )],
			[ "D", nt( "d", normal.day )],
			[ "ms", nt( "ms", normal.milisecond )],

			[ /hh\*/i, np( "h", normal.hour )],
			[ /h\*/i, naming( "h", normal.hour )],
			[ /hh/i, padding( normal.hour )],
			[ /h/i, normal.hour ],

			[ /mm\*/, np( "m", normal.minute )],
			[ /m\*/, naming( "m", normal.minute )],
			[ /mm/, padding( normal.minute )],
			[ /m/, normal.minute ],

			[ /ss\*/, np( "s", normal.second )],
			[ /s\*/, naming( "s", normal.second )],
			[ /ss/, padding( normal.second )],
			[ /s/, normal.second ],
		];

		var data = [];

		replacementMap.forEach( function( item, i )
		{
			pattern = pattern.replace( item[ 0 ], "{#" + i + "}" );
			data.push( item[ 1 ]);
		});

		data.forEach( function( value, i )
		{
			pattern = pattern.replace( "{#" + i + "}", value );
		});

		return pattern.trim();
	}
});
