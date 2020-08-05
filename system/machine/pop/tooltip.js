define(
[
	'text!system/styles/tooltip.css',
	// 'system/helper/position',
	'system/machine/anonstyle',
	'system/machine/zindex'
],
function( styles, helperPosition )
{
	/**
	 * Ana işlemleri ayrı bir işlev içinde tutup her bir element için bir örnek
	 * yaratacağız ve her işlem kendi alanına sahip olacak.
	 */
	window.Tooltip = Tooltip = function( el, o )
	{
		// eklentinin iç etki alanını alt işlevler içinde kullanabilmek için
		// referanslayalım
		var root = this;

		/**
		 * Eklentinin anonim stillerini yönetmesini sağlayan arayüzü tutar.
		 * @type {Anonstyle}
		 */
		this.stylizer = Anonstyle.new( 'tooltip' );

		/**
		 * Verilen içerik metnini düzgün görüntülenecek biçimde yeniden işler.
		 * 
		 * @param  {Object String} str işlenecek string
		 * @return {Object String}
		 */
		this.parse_body = function( str )
		{
			if( typeof( str ) == 'string' )

				return str.replace( /([\r\n]?)(\r\n|\n\r|\r|\n)/mg, '<br>' );
		}

		this.options = $.extend(
		{
			title: '',
			position: 'top',
			max_width: 200,
			min_width: 75,
			min_height: 35
		},
		{
			title: this.parse_body( el.data( 'title' ) || el.attr( 'title' )),
			hide: el.data( 'hide' ),
			delay: el.data( 'delay' ),
			position: el.data( 'position' )
		}, o );

		/**
		 * tooltip gövdesini oluşturur ve ayarlarını düzenleyip ekranda
		 * göstermeye uygun hale getirir.
		 * 
		 * @type {Object}
		 */
		this.skeleton = new ( function()
		{
			var skeleton = '<div class="tooltip">'+
								'<div class="arrow"></div>'+
								'<div class="body noselect"></div>'+
							'</div>';

			this.body  = $( skeleton ).addClass( root.options.position );
			this.arrow = this.body.find( '.arrow' );
			this.inner = this.body.find( '.body'  ).html( root.options.title );

			// ilgili element için artık title özelliği gereksiz, silelim
			el.attr( 'data-title', root.options.title );
			el.removeAttr( 'title' );
		})();

		/**
		 * Katman yönetim arayüzünün örneğini tutar.
		 * @type {zindex}
		 */
		this.layer = new Zindex( 'tooltip' );

		/**
		 * Katman yöneticisine bir dinleyici kaydedelim. Böylece katman sıralamamız dışarıdan
		 * gerekiyorsa değiştirilebilir.
		 */
		this.layer.attach( function( z )
		{
			root.skeleton.body.css({ 'z-index': z });
		});

		/**
		 * Tooltipi ekrana getirir. Süre belirtilirse sonunda otomatik olarak kapatılır.
		 * 
		 * @param {Number} {hide} Belirtilirse tooltip ekrana geldikten sonra kapanır, milisaniye cinsinden değer almalıdır.
		 */
		this.show = function( hide )
		{
			$( document.body ).append( root.skeleton.body  );
					
			root.stylizer.push( 'all', styles );
			root.skeleton.body.css( root.calculate_position( )).show();

			if( hide || root.options.hide )
			{
				// en az 200 ms sınırı koyalım yoksa show işleminin bir anlamı kalmayacaktı
				// en azından şimdi ekranda 200 ms bile olsa görünüp kapanabilir
				hide = hide || root.options.hide;
				hide = hide < 200? 200 : hide;

				if( root.hide_timer ) clearTimeout( root.hide_timer );

				root.hide_timer = setTimeout( this.hide, hide );
			}
		}

		/**
		 * Tooltipi ekrandan kaldırır.
		 */
		this.hide = function()
		{
			clearTimeout( root.show_timer );
			
			root.skeleton.body.remove();
			
			// stilleri silmiyoruz dökümanda kalabilirler çünkü
			// tooltip bulunan elemanlar sıklıkla yan yana oluyorlar ve
			// mouse ile çoğunun üzerinden şöyle bir geçildiği için stil
			// ekle çıkar olmaması daha iyi
			// root.stylizer.destroy( 'all' );
		}

		/**
		 * Eklentinin olaylarını tutar.
		 * @type {Object event}
		 */
		this.event = 
		{
			/**
			 * Tooltip özelliği olması istenen elementin üzerine mouse ile gelinince
			 * olacakları düzenler.
			 */
			targetOver: function()
			{
				if( root.options.delay )
				{
					clearTimeout( root.show_timer );

					root.show_timer = setTimeout( root.show, root.options.delay );
				}
				else root.show();
			},

			/**
			 * Tooltip özelliği olması istenen elementin üzerinden mouse ile ayrılınca
			 * olacakları düzenler.
			 */
			targetOut: function()
			{
				root.hide();
			},

			listen: function()
			{
				el.on( 'mouseover',  this.targetOver )
				  .on( 'mouseleave', this.targetOut  );
			},

			stop: function()
			{
				el.off( 'mouseover mouseleave' );
			}
		}

		/**
		 * Verilen pozisyon ifadesini verilen eksende tersine döndürür.
		 * 
		 * @param  {Object String} pos   pozisyon ifadesi (örn: bottom-right)
		 * @param  {Object String} align ters çevirmenin uygulanacağı eksen [horizontal|vertical|all]
		 * @return {Object String}
		 */
		this.reverse_pos = function( pos, align )
		{
			var p = pos.split( '-' );
			var r = function( e )
			{
				if( e == undefined ) return '';
				if( e == 'left'    ) return 'right';
				if( e == 'right'   ) return 'left';
				if( e == 'top'     ) return 'bottom';
				if( e == 'bottom'  ) return 'top';
			}

			switch( align )
			{
				case 'horizontal':
					if( p.length == 1 ) p[ 0 ] = r( p[ 0 ]);
					else                p[ 1 ] = r( p[ 1 ]); break;

				case 'vertical': p[ 0 ] = r( p[ 0 ]); break;

				case 'all':
					p[ 0 ] = r( p[ 0 ]);
					p[ 1 ] = r( p[ 1 ]); break;
			}

			return p[ 0 ] + ( p[ 1 ]? '-' + p[ 1 ] : '' );
		}

		/**
		 * Aracın pozisyona uygun bir üst ve sol boşluğu hedef elementin boyutlarını da hesaba katarak
		 * hesaplayıp döndürür.
		 * 
		 * @return {Object String}
		 */
		this.calculate_position = function()
		{
			var pos = this.options.position
			
			var reverser = function( direction )
			{
				// sonsuz döngü olaması için sınır koyuyoruz
				if( el.data( 'tooltip-relocate-count' ) < 4 )

					root.relocate( root.reverse_pos( pos, direction ))

				else

					root.destroy();
			}

			var ver = function(){ reverser( 'vertical' )}
			var hor = function(){ reverser( 'horizontal' )}

			return helperPosition.alignment( pos, root.options.to || el, root.skeleton.body,
			{
				overflow:
				{
					right : hor,
					left  : hor,
					top   : ver,
					bottom: ver
				}
			});
		}

		/**
		 * Verilen konum türüne göre mevcut tooltip kurulumunu sonlandırıp yeni konuma göre
		 * tekrar örnekler.
		 * 
		 * @param {Object String} pos yeni örneğin alacağı konum [top,bottom,left,right...]
		 */
		this.relocate = function( pos )
		{
			var tooltip = new handler( el );
			this.destroy();

			el.data( 'position', pos );
			
			tooltip.init();
			tooltip.event.targetOver();
		}

		/**
		 * Tooltip gövdesini set eder.
		 * @param {Object String} str yeni değer
		 */
		this.body = function( str )
		{
			this.skeleton.inner.html( this.parse_body( str ));
		}

		/**
		 * İlgili kurulumu tamamen yokeder.
		 */
		this.destroy = function()
		{
			this.hide();
			this.event.stop();
			el.removeData( 'tooltip' );
		}

		/**
		 * Eklentinin kurulumunu gerçekleştirip gerekli tetiklemeleri yapar.
		 */
		this.init = function()
		{
			this.event.listen();

			if( old = el.data( 'tooltip' ))
			{
				old.destroy();
				el.removeData( 'tooltip' );
			}

			el.data( 'tooltip', this );
		}
	}

	$.fn.tooltip = function( o )
	{
		this.each( function()
		{
			var el = $( this );

			var tt = new Tooltip( el, o );
				tt.init();
		});

		return this;
	}

	return Tooltip;
});
