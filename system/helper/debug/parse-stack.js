define( function()
{
	/**
	 * Verilen metinsel stack ifadesini parse edip düzenli biçimde döndürür.
	 * 
	 * @param {String} stack stack yığını söz dizimi
	 * @return {Array}
	 */
	return function parseStack( stack )
	{
		var meta;
		var errStack = 
		{
			type: null,
			message: null,
			stack: []
		}

		stack = stack.split( "\n" );
		meta = stack.shift().match( /^(?:(.*?): )?(.*?)$/ );

		errStack.type = meta[ 1 ];
		errStack.message = meta[ 2 ];

		stack.forEach( function( item )
		{
			var match = item.match( /^    at(?: ([\w.<>]+))?(?: \[(?:.*?)\])? \(?(.*):([0-9]+):([0-9]+)\)?$/ );

			if( ! match )

				return;

			errStack.stack.push(
			{
				method: match[ 1 ],
				file: match[ 2 ],
				line: match[ 3 ],
				col: match[ 4 ],
				source: item
			});
		});

		return errStack;
	}
});
