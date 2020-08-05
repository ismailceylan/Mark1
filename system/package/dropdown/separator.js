define( function()
{
	window.DropdownSeparator = DropdownSeparator = function()
	{
		// option ana etki alanı
		var root = this;

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = $( '<li class="separator"></li>' );

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Dinlenecek olayları attach eder.
			 */
			attach: function()
			{

			},

			/**
			 * Dinlenen olayları dettach eder.
			 */
			dettach: function()
			{

			}
		}

		/**
		 * Seçeneği menüden siler.
		 */
		this.remove = function()
		{
			var root = this;

			// listeden silelim
			$( root.option.parent.items ).each( function( i )
			{
				if( this == root )

					root.option.parent.items.splice( i, 1 );
			});

			// DOM düğümünü silelim
			this.skeleton.remove();
		}

		/**
		 * Menü seçeneğinin kurulumunu yapar.
		 */
		this.init = function()
		{

		}
	}

	/**
	 * Bir dropdown menüye normal bir seçenek ekler.
	 * @return {DropdownSeparator}
	 */
	Dropdown.prototype.separator = function()
	{
		// öğeyi örnekleyelim
		var item = new DropdownSeparator();
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton );

		return item;
	}
});
