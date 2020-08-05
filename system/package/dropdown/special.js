define( function()
{
	window.DropdownSpecialItem = DropdownSpecialItem = function( o )
	{
		// seçeneğin ana etki alanı
		var root = this;

		/**
		 * Seçeneğin durumu.
		 * @type {Boolean}
		 */
		this.isDisabled = false;

		/**
		 * Seçenek özelliklerini tutar.
		 * @type {Object}
		 */
		this.option = $.extend(
		{
			skeleton: null,
			disabled: false
		}, o );

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			// gövdeyi oluşturalım
			this.body = $( root.option.skeleton );

			this.body.addClass( 'item special' );
		}

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Seçenek üzerine gelindiğinde tetiklenir.
			 */
			onMouseover: function()
			{
				// ekranda, bu dropdown'a ait açık bir alt menü varsa
				// bunu kapatalım
				if( ac = root.option.parent.activeChild )
				{
					ac.isLocked = false;
					ac.close();
				}
			},

			/**
			 * Dinlenecek olayları attach eder.
			 */
			attach: function()
			{
				// olaylar zaten attach edilmişse yine attach etmemeliyiz
				if( this.attached )

					return;

				$( root.skeleton.body )
					.on( 'mouseover', this.onMouseover );

				// olayları attach ettiğimizi kaydedelim
				this.attached = true;
			},

			/**
			 * Dinlenen olayları dettach eder.
			 */
			dettach: function()
			{
				$( root.skeleton.body )
					.off( 'mouseover' );

				this.attached = false;
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
			this.skeleton.item.remove();
		}

		/**
		 * Seçeneği disable veya enable yapar.
		 * @param {Boolean} mode seçeneğin disabled olup olmayacağı
		 */
		this.disabled = function( mode )
		{
			// true modunu ele alalım
			if( mode )
			{
				this.skeleton.item.addClass( 'disabled' );
				this.isDisabled = true;
				this.listener.dettach();
			}
			// false modunu ele alalım
			else
			{
				this.skeleton.item.removeClass( 'disabled' );
				this.isDisabled = false;
				this.listener.attach();
			}
		}

		/**
		 * Menü seçeneğinin kurulumunu yapar.
		 */
		this.init = function()
		{
			// seçenek dışarıdan verilen bir ayarla disable
			// edilmişse olaylarını dinlemeyeceğiz
			if( this.option.disabled )

				return;

			this.listener.attach();
		}
	}

	/**
	 * Bir dropdown menüye özel amaçlı bir seçenek ekler.
	 * 
	 * @param  {Object} o seçeneğin özellikleri
	 * @return {DropdownSpecialItem}
	 */
	Dropdown.prototype.special = function( o )
	{
		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownSpecialItem( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.body );

		return item;
	}
});
