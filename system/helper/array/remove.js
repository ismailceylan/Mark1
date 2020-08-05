define( function()
{
		/**
		 * Pozisyonu verilen elemanı diziden siler. Dönen dizi eskisinin
		 * elemanlarını içeren yeni bir dizidir.
		 * 
		 * @param {Array} haystack elemanı silinecek olan dizi
		 * @param {Number} position silinecek elemanın dizi içindeki konumu
		 * @return {Array}
		 */
		return function arrRemove( haystack, position )
		{
			return haystack
				.slice( 0, position )
				.concat( haystack.slice( position + 1 ));
		}
});
