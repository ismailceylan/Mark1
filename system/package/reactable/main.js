define(
[
	"text!./css/reactable.min.css",
	"system/helper/string/assign",

	"system/machine/anonstyle",
	"system/machine/jquery/core"
],
function( styles, assign )
{
/**
 * Creates an interface that will allow the user to respond
 * to a given web item with an ID number.
 *
 * @author Ismail Ceylan
 * @copyright Ismail Ceylan http://biliyon.net/reactable/index.php/demo
 *
 * @param {number|string} item any ID value
 * @param {object} options setup settings
 * @event {open} triggered when the interface comes to the screen
 * @event {close} triggered when the interface disappears from the screen
 * @event {action} when an action is performed (insert, delete, modify), it is triggered just before the request is forwarded to the server
 * @event {success} triggered when the reaction (insertion, deletion, modification) is successful
 * @event {failed} occurs when a network request for a reaction process (add, delete, change) fails
 * @event {labelHover} triggered when mouse comes on reaction button
 * @event {labelClick} triggered when the reaction button is clicked
 * @event {iconHover} triggered when the mouse comes over a reaction symbol in the reaction interface
 * @event {iconClick} triggered when a reaction symbol in the reaction interface is clicked
 * @event {feelingsClick} triggered when the HTML element showing the total number of given reactions is clicked
 * @event {feelingsHover} triggered when the mouse is over the HTML item that shows the total number of given reactions
 * @event {summaryIconHover} triggered when the mouse comes over an icon of the most given reactions
 * @event {summaryIconClick} triggered when an icon of the most given reactions is clicked
 * @event {status-xxx} An event with the same name as the status code of this response is triggered when a response is returned from the server.
 */
var Reactable = function Reactable( item, options )
{
	if( this === window )

		return new Reactable( item, options );

	// main domain
	var root = this;

	/**
	 * A special id number for the plugin instance.
	 * @type {integer}
	 */
	this.id = ( new Date ).getTime();

	/**
	 * It tells if the reaction sharing
	 * interface is on the screen.
	 * 
	 * @type {boolean}
	 */
	this.isOpen = false;

	/**
	 * Keeps the active selection.
	 * @type {string|null}
	 */
	this.choice = null;

	/**
	 * Sunucudaki reaksiyon.
	 * @type {Object}
	 */
	this.serverReaction = null;

	/**
	 * General settings with default values
	 * for this Reactable instance.
	 * 
	 * @type {object}
	 */
	this.options = $.extend( true,
	{
		trigger: $( document.body ),
		value: 'like',
		subjectType: null,
		placeholder: 'Select Reaction',
		serviceUri: 'reaction',
		choice: null,
		method: 'post',
		summaryIconLimit: 2,
		mobileDirection: 'right',
		update: 'no',
		name: false,
		sound: app.asset( 'js/system/package/reactable/sound/plup-effect.mp3' ),
		volume: 44,
		position: 'top',
		delayShow: 400,
		delayHide: 1100,
		delayFadein: 120,
		delayFadeout: 350,
		feelings:
		{
			angry: 0,
			upset: 0,
			whoa: 0,
			haha: 0,
			love: 0,
			like: 0
		},
		items:
		[
			// in some languages, the verb itself, present tense and past tense, may be different.
			// native,   simple verb,   not happened,   happened
			[ 'angry',   'Öfke',        'Öfkelen',      'Öfkelendin' ],
			[ 'upset',   'Üzüntü',      'Üzül',         'Üzüldün' ],
			[ 'whoa',    'Şaşırma',     'Şaşır',        'Şaşırdın' ],
			[ 'haha',    'Kahkaha',     'Gül',          'Güldün' ],
			[ 'love',    'Sevgi',       'Bayıl',        'Bayıldın' ],
			[ 'like',    'Beğeni',      'Beğen',        'Beğendin' ]
		]
	}, options );

	/**
	 * It produces a logical result about the mobile
	 * device based on the screen resolution.
	 * 
	 * @return {boolean}
	 */
	this.isMobile = function()
	{
		return $( window ).width() < 769;
	}

	/**
	 * It produces a logical result about the html
	 * form input mode.
	 * 
	 * @return {Boolean}
	 */
	this.isInputMode = function()
	{
		return this.options.name !== false;
	}

	/**
	 * It is a DOM namespace for the HTML skeleton.
	 * @type {object}
	 */
	this.skeleton = new ( function()
	{
		var self = this;

		this.body = $
		(
			'<div>'+
				'<div class="reaction">'+
					'<div class="overlay">'+
						'<button type="button">Kapat</button>'+
						'<input type="hidden">'+
						'<div class="inline-summary"></div>'+
					'</div>'+
				'</div>'+
			'</div>'
		);

		this.container = this.body.find( '.reaction' );
		this.overlay   = this.container.find( '.overlay' );
		this.inlineSummary = this.container.find( '.inline-summary' );
		this.input = this.overlay.find( 'input' ).remove();

		$( root.options.items ).each( function()
		{
			var name = this[ 0 ];
			var desc = this[ 1 ].replace( ' ', '&nbsp;' );
			var label = this[ 2 ].replace( ' ', '&nbsp;' );
			var happened = this[ 3 ].replace( ' ', '&nbsp;' );

			var icon = $( '<div></div>' )
				.addClass( 'shell ' + name )
				.attr( 'data-name', name )
				.attr( 'data-desc', desc )
				.attr( 'data-happen', happened )
				.attr( 'data-label', label )
				.append( '<span></span>' );

			if( ! root.isMobile())

				icon
				[
					root.options.position == 'top'
						? 'prepend'
						: 'append'
				]( $( '<i></i>' ).html( desc ));

			self.overlay.append( icon );
			self[ name ] = icon;
		});

		this.icons       = this.overlay.find( '.shell' );
		this.trigger     = $( root.options.trigger );
		this.total       = this.trigger.find( '.feelings' );
		this.buttonIcon  = this.trigger.find( '.summary' );
		this.buttonLabel = this.trigger.find( '.label' );
		this.close       = this.overlay.find( 'button' );
		this.actors      = $( '<div></div>' ).addClass( 'actors' );
		this.feelings    = $( '<ul></ul>' ).addClass( 'feelings-summary' );

		var position, direction, dr;

		// interface position
		if( position = root.options.position )

			this.container.addClass( position );

		// interface screen direction
		if( direction = root.options.mobileDirection )

			this.container.addClass( direction );

		// input mode
		if( root.isInputMode())
		{
			this.input.attr( 'name', root.options.name );
			
			this.trigger
				.append( this.input )
				.addClass( 'input-mode' );

			if( dr = root.options.value )

				this.input.val( dr );

			this.total.remove();
			this.buttonIcon.remove();
			this.inlineSummary.remove();
		}
	});

	/**
	 * Event listener methods are kept together. These methods
	 * constitute the logical functionality that the plug-in needs.
	 * 
	 * @type {object}
	 */
	this.listener = new function()
	{
		/**
		 * This method is triggered by
		 * mouse over the reaction button.
		 */
		this.onLabelMouseover = function()
		{
			$( root ).trigger( 'labelHover' );
		}

		/**
		 * This method is triggered by
		 * click the reaction button.
		 * 
		 * @return {boolean}
		 */
		this.onLabelClick = function()
		{
			clearTimeout( root.triggerMouseOverShowTimer );

			if( root.isMobile())
			{
				root.show();
				return false;
			}

			var ch, def;

			// first: use active choice, second: use default reaction, else: show interface
			if( ch = root.choice )

				root.ping( ch );

			else if( def = root.options.value )

				root.ping( def );

			else

				root.show();

			$( root ).trigger( 'labelClick' );

			return false;
		}

		/**
		 * Triggered when the mouse leaves the button.
		 */
		this.onTriggerMouseout = function()
		{
			// we must cancel countdowns
			clearTimeout( root.triggerMouseOverHideTimer );
			clearTimeout( root.triggerMouseOverShowTimer );

			// we must restart the countdown
			root.triggerMouseOverHideTimer = setTimeout
			(
				function()
				{
					root.hide();
				},
				root.isMobile()
					? root.options.delayHide * .5
					: root.options.delayHide
			);
		}

		/**
		 * This method is triggered by
		 * mouse over the whole trigger element.
		 */
		this.onTriggerMouseover = function()
		{
			// we must cancel countdowns
			clearTimeout( root.triggerMouseOverHideTimer );
			clearTimeout( root.triggerMouseOverShowTimer );

			// we're done if it's already open
			if( root.isOpen )

				return;

			// we might be need a little bit delay
			root.triggerMouseOverShowTimer = setTimeout( function()
			{
				root.show();
			},
			root.options.delayShow );
		}

		/**
		 * It is triggered when mouse over
		 * one of the summary icons.
		 */
		this.onSummaryIconMouseover = function()
		{
			$( root ).trigger( 'summaryIconHover' );
		}

		/**
		 * It is triggered when click
		 * one of the summary icons.
		 */
		this.onSummaryIconClick = function()
		{
			$( root ).trigger( 'summaryIconClick' );
		}

		/**
		 * It is triggered when click
		 * one of the main reaction icons.
		 */
		this.onEmotionClick = function()
		{
			root.ping( $( this ).data( 'name' ));
			$( root ).trigger( 'iconClick' );
		}

		/**
		 * It is triggered when mouse over
		 * one of the main reaction icons.
		 */
		this.onEmotionMouseover = function()
		{
			$( root ).trigger( 'iconHover' );
		}

		/**
		 * It is triggered when mouse over
		 * the total reactions element.
		 */
		this.onFeelingsMouseover = function()
		{
			$( root ).trigger( 'feelingsHover' );
			root.showAllFeelingsSummary();
		}

		/**
		 * It is triggered when mouse out
		 * the total reactions element.
		 */
		this.onFeelingsMouseout = function()
		{
			root.hideAllFeelingsSummary();
		}

		/**
		 * It is triggered when click
		 * the total reactions element.
		 */
		this.onFeelingsClick = function()
		{
			$( root ).trigger( 'feelingsClick' );
		}

		/**
		 * It is triggered when clicking on the close
		 * button activated on the mobile devices.
		 */
		this.onCloseClick = function()
		{
			root.hide();
		}

		/**
		 * It is triggered when resetting form
		 * which is contain our input field.
		 */
		this.onInputFormReset = function()
		{
			root.skeleton.input.val( '' );
			root.choice = null;
			root.intro();
		}

		/**
		 * Triggered when a new reaction
		 * attempt is successful on the server.
		 * 
		 * @param {string} choice user-selected reaction's native name
		 * @param {object} feelings server-generated reaction statistics object
		 */
		this.onReactAdded = function( choice, feelings )
		{
			root.skeleton
			[
				root.choice = choice
			]
			.find( 'span' ).addClass( 'animated rubberBand' );

			var sound;

			if( sound = root.options.sound )

				root.playSoundEffect( sound );

			root.dropReaction( choice );
		}

		/**
		 * Triggered when a already given reaction
		 * removing attempt is successful on the server.
		 * 
		 * @param {string} choice user-selected reaction's native name
		 * @param {object} feelings server-generated reaction statistics object
		 */
		this.onReactRemoved = function( choice, feelings )
		{
			root.skeleton[ root.choice ].find( 'span' ).removeClass( 'rubberBand' );
			root.choice = null;
		}

		/**
		 * Triggered when replacing a given reaction with
		 * another is successful on the server.
		 * 
		 * @param {string} choice user-selected reaction's native name
		 * @param {object} feelings server-generated reaction statistics object
		 */
		this.onReactUpdated = function( choice, feelings )
		{
			var sound;

			root.skeleton
			[
				root.choice = choice
			]
			.find( 'span' ).removeClass( 'rubberBand' );

			if( sound = root.options.sound )

				root.playSoundEffect( sound );

			root.dropReaction( choice );
		}

		/**
		 * Triggered when an operation on the
		 * item succeeds (insert, delete, modify).
		 * 
		 * @param {string} choice user-selected reaction's native name
		 * @param {object} feelings server-generated reaction statistics object
		 */
		this.onReacted = function( choice, feelings )
		{
			root.options.feelings = feelings;
			root.intro();
			root.updateInlineSummary();
		}

		/**
		 * It is attach event listeners to the
		 * events that need to be listened.
		 */
		this.attach = function()
		{
			var sk = root.skeleton;
			
			// being sure not double listened
			this.dettach();

			sk.buttonLabel
				.on( 'click', this.onLabelClick )
				.on( 'mouseover', this.onLabelMouseover );

			sk.total
				.on( 'mouseover', this.onFeelingsMouseover )
				.on( 'mouseout', this.onFeelingsMouseout )
				.on( 'click', this.onFeelingsClick );

			sk.trigger
				.on( 'mouseleave', this.onTriggerMouseout )
				.on( 'mouseenter', this.onTriggerMouseover );

			sk.icons.on( 'click', this.onEmotionClick );

			sk.buttonIcon
				.on( 'mouseover', this.onSummaryIconMouseover )
				.on( 'click', this.onSummaryIconClick );

			if( root.isInputMode())
			
				sk.input.closest( 'form' ).on( 'reset', this.onInputFormReset );

			if( root.isMobile())
			
				sk.close.on( 'click', this.onCloseClick );
		}

		/**
		 * It is stop listening events.
		 */
		this.dettach = function()
		{
			var sk = root.skeleton;
			
			sk.icons.off( 'click', this.onEmotionClick );

			sk.buttonLabel
				.off( 'click', this.onLabelClick )
				.off( 'mouseover', this.onLabelMouseover );

			sk.total
				.off( 'mouseover', this.onFeelingsMouseover )
				.off( 'mouseout', this.onFeelingsMouseout )
				.off( 'click', this.onFeelingsClick );

			sk.trigger
				.off( 'mouseleave', this.onTriggerMouseout )
				.off( 'mouseenter', this.onTriggerMouseover );

			sk.buttonIcon
				.off( 'mouseover', this.onSummaryIconMouseover )
				.off( 'click', this.onSummaryIconClick );

			if( root.isInputMode())
			
				sk.input.closest( 'form' ).off( 'reset', this.onInputFormReset );

			if( root.isMobile())

				sk.close.off( 'click', this.onCloseClick )
		}
	}

	/**
	 * It takes the native name of the reaction and
	 * returns the appropriate state to show on the
	 * screen.
	 * 
	 * @param {string} emotion a native reaction name (love,like,...)
	 * @return {string|false}
	 */
	this.getEmotionLabel = function( emotion )
	{
		var icon;

		if( ! ( icon = this.skeleton[ emotion ]))

			return this.options.placeholder;

		return icon.data( 'label' );
	}

	/**
	 * It takes the native name of the reaction and
	 * returns the happened word for given emotion name.
	 * 
	 * @param {string} emotion native reaction name
	 * @return {string|false}
	 */
	this.getEmotionHappen = function( emotion )
	{
		var icon;

		if( ! ( icon = this.skeleton[ emotion ]))

			return false;

		return icon.data( 'happen' );
	}

	/**
	 * Makes the tooltip visible, showing all
	 * the reactions one by one.
	 */
	this.showAllFeelingsSummary = function()
	{
		if( this.isMobile())

			return;

		var skeleton = this.skeleton
		var tooltip = skeleton.feelings;
		var target = skeleton.trigger;
		var feelings = this.populars();

		tooltip.html( '' );

		$( feelings ).each( function()
		{
			var name = this[ 0 ];
			var sum = this[ 1 ];

			if( sum == 0 )

				return;

			var line = $( '<li></li>' );
			var icon = root.skeleton[ name ].clone();
			var label = icon.find( 'i' ).html( icon.data( 'desc' )).remove();

			label.html( '<b>' + sum + '</b> ' + label.html());
			line.append( icon );
			line.append( label );
			tooltip.append( line );
		});

		target.append( tooltip );
	}

	/**
	 * Updates inline summaries for mobile devices.
	 */
	this.updateInlineSummary = function()
	{
		if( ! this.isMobile())

			return;

		var sum,
			inline = this.skeleton.inlineSummary;

		inline.html( '' );

		$( this.options.items ).each( function()
		{
			var line2 = $( '<p>&nbsp;</p>' );
			inline.append( line2 );

			if( root.options.feelings && ( sum = root.options.feelings[ this[ 0 ]]))
				
				line2.text( sum );
		});

	}

	/**
	 * Its hides summaries.
	 */
	this.hideAllFeelingsSummary = function()
	{
		this.skeleton.feelings.remove();
	}

	/**
	 * Return the total number of reactions.
	 * @return {integer}
	 */
	this.total = function()
	{
		var r = 0;

		for( var i in root.options.feelings )
		
			r += parseInt( root.options.feelings[ i ], 10 );

		return r;
	}

	/**
	 * It opens the interface.
	 */
	this.show = function()
	{
		if( this.isOpen )

			return;

		var container = this.skeleton.container;

		// append overlay to the document
		this.skeleton.trigger.append( container );

		// mobile touches
		root.isMobile()
			? this.mobilize()
			: this.unMobilize();

		// fix alignment problem for tooltips
		this.fixTooltipAlignment();

		container.fadeIn( this.options.delayFadein, function()
		{
			setTimeout( function()
			{
				container.addClass( 'hover' );
				
				// is there a chosen reaction?
				if( root.choice != null )
				
					// add shake
					root.skeleton[ root.choice ].find( 'span' ).addClass( 'animated rubberBand' )

				$( root ).trigger( 'open' );
			}, 130 );

			root.listener.attach();
		});

		this.isOpen = true;
	}

	/**
	 * It closes the interface.
	 */
	this.hide = function()
	{
		if( ! this.isOpen )

			return;

		var container = this.skeleton.container;

		container.removeClass( 'hover' );

		this.skeleton.icons.find( 'span' ).removeClass( 'rubberBand' );

		setTimeout( function()
		{
			container.fadeOut( root.options.delayFadeout, function()
			{
				container.remove();
				$( root ).trigger( 'close' );
			});
		}, 180 );

		this.isOpen = false;
	}

	/**
	 * Makes necessary touches on
	 * the interface for mobile.
	 */
	this.mobilize = function()
	{
		this.skeleton.trigger
			.addClass( 'mobile' )
			.addClass( this.options.mobileDirection );
		
		this.skeleton.close.show();
		this.updateInlineSummary();
	}

	/**
	 * Clean mobile touches on the interface.
	 */
	this.unMobilize = function()
	{
		this.skeleton.trigger
			.removeClass( 'mobile' )
			.removeClass( 'align-' + this.options.mobileDirection );

		this.skeleton.close.hide();
	}

	/**
	 * Its fix tooltip's alignment problem.
	 */
	this.fixTooltipAlignment = function()
	{
		if( this.tooltipAlignmentFixed )

			return;

		var icoWidth = this.skeleton.icons.eq( 0 ).width();

		$( this.options.items ).each( function()
		{
			var name = this[ 0 ];
			var tooltip = root.skeleton[ name ].find( 'i' );

			tooltip.css( 'left', ( -1 * (( tooltip.outerWidth() - icoWidth ) / 2 )) + 'px' );
		});

		this.tooltipAlignmentFixed = true;
	}

	/**
	 * This method reflects the current situation
	 * to the trigger element when it call.
	 */
	this.intro = function()
	{
		if( this.isInputMode())

			return void this.inputIntro();

		// get most popular reactions
		var populars = this.populars( this.options.summaryIconLimit );
		// calculate total reactions
		var total = this.total();

		var chosen = this.skeleton[ this.choice ];
		var button = this.skeleton.buttonLabel;
		var choice = this.choice;
		var icons = this.skeleton.icons;

		// do we have at least 1 reaction?
		this.skeleton.total.html( total || '' );
		this.skeleton.buttonIcon.html( '' );

		// do we have a choice already?
		if( choice != null )
		{
			button
				.removeClass( button.data( 'choice' ))
				.addClass( 'choiced ' + choice )
				.data( 'choice', choice )
				.html( chosen.data( 'happen' ));

			icons.find( 'span' ).removeClass( 'rubberBand' );

			if( this.isOpen )

				chosen.addClass( 'hover' )
					  .find( 'span' )
					  .addClass( 'animated rubberBand' );
		}
		else
		{
			button
				.removeClass( button.data( 'choice' ))
				.removeClass( 'choiced' )
				.html( this.getEmotionLabel( this.options.value ));
			
			icons.find( 'span' ).removeClass( 'rubberBand' );
		}

		// let's put most popular reactions
		$( populars ).each( function()
		{
			var name = this[ 0 ];
			var hit = this[ 1 ];

			if( hit <= 0 )

				return;

			var ico = root.skeleton[ name ].clone();

			ico.find( 'i' ).remove();

			root.skeleton.buttonIcon.append( ico );
		});
	}

	/**
	 * This method reflects the current situation
	 * to the trigger element for input mode when
	 * it call.
	 */
	this.inputIntro = function()
	{
		var chosen = this.skeleton[ this.choice ];
		var button = this.skeleton.buttonLabel;
		var choice = this.choice;

		// do we have a choice already?
		if( choice != null )
		{
			button
				.removeClass( button.data( 'choice' ))
				.addClass( 'choiced ' + choice )
				.data( 'choice', choice )
				.html( chosen.data( 'happen' ));

			if( this.isOpen )

				chosen.addClass( 'hover' )
					  .find( 'span' )
					  .addClass( 'animated rubberBand' );
		}
		else
		{
			button
				.removeClass( button.data( 'choice' ))
				.removeClass( 'choiced' )
				.html( this.getEmotionLabel( this.options.value ));
		}
	}

	/**
	 * This method is sent request to the server for a reaction.
	 *
	 * There is no state control for the emotion
	 * here (add, replace, delete). This needs to be done on
	 * the server side. When the user selects a feeling, the
	 * selected emotion name is delivered to the server.
	 * 
	 * What to do on the server is as follows;
	 * 
	 *  1- Reaction should be added if the user is sending a feeling
	 *  for the item for the first time.
	 *  2- If the user has already sent a reaction for the item, but
	 *  this new one is different, it should be replaced with the old one.
	 *  3- If the user has already sent a reaction for the item, the
	 *  reaction saved should be deleted if the new one is the same as
	 *  the old one.
	 * 
	 * @param {string} emotion native emotion name (like, haha, ...) to be
	 * transmitted to the server
	 */
	this.ping = function( emotion )
	{
		// if we are in input mode there will be no ping action
		if( this.isInputMode())
		{
			this.skeleton.input.val( emotion );

			switch( root.getHTTPVerb( emotion ))
			{
				case 'post':
					this.listener.onReactAdded( emotion );
					break;

				case 'delete':
					this.listener.onReactRemoved( emotion );
					break;

				case 'patch':
					this.listener.onReactUpdated( emotion );
			}

			this.listener.onReacted( emotion );
			return;
		}

		// let's find an HTTP method name for emotion
		var method = this.getMethod( emotion );

		$( root ).trigger( 'action' );

		$.ajax(
		{
			url: this.options.serviceUri,
			type: method,
			dataType: 'json',
			data:
			{
				id: item,
				reaction_id: ( root.serverReaction && root.serverReaction.id ) || null,
				reaction: emotion,
				"subject-type": this.options.subjectType || 'null'
			},
		})
		.done( function( e, statusName, response )
		{
			var listener = root.listener;

			root.serverReaction = e.result.reaction;

			switch( root.getHTTPVerb( emotion ))
			{
				case 'post':
					listener.onReactAdded( emotion, e.result.summary );
					break;

				case 'delete':
					listener.onReactRemoved( emotion, e.result.summary );
					break;

				case 'patch':
					listener.onReactUpdated( emotion, e.result.summary );
			}

			// general purpose listener
			listener.onReacted( emotion, e.result.summary );

			$( root )
				.trigger( 'status-' + response.status )
				.trigger( 'success' );
		})
		.fail( function( e )
		{
			$( root )
				.trigger( 'status-' + e.status )
				.trigger( 'failed' );
		});
	}

	/**
	 * Plays a sound file.
	 * @param {string} path sound file path
	 */
	this.playSoundEffect = function( path )
	{
		if( ! this.isOpen || this.options.volume == null )

			return;

		var player = new Audio;

		player.volume = this.options.volume / 100;
		player.src = path;
		player.play();
	}

	/**
	 * Prepares a drop effect for a named reaction.
	 * @param {string} reaction chosen reaction's name
	 */
	this.dropReaction = function( reaction )
	{
		if( this.isMobile())

			return;

		var mainico = this.skeleton[ reaction ];
		var tmpicon = mainico.clone();
		var classes = 'animated ';

		classes += this.options.position == 'top'
			? 'zoomOutDown'
			: 'zoomOutUp';

		tmpicon.addClass( classes )
			   .find( 'i' )
			   .remove();

		mainico.after( tmpicon );

		setTimeout( function()
		{
			tmpicon.remove();
		}, 1100 );
	}

	/**
	 * This method computes the state for the "Auto" method and returns
	 * the appropriate HTTP method name for the restful API. If another
	 * method other than "Auto" is preferred, this will return the
	 * preference.
	 *
	 * @param {string} choice a reaction native name (like, haha, ...)
	 * @return {string}
	 */
	this.getMethod = function( choice )
	{
		var m;

		if(( m = this.options.method ) != 'auto' )

			return m;

		return this.getHTTPVerb( choice );
	}

	/**
	 * It compares a given reaction name with the current selection
	 * state of the annex and returns the HTTP verb of what the user
	 * action means.
	 * 
	 * @param {string} choice a reaction native name (like, haha, ...)
	 * @return {string}
	 */
	this.getHTTPVerb = function( choice )
	{
		switch( this.choice )
		{
			// first time?
			case null: return 'post';
			// we have already a selection
			// and new one is same old one?
			case choice: return 'delete';
			// we have already a selection
			// and new one is different old one?
			default: return 'patch';
		}
	}

	/**
	 * Its finds most popular reactions.
	 * 
	 * @param {number} items reaction number
	 * @return {array}
	 */
	this.populars = function( items )
	{
		var feelings = this.options.feelings;
		var r = [];

		for( var i in feelings )

			r.push([ i, feelings[ i ]]);

		r.sort( function( a, b )
		{
			return a[ 1 ] - b[ 1 ];
		});

		return r.slice( -1 * items ).reverse();
	}

	/**
	 * Performs the installation. Makes a few adjustments as
	 * necessary. Makes the plug-in ready for operation.
	 */
	this.init = function()
	{
		var im, dr;

		this.choice = this.options.choice;
		this.options.itemID = item;

		if(( im = this.isInputMode()) && ( dr = this.options.value ) !== false )
		
			this.choice = dr;

		this.intro();
		this.listener.attach();

		if( this.options.update == 'yes' && ! im && window.reactableQueue )

			reactableQueue.push( this );

		Anonstyle.new( "reactable" ).push( "all", assign( styles,
		{
			root: app.public()
		}));
	}

	this.init();
}

/**
 * Örneklenmiş Reactable nesnelerinin reaksiyon özetinin
 * sunucudan güncellenebilmesi için ortak bir arayüz sağlar,
 * instance sayısından bağımsız olarak tek istek ile bilgileri
 * alır ve ilgili instance'lara dağıtır. Özetle bir istek
 * kuyruğu gibi çalışır.
 *
 * @param {Object} options kurulum ayarlar
 */
window.ReactableUpdateEngine = ReactableUpdateEngine = function( options )
{
	// root path
	var root = this;

	/**
	 * İş kuyruğu.
	 * @type {object}
	 */
	this.queue = 
	{
		length: 0
	};

	/**
	 * Tür adı haritası.
	 * @type {array}
	 */
	this.types = [ 'null' ];

	/**
	 * Ana sayaç.
	 * @type {number}
	 */
	this.timer = 0;

	/**
	 * Döngünün çalışıp çalışmadığı.
	 * @type {boolean}
	 */
	this.isWorking = false;

	/**
	 * Döngü sayısını tutar.
	 * @type {Number}
	 */
	this.cycle = 0;

	/**
	 * Çeşitli tolerans hesaplamaları sonucunda
	 * hemen tetikleme moduna izin verilip verilmeyeceğini
	 * söyler.
	 * 
	 * @type {Boolean}
	 */
	this.immediateAllowed = false;

	/**
	 * Varsayılan ayarlar.
	 * @type {object}
	 */
	this.options = $.extend( true,
	{
		immediateStartTolerance: .05,
		reactableDelay: 5000,
		reactableUri: 'batch-ping',
		reactableImmediate: 'no'
	}, options );

	/**
	 * Verilen reactable örneğini kuyruğa ekler.
	 * @param {Reactable} reactable bir reactable örneği
	 */
	this.push = function( reactable )
	{
		var st, tp;
		
		if( ! ( reactable instanceof Reactable ))

			return;

		if( reactable.options.subjectType === null )

			reactable.options.subjectType = 'null';

		if(( st = reactable.options.subjectType ) && ( tp = this.types.indexOf( st )) == -1 )
		{
			this.types.push( st );
			tp = this.types.length - 1;
		}

		this.queue[ reactable.options.itemID + ':' + tp ] = reactable;
		this.queue.length++
		this.restart();
		
		if( this.options.reactableImmediate == 'yes' && ! this.immediateAllowed )

			this.ping();
	}

	/**
	 * Güncelleme motorunu çalıştırır.
	 */
	this.start = function()
	{
		if( this.isWorking )

			return;

		this.timer = setInterval( function()
		{
			root.ping();
		},
		this.options.reactableDelay );

		this.isWorking = true;
	}

	/**
	 * Motoru durdurur.
	 */
	this.stop = function()
	{
		clearTimeout( this.timer );
		this.isWorking = false;
	}

	/**
	 * Sayacı başa alır.
	 */
	this.restart = function()
	{
		this.stop();
		this.start();
	}

	/**
	 * Kuyruktaki tüm Reactable instance'larını alarak bir ağ
	 * isteği derleyip sunucuya teslim eder, aldığı yanıtı
	 * ilgili instance'lara dağıtır.
	 */
	this.ping = function()
	{
		var serializedItems = this.serialize();

		this.cycle++

		$.ajax(
		{
			url: this.options.reactableUri,
			type: 'GET',
			dataType: 'json',
			data: serializedItems,
		})
		.done( function( e )
		{
			for( var i in e.feelings )
			{
				var itemID = i.split( '|' )[ 0 ];
				var itemType = root.types.indexOf( i.split( '|' )[ 1 ]);

				var target = root.queue[ itemID + ':' + itemType ];
				var item = e.feelings[ i ];
				var feelings = item.feelings;
				var choice = item.choice;

				target.options.feelings = feelings;
				target.choice = choice;
				target.intro();
			}
		})
		.fail( function()
		{

		});
	}

	/**
	 * Kuyruktaki öğelerin ID bilgilerini birleştirip döndürür.
	 * @return {object}
	 */
	this.serialize = function()
	{
		var items = [];

		for( var i in this.queue )

			i != 'length' && items.push( i );

		return {
			items: items.join( ',' ),
			types: this.types.join( ',' )
		}
	}

	/**
	 * Hemen başlatma modu aktif olduğunda devreye girer ve
	 * tazeleme süresini ve ayarlı tolerans değerini alarak
	 * bir süre hesaplar. Bu süre dolduğu zaman da tolerans
	 * bayrağını false durumuna getirir.
	 */
	this.immediateTolerance = function()
	{
		var tolerable = this.options.reactableDelay * this.options.immediateStartTolerance;

		this.immediateAllowed = true;

		setTimeout( function()
		{
			root.immediateAllowed = false;
			root.ping();
		},
		tolerable );
	}

	/**
	 * Kurulumu gerçekleştirir.
	 */
	this.init = function()
	{
		clearTimeout( this.timer );

		this.immediateTolerance();
	}

	this.init();
}

	/**
	 * jQuery plug-in provider metot. Even if it works with the
	 * element list, it works for the first element in the list.
	 * It returns the instance of the reactable interface backwards.
	 * 
	 * @param {number|string} item any ID value
	 * @param {object} options setup settings
	 * @return {jQuery}
	 */
	$.fn.reactable = function( item, options )
	{
		return $( new Reactable
		(
			item,
			$.extend( true, options,
			{
				trigger: this.eq( 0 )
			})
		));
	}

	$( function()
	{
		var ueOptions = $( document.body ).data();

		if( ueOptions.reactableDelay || ueOptions.reactableUri )

			window.reactableQueue = new ReactableUpdateEngine( ueOptions );

		$( '[data-toggle=reactable]' ).each( function()
		{
			var el = $( this );

			if(( id = el.data( 'id' )) == undefined )

				return void console.error( 'Reactable.js: data-id parameter is required.' );

			var elData = el.data();

			elData.trigger = el;
			elData.choice = elData.choice || null;

			var reactable = new Reactable( id, elData );
		});
	});

	return Reactable;
});
