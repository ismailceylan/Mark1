define( function()
{
	window.DropdownItem = DropdownItem = function( o )
	{
		// option ana etki alanı
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
			name: null,
			label: 'option',
			value: null,
			icon: null,
			disabled: false
		}, o );

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			// gövdeyi oluşturalım
			this.body = $( '<item><li class="item option"><a href="#"></a></li></item>' );
			// seçeneği seçelim
			this.item = this.body.find( '.item' );
			// link kısmını seçelim
			this.link = this.item.find( 'a' );
			// simgeyi tanımlayalım
			this.icon = null;

			// seçenek içinde görünecek ifadeyi set edelim
			this.link.text( root.option.label );

			// bir icon tanımlanmışsa seçeneğe simge de ekleyelim
			if( icon = root.option.icon )
					
				this.link
					.prepend( $( '<i class="icon fa fa-fw"></i>' ).addClass( icon ));
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
				// dropdown seviyesinde olayı tetikleyelim
				$( root.option.parent ).trigger( 'select', data =
				{
					name: root.option.name,
					label: root.option.label,
					value: root.option.value
				});
				// öğe saviyesinde tetikleyelim
				$( root ).trigger( 'select', data );

				// bu menüyü kapatalım
				root.option.parent.bubbleClose();

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
	 * Bir dropdown menüye normal bir seçenek ekler.
	 * 
	 * @param  {Object} o seçeneğin özellikleri
	 * @return {DropdownItem}
	 */
	Dropdown.prototype.item = function( o )
	{
		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownItem( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.item );

		return item;
	}
});
