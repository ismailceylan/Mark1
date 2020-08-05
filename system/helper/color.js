define(
[
	"./color/config",
	"./color/alpha-hex-to-percent",
	"./color/contrast",
	"./color/full-hex-to-rgb",
	"./color/get-black-or-white-for-hex",
	
	"./color/hex-to-a-mean",
	"./color/hex-to-luminanace",
	"./color/hex-to-rgb",
	"./color/is-hex-color",
	"./color/rgb-to-hex",
	"./color/short-hex-to-rgb",

],
function
(
	config, alphaHex2percent, contrast, fullHex2RGB, getBlackOrWhite4Hex,
	hex2aMean, hex2luminanace, hex2rgb, isHexColor, rgb2Hex, shortHex2rgb
)
{
	return {
		config: config,
		alphaHex2percent: alphaHex2percent,
		contrast: contrast,
		fullHex2RGB: fullHex2RGB,
		getBlackOrWhite4Hex: getBlackOrWhite4Hex,
		hex2aMean: hex2aMean,
		hex2luminanace: hex2luminanace,
		hex2rgb: hex2rgb,
		isHexColor: isHexColor,
		rgb2Hex: rgb2Hex,
		shortHex2rgb: shortHex2rgb
	}
});
