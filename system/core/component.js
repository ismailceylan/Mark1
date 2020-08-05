define(
[
	"system/core/type",
	"system/core/view",
	"system/core/traits/assignable",
	"system/helper/string/assign",

	"system/machine/anonstyle",

],
function( Type, View, Assignable, assign )
{
	return Type( "Component" ).use( Assignable ).prototype(
	{
		/**
		 * Zincirleme assign çağrısı
		 * yapabilme özelliğini aktive eder.
		 * 
		 * @type {Boolean}
		 */
		chainableAssignments: true,

		/**
		 * Bir kez assign edilen component
		 * bir daha assign edilemesin.
		 * 
		 * @type {Boolean}
		 */
		isAssignmentsOverwriteable: false,

		/**
		 * Render edilmiş bileşen stilleri yığını.
		 * @type {String}
		 */
		styles: "",

		/**
		 * Temsil edilen component'in html yapısı.
		 * @type {String}
		 */
		skeleton: "",

		/**
		 * Temsil edilen bileşenin html
		 * tarafını temsil eden arayüz.
		 * 
		 * @type {View}
		 */
		view: null,

		/**
		 * Component'in html iskeletine assign
		 * edilecek değişkenleri tutar.
		 * 
		 * @type {Object}
		 */
		data: null,

		/**
		 * Kurulumu yapar.
		 */
		construct: function()
		{
			this.data = {};

			if( this.listeners && this.listeners instanceof Function )

				this.listeners = new this.listeners( this );
		},

		/**
		 * Component stillerini dökümana verilen isimle
		 * yerleştirir. Bir isim verilmezse tür adı kullanılır.
		 * 
		 * @param {Object} options özellikler, ayarlar
		 * @return {this}
		 */
		stylize: function( options )
		{
			var anon = Anonstyle.new( this.type.name );

			for( var type in options )
			
				anon.push( type, options[ type ]);

			return this;
		},

		/**
		 * Verilen iskeletten bir view oluşturur.
		 * @return {this}
		 */
		makeView: function( skeleton, data, toucher, toucherArg )
		{
			// view oluşturulmamışsa oluşturalım
			if( ! this.view )
				
				this.view = View.new(
					skeleton || this.skeleton,
					data || this.data,
					toucher || this.touch,
					toucherArg || this
				);

			return this;
		},

		/**
		 * Adı verilen örneklenmiş component nesnesini döndürür.
		 * 
		 * @param {String} name component adı
		 * @return {Component}
		 */
		component: function( name )
		{
			return this[ name + "_instance" ];
		},

		/**
		 * Componenti yıkar.
		 */
		destroy: function()
		{
			this.view.remove( "root" );
			Anonstyle.new( this.type.name ).destroy( "all" );
		},

		/**
		 * Assign edilmiş componentleri render eder, adı verilen
		 * element içine yerleştirir, stillerini toplar.
		 */
		render: function()
		{
			this.makeView();

			// bu bileşenle birlikte alt bileşenler de render edilsin
			this.each( function( name, assignment, root )
			{
				if( root.handleRenderedComponent( name ))

					return;

				var component = root.makeComponentInstance( assignment );

				root.embed( name,
					root.extractSourceElementFromComponent( component ),
					root.getTargetElementFromView( name, component )
				);

				// component stillerini yığına ekleyelim
				root.styles += component.styles;

				// component instance'ına bu nesne üzerinden erişilebilsin
				root[ name + "_instance" ] = component;
			});

			// bu bileşene ve render edildikleri için alt
			// bileşenlerin linkleri pushstate yapılsın
			app.navigate.linkify( this.view.$root );
		},

		/**
		 * Adı verilen component zaten render edilmişse gerekli
		 * tazeleme işlemlerini yapıp true döner. Render edilmiş
		 * bir component yoksa false döndürülür.
		 * 
		 * @param {String} name component adı
		 * @return {Boolean}
		 */
		handleRenderedComponent: function( name )
		{
			var component = this[ name + "_instance" ];

			// bu sınıf üzerinde bu isimde bir component daha önceden
			// render edilmiş olabilir böyle bir durum varsa tekrar
			// component örneklemek yerine bu instance'ın refresh
			// metodunu çalıştırırız böylece bileşenler kaybolabilecek
			// bilgilerini bu metot içinden tazeleme şansı elde ederler
			// yeniden kurulum maliyetinden de kurtuluruz
			if( component )
			{
				component.refresh &&
					component.refresh();

				return true;
			}

			return false;
		},

		/**
		 * Assign edilmiş component kurucusu ve parametreleriyle
		 * ilgili componentin bir örneğini oluştururp döndürür.
		 * 
		 * @param {Array} assignment assign edilmiş component ve parametreleri
		 * @return {Component}
		 */
		makeComponentInstance: function( assignment )
		{
			// ilk öğe component kurucusu
			// kalanlar component parametreleri
			var TargetComponent = assignment[ 0 ];

			var component = TargetComponent.new.apply( TargetComponent, assignment.slice( 1 ));

				// örneklediğimiz component içine kendisini
				// çağıran bu componenti linkleyelim
				component.parent = this;
				// tazeleme metodu tanımlamışsa çalıştıralım
				component.refresh && component.refresh();

			return component;
		},

		/**
		 * Bu bileşenin view nesnesi üzerindeki adı verilen elementi
		 * döndürür. Element mevcut değilse uygun bir istisna fırlatılır.
		 * 
		 * @param {String} name view içindeki bir element adı
		 * @param {Component} component adı verilen elemente yerleştirilecek olan component
		 * @return {jQuery}
		 */
		getTargetElementFromView: function( name, component )
		{
			var target = this.view.fetch( name );

			// component assign edilen nesnenin view'ında assign edilen
			// componentlerle aynı isimde bir element olmalı yoksa componentleri
			// nereye yerleştireceğimizi bilemeyiz
			if( ! target )
			{
				var message =
				[
					'"{{current}}" isimli component\'e "{{target}}" isimli',
					'bir component "{{field}}" adıyla enjekte edildi ancak "{{current}}", view',
					'tarafında "{{field}}" adında bir field tanımlamadığı için "{{target}}"',
					'component\'ini yerleştirecek bir yer bulamadık!'
				];

				throw ReferenceError( assign( message.join( " " ),
				{
					current: this.type.name,
					target: component.type.name,
					field: name
				}));
			}

			return target;
		},

		/**
		 * Verilen component nesnesi, view tarafını direkt bir component
		 * olarak tanımlamışsa ya bu component elementinin iç kısmını
		 * (innerHTML) ya da bu element içindeki bir elemente adıyla
		 * refere ediyorsa bu elementi döndürür. Sonuç olarak bileşen,
		 * hedefe yerleştirilirken component elementiyle değil bunun iç
		 * kısmıyla yerleşir.
		 * 
		 * @param {Component} component bir component
		 * @return {jQuery}
		 */
		extractSourceElementFromComponent: function( component )
		{
			// bileşeni oluştururken kök element olarak <component etiketi
			// kullanılmış olabilir bu durumda bunun iç kısmını alacağız
			var source = component.view.$root;

			if( source && source[ 0 ].tagName == "COMPONENT" )
			{
				var finlly;

				// <component finally="NAME"> tanımı varsa bunu yoksa
				// yine root'un içini alacağız
				if( finlly = source.attr( "finally" ))

					source = component.view.fetch( finlly );

				else

					source = source.html();
			}

			return source;
		},

		/**
		 * Verilen kaynağa verilen hedefi yerleştirir. Hedef element
		 * <component> şeklinde bir yer gösterici ise kaynak element
		 * bunun hemen sonrasına gömülür ve yer gösterici silinir.
		 *
		 * @param {String} name hedef element adı
		 * @param {jQuery} target hedef element
		 * @param {jQuery} source yerleştirilecek element
		 */
		embed: function( name, source, target )
		{
			// hedef element <component> şeklinde tanımlanmışsa bunu
			// bir yer gösterici olarak kullanacağız ve işimiz bitince
			// sileceğiz
			if( target[ 0 ].tagName == "COMPONENT" )
			{
				this.view.after( name, source );
				target.remove();
			}
			else

				// hedef normal bir element, component
				// bunun içinde bulunsun istenmiş
				this.view.append( name, source );
		},

		/**
		 * Bu nesnenin parent isimli özelliğinden yola çıkarak
		 * gidebildiği kadar üst seviyeye gider ve artık gidemediği
		 * üst componenti döndürür. Yani çağırıldığı componenti de
		 * kapsayan en tepedeki kök componenti döndürür.
		 * 
		 * @return {Component|undefined} varsa en tepedeki bileşeni, yoksa undefined döndürür.
		 */
		getRootComponent: function()
		{
			var root;
			var current = root = this.parent;

			if( current && current.parent )
			while( current = current.parent )
			
				root = current;

			return root;
		},

		/**
		 * pusher metodunu "append" modunda sürer.
		 * @inheritDoc
		 */
		append: function( container, target, name )
		{

			return this.view.append.apply( this.view, arg( arguments ));
		},

		/**
		 * pusher metodunu "prepend" modunda sürer.
		 * @inheritDoc
		 */
		prepend: function( container, target, name )
		{
			return this.view.prepend.apply( this.view, arg( arguments ));
		},

		/**
		 * pusher metodunu "after" modunda sürer.
		 * @inheritDoc
		 */
		after: function( container, target, name )
		{
			return this.view.after.apply( this.view, arg( arguments ));
		},

		/**
		 * pusher metodunu "before" modunda sürer.
		 * @inheritDoc
		 */
		before: function( container, target, name )
		{
			return this.view.before.apply( this.view, arg( arguments ));
		},

		/**
		 * pusher metodunu "html" modunda sürer.
		 * @inheritDoc
		 */
		html: function( container, target, name )
		{
			return this.view.html.apply( this.view, arg( arguments ));
		},

		/**
		 * pusher metodunu "text" modunda sürer.
		 * @inheritDoc
		 */
		text: function( container, target, name )
		{
			return this.view.text.apply( this.view, arg( arguments ));
		},

		/**
		 * Adı verilen öğeyi dom ağacından kaldırır. Öğe view içinde
		 * kalmaya devam eder. Geriye kaldırılan öğe döndürülür.
		 * 
		 * @param {String} name kaldırılacak öğe adı
		 * @return {jQuery}
		 */
		remove: function( name )
		{
			return this.view.remove.apply( this.view, arg( arguments ));
		}
	});
});
