define( function()
{
	window.DropdownRadio = DropdownRadio = function( o )
	{
		// radio ana etki alanı
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
			name: 'radio',
			label: 'radio',
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
			this.body = $( '<item><li class="item radio"><a href="#"></a></li></item>' );
			// radio inputu
			this.radio = $( '<input type="radio">' );
			// seçeneği seçelim
			this.item = this.body.find( '.item' );
			// link kısmını seçelim
			this.link = this.item.find( 'a' );

			// inputa adını ve değerini yazalım
			this.radio
				.attr( 'checked', root.option.checked )
				.attr( 'name', root.option.name )
				.val( root.option.value );

			// seçenek içinde görünecek ifadeyi set edelim
			this.link
				.text( root.option.label )
				.prepend( this.radio );
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
				var checked = root.skeleton.radio[ 0 ].checked = ! root.skeleton.radio[ 0 ].checked;

				// dropdown seviyesinde olayı tetikleyelim
				$( root.option.parent ).trigger( 'change',
				{
					label: root.option.label,
					name: root.option.name,
					value: root.skeleton.radio.val()
				});
				
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
	 * Bir dropdown menüye radio türünde seçenek ekler.
	 * 
	 * @param  {Object} o seçeneğin özellikleri
	 * @return {DropdownRadio}
	 */
	Dropdown.prototype.radio = function( o )
	{
		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownRadio( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.item );

		return item;
	}
});
