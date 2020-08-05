define(
[
	"./typo/filesize",
	"./typo/ellipsize",
	"./typo/capitalize",
	"./typo/camel-to-dash",
	"./typo/dash-to-camel",
	"./typo/number-to-kilo",

],
function( filesize, ellipsize, capitalize, camel2dash, dash2camel, n2k )
{
	return {
		filesize: filesize,
		ellipsize: ellipsize,
		capitalize: capitalize,
		camel2dash: camel2dash,
		dash2camel: dash2camel,
		n2k: n2k
	}
});
