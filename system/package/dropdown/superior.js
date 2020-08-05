define( function()
{
	window.DropdownSuperior = DropdownSuperior = function( o )
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
			label: 'option',
			icon: null,
			disabled: false,
			dropdown: null
		}, o );

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			var icon;
			
			// gövdeyi oluşturalım
			this.body = $( '<item><li class="item superior"><a href="#"></a></li></item>' );
			// ok işareti
			this.caret = $( '<i class="subicon fa fa-fw fa-caret-right"></i>' );
			// seçeneği seçelim
			this.item = this.body.find( '.item' );
			// link kısmını seçelim
			this.link = this.item.find( 'a' );
			// simgeyi tanımlayalım
			this.icon = null;
			
			// seçenek içinde görünecek ifadeyi set edelim
			this.link.text( root.option.label );

			this.link.append( this.caret );

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
				clearTimeout( this.longWaitingTimerOpen );
				root.openSubMenu();
				return false;
			},

			/**
			 * Seçenek üzerine gelindiğinde tetiklenir.
			 */
			onMouseOver: function()
			{
				clearTimeout( this.longWaitingTimerOpen );

				this.longWaitingTimerOpen = setTimeout( function()
				{
					root.openSubMenu();
				},
				250 );
			},

			/**
			 * Seçenek üzerinden gidildiğinde tetiklenir.
			 */
			onMouseOut: function()
			{
				clearTimeout( this.longWaitingTimerOpen );
			},

			/**
			 * Alt menü ekrana geldiğinde tetiklenir.
			 */
			onSubMenuOpened: function()
			{
				// kendimizi seçili aktif hale getirelim
				root.skeleton.item.addClass( 'active' );

				// bizden önce, ait olduğumuz dropdown altında başka bir
				// alt menü açılmış veya ekranda açık duruyor olabilir
				// bu menüyü kapatalım
				if( ac = root.option.parent.activeChild )
				{
					ac.isLocked = false;
					ac.close();
				}

				// bizi barındıran dropdown menüye az önce açtığımız
				// dropdown'ı çocuk olarak kaydedelim
				if( dd = root.option.dropdown )

					root.option.parent.activeChild = root.option.dropdown;
			},

			/**
			 * Alt menü kapandığında tetiklenir.
			 */
			onSubMenuClosed: function()
			{
				// kendimizi seçili halden çıkaralım
				root.skeleton.item.removeClass( 'active' );

				// alt menünün varsa alt menüleri de kapansın
				if( ac = root.option.dropdown.activeChild )
				{
					// kilit varsa önce onu kaldıralım
					ac.isLocked = false;
					ac.close();
				}
			},

			/**
			 * Alt menü üzerine mouse ile gelince tetiklenir.
			 */
			onSubMenuHover: function()
			{
				
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
					.on( 'mouseover', this.onMouseOver )
					.on( 'mouseout', this.onMouseOut );

				if( subDD = root.option.dropdown )
				{
					$( subDD )
						.on( 'open', this.onSubMenuOpened )
						.on( 'close', this.onSubMenuClosed );

					$( subDD.skeleton.popup.skeleton.body )
						.on( 'mouseover', this.onSubMenuHover );
				}

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
		 * Alt menüyü açar.
		 */
		this.openSubMenu = function()
		{
			if( dd = this.option.dropdown )
			{
				// menu popup'ını seçeneğe hizalayalım
				dd.skeleton.popup.options.to = this.skeleton.link;
				dd.skeleton.popup.options.align = 'start-top-right';

				dd.open();
			}
		}

		/**
		 * Alt menüyü gizler.
		 */
		this.closeSubMenu = function()
		{
			if( dd = this.option.dropdown )

				dd.close();
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

			if( subDD = this.option.dropdown )
			{
				// alt menüye parent dropdown'ın kim olduğunu söyleyelim
				subDD.parent = this.option.parent;
				// alt menü seviyesi üst menüden alınsın
				subDD.level = subDD.parent.level + 1;
			}

			this.listener.attach();
		}
	}

	/**
	 * Bir dropdown menüye normal bir seçenek ekler.
	 * 
	 * @param {Object} o seçeneğin özellikleri
	 * @return {DropdownSuperior}
	 */
	Dropdown.prototype.superior = function( o )
	{
		// temsil edilen dropdown ile trigger edilecek dropdown
		// aynıysa (inception:xd) işlem sonsuz döngü oluşacaktır
		if( this === o.dropdown )

			throw Error( 'Infinite parent-child relationship detected.' );

		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownSuperior( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.item );

		return item;
	}
});
