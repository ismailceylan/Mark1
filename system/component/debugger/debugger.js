define(
[
	"text!./debugger.css",
	"text!application/library/bootstrap/bootstrap-4.min.css",
	"text!./debugger.html",
	"system/core/type",
	"system/core/component",
	"system/helper/debug/parse-stack",
	"system/helper/string/html-encode",

],
function( styles, bootstrap, skeleton, Type, Component, parseStack, htmlencode )
{
	/**
	 * Hata ayıklama arayüzünü oluşturur.
	 */
	return Type( "Debugger" ).extends( Component ).prototype(
	{
		/**
		 * Odaklanılan satırdan öncesi ve sonrası
		 * olarak dahil edilecek kod satırı sayısı.
		 * 
		 * @type {Number}
		 */
		margin: 10,

		/**
		 * Kurulumu yapar.
		 * @param {Object} error hata bilgileri
		 */
		construct: function( error )
		{
			this.super( "construct" );
			
			this.updateActiveDebuggerCount();

			var stack = parseStack( error.callStack );

			this.id = "debugger-" + app.activeDebuggers;
			this.line = error.line;
			this.file = error.file;
			this.msg = stack.message;
			this.col = error.col;
			this.error = stack;

			this.cleanAllStyles();

			this
				.stylize({ all: bootstrap + styles })
				.makeView( skeleton,
				{
					title: this.msg,
					file: this.file,
					type: this.error.type,
					debuggerNo: app.activeDebuggers
				});

			this.focus( this.file, this.line, this.col );
		},

		/**
		 * Arayüze son halini verir.
		 */
		touch: function( root )
		{
			var view = this;

			// debugger IDsini kök elemente verelim
			this.$root.attr( "id", root.id );

			// arayüzü döküman gövdesine yerleştirelim
			$( "body" )[ root.getDebuggerPlacementLogic()]( this.$root );

			// callstack öğelerini işleyelim
			if( ! is( root.error.stack, "empty" ))

				root.error.stack.forEach( function( item )
				{
					view.$stack.append( root.makeStackItem(
						item,
						view.$stackItem.clone()
					));
				});

			else

				this.$stack.html( this.$noContent.clone().text( "Gösterilecek callStack geçmişi yok." ));
		},

		/**
		 * Olay dinleyiciler.
		 * @param {Debugger} root Debugger etki alanı
		 */
		listeners: function( root )
		{
			this.onStackItemClick = function()
			{
				var data = $( this ).data();

				root.focus( data.file, data.line, data.col );

				return false;
			}
		},

		/**
		 * Sayfadaki bütün style ve link etiketlerini siler.
		 */
		cleanAllStyles: function()
		{
			$( "style,link" ).remove();
		},

		/**
		 * global app nesnesi üzerine kaç tane aktif
		 * debugger çizimi varsa sayısını yansıtır.
		 */
		updateActiveDebuggerCount: function()
		{
			if( ! ( "activeDebuggers" in app ))

				app.activeDebuggers = 1;

			else
				
				app.activeDebuggers++
		},

		/**
		 * Ekranda hiç debugger yoksa "html", zaten debugger varsa
		 * "append" değerini döndürür. Böylece ilk hata anında ekran
		 * temizlenirken peşinden gelen hatalar önceki hatayı silmek
		 * yerine kendisini öncekinin altına yerleştirir.
		 * 
		 * @return {String}
		 */
		getDebuggerPlacementLogic: function()
		{
			return app.activeDebuggers <= 1
				? "html"
				: "append";
		},

		/**
		 * Verilen callstack öğesini verilen element içine yerleştirir.
		 * 
		 * @param {Object} item callstack öğesi
		 * @param {jQuery} el bir element
		 * @return {@el}
		 */
		makeStackItem: function( item, el )
		{
			var namespace = item.file.replace( app.baseurl() + "/", "" );

			// if( /system\/(.*?)\/require\.js/.test( namespace ))

				// return;

			var method = item.method
				? "[" + item.method + "] "
				: "";

			return el
				.on( "click", this.listeners.onStackItemClick )
				.data( item )
				.text( method + namespace + ":" + item.line );
		},

		/**
		 * Yolu verilen dosyanın verilen satır ve sütununa odaklama yapar.
		 * 
		 * @param {String} file dosya yolu
		 * @param {Number} line satır numarası
		 * @param {Number} col sütun numarası
		 */
		focus: function( file, line, col )
		{
			var root = this;

			line = parseInt( line );
			col = parseInt( col );

			require([ "text!" + file ], function( file )
			{
				var lines = root.highlight
				(
					col,
					root.normalizeLines
					(
						line,
						root.getLines( file )
					)
				);

				root.view.$lineNumbers.html(
					root.makeLineNumbers( line, lines.left.length + lines.right.length + 1 )
				);

				root.view.$content.html(
					lines.left.concat( lines.subject, lines.right ).join( "\n" )
				);
			});
		},

		/**
		 * Verilen string içeriği satırlardan bölüp döndürür. Bunu yapmadan
		 * önce aynı zamanda html tag açma kapatma işaretlerini de html olarak
		 * kodlar.
		 * 
		 * @param {String} str çok satırlı bir string
		 * @return {Array}
		 */
		getLines: function( str )
		{
			return htmlencode( str ).split( /\n/g );
		},

		/**
		 * Verilen diziyi line değerine göre 3 parçaya bölüm döndürür.
		 *
		 * @param {Number} line odaklanılacak satır numarası
		 * @param {Array} lines satırları temsil eden dizi
		 * @return {Object}
		 */
		normalizeLines: function( line, lines )
		{
			var parts = {};

			parts.left = lines.slice( Math.max( line - ( this.margin + 1 ), 0 ), Math.max( line - 1, 0 ));
			parts.right = lines.slice( line, line + this.margin );
			parts.subject = lines[ line - 1 ];

			return parts;
		},

		/**
		 * Önceki ve sonraki satırları parlatır.
		 *
		 * @param {Number} col sütun numarası
		 * @param {Object} lines normalize edilmiş satırlar
		 * @return {Object}
		 */
		highlight: function( col, lines )
		{
			function render( className, inner )
			{
				return '<span class="' + className + ' highlight">' + inner + "</span>";
			}

			for( var p = lines.left.length - 1, i = 0; p > lines.left.length - 3; p--, i++ )
			
				lines.left[ p ] = render( "prev" + ( i + 1 ), lines.left[ p ]);
			
			for( var i = 0; i < 2; i++ )
			
				lines.right[ i ] = render( "next" + ( i + 1 ), lines.right[ i ]);

			lines.subject = render( "the-line", this.addPointer( lines.subject, col ));

			return lines;
		},

		/**
		 * Verilen string'in verilen konumuna pointer
		 * görüntüleyen elementi enjekte edip döndürür.
		 * 
		 * @param {String} string bir string
		 * @param {Number} index pointer'ın yerleştirileceği konum
		 */
		addPointer: function( string, index )
		{
			return string.slice( 0, index - 1 ) + '<i></i>' + string.slice( index - 1 );
		},

		/**
		 * Verilen sayıda numaralı satır oluşturup döndürür.
		 *
		 * @param {Number} line satır numarası
		 * @param {Number} total toplam satır sayısı
		 * @return {String}
		 */
		makeLineNumbers: function( line, total )
		{
			var stack = "";
			var end = line + this.margin + 1;

			if( total < this.margin * 2 )

				end = total + 1;

			for( var i = Math.max( line - this.margin, 1 ); i < end; i++ )
			
				stack += "<p>" + i + "</p>";
			
			return stack;
		}
	});
});
