define(
[
	"system/core/trait",

],
function( Trait )
{
	return Trait( "Actionable" ).prototype(
	{
		/**
		 * Dialog işlem butonları yığını.
		 * @type {Array}
		 */
		actions: {},

		/**
		 * Verilen bir HTMLButton veya jQuery button nesnesi veya bir buton ID ismi
		 * gibi değerden yola çıkarak geriye bu butona özel çalışacak bir arayüz
		 * döndürerek bu buton üzerinde dialog işlemleri yapmayı sağlar.
		 * 
		 * @param  {String|jQuery|HTMLButtonElement} button button ID adı, jQuery buton veya HTMLButton nesnesi
		 * @return {Object}
		 */
		action: function( button )
		{
			// dialog ana etki alanını yedekleyelim
			var dialog = this;

			// önce string durumunu handle edelim bunu ID adı
			// olarak kabul edeceğiz
			if( is( button, 'string' ))
			{
				// kendi tuttuğumuz button listesinde bu isimde
				// bir buton yoksa işlem yapılacak buton bilinmiyordur
				for( var name in this.actions )
				{
					if( this.actions[ name ].attr( 'id' ) == button )

						button = this.actions[ name ];
				}

				if( ! ( button instanceof jQuery ))

					return undefined;
			}
			// jQuery ile seçilmiş bir element veya native bir elementse handle edelim
			else if( button instanceof jQuery || button instanceof HTMLElement )
			
				button = $( button );
			
			// undefined yani hiç parametre verilmezse reset veya rebuild gibi butona
			// gerek olmayan metotların çalışabilmesi için yine de arayüzü döndürmeliyiz
			else if( button === undefined )
			{
				// durumu handle ettik süreç
				// bu if bloğunun sonuna atlayacak
			}
			// öylesine bir nesne gönderilmiş
			else

				return undefined;

			// scope tanımları tamam şimdi bu scopeları
			// kullanan arayüzü döndürebiliriz
			return {

				/**
				 * Arayüzün temsil ettiği buton nesnesi.
				 * @type {jQuery}
				 */
				button: button,

				/**
				 * Temsil edilen butonu veya parametre ile verilen
				 * butonu veya bütün buton listesini dialoğa ekler.
				 * 
				 * @param {jQuery|HTMLButtonElement} btn eklenecek bir buton nesnesi
				 */
				draw: function( btn )
				{
					buttons = btn || button || dialog.actions;

					$( buttons ).each( function()
					{
						var bt = $( this );

						// actions etki alanını yedekleyelim
						var self = dialog.actions;

						// buttonda default olması gereken özellikleri verelim
						bt.addClass( 'pull-right btn btn-sm col-xs-12' );

						// data özellikleriyle buton yapısını geliştirelim
						if( state = bt.data( 'state' ))

							bt.addClass( 'btn-' + state );

						if( bt.data( 'focus' ) == 'yes' )
						
							$( dialog ).on( 'opened', function()
							{
								bt.focus();
							});

						// buttonu dialoğa ekleyelim
						dialog.view.$action.append( bt );

						// buton kapatma özelliğine sahipse kapatma olayı ekleyelim
						if( bt.data( 'role' ) == 'close' )
						
							bt.on( 'click', function()
							{
								dialog.close();
							});
					});
				},

				/**
				 * Temsil edilen butonu sadece listeye ekler.
				 */
				push: function()
				{
					// actions etki alanını yedekleyelim
					var self = dialog.actions;
					// butonu sıra numarasıyla ekleyelim
					self[ self.length ] = button;

					return this;
				},

				/**
				 * Dialog penceresinin kapatıldığında
				 * yapılması gereken bazı işleri halleder.
				 */
				reset: function()
				{
					// dialog buton alanını boşaltalım
					dialog.view.$action.html( '' );

					return this;
				},

				/**
				 * Dialoğun butonlarını fabrika ayarlarına getirir.
				 */
				destroy: function()
				{
					dialog.actions = [];
					dialog.view.$action.html( '' );

					return this;
				}
			}
		}
	});
});
