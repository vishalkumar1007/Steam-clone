jQuery( function($) {
	

	const $Menu = $('#responsive_page_menu');
	const $Frame = $('.responsive_page_frame');
	const $ContentCtn = $('.responsive_page_content' );
	const $ContentOverlay = $('.responsive_page_content_overlay');
	const strLastExpandedSubmenu = WebStorage.GetLocalSession( 'responsiveMenuLastSubmenu' );

	const fnMakeExpandableMenuItem = function( $MenuItem, $Submenu )
	{
		$MenuItem.append( $J('<div/>', {'class': 'chevron' } ) );


		const $SubmenuWrapper = $J('<div/>', {'class': 'menuitem_submenu_wrapper' });
		$MenuItem.after( $SubmenuWrapper.append( $Submenu ) );
		$Submenu.wrap( $('<div/>', {'class': 'inner_borders' } ) );

		if ( strLastExpandedSubmenu && strLastExpandedSubmenu == $Submenu.data('submenuid') )
		{
			$SubmenuWrapper.css( 'height', $Submenu.height() + 'px' );
			$MenuItem.addClass( 'submenu_active' );
			$SubmenuWrapper.addClass('active');
		}
		else
		{
			$SubmenuWrapper.css( 'height', 0 );
		}

		$Submenu.show();

		$MenuItem.click( function(e) {
			e.preventDefault();
			if ( $SubmenuWrapper.hasClass('active' ) )
			{
				$SubmenuWrapper.removeClass('active' ).css('height',0);
				$MenuItem.removeClass('submenu_active');
				
			}
			else
			{
				$SubmenuWrapper.siblings( '.menuitem_submenu_wrapper.active' ).css('height',0 ).removeClass('active');
				$MenuItem.siblings('.menuitem').removeClass('submenu_active');
				$SubmenuWrapper.css( 'height', $Submenu.height() + 'px' );
				$MenuItem.addClass( 'submenu_active' );
				$SubmenuWrapper.addClass('active');
				
			}
		});
	};

	const fnBuildMenuEvents = function( $Menu, strMenuName, fnFirstTimeInitialization )
	{
		const strActiveClass = strMenuName + '_active';
		const fnGPOnClosingModalWindow = null;

		const fnDismissMenu = function() {
			$ContentCtn.off( 'click.ReponsiveMenuDismiss');
			$Frame.removeClass(strActiveClass);
		};

		var bInitialized = false;
		const fnActivateMenu = function() {
			if ( !bInitialized )
			{
				fnFirstTimeInitialization && fnFirstTimeInitialization();
				bInitialized = true;
			}

			if ( $Frame.hasClass( strActiveClass ) )
			{
				fnDismissMenu();
				return;
			}
			$Menu.removeClass('secondary_active');
			$Frame.addClass( strActiveClass );
			$ContentOverlay.one( 'click.ResponsiveMenuDismiss', function() {
				fnDismissMenu();
			});
		};

		return { fnActivateMenu: fnActivateMenu, fnDismissMenu: fnDismissMenu };
	};

	const fnInitMainMenu = function() {
		$('.responsive_page_menu' ).find( '.supernav').each( function() {
			var $Element = $(this);
			$Element.attr('href','');
			const strSubmenuSelector = $Element.data('tooltip-content');
			const $Submenu = $Element.parent().find(strSubmenuSelector);
			if ( $Submenu.length )
			{
				fnMakeExpandableMenuItem( $Element, $Submenu );
			}
		});

		const $NotificationItem = $Menu.find( '.notifications_item' );
		const $NotificationSubmenu = $Menu.find('.notification_submenu');
		if ( $NotificationItem.length && $NotificationSubmenu.length )
		{
			fnMakeExpandableMenuItem( $NotificationItem, $NotificationSubmenu );
		}
		
	};

	let MainMenuEvents = null;
	if ( $Menu.length )
	{
		MainMenuEvents = fnBuildMenuEvents( $Menu, 'mainmenu', fnInitMainMenu );


		$('#responsive_menu_logo' ).click( function( e ) {
			MainMenuEvents.fnActivateMenu();
		} );
	}
});



function Responsive_BuildChangeLanguageOption(){}