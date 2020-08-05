define(
[
	"system/core/type",
	"system/core/traits/assignable",
	"system/helper/string/assign",
	"system/helper/typo/dash-to-camel",
	
],
function( Type, Assignable, assign, dash2camel )
{
	/**
	 * Verilen adresteki veya direkt verilen xml veriyi alıp işler
	 * ve geriye bu view üzerinde işlemler yapmayı sağlayan bir
	 * arayüz örneği döndürür. İşlemlerini asenkron olarak yürütür.
	 * 
	 * @param {String} raw bir xml döküman
	 * @param {Object} assignments xml kaynağa uygulanacak değişkenler
	 * @param {Function} onReady view hazır olduğunda çalışacak bir metot
	 */
	var View = Type( "View" ).use( Assignable ).prototype(
	{
		/**
		 * Kurulumsal işlemler.
		 */
		construct: function( raw, assignments, onReady, pushArg )
		{
			if( is( assignments, "function" ))
			{
				pushArg = onReady;
				onReady = assignments;
				assignments = {}
			}

			this.raw = raw;
			this.assignments = assignments;
			this.onReady = onReady;
			this.pushArg = pushArg;

			this.objectify();
			
			is( onReady, "function" ) && onReady.call( this, pushArg );
		},

		/**
		 * İşlenmemiş xml iskelet.
		 * @type {String}
		 */
		raw: null,

		/**
		 * İşlenmemiş iskelete assign edilecek değişkenler.
		 * @type {Object}
		 */
		assignments: {},

		/**
		 * View işlendiğinde çalıştırılacak bir metot.
		 * @type {Function}
		 */
		onReady: null,

		/**
		 * View işlendiğinde çalışacak metoda parametre
		 * yolula geçirilecek bir değer.
		 * 
		 * @type {mixed}
		 */
		pushArg: null,

		/**
		 * İsimsiz öğeler için başvurulacak pozisyon bayrağı.
		 * @type {Number}
		 */
		currentPosition: 0,

		/**
		 * View içinde tanımlı name parametrelerini
		 * izleyerek bir nesne isim alanı oluşturur.
		 */
		objectify: function()
		{
			// ana etki alanı
			var root = this;

			this.raw = assign( this.raw, this.assignments );

			this

			.assign( "root", $( this.raw ))

			.find( "*" )

			.each( function()
			{
				var node = $( this );
				var name = node.attr( "name" );

				// node.removeAttr( "name" );

				if( node.attr( "remove" ) != undefined )
				
					node.remove().removeAttr( "remove" );

				if( ! name )
				{
					name = root.currentPosition.toString();
					root.currentPosition++
				}

				if( node.attr( "view" ) != undefined )
				{
					node.removeAttr( "view" );
					root.handleNodeAsView( node, name );
				}
				else

					root.handleNode( node, name );
			});
		},

		/**
		 * Verilen element düğümünü view olarak handle eder.
		 * 
		 * @param {jQuery} node işlenecek düğüm
		 * @param {String} name düğümü temsil edecek isim(ler)
		 */
		handleNodeAsView: function( node, name )
		{
			var root = this;
			var raw = $( "<tmp></tmp>" ).html( node ).html();
			var view = View.new( raw, this.assignments, this.onReady, this.pushArg );

			$( name.split( " " )).each( function()
			{
				root.assign( dash2camel( this ), view );
			});

			node.find( "*" ).each( function()
			{
				$( this ).attr( "skip", "yes" );
			});
		},

		/**
		 * Verilen element düğümünü handle eder.
		 * 
		 * @param {jQuery} node işlenecek düğü
		 * @param {String} name düğümü temsil edecek isim(ler)
		 */
		handleNode: function( node, name )
		{
			var root = this;

			if( node.attr( "skip" ) != undefined )
			{
				node.removeAttr( "skip" );
				return;
			}

			$( name.split( " " )).each( function()
			{
				var name = dash2camel( this );

				if( root.has( name ))

					root.assign( name, root.fetch( name ).add( node ));
				
				else
				
					root.assign( name, node );
			});

		},

		/**
		 * Adı verilen öğenin içindeki değişkene değer yazar. Değişken adı
		 * verilmezse öğeye .text() yöntemiyle verilen değer olduğu gibi yazılır.
		 *
		 * View.$ITEM.VARIABLE = VALUE
		 * 
		 * @param {String} item element adı
		 * @param {String} variable değişken adı
		 * @param {String} value yazılacak değer
		 * @return {this}
		 */
		createProperty: function( item, variable, value )
		{
			var item = this.fetch( item );

			if( variable )
			{
				list = {};
				list[ variable ] = value;
				value = String.prototype.assign( item.text(), list );
			}

			item.text( value );

			return this;
		},

		/**
		 * Temsil edilen view'in işlenmiş
		 * halini string olarak döndürür.
		 * 
		 * @return {String}
		 */
		toString: function()
		{
			return $( "<tmp></tmp>" )
				.append( this.fetch( "root" ).clone())
				.html();
		},

		/**
		 * Adı verilen elementi döndürür. Bulamazsa undefined döner.
		 * 
		 * @param {String} name element adı
		 * @return {undefined|jQuery}
		 */
		get: function( name )
		{
			var el;

			if( el = this.fetch( dash2camel( name )))

				return el;

			return;
		},

		/**
		 * Temsil edilen view üzerinde adı verilen bir parça
		 * içine verilen hedefi ilave eder. Geriye işlem yapılmış
		 * elementin referansı döner.
		 * 
		 * @param {String} container bu view üzerinde ekleme yapılacak elementin adı (tree üzerindeki)
		 * @param {jQuery|HTMLElement|View} target eklenecek element
		 * @param {String} position ekleme şekli (append,after,before,prepend,html,text)
		 * @param {String} name set edilirse eklenen element tree üzerinde bu isimle yer bulur
		 * @return {@target}
		 */
		pusher: function( container, target, position, name )
		{
			// hedef olarak bir View nesnesi verilmişse tree
			// üzerindeki root elemanını kullanacağız
			// yani komple viewi eklemiş olacağız
			if( is( target, "View" ))

				target = target.fetch( "root" );

			// Component nesnesi verilmişse bunun da üzerindeki
			// view nesnesinin root elemanını kullanacağız
			else if( is( target, "Component" ))

				target = target.view.fetch( "root" );

			// else if( is( target, "String" ))

				// target = this.fetch( target );

			else

				target = $( target );

			// name set edilmişse bu view üzerindeki tree içine yazalım
			if( name )
			{
				var root = this;

				$( name.split( " " )).each( function()
				{
					// bu isimde bir element zaten bu view üzerinde varsa koleksiyonuna yazalım
					if( root.has( this ))
					
						target = root.fetch( this ).add( target );
					
					root.assign( dash2camel( this ), target );
				});
			}

			// ilgili alana gönderelim
			this.fetch( container )[ position ]( target );

			return target;
		},

		/**
		 * pusher metodunu "append" modunda sürer.
		 * @inheritDoc
		 */
		append: function( container, target, name )
		{
			return this.pusher( container, target, "append", name );
		},

		/**
		 * pusher metodunu "prepend" modunda sürer.
		 * @inheritDoc
		 */
		prepend: function( container, target, name )
		{
			return this.pusher( container, target, "prepend", name );
		},

		/**
		 * pusher metodunu "after" modunda sürer.
		 * @inheritDoc
		 */
		after: function( container, target, name )
		{
			return this.pusher( container, target, "after", name );
		},

		/**
		 * pusher metodunu "before" modunda sürer.
		 * @inheritDoc
		 */
		before: function( container, target, name )
		{
			return this.pusher( container, target, "before", name );
		},

		/**
		 * pusher metodunu "html" modunda sürer.
		 * @inheritDoc
		 */
		html: function( container, target, name )
		{
			return this.pusher( container, target, "html", name );
		},

		/**
		 * pusher metodunu "text" modunda sürer.
		 * @inheritDoc
		 */
		text: function( container, target, name )
		{
			return this.pusher( container, target, "text", name );
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
			return this.fetch( name ).remove();
		},

		/**
		 * Temsil edilen view ile aynı iskeleti
		 * temsil eden bir tane kopya view döndürür.
		 * 
		 * @return {View}
		 */
		clone: function()
		{
			return View.new( this.raw );
		}
	});

	return View;
});
