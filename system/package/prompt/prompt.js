define(
[
	'text!./view/body.xml',
	'text!./css/style.min.css',
	
	'system/library/validation',
	// 'system/helper/platform',
	// 'system/helper/object',
	'system/machine/anonstyle',
	'system/machine/pop/tooltip'
],
function( skeleton, styles, Validation, PlatformHelper, objectHelper )
{
	styles = styles.replace( /\s{2,}/mg, '' );

	/**
	 * Kullanıcıdan veri toplayan dialog penceresini standardize eder.
	 * 
	 * @param {String}       {title}  Dialog penceresinin başlığı
	 * @param {Array|jQuery} {fields} Input listesi
	 * @param {Function}     {onDone} Veri toplama bitip pencere kapatıldığında girdi alanlarındaki veriler
	 *                                geçirilerek çalışıtırılacak bir fonksiyon
	 * @param {Function}     onCancel Kullanıcı olumsuz seçim yaptığında çalıştırılacak işlev
	 */
	Dialog.prototype.prompt = function( title, fields, onDone, onCancel )
	{
		// dialog ana etki alanını yedekleyelim
		var dialog = this;

		/**
		 * Prompt işlevselliğini hayata geçiren ana metoddur. Prompt metodu
		 * dialog scope'una ait olacağı için daha geniş bir hareket alanı ve
		 * isim çakışmalarının önüne geçmek için işlevselliği ayrı bir alanda
		 * kodlamak daha mantıklı olacaktır.
		 */
		var handler = function()
		{
			// buradaki scope prompt işlevselliğini barındırıyor
			// bazı callback'lerde bu lazım olacağı için yedekliyoruz
			var root = this;

			/**
			 * Prompt'un varsayılan ayarlarını bir arada tutar.
			 * @type {Object}
			 */
			this.option = 
			{
				// yardım metni bu uzunluğu aşarsa dialog, aşmıyorsa tooltip olarak görüntülenir
				help_text_limit: 175,
				// yardım metni için tooltip kullanılacaksa ufak bir gecikmeyle çalışması faydalı olur
				help_tooltip_delay: 400,
				// error gösteren tooltiplerin ekranda kalacağı süre
				error_tooltip_duration: 2400,
				// hata gösteren tooltiplerin pozisyonları
				error_tooltip_position: 'top'
			}

			/**
			 * Prompt inputlarına testler uygulayıp istenen türde ve biçimde
			 * değerlerin girildiğinden emin olmamızı sağlayacak doğrulama
			 * arayüzünün örneğini tutar.
			 * 
			 * @type {validation}
			 */
			this.test = new Validation;

			/**
			 * Stilleri yönetecek arayüz
			 * @type {Anonstyle}
			 */
			this.styles = Anonstyle.new( 'prompt' );

			/**
			 * Dialog penceresinde bulunacak prompt gövdesini parçalarına ayırıp tutar.
			 * @type {Object}
			 */
			this.skeleton = new function()
			{
				// prompt penceresi butonlarını oluşturalım
				this.OK     = $( '<button id="OK" data-state="primary">OK</button>' );
				this.CLEAR  = $( '<button id="CLEAR" data-state="danger">Reset</button>' );
				this.CANCEL = $( '<button id="CANCEL" data-role="close">Cancel</button>' );

				this.body = $( skeleton );

				this.form = this.body.find( 'form' );
				this.list = this.form;
				this.err  = this.body.find( '.form-errors' );

				// her input için bir satır şeklinde tasarımımız olduğu için
				// iskelette de 1 tane örnek satır olduğu için onu oradan kesip alalım
				// daha sonra dinamik biçimde input sayısı kadar klonlayıp kullanacağız
				this.line = this.body.find( 'label' ).remove();

				// gövdeyi dialog içine gönderebiliriz
				dialog.body( this.body );
			}

			/**
			 * Gönderilen input bilgilerini tutan objectin özelliklerini, iskelette
			 * tasarlanmış prompt satırının bir klonunu doldurup döndürür.
			 * 
			 * @param  {Object} {line} input özellikleri
			 * @return {jQuery}
			 */
			this.line = function( line )
			{
				// iskeletten satırın bir klonunu alıp parçalarına ayıralım
				var item  = this.skeleton.line.clone();
				var span  = item.find( 'span' );
				var input = item.find( 'input' );
				var info  = span.find( 'i' ).remove();

				input.after( line ).remove();
				input = line;

				span.html( input.data( 'label' ));
				input.attr( 'name', 'prompt-' + input.attr( 'name' ).replace( 'prompt-', '' ));

				// inputun değeri, value tanımlıysa value, değilse default değer olmalı
				// o da tanımlı değilse boş kalabilir
				if( ! input.val() && ( def = input.data( 'default' )))

					input.attr( 'value', def );

				// checkbox ve radio gibi inputları sağa dayalı yapalım
				if([ 'checkbox', 'radio' ].indexOf( input.attr( 'type' )) > -1 )

					item.addClass( 'right-state clearfix' );

				// title tanımlıysa bununla inputun yardım olanaklarını geliştireceğiz
				// yapı olarak başlık=>>gövde yapısı benimsenmiştir string mutlaka bu şekilde
				// gelmek zorundadır. gövde uzunluğuna bakılarak yardım etme biçimi tooltip
				// veya dialog penceresi açmak şeklinde otomatik olarak belirlenir.
				if( helpText = input.attr( 'title' ) || input.data( 'help' ))
				{
					// mesajı başlık ve gövde olarak parçalayalım
					var msg = helpText.split( '=>>' );

					input.removeData( 'help' ).removeAttr( 'title' );

					// yardım metninin uzunluğu sınırı aşıyorsa info simgesi olan
					// üzerine gelince detaylı bilgi için tıklayınız diyen ve tıklandığında
					// dialog penceresi açan bir yardım işlevselliği sunacağız ayrıca
					// mobil sürümde çalışıyorsak direkt bu özelliği uygulayacağız
					if( helpText.length > root.option.help_text_limit || PlatformHelper.isMobile())
					{					
						span.prepend( info );

						// yardım alanının tıklanma olayını kendi olay yönetim arayüzü
						// üzerinden yöneteceğiz
						span.on( 'click', root.listener.onHelpLabelClick( msg[ 0 ], msg[ 1 ]));
					}
					// satırın label tutan etiketine tooltip biçiminde
					// yardım metnini verebiliriz
					else

						span.tooltip(
						{
							title: msg[ 1 ],
							delay: root.option.help_tooltip_delay // ufak bir gecikme iyidir
						});
				}

				// inputta değişiklik oldukça doğrulama işlemini başa alacağız
				// böylece her tepkiye dinamik bir bildirim mümkün olur
				input.on( 'change keyup paste', root.listener.onChange );

				// input satırımız yardım fasilitesiyle, label ve input alanlarıyla
				// vs hazır durumda şimdi buradaki input alanına rules ile belirtildiği
				// şekilde giriş yapılmasını garanti altına alan doğrulama arayüzüne
				// inputu gönderelim
				if( input.data( 'rules' ))

					root.test.add( input );

				// artık bu satır ile ilgili herşey tamam satırın jQuery örneğini
				// geriye döndürelim
				return item;
			}

			/**
			 * Prompt içinde gerçekleşen bir takım olaylar olur. Mesela bir input geniş
			 * yardım özelliğine sahipse üzerine tıklanması veya kullanıcı bir inputa
			 * bazı veriler girip tamam demiştir ancak girilen veri inputun bazı testlerde
			 * başarısız olmasına sebep olabilir bu durumda doğrulama arayüzü bir event
			 * tetikler işte bu tür iç olayları dinleyecek callback'ler burada bir arada
			 * tutulur.
			 * 
			 * @type {Object}
			 */
			this.listener = 
			{
				/**
				 * Prompt satırının label alanına tıklandığında tetiklenir.
				 *
				 * @param {String} {title} Açılacak alert dialoğunun başlığı
				 * @param {String} {body}  Dialoğun gövdesi
				 */
				onHelpLabelClick: function( title, body )
				{
					// bizden bir click olayı için listener beklendiği için
					// geriye bir function döndürmemiz gerekiyor
					return function()
					{
						// yardım metni için alert tipi dialog penceresi iş görür
						( new Dialog ).alert( body, undefined, { title: title });
					}
				},

				/**
				 * Bir inputta yapılan değişiklikleri dinler. Bu değişiklikler keyup, focus
				 * paste, cut gibi olayları tetikleyebilir. Hepsi bu metodu tetikleyecektir.
				 */
				onChange: function()
				{
					var el = $( this );

					// öncelikle inputta kurulu bulunan bir tooltip varsa
					// yok ediyoruz yoksa hata olmasa bile en son hata görünmeye devam eder.
					if( tt = el.data( 'tooltip' ))

						tt.destroy();

					// kontrol arayüzü sadece şuanki input için çalışsın
					// yaptığımız tüm kurulum sadece bu input varmış gibi çalışacaktır
					var isThisOK = root.test.run( this.name );

					if( isThisOK )
					
						// hata ile ilgili classlar varsa bunlar bir önceki
						// change olayından kalmıştır bunları temizleyelim
						el.parent()
							.removeClass( 'has-error' )
							.find( 'p' )
							.text( '' );

					// OK butonunun enable/disable durumu güncellensin
					root.updateOKButtonState();
				},

				/**
				 * validation nesnesinin run metodu tetiklendiğinde kayıtlı inputlarda
				 * testleri aşamayan olursa aşılamayan her bir kural için tetiklenir.
				 */
				onValidationError: function( evt, e )
				{
					e.each( function()
					{
						this.el
							.parent()
							.addClass( 'has-error' )
							.find( 'p' )
							.text( this.message );
					});
				},

				/**
				 * Dialog penceresinde bulunan OK idsine sahip butona tıklandığında tetiklenir.
				 */
				onOKclick: function()
				{
					// öncelikle doğrulama arayüzünü kayıtlı tüm inputları test etmesi için
					// tetikleyelim herhangi bir hata durumunda false dönecektir zaten
					if( root.test.run())
					{
						if( ! onDone )

							return;

						var r      = {}
						var inputs = root.skeleton.body
										.find( 'input,select,textarea' )
										.serializeObject();

						for( input in inputs )
						
							r[ input.replace( 'prompt-', '' )] = inputs[ input ];

						if( onDone instanceof Function )
						{
							onDone( r ) !== false && dialog.close();
						}
					}
					else

						// kullanıcı bir takım hatalar yapmış bu satıra gelmeden
						// validation nesnesi bir error eventi tetikledi bile yani
						// bizim bu olayı dinleyen listener'ımız gereken uyarıyı vs yaptı
						// burada başkaca işlemleri yapabiliriz
						return false;
				},

				/**
				 * Sıfırlama butonuna tıklandığında tetiklenir.
				 */
				onClearClick: function()
				{
					// tüm inputlaır boşaltalım
					root.skeleton.form[ 0 ].reset();
				},

				/**
				 * Prompt dialoğu ekrana gelmeden önce tetiklenir.
				 */
				onBeforeOpen: function()
				{
					// stilleri dökümana yazalım
					root.styles.push( 'all', styles );
				},

				/**
				 * Dialog penceresi açıldıktan sonra tetiklenir.
				 */
				onOpen: function()
				{
					root.skeleton.body.find( 'input' ).eq( 0 ).focus();
				},

				/**
				 * Prompt dialoğu kapandığında tetiklenir.
				 */
				onClose: function()
				{
					root.styles.destroy( 'all' );
				},

				/**
				 * Prompt formu resetlendiğinde tetiklenir.
				 */
				onReset: function()
				{
					root.skeleton.form.find( 'input,select,textarea' ).each( function()
					{
						var inp    = $( this );
						var parent = inp.parent();

							parent.removeClass( 'has-error' );
							parent.find( 'p' ).text( '' );
					});

					root.skeleton.err.html( '' );

					// OK butonunun enable/disable durumu güncellensin
					setTimeout( root.updateOKButtonState, 200 );
				},

				/**
				 * Dinlenecek olaylara olay dinleyicileri attach eder.
				 */
				attach: function()
				{
					$( dialog )
						.on( 'opened', this.onOpen )
						.on( 'closed', this.onClose );

					// beforeOpen olayı dialoğun açılıp açılmaması konusunda
					// kaderine karar verebilen bir yapısı olduğu için bunu
					// jQuery event mekanizması ile yapamadık bu yüzden olay
					// dinleyici native metot olarak attach etmemiz gerek
					dialog.beforeOpen = this.onBeforeOpen;

					// dialoğun OK idsine sahip butonunun click olayı bizim için önemli
					// bu olay tetiklenince inputların kontrol edileceği prosedürü başlatacağız
					$( root.skeleton.OK    ).on( 'click', this.onOKclick );
					$( root.skeleton.CLEAR ).on( 'click', this.onClearClick );

					// doğrulama arayüzünde bir başarısızlık oluşup oluşmadığını dinleyelim
					$( root.test ).on( 'error', this.onValidationError );

					// formun olaylarını dinleyelim
					root.skeleton.form.on( 'reset', this.onReset );
				}
			}

			/**
			 * OK görevi gören butonun disable veya enable durumunu
			 * test arayüzünü mevcut setup ile çalıştırarak buradan
			 * dönen test sonuçlarına bakarak ayarlar.
			 */
			this.updateOKButtonState = function()
			{
				var OK = dialog.action( 'OK' ).button;

				// tüm inputlar üzerinde testler çalıştırılsın
				var inputs = undefined;
				// test sonucunda hata varsa bir event
				// tetiklenmesin, durum buraya return edilsin
				var isSilent = true;
				// testi çalıştıralım
				var isAllOK = root.test.run( inputs, isSilent );

				isAllOK
					? OK.removeAttr( 'disabled' )
					: OK.attr( 'disabled', 'yes' );
			}

			/**
			 * Prompt formunun belirtilen pozisyonuna bir input ilave eder.
			 * 
			 * @param {Integer} index      inputun form içindeki sıralaması (0 tabanlı)
			 * @param {jQuery|HTMLElement} input ilave edilecek input
			 */
			this.add = function( index, input )
			{
				// form elemanlarını seçelim
				var items = this.skeleton.form.find( 'label' );

				// belirtilen index yoksa false dönelim
				if( ! items[ index ])

					return false;

				// inputu işleyelim
				input = this.line( input );

				items.eq( index ).before( input );
			}

			/**
			 * Pozisyon sıra numarası (0 tabanlı) veya adı (name) verilen inputu
			 * prompt formundan kaldırır.
			 * 
			 * @param {Integer|String} identify input pozisyonu veya adı
			 */
			this.remove = function( identify )
			{
				var el;

				// pozisyon sıra numarasını handle edelim
				if( typeof( identify ) == 'number' )
				{
					var items = this.skeleton.form.find( 'label' );
						el    = items.eq( identify );
				}
				else

					el = this.skeleton.form.find( '[name=prompt-' + identify + ']' ).parent();

				// validation arayüzünden inputu silelim
				root.test.inputs.remove( el.find( 'input,select,textarea' ).attr( 'name' ));
				// dökümandan input satırını silelim
				el.remove();
			}

			/**
			 * Verilen bir input için bir hata mesajı set eder.
			 * 
			 * @param {String} name   mesaj set edilecek inputun adı
			 * @param {String} errMsg hata mesajı
			 */
			this.setError = function( name, errMsg )
			{
				var line = this.skeleton.form
								.find( '[name=prompt-' + name + ']' )
								.parent();

				line
					.addClass( 'has-error' )
					.find( 'p' )
					.text( errMsg );
			}

			/**
			 * Prompt'u yapılandırır, son şeklini almasını sağlar.
			 */
			this.init = function()
			{
				// prompt penceresi en küçük kutu ve footer açık olsun
				dialog.state( 'action title close .col-xs-10 .col-xs-offset-1 '+
							  '.promptDialog .col-sm-8 .col-sm-offset-2 .col-md-6 '+
							  '.col-md-offset-3 .col-lg-4 .col-lg-offset-4' );

				// prompt başlığını set edelim
				dialog.title( title );

				// bir dialog nesnesi üzerinde bir kaç defa
				// prompt özelliği çalıştırılırsa html alanında
				// butonları tekrar tekrar çizmemek için bu alanı
				// sıfırlamamız gerekiyor
				dialog.action().destroy();

				this.skeleton.OK     = dialog.action( this.skeleton.OK     ).push().button;
				this.skeleton.CLEAR  = dialog.action( this.skeleton.CLEAR  ).push().button;
				this.skeleton.CANCEL = dialog.action( this.skeleton.CANCEL ).push().button;
			
				dialog.action().draw();

				// inputlar prompt gövdesine satır satır ilave olmalı biz sadece
				// input nesnesini alıp ondan bir satır oluşturacak metoda bir tane
				// inputu göndereceğiz ve ondan dönen değeri gövdeye ilave edeceğiz
				$( fields ).each( function()
				{
					root.skeleton.list.append( root.line( this ));
				});

				// doğrulama arayüzünü sessiz modda çalıştırarak daha kullanıcı hiçbir
				// girişimde bulunmadan formun durumuna genel bir bakış atalım
				// başarısız olan testler varsa OK butonu ilk anda disable olarak açılacak
				// testler sorunsuz ise disable olmasına gerek yok kullanıcı girdileriyle
				// testleri bozarsa bu sefer de OK butonu event listener içinde disable edilir
				
				this.updateOKButtonState();

				this.listener.attach();
			}
		}

		// prompt metodu çalıştığına göre bir tane handler örneği oluşturalım
		var prompt = new handler;
			prompt.init();

		// prompt kurulumu yapıldı dialog penceresini açabiliriz
		dialog.open();

		return prompt;
	}
});
