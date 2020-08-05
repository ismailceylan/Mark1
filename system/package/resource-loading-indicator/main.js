define(
[
	'text!./css/style.css',
	'../../machine/anonstyle'
],
function( styles )
{
	return function ResourceLoadingIndicator()
	{
		// ana etki alanı
		var root = this;

		/**
		 * Toplam aşama sayısı.
		 * @type {Number}
		 */
		this.steps = 0;

		/**
		 * Tamamlanan aşama sayısı.
		 * @type {Number}
		 */
		this.current = 0;

		/**
		 * Stil yönetim arayüzü.
		 * @type {Anonstyle}
		 */
		this.styles = Anonstyle.new( 'resource-loading-indicator' );

		/**
		 * İskeleti tutar.
		 * @type {object}
		 */
		this.skeleton = new function()
		{
			this.body = $( '<div id="resource-loading-indicator"><div></div></div>' );
			this.indicator = this.body.find( 'div' );
		}

		/**
		 * Göstergeye bir aşama ekler.
		 * @param {integer} steps eklenecek aşama sayısı (varsayılan 1)
		 */
		this.addStep = function( steps )
		{
			this.steps += steps || 1;
			this.show();
		}

		/**
		 * Göstergeden bir aşama düşer.
		 * @param {integer} steps düşülecek aşama sayısı (varsayılan 1)
		 */
		this.removeStep = function( steps )
		{
			this.steps -= steps || 1;
		}

		/**
		 * Bir adet aşamayı tamamlandı olarak işaretler. Hiç
		 * aşama kalmamışsa göstergeyi gizler.
		 */
		this.check = function()
		{
			if( this.current < this.steps )
			{
				this.current++
				this.skeleton.indicator.width(( this.current * 100 / this.steps ) + '%' );

				if( this.current >= this.steps )
				
					this.hide( function()
					{
						root.reset();
					});
			}
			else
			
				this.hide( function()
				{
					root.reset();
				});
		}

		/**
		 * Göstergeyi sıfırlar.
		 * @return {this}
		 */
		this.reset = function()
		{
			this.steps =
			this.current = 0;
			this.skeleton.indicator.width( 0 );

			return this;
		}

		/**
		 * Göstergeyi gizler.
		 * @param {Function} callback gizleme işlemi bittiğinde tetiklenecek bir metot
		 */
		this.hide = function( callback )
		{
			setTimeout( function()
			{
				root.skeleton.body.hide( function()
				{
					if( callback ) callback();
				});
			},
			1000 );
		}

		/**
		 * Göstergeyi görünür yapar.
		 */
		this.show = function()
		{
			root.skeleton.body.show();
		}

		/**
		 * Kurulumu gerçekleştirir.
		 */
		this.init = function()
		{
			this.styles.push( 'all', styles );

			var target = $( '.all' );

			if( target.length == 0 )

				target = $( 'body' );

			target.prepend( this.skeleton.body );

			return this;
		}

		this.init();
	}
});
