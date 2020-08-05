define(
[
	"./config",
	"./short-hex-to-rgb",
	"./alpha-hex-to-percent",
	"./full-hex-to-rgb",

],
function( config, shortHex2RGB, alphaHex2Percent, fullHex2RGB )
{
	/**
	 * Alpha renk karıştırma yüzdesini de içeren hexadecimal renk kodunu
	 * parçalarına ayırıp bunları ait oldukları isimlerle bir nesneye
	 * yerleştirir ve döndürür.
	 * 
	 * @param {String} hex hexadecimal renk kodu
	 * @param {Number} alphaSensitivity alpha değerinin hassasiyeti
	 * @return {Object}
	 */
	return function hex2RGB( hex, alphaSensitivity )
	{
		var match;

		if( ! hex || ! ( match = hex.match( config.hexadecimalRGBAPattern )))

			return;

		var alpha;

		hex = match[ 1 ];

		if( hex.length == 3 )

			return shortHex2RGB( hex );

		else if( hex.length == 4 )
			
			return Object.assign( shortHex2RGB( hex.slice( 0, 3 )),
			{
				alpha: alphaHex2Percent( hex.slice( -1 ), alphaSensitivity )
			});
		
		else if( hex.length == 6 )

			return fullHex2RGB( hex );

		else if( hex.length == 8 )

			return Object.assign( fullHex2RGB( hex.slice( 0, 6 )),
			{
				alpha: alphaHex2Percent( hex.slice( -2 ), alphaSensitivity )
			});
	}
});
