/*-----------------------------------------------------------------------------------

 	Script - All Custom frontend jQuery scripts & functions

-----------------------------------------------------------------------------------*/
(function(){
	'use strict';

	/* do animations if element is visible
    ------------------------------------------------*/



	/* header Features ()
    ------------------------------------------------*/
	function headerFeatures() {
		/* Add hero-invisible as soon as it's out of the viewport */
		var selector = "#hero"; if (jQuery("header").hasClass("hero-side")) { selector = "#hero-and-body"; }
		if (jQuery( window ).scrollTop() + 30 > jQuery(selector).height()) {
			jQuery('header.onhero').addClass("hero-invisible");
			// trigger mute if sound is on
			if (jQuery(selector).find(".mute-video:not(.unmute)").length) {
				jQuery(selector).find(".mute-video:not(.unmute)").trigger("click");
			}
		} else {
			jQuery('header.onhero').removeClass("hero-invisible");
		}

		/* Show Hide back to top arrow */
		if (jQuery(window).scrollTop() > jQuery(window).height()) { jQuery('header .header-totop').addClass("visible");
		} else { jQuery('header .header-totop').removeClass("visible"); }

	}




	jQuery(window).on("load",function() {

		/*----------------------------------------------
                H E A D E R   S E T T I N G S
        ------------------------------------------------*/
		if (	(jQuery("#logo").hasClass("logo-right") && (jQuery("#hero").hasClass("side-left") || jQuery("#hero").hasClass("side-left-small")) ) ||
			(jQuery("#logo").hasClass("logo-left") && (jQuery("#hero").hasClass("side-right") || jQuery("#hero").hasClass("side-right-small")) ) ) {
		} else {
			jQuery("header").addClass("onhero");
			if (jQuery("#hero").attr("class") && jQuery("#hero").attr("class").indexOf("side") >= 0) {
				jQuery("header").addClass("hero-side");
				jQuery("#logo").addClass("disable-switch");
			}
		}
		if (jQuery("#logo").hasClass("logo-right")){ jQuery("header").addClass("logo-is-right"); } // for mquerries





		/*----------------------------------------------
                   R E S P O N S I V E   N A V
        ------------------------------------------------*/
		// jQuery('header').on("click", ".menu-toggle", function() {
		// 	jQuery('#header').toggleClass('menu-is-open');
		// 	return false;
		// });

		jQuery('#main-nav').on("click", "li > a", function() {
			var thisItem = jQuery(this);
			var thisParent = jQuery(this).parent('li');
			if (thisItem.siblings('ul').length > 0 && thisItem.siblings('ul').css('display') === 'none') {
				thisItem.siblings('ul').slideDown(400, "easeInOutCubic");
				thisParent.siblings('li').children('ul').slideUp(400, "easeInOutCubic");
				return false;
			}
		});



		/*----------------------------------------------
                   H E A D E R   A C T I O N S
        ------------------------------------------------*/
		jQuery('header').on("click", ".open-action", function() {
			jQuery('#header').addClass('action-is-active '+jQuery(this).data('action')).removeClass('menu-is-open');
			return false;
		});

		// jQuery('header').on("click", ".header-close", function() {
		// 	jQuery('header .open-action').each(function(){
		// 		jQuery('#header').removeClass(jQuery(this).data('action'));
		// 	});
		// 	jQuery('#header').removeClass('action-is-active').removeClass('menu-is-open');
		// 	return false;
		// });




		/*----------------------------------------------
                           L I G H T C A S E
        ------------------------------------------------*/
		if(jQuery().lightcase) {
			jQuery('a[data-rel^=lightcase]').lightcase({
				showSequenceInfo: false,
				swipe: true,
				showCaption: true,
				overlayOpacity:0.9,
				maxWidth: 1300,
				maxHeight: 1100,
				shrinkFactor: 1,
				liveResize: true,
				fullScreenModeForMobile: true,
				video: {
					width : 854,
					height : 480
				},
				iframe:{
					width:854,
					height:480,
					allowfullscreen: 1
				}
			});

			jQuery('a[data-rel^="lightcase:"]').each(function(index) {
				var el = jQuery(this);
				if(!el.hasClass('lc-trigger') && !el.parents('.isotope-item').hasClass('sr-gallery-item')) {
					var rel = el.data('rel');
					var href = el.attr('href');
					var count = jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').length;
					if(count > 1) {
						jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').not(this).addClass('lc-trigger').attr('data-trigger',index).attr('data-rel','');
						el.addClass('lc-trigger-'+index);
					}
				}
			});

			jQuery('a.lc-trigger').on("click", function() {
				jQuery( ".lc-trigger-"+jQuery(this).data('trigger') ).trigger( "click" );
				return false;
			});

			// mute all bg videos if lightcase is opened
			jQuery('a[data-rel^=lightcase]').on("click", function() {
				if (jQuery(".phatvideo-bg .mute-video:not(.unmute)").length) {
					jQuery('.phatvideo-bg .mute-video:not(.unmute)').each(function() {
						jQuery(this).trigger("click");
					});
				}
			});

		}


		/*----------------------------------------------
            O W L   S L I D E R & C A R O U S E L
        ------------------------------------------------*/







		/*----------------------------------------------
                    S T I C K Y   C O L U M N     (portfolio)
        ------------------------------------------------*/
		// if(jQuery().stick_in_parent) {
		// 	if (jQuery(window).width() < 769) { jQuery("#hero[class*='side-']").trigger("sticky_kit:detach"); }
		// }


		/*----------------------------------------------
                            T A B S
        ------------------------------------------------*/
		jQuery(".tabs:not(.wc-tabs):not(.woocommerce-tabs)").each(function() {
			var thisItem = jQuery(this);
			thisItem.find('.tab-content').removeClass('active').css('display','none');
			var rel = thisItem.find('.active a').attr('href');
			thisItem.find('.'+rel).addClass('active');
		});

		jQuery(".tab-nav:not(.wc-tabs)").on("click", "a", function() {
			var thisItem = jQuery(this);
			var parentdiv = thisItem.parents('li').parent('ul').parent('div');
			var rel = thisItem.attr('href');

			jQuery(parentdiv).find(".tab-nav li").removeClass("active");
			thisItem.parents('li').addClass("active");

			jQuery(parentdiv).find(".tab-container .tab-content").hide().removeClass('active');
			jQuery(parentdiv).find(".tab-container ."+rel).fadeIn(500).addClass('active');

			return false;
		});



		/*----------------------------------------------
                T O G G L E  &  A C C O R D I O N
        ------------------------------------------------*/
		jQuery(".toggle-item").each(function() {
			if (!jQuery(this).find('.toggle-active').length) { jQuery(this).find('.toggle-inner').slideUp(300); }
			jQuery(this).find('.toggle-active').parent(".toggle-item").siblings('.toggle-item').find('.toggle-inner').slideUp(300);
			jQuery(this).find('.toggle-active').siblings('.toggle-inner').slideDown(300);
		});

		jQuery(".toggle-item").on("click", ".toggle-title", function() {
			var thisItem = jQuery(this);
			var parentdiv = thisItem.parent('div').parent('div');
			var active = thisItem.parent('div').find('.toggle-inner').css('display');

			if (jQuery(parentdiv).attr('class') === 'accordion') {
				if (active !== 'none' ) {
					jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
					thisItem.toggleClass('toggle-active');
				} else {
					jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
					jQuery(parentdiv).find('.toggle-item .toggle-title').removeClass('toggle-active');

					thisItem.toggleClass('toggle-active');
					thisItem.siblings('.toggle-inner').slideDown(300);
				}
			} else {
				thisItem.toggleClass('toggle-active');
				thisItem.siblings('.toggle-inner').slideToggle(300);
			}

			return false;
		});




		/*----------------------------------------------
                       S C R O L L   T O (back to top, scroll down)
        ------------------------------------------------*/
		jQuery('body').on('click', '.totop,#scrolldown', function() {
			var topPos = 0;
			if (jQuery(this).attr("id") === "scrolldown") { topPos = jQuery("#page-body").offset().top; }
			jQuery('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart');
			return false;
		});

	});

	jQuery(window).on('scroll',function() {
	// 	animateOnScroll(false);
	// 	headerFeatures();
	});
	//
	// jQuery(window).on('resize',function() {
	// 	reorganizeIsotope();
	// 	resizeAdapt();
	// });

})(jQuery);
