define( function()
{
	/**
	 * Cihazın mobil olup olmadığını söyler.
	 * @return {Boolean}
	 */
	return function isMobile()
	{
		return window.screen.availWidth < 769;
	}
});
