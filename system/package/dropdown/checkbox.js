define( function()
{
	window.DropdownCheckbox = DropdownCheckbox = function( o )
	{
		// check ana etki alanı
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
			label: 'check',
			value: null,
			checked: false,
			disabled: false
		}, o );

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			// gövdeyi oluşturalım
			this.body = $( '<item><li class="item check"><a href="#"></a></li></item>' );
			// check inputu
			this.check = $( '<input type="checkbox">' );
			// seçeneği seçelim
			this.item = this.body.find( '.item' );
			// link kısmını seçelim
			this.link = this.item.find( 'a' );

			this.check.attr( 'checked', root.option.checked );

			// seçenek içinde görünecek ifadeyi set edelim
			this.link
				.text( root.option.label )
				.prepend( this.check );
		}

		/**
		 * Olay dinleyiciler.
		 * @type {Object}
		 */
		this.listener = 
		{
			/**
			 * Seçeneğe tıklandığında tetiklenir.
			 */
			onClick: function()
			{
				// seçeneğe tıklandığında checkbox durumu değişmeli
				var checked = root.skeleton.check[ 0 ].checked = ! root.skeleton.check[ 0 ].checked;

				// dropdown seviyesinde olayı tetikleyelim
				$( root.option.parent ).trigger( 'change', checked );
				// öğe saviyesinde tetikleyelim
				$( root ).trigger( 'change', checked );

				return false;
			},

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

				$( root.skeleton.link )

					.on( 'click', this.onClick )
					.on( 'mouseover', this.onMouseover );

				// olayları attach ettiğimizi kaydedelim
				this.attached = true;
			},

			/**
			 * Dinlenen olayları dettach eder.
			 */
			dettach: function()
			{
				$( root.skeleton.link )

					.off( 'click' );

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
	 * Bir dropdown menüye check türünde seçenek ekler.
	 * 
	 * @param  {Object} o seçeneğin özellikleri
	 * @return {DropdownCheckbox}
	 */
	Dropdown.prototype.checkbox = function( o )
	{
		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownCheckbox( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.item );

		return item;
	}
});
