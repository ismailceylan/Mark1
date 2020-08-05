define(
[
	"system/core/type",
	"./traits/renderable",
	"./traits/inheritable",
	"./traits/middlewareable",
	"system/library/regular-expression",
	"system/helper/string/unserialize-method-call",

],
function( Type, Renderable, Inheritable, Middlewareable, RegularExpression, unserializeMethodCall )
{
	return Type( "RouteGroup" ).use( Renderable, Inheritable, Middlewareable ).prototype(
	{
		/**
		 * Bu grubu içinde barındıran üst grubu verir.
		 * @type {RouteGroup}
		 */
		parent: null,
		
		/**
		 * Bu grubun bağlam metodu içine yollanan RouteManager
		 * örneğidir. Üzerinde sadece bu grubu ilgilendiren
		 * bilgiler barındırır.
		 * 
		 * @type {RouteManager}
		 */
		manager: null,

		/**
		 * Rotalar.
		 * @type {Array}
		 */
		stack: null,

		/**
		 * Bu grup altında bulunan rota desenlerine
		 * uygulanacak url ön eki.
		 * 
		 * @type {String}
		 */
		prf: "",

		/**
		 * Bu grup altında bulunan rotaların hedef
		 * gösterdiği controller dosyalarına dizin
		 * yapıları ekler.
		 * 
		 * @type {String}
		 */
		ns: "",

		/**
		 * Bu grup altındaki rotalara uygulanacak
		 * genel middleware yığını.
		 * 
		 * @type {Object}
		 */
		middlewares: null,

		/**
		 * URL üzerindeki domain segmentinde çalıştırılacak bir eşleşme
		 * ifadesidir. Bu grup altındaki tüm rotaların çalışması bu eşleşmeye
		 * bağlıdır. Eşleşme sağlanırsa domain alanından elde edilen veriler
		 * bu grup altındaki rotaların parametre listesinin en başına
		 * yerleştirilir.
		 * 
		 * @type {RegularExpression}
		 */
		domain: null,

		/**
		 * İsimli yakalayıcı kuralları.
		 * @type {Array}
		 */
		rules: null,

		/**
		 * Kalıtım yapısı.
		 * @type {Object}
		 */
		inheritance:
		{
			extendingInheritance: [ "rules", "middlewares" ],
			prefixingInheritance: [ "prf", "ns" ]
		},

		/**
		 * Kurulumu yapar.
		 * @param {Object} options ayarlar
		 */
		construct: function( options )
		{
			this.stack = [];
			this.prf = options.prefix || "";
			this.ns = options.namespace || "";
			this.middlewares = unserializeMethodCall( options.middleware || "" );
			this.domain = new RegularExpression( options.domain || "" );
			this.rules = {};
		},

		/**
		 * Verilen rotayı veya rota grubunu bu grubun rota yığınına ekler.
		 * 
		 * @param {Route|RouteGroup} item bir rota veya rota grubu
		 * @return {Route|RouteGroup}
		 */
		pushStack: function( item )
		{
			item.parent = this;
			item.init();

			this.stack.push( item );

			return item;
		}
	});
});
