define(
[
	"./platform/browser",
	"./platform/is-mobile",

],
function( browser, isMobile )
{
	return {
		browser: browser,
		isMobile: isMobile
	}
});
