define(
[
	"system/core/type",
	"./plugins/index",

],
function( Type, Plugins )
{
	return Type( "Markdown" ).prototype(
	{
		/**
		 * Kurallar.
		 * @type {Object}
		 */
		ruleStack: {},

		/**
		 * Static özellik ve metotlar.
		 * @type {Object}
		 */
		static:
		{
			/**
			 * Mevcut markdown kurallarına verilen yeni kuralları
			 * ekler. Yeni kurallar eski kuraları geçersiz kılabilir.
			 * 
			 * @param {Object} overwrites yeni kurallar
			 * @return {Markdown}
			 */
			extend: function( overwrites )
			{
				this.ruleStack = $.extend( true, this.ruleStack, overwrites );
				return this.type;
			}
		},

		/**
		 * Kurulumu gerçekleştirir.
		 * @param {String} raw işlenecek markdown döküman
		 */
		construct: function( raw )
		{
			if( ! is( raw, "string" ))

				throw new Error( "İşlenecek markdown döküman string türünde olmalı." );
			
			this.sections = { length: 0 };
			this.raw = raw;
		},

		/**
		 * Verilen kuralları mevcut kuralların tamamının üzerine yazar.
		 * 
		 * @param {Object} rules kurallar
		 * @return {this}
		 */
		rules: function( rules )
		{
			this.ruleStack = rules;
			return this;
		},

		/**
		 * Render işlemini başlatıp render edilmiş dökümanı döndürür.
		 *
		 * @param {Object} engine render metotlarını barındıran nesne
		 * @return {String}
		 * @throws {ReferenceError} ruleStack içinde henüz tanımlanmamış
		 * bir bileşen adı kullanıldığında fırlatılır
		 */
		render: function( engine )
		{
			this.engine = engine || {};

			for( var name in this.ruleStack )
			{
				// if( ! Plugins[ name ])

					// throw ReferenceError( name + " isimli bileşen, Markdown tarafından desteklenmiyor." );

				// eklentiyi örnekliyoruz
				Plugins[ name ] && Plugins[ name ].new( this, this.ruleStack[ name ]);
			}

			this.compile();

			return this.raw;
		},

		/**
		 * Render edilmiş dökümanı derler.
		 */
		compile: function()
		{
			for( var placeholder in this.sections )
			{
				var section = this.sections[ placeholder ];
				var needle = section.pattern || placeholder;

				this.raw = this.raw.replace( needle, section.rendered );
			}

			// yığını temizleyelim
			this.sections = { length: 0 }
		}
	});
});
