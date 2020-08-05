define(
[
	'system/library/validation'
],
function( Validation )
{
	window.DropdownPrompt = DropdownPrompt = function( o )
	{
		// check ana etki alanı
		var root = this;

		/**
		 * Seçeneğin durumu.
		 * @type {Boolean}
		 */
		this.isDisabled = false;

		/**
		 * Girdi doğrulamasını yapacak arayüz örneği.
		 * @type {Validation}
		 */
		this.validator = new Validation;

		/**
		 * Seçenek özelliklerini tutar.
		 * @type {Object}
		 */
		this.option = $.extend(
		{
			name: 'dropdown-prompt-' + ( new Date ).getTime(),
			placeholder: 'prompt',
			value: null,
			rules: '',
			description: null,
			type: null,
			disabled: false
		}, o );

		/**
		 * Seçeneğinin iskeletini tutar.
		 * @type {Object}
		 */
		this.skeleton = new function()
		{
			var skeleton = '<item>'+
								'<li class="item prompt">'+
									'<a></a>'+
								'</li>'+
						   '</item>';

			// gövdeyi oluşturalım
			this.body = $( skeleton );
			// check inputu
			this.input = $( '<input>' );
			// seçeneği seçelim
			this.item = this.body.find( '.item' );
			// link kısmını seçelim
			this.link = this.item.find( 'a' );
			// hata listesi
			this.error = $( '<div class="error"></div>' );

			this.input
				.attr( 'name', root.option.name )
				.attr( 'type', root.option.type || 'text' )
				.attr( 'data-rules', root.option.rules )
				.val( root.option.value );
			
			if( dsc = root.option.description )
			{
				this.desc = $( '<p></p>' );
				this.desc.text( dsc );
				this.link.append( this.desc );
			}

			// seçenek içinde görünecek ifadeyi set edelim
			this.input.attr( 'placeholder', root.option.placeholder );
			this.link.append( this.input );

			// inputu doğrulama arayüzüne ilave edelim
			root.validator.add( this.input );
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

				// inputa focus olalım
				root.skeleton.input.focus();
			},

			/**
			 * Input içinde bir tuş indiği anda tetiklenir.
			 * 
			 * @param  {KeyboardEvent} e tuş bilgileri
			 * @return {Boolean}
			 */
			onKeydown: function( e )
			{
				// down sırasında enter tuşunu devre dışı
				// bırakırsak form submit edilemeyecektir
				// keyup aşamasında yine enter durumunu
				// yakalayıp handle edebileceğiz
				if( e.keyCode == 13 )

					return false;
			},

			/**
			 * İnput içinde bir tuşa basıldığında tetiklenir.
			 * 
			 * @param  {KeyboardEvent} e tuş bilgileri
			 * @return {Mixed}
			 */
			onKeyup: function( e )
			{
				// önce girilen bilgileri test edelim
				if( ! root.validator.run())
				
					return;

				else

					// seçenekte varsa önceki hataları silelim
					root.skeleton.link.find( '.error' ).remove();

				// enter tuşunu handle edelim
				if( e.keyCode == 13 )

					return root.listener.onEnter();
			},

			/**
			 * Enter tuşuna basıldığında tetiklenir.
			 * @return {Boolean}
			 */
			onEnter: function()
			{
				// dropdown seviyesinde olayı tetikleyelim
				$( root.option.parent ).trigger( 'change',
				{
					name: root.option.name,
					value: root.skeleton.input.val()
				});

				// öğe seviyesinde tetikleyelim
				$( root ).trigger( 'change', root.skeleton.input.val());

				// enter olayı formu submit edeceğinden false dönerek bunu engelleyelim
				return false;
			},

			/**
			 * Girilen bilgi gereken şartları sağlamadığında tetiklenir.
			 * @param {Object} err mevcut hatalar ve bunları yönetmeyi sağlayan arayüz
			 */
			onValidationError: function( evt, err )
			{
				// seçenekte varsa önceki hataları silelim
				root.skeleton.link.find( '.error' ).remove();

				// her hatayı seçenek altına sıralayalım
				err.each( function()
				{
					var error = root.skeleton.error.clone();
						error.text( this.message );

					root.skeleton.link.append( error );
				});
			},

			/**
			 * Dinlenecek olayları attach eder.
			 */
			attach: function()
			{
				// olaylar zaten attach edilmişse yine attach etmemeliyiz
				if( this.attached )

					return;

				// seçenekteki link olayları
				$( root.skeleton.link )
					.on( 'click', this.onClick )
					.on( 'mouseover', this.onMouseover )
					.on( 'keydown', this.onKeydown )
					.on( 'keyup', this.onKeyup );

				// doğrulama olayları
				$( root.validator )
					.on( 'error', this.onValidationError );

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
	 * Bir dropdown menüye prompt türünde seçenek ekler.
	 * 
	 * @param  {Object} o seçeneğin özellikleri
	 * @return {DropdownPrompt}
	 */
	Dropdown.prototype.prompt = function( o )
	{
		// dropdown ana etki alanını ekleyelim
		o.parent = this;

		// öğeyi örnekleyelim
		var item = new DropdownPrompt( o );
			item.init();

		this.items.push( item );

		// öğeyi menüye de ekleyelim
		this.skeleton.list.append( item.skeleton.item );

		return item;
	}
});
