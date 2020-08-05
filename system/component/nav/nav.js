define(
[
	"text!./nav.css",
	"text!./nav.html",
	"system/core/type",
	"system/core/component",
	"system/helper/object/each",
	"system/library/url",

],
function( styles, skeleton, Type, Component, each, URL )
{
	/**
	 * Navigasyon çubuğu oluşturur.
	 * @event change güncel sekme değiştikçe tetiklenir.
	 */
	return Type( "Nav" ).extends( Component ).prototype(
	{
		/**
		 * Kurulumu yapar.
		 * @param {Object} tabs handle edilecek sekmeler
		 */
		construct: function( tabs )
		{
			this.super( "construct" );

			this.tabs = tabs;
			this.active = null;

			if( "qs" in tabs )
			
				app.watchQueryString( tabs.qs,
					this.listeners.onQSVariableChange );

			else if( "state" in tabs )

				$( app )
					.on( "urichange", this.listeners.onUriChange );

			this
				.stylize({ all: styles })
				.makeView( skeleton )
				.setActive( this.getTabName());
		},

		/**
		 * Verilen sekme bilgileriyle iskelete son halini verir.
		 * @param {Nav} root Nav componenti etki alanı
		 */
		touch: function( root )
		{
			var tabs = root.tabs;
			var view = this;

			each( tabs.items, function( tabName, tab )
			{
				var url;

				if( "qs" in tabs )

					url = URL().set( tabs.qs, tabName ).rebuild();

				else if( "state" in tabs )

					url = app.baseurl([ tabs.state, tabName ].join( "/" ));

				var item = view.$item.clone()
					.attr( "href", url )
					.attr( "data-name", tabName )
					.text( tab.label );

				view.append( "overlay", item, "items" );
				view.assign( tabName, item );
			});

			app.navigate.linkify( this.$root );
		},

		/**
		 * Olay dinleyiciler.
		 * @param {Nav} root Nav etki alanı
		 */
		listeners: function( root )
		{
			/**
			 * İlgili query string değişkeni değiştikçe tetiklenir.
			 */
			this.onQSVariableChange = function()
			{
				root.setActive( root.getTabName());
			}

			/**
			 * Uygulama url'si değiştikçe tetiklenir.
			 */
			this.onUriChange = function()
			{
				root.setActive( root.getTabName());
			}
		},

		/**
		 * Sekme adını url'den veya varsayılanlardan alıp döndürür.
		 * @return {String}
		 */
		getTabName: function()
		{
			if( "state" in this.tabs )

				return this.getTabNameFromURL();

			else

				return this.getTabNameFromQueryString();
		},

		/**
		 * URL yapısından veya varsayılan değerden mevcut tab adını bulup döndürür.
		 * @return {String}
		 */
		getTabNameFromURL: function()
		{
			var tabs = this.tabs;

			// tanımlı değerler yoksa
			if( is( tabs.items, "empty" ))

				// herhangi bir şeyi doğrulayamayız o nedenle hata oluşturalım
				throw new Error( "En az 1 navigasyon öğesi tanımlanmalı!" );

			// url'deki değeri alalım
			var segments = app.uri.assocSegments();

			// segmentlerde tab için bir eşleşme varsa
			if( tabs.state in segments )

				// tab ismi tanımlanmışsa geçerlidir
				if( segments[ tabs.state ] in tabs.items )

					return segments[ tabs.state ];

			// varsayılan değer tablar içinde tanımlıysa (geliştirici hata yapabilir)
			if( tabs.default in tabs.items )

				return tabs.default;

			// tanımlı değerlerden ilkini döndürelim
			return Object.keys( tabs.items )[ 0 ];
		},

		/**
		 * QueryString'ten veya varsayılan değerlerden bir duvar adı bulup döndürür.
		 * @return {String}
		 */
		getTabNameFromQueryString: function()
		{
			var tabs = this.tabs;

			// tanımlı değerler yoksa
			if( is( tabs.items, "empty" ))

				// herhangi bir şeyi doğrulayamayız o nedenle hata oluşturalım
				throw new Error( "En az 1 navigasyon öğesi tanımlanmalı!" );

			// url'deki değeri alalım
			var tabName = app.uri.get( tabs.qs );

			// tab ismi tanımlanmışsa geçerlidir
			if( tabName in tabs.items )

				return tabName;

			// varsayılan değer tablar içinde tanımlıysa (geliştirici hata yapabilir)
			if( tabs.default in tabs.items )

				return tabs.default;

			// tanımlı değerlerden ilkini döndürelim
			return Object.keys( tabs.items )[ 0 ];
		},

		/**
		 * Adı verilen sekmeyi seçili hale getirir.
		 */
		setActive: function( name )
		{
			if( this.active == name )

				return;

			this.view.$items.removeClass( "active" );
			this.view.fetch( name ).addClass( "active" );
			this.active = name;

			$( this ).trigger( "change", name );
		}
	});
});
