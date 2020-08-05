define(
[
	"../helper/typo/capitalize",

],
function( capitalize )
{
	/**
	 * Trait oluşturur.
	 * @param {String} name trait adı
	 */
	return function Trait( name )
	{
		if( ! ( this instanceof Trait ))

			return new Trait( name );

		if( ! is( name, "nameable" ))

			throw TypeError( "İlk argüman geçerli bir davranışsal isim olmalıdır!" );

		/**
		 * Trait'in adı.
		 * @type {String}
		 */
		this.name = capitalize( name );

		/**
		 * Bu trait'in kendi trait'i de dahil sahip olduğu trait'leri tutar.
		 * @type {Array}
		 */
		this.types = [ this.name ];

		/**
		 * Trait'in kendininki ve miras aldığı trait'lerdeki metot ve özellikler.
		 * @type {Object}
		 */
		this.properties = {}

		/**
		 * Verilen üstel trait'(ler)in özelliklerini bu trait'in özellikleri arasına
		 * kopyalar, miras alır.
		 * 
		 * @param {Trait} ...parents özellikleri miras alınacak ebeveyn trait(ler)
		 * @return {this}
		 */
		this.use = function( parents )
		{
			arg( arguments ).forEach( function( parent )
			{
				Object.assign( this.properties, parent.properties );
				this.types = this.types.concat( parent.types );
			},
			this );

			return this;
		}

		/**
		 * Verilen nesnedeki özellikleri trait'in prototype yığınına ekler.
		 * 
		 * @param {Object} context trait'in metot ve özelliklerini içeren bir nesne
		 * @return {this}
		 */
		this.prototype = function( context )
		{
			Object.assign( this.properties, context );
			return this;
		}

		/**
		 * Temsil edilen trait'in verilen türü miras alıp almadığını söyler.
		 * 
		 * @param {Trait} target sınanacak bir trait
		 * @return {Boolean}
		 */
		this.is = function( target )
		{
			return this.types.indexOf( target.name ) > -1;
		}
	}
});
