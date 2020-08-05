define(
[
	"../trait",
	"../../helper/array",

],
function( Trait, ArrHelper )
{
	return Trait( "Assignable" ).prototype(
	{
		/**
		 * assign metodunun davranışını assign edilen parametreyi
		 * döndürmek ile ana etki alanını döndürmek arasında değiştirir.
		 * @type {Boolean}
		 */
		chainableAssignments: false,

		/**
		 * Assign edilen anahtarlar isimlerini başına yerleştirilecek
		 * bir ön ek. Bu ek sadece kaputun altında kullanılır. Geliştirici
		 * assign, has ve fetch gibi işlemleri yaparken bu değeri vermez.
		 * 
		 * @type {String}
		 */
		assignmentPrefix: "$",

		/**
		 * Daha önceden assign edilen değerlere tekrar yazılmak
		 * istendiğinde gösterilecek davranışı belirler.
		 * 
		 * @type {Boolean}
		 */
		isAssignmentsOverwriteable: true,

		/**
		 * Kurulumsal işlemleri yapar.
		 */
		construct: function()
		{
			this.assignedProperties = [];
		},

		/**
		 * İçinde bulunduğu nesneye adı verilen özelliği ekleyip verilen
		 * değeri içine yazar. Özellik isimlerinin başında "$" işareti
		 * olacağı için çakışmalar önlenebilir.
		 *
		 * Geriye yazılan değer döner.
		 * 
		 * @param {String} key bir anahtar adı
		 * @param {mixed} value herhangi bir değer
		 * @param {Boolean} overwrite anahtar mevcut olduğu durumda üzerine
		 * yazılıp yazılmayacağı
		 * @return {this|mixed}
		 */
		assign: function( key, value, overwrite )
		{
			if( ! this.has( key ))
			
				this.assignedProperties.push( key );

			// anahtar zaten assign edilmiş
			else
			{
				overwrite = overwrite !== undefined
					? overwrite
					: this.isAssignmentsOverwriteable;

				// üzerine yazma devredışıysa
				if( ! overwrite )
				
					return this.chainableAssignments
						? this
						: value;
			}

			this[ this.assignmentPrefix + key ] = value;
			
			return this.chainableAssignments
				? this
				: value;
		},

		/**
		 * Adı verilen anahtarı siler.
		 * @param {String} key silinecek anahtar adı
		 */
		unAssign: function( key )
		{
			delete this[ this.assignmentPrefix + key ];
			
			this.assignedProperties = ArrHelper.remove(
				this.assignedProperties,
				this.assignedProperties.indexOf( key )
			);
		},

		/**
		 * Verilen isimde bir öğe saklanıp saklanmadığını söyler.
		 * 
		 * @param {String} name öğe adı
		 * @return {Boolean}
		 */
		has: function( name )
		{
			return this.hasOwnProperty( this.assignmentPrefix + name );
		},

		/**
		 * İçinde bulunduğu nesneden adı verilen özelliğin değerini döndürür. Özellik
		 * mevcut değilse ve varsa varsayılan değer, yoksa undefined döner.
		 * 
		 * @param {String} key değeri istenen anahtar (başında "$" işareti olmadan)
		 * @param {mixed} def herhangi bir varsayılan değer
		 * @return {undefined|mixed|@def}
		 */
		fetch: function( key, def )
		{
			if( this.has( key ))

				return this[ this.assignmentPrefix + key ];

			if( def !== undefined )

				return def;

			throw new ReferenceError( app.lang.render( "keyNotExists",
			{
				keyname: key
			}));
		},

		/**
		 * Adı verilen öğe mevcutsa hemen değerini döndürür. Mevcut değilse verilen
		 * callback'i çalıştırıp bundan dönen sonucu assign eder ve en son bu değeri
		 * döndürür.
		 * 
		 * @param {String} name bir öğe adı
		 * @param {Function} source besleyici metot
		 * @return {mixed}
		 */
		rememberAssigned: function( name, source )
		{
			if( this.has( name ))

				return this.fetch( name );

			return this.assign( name, source.call( this ));
		},

		/**
		 * İçinde bulunduğu nesneye assign edilmiş anahtarların hepsini tek tek
		 * verilen callbacke parametre olarak geçirip döngü kurar.
		 *
		 * Geriye içinde bulunduğu nesnenin kendisi döner.
		 * 
		 * @param {Function} callback bir metot
		 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
		 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
		 * @return {Object}
		 */
		each: function( callback, thisArg )
		{
			for( var i = 0; i < this.assignedProperties.length; i++ )
			{
				var name = this.assignedProperties[ i ];
				var key = this.assignmentPrefix + name;
				var value = this[ key ];

				if( callback.call( thisArg || value, name, value, this ) === false )

					return false;
			}

			return thisArg;
		},

		/**
		 * İçinde bulunduğu nesneye assign edilmiş anahtarların içinde arama
		 * yapar. İlk return deyiminde return edilen şeyi döndürür.
		 * 
		 * @param {Function} callback bir metot
		 * @param {mixed} thisArg tarayıcı metodun içindeki this sözcüğünün erişeceği nesne (belirtilmezse
		 * döngünün o adımındaki özelliği temsil eden bir nesneye erişilir)
		 * @return {mixed|undefined}
		 */
		search: function( callback, thisArg )
		{
			var r;

			for( var i = 0; i < this.assignedProperties.length; i++ )
			{
				var name = this.assignedProperties[ i ];
				var key = this.assignmentPrefix + name;
				var value = this[ key ];

				if(( r = callback.call( thisArg || value, key, value, i, this )) !== undefined )

					return r;
			}
		}
	});
});
