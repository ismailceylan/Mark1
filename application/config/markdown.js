define(
{
	/*
	|--------------------------------------------------------------------------
	| Kurallar
	|--------------------------------------------------------------------------
	|
	| Burada Markdown kütüphanesini sürecek kurallar topluluğunu tanımlarız. Bu
	| kurallar yardımıyla, hangi söz dizimlerini destekleyeceğiz, hangilerinin
	| içinde hangi söz dizimleri desteklenecek veya desteklenmeyecek bunları
	| belirleyebiliriz. Başka bir kural topluluğu oluşturup başka senaryolar için
	| özel davranışlar oluşturabiliriz.
	|
	*/
	fullCapability:
	{
		fencedCode: null,
		code: null,

		conversation:
		{
			message:
			{
				bkz: null,
				shortBKZ: null,
				directBKZ: null,

				itabold: null,
				bold: null,
				italic: null,

				link: null,
				directLink: null,
				email: null,
			}
		},

		horizontalRule: 
		{
			itabold: null,
			bold: null,
			italic: null,
		},
		
		table: 
		{
			bkz: null,
			shortBKZ: null,
			directBKZ: null,

			itabold: null,
			bold: null,
			italic: null,

			code: null,

			link: null,
			directLink: null,
			email: null,

			duyoji: null
		},

		header: 
		{
			itabold: null,
			bold: null,
			italic: null,
		},

		photo: null,

		blockquote: 
		{
			header: 
			{
				bold: null,
			},

			horizontalRule: null,

			blockquote:
			{
				link: null,
				directLink: null,
				shortBKZ: null,
				directBKZ: null,
				bkz: null,
				newLine: null,
			},

			link: null,
			directLink: null,
			
			shortBKZ: null,
			directBKZ: null,
			bkz: null,

			bold: null,

			newLine: null,
		},

		orderedList:
		{
			listItem:
			{				
				itabold: 
				{
					link:
					{
						code: null
					}
				},
				bold: 
				{
					link:
					{
						code: null
					}
				},
				italic: 
				{
					link:
					{
						code: null
					}
				},

				shortBKZ: null,
				directBKZ: null,
				bkz: null,
				link: null,
				directLink: null,
				duyoji: null,
			}
		},

		unorderedList:
		{
			listItem:
			{
				itabold: 
				{
					link:
					{
						code: null
					}
				},
				bold: 
				{
					link:
					{
						code: null
					}
				},
				italic: 
				{
					link:
					{
						code: null
					}
				},
				shortBKZ: null,
				directBKZ: null,
				bkz: null,
				link: null,
				directLink: null,
				duyoji: null,
			}
		},
				
		spoiler: 
		{
			title:
			{
				directBKZ: null,
				itabold: null,
				bold: null,
				italic: null,
			},
			body:
			{
				itabold: null,
				bold: null,
				italic: null,
				
				link: null,
				directLink: null,
				email: null,
				youtubeLink: null,
				duyoji: null,

				shortBKZ: null,
				directBKZ: null,
				bkz: null,

				newLine: null,
			}
		},

		link:
		{
			code: null
		},

		shortBKZ: null,
		directBKZ: null,
		bkz: null,

		itabold:
		{
			link:
			{
				code: null
			}
		},

		bold:
		{
			link:
			{
				code: null
			}
		},

		italic: 
		{
			link:
			{
				code: null
			}
		},

		youtubeLink: null,
		directLink: null,
		email: null,
		duyoji: null,
		hashtag: 
		{
			space:
			{
				newLine: null
			}
		},
		newLine: null,
	}
});
