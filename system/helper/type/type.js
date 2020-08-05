define( function()
{
	/**
	 * Verilen değişkenin tür adını verir.
	 * 
	 * @param {mixed} variable herhangi bir değer
	 * @return {String}
	 */
	return function type( variable )
	{
		return Object.prototype.toString.call( variable )
			.match( /\[object (.*)\]/ )[ 1 ];
	}
});
