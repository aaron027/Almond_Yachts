(function ($) {

	"use strict";

	//Hide Loading Box (Preloader)
	function handlePreloader () {
		if ($('.preloader').length) {
			$('body').addClass('page-loaded');
			$('.preloader').delay(1000).fadeOut(0);
		}
	}

	//Update Header Style and Scroll to Top
	function headerStyle () {
		if ($('.main-header').length) {
			var windowpos = $(window).scrollTop();
			var siteHeader = $('.main-header');
			var scrollLink = $('.scroll-to-top');
			var sticky_header = $('.main-header .sticky-header');
			if (windowpos > 180) {
				siteHeader.addClass('fixed-header');
				sticky_header.addClass("animated slideInDown");
				scrollLink.fadeIn(300);
			} else {
				siteHeader.removeClass('fixed-header');
				sticky_header.removeClass("animated slideInDown");
				scrollLink.fadeOut(300);
			}
		}
	}

	headerStyle();

	//Submenu Dropdown Toggle
	if ($('.main-header li.dropdown ul').length) {
		$('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-right"></span></div>');

	}

	// responsive Table
	$('.table-responsive-stack').each(function (i) {
		var id = $(this).attr('id');
		$(this).find("th").each(function (i) {
			$('#' + id + ' td:nth-child(' + (i + 1) + ')').prepend('<span class="table-responsive-stack-thead">' + $(this).text() + ':</span> ');
			$('.table-responsive-stack-thead').hide();

		});
	});
	$('.table-responsive-stack').each(function () {
		var thCount = $(this).find("th").length;
		var rowGrow = 100 / thCount + '%';
		$(this).find("th, td").css('flex-basis', rowGrow);
	});
	function flexTable () {
		if ($(window).width() < 768) {
			$(".table-responsive-stack").each(function (i) {
				$(this).find(".table-responsive-stack-thead").show();
				$(this).find('thead').hide();
			});
		} else {
			$(".table-responsive-stack").each(function (i) {
				$(this).find(".table-responsive-stack-thead").hide();
				$(this).find('thead').show();
			});
		}
	}
	flexTable();
	window.onresize = function (event) {
		flexTable();
	};

	//Mobile Nav Hide Show
	if ($('.mobile-menu').length) {

		$('.mobile-menu .menu-box').mCustomScrollbar();

		var mobileMenuContent = $('.main-header .nav-outer .main-menu').html();
		$('.mobile-menu .menu-box .menu-outer').append(mobileMenuContent);
		$('.sticky-header .main-menu').append(mobileMenuContent);

		//Dropdown Button
		$('.mobile-menu li.dropdown .dropdown-btn').on('click', function () {
			$(this).toggleClass('open');
			$(this).prev('ul').slideToggle(500);
		});
		//Menu Toggle Btn
		$('.mobile-nav-toggler').on('click', function () {
			$('body').addClass('mobile-menu-visible');
		});

		//Menu Toggle Btn
		$('.mobile-menu .menu-backdrop,.mobile-menu .close-btn').on('click', function () {
			$('body').removeClass('mobile-menu-visible');
		});
		$(document).keydown(function (e) {
			if (e.keyCode === 27) {
				$('#search-popup').removeClass('mobile-menu-visible');
				$('body').removeClass('mobile-menu-visible');
			}
		});
	}

	//Search Popup
	if ($('#search-popup').length) {

		//Show Popup
		$('.search-toggler').on('click', function () {
			$('#search-popup').addClass('popup-visible');
			$('body').addClass('search-visible');
		});
		$(document).keydown(function (e) {
			if (e.keyCode === 27) {
				$('#search-popup').removeClass('popup-visible');
				$('body').removeClass('search-visible');
			}
		});
		//Hide Popup
		$('.close-search,.search-popup .overlay-layer').on('click', function () {
			$('#search-popup').removeClass('popup-visible');
			$('body').removeClass('search-visible');
		});
	}

	//Hidden Bar Menu Config
	function hiddenBarMenuConfig () {
		var menuWrap = $('.hidden-bar .side-menu');
		// hidding submenu 
		menuWrap.find('.dropdown').children('ul').hide();
		// toggling child ul
		menuWrap.find('li.dropdown > a').each(function () {
			$(this).on('click', function (e) {
				e.preventDefault();
				$(this).parent('li.dropdown').children('ul').slideToggle();

				// adding class to item container
				$(this).parent().toggleClass('open');

				return false;

			});
		});
	}

	hiddenBarMenuConfig();


	//Hidden Sidebar
	if ($('.hidden-bar').length) {
		var hiddenBar = $('.hidden-bar');
		var hiddenBarOpener = $('.max-nav-toggler .toggle-btn');
		var hiddenBarCloser = $('.hidden-bar-closer');
		$('.hidden-bar-wrapper').mCustomScrollbar();

		//Show Sidebar
		hiddenBarOpener.on('click', function () {
			hiddenBar.addClass('visible-sidebar');
		});

		//Hide Sidebar
		hiddenBarCloser.on('click', function () {
			hiddenBar.removeClass('visible-sidebar');
		});

		$(document).keydown(function (e) {
			if (e.keyCode === 27) {
				hiddenBar.removeClass('visible-sidebar');
			}
		});

	}

	//Main Slider / Banner Carousel
	if ($('.banner-carousel').length) {
		$('.banner-carousel').owlCarousel({
			loop: true,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			margin: 0,
			nav: true,
			smartSpeed: 500,
			autoplay: 6000,
			autoplayTimeout: 7000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Services Carousel
	if ($('.services-carousel').length) {
		$('.services-carousel').owlCarousel({
			loop: true,
			margin: 35,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 2
				},
				1024: {
					items: 3
				}
			}
		});
	}

	//Activity Carousel
	if ($('.activity-carousel').length) {
		$('.activity-carousel').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				768: {
					items: 2
				},
				1024: {
					items: 2
				},
				1140: {
					items: 1
				},
				1500: {
					items: 1
				},
				1600: {
					items: 2
				}
			}
		});
	}

	//Testimonial Carousel
	if ($('.testimonial-carousel').length) {
		$('.testimonial-carousel').owlCarousel({
			loop: true,
			margin: 40,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				768: {
					items: 1
				},
				1024: {
					items: 2
				},
				1500: {
					items: 2
				},
				1700: {
					items: 3
				}
			}
		});
	}

	//Testimonial Carousel
	if ($('.testimonial-carousel-two').length) {
		$('.testimonial-carousel-two').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 2
				},
				1200: {
					items: 2
				}
			}
		});
	}

	//Offer Carousel
	if ($('.offer-carousel').length) {
		$('.offer-carousel').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				768: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Facts Carousel
	if ($('.facts-carousel').length) {
		$('.facts-carousel').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Single Item Carousel
	if ($('.single-item-carousel').length) {
		$('.single-item-carousel').owlCarousel({
			loop: true,
			animateOut: 'fadeOut',
			animateIn: 'fadeIn',
			margin: 10,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Team Carousel
	if ($('.team-carousel').length) {
		$('.team-carousel').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				768: {
					items: 2
				},
				1024: {
					items: 3
				}
			}
		});
	}

	//Testimonials Carousel Three
	if ($('.testimonial-carousel-three').length) {
		$('.testimonial-carousel-three').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Event Carousel
	if ($('.event-carousel').length) {
		$('.event-carousel').owlCarousel({
			loop: true,
			margin: 60,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 1
				},
				1024: {
					items: 1
				}
			}
		});
	}

	//Event Carousel
	if ($('.featured-column-carousel').length) {
		$('.featured-column-carousel').owlCarousel({
			loop: true,
			margin: 50,
			nav: true,
			smartSpeed: 500,
			autoplay: 5000,
			autoplayTimeout: 5000,
			navText: ['<span class="icon flaticon-back"></span>', '<span class="icon flaticon-next"></span>'],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				800: {
					items: 2
				},
				1024: {
					items: 2
				}
			}
		});
	}

	//Coming Soon Scroll
	if ($('.yacht-details .scroller').length) {
		$('.yacht-details .scroller').mCustomScrollbar();
	}

	//Coming Soon Countdown Timer
	if ($('.time-countdown').length) {
		$('.time-countdown').each(function () {
			var $this = $(this), finalDate = $(this).data('countdown');
			$this.countdown(finalDate, function (event) {
				var $this = $(this).html(event.strftime('' + '<div class="counter-column"><span class="count">%D</span>Days</div> ' + '<div class="counter-column"><span class="count">%H</span>Hrs</div>  ' + '<div class="counter-column"><span class="count">%M</span>Mins</div>  ' + '<div class="counter-column"><span class="count">%S</span>Secs</div>'));
			});
		});
	}

	//Datepicker
	if ($('.datepicker').length) {
		$(".datepicker").datepicker();
	}

	//Custom Quantity Spinner
	if ($('.quantity-spinner').length) {
		$('.quantity-spinner .plus').on('click', function () {
			var val = $(this).prev('.prod_qty').val();
			$(this).prev('.prod_qty').val((val * 1) + 1);
		});

		$('.quantity-spinner .minus').on('click', function () {
			var val = $(this).next('.prod_qty').val();
			if (val != 1) {
				$(this).next('.prod_qty').val((val * 1) - 1);
			}
		});
	}

	//Date Time Picker
	if ($('.datetime-picker').length) {
		$('.datetime-picker').datetimepicker({
			formatDate: 'Y/m/d',
			minDate: '-2020/01/01', // yesterday is minimum date
			maxDate: '+2030/12/30' // and tommorow is maximum date calendar
		});
	}

	//Range Slider
	if ($('.range-slider-1').length) {
		$(".range-slider-1").slider({
			range: true,
			min: 0,
			max: 7500,
			values: [1000, 2500],
			slide: function (event, ui) {
				$("#amount-1").val("$" + ui.values[0] + " - $" + ui.values[1]);
			}
		});
		$("#amount-1").val("$" + $(".range-slider-1").slider("values", 0) +
			" - $" + $(".range-slider-1").slider("values", 1));
	}

	//Dewfault Masonry
	function enableDefaultMasonry () {
		if ($('.masonry-container').length) {

			var winDow = $(window);
			// Needed variables
			var $container = $('.masonry-container');

			$container.isotope({
				itemSelector: '.masonry-item',
				masonry: {
					columnWidth: '.masonry-item'
				},
				animationOptions: {
					duration: 500,
					easing: 'linear'
				}
			});
		}
	}
	enableDefaultMasonry();

	//Sortable Masonary with Filters
	function sortableMasonry () {
		if ($('.sortable-masonry').length) {

			var winDow = $(window);
			// Needed variables
			var $container = $('.sortable-masonry .items-container');
			var $filter = $('.filter-btns');

			$container.isotope({
				filter: '*',
				masonry: {
					columnWidth: '.masonry-item'
				},
				animationOptions: {
					duration: 500,
					easing: 'linear'
				}
			});


			// Isotope Filter 
			$filter.find('li').on('click', function () {
				var selector = $(this).attr('data-filter');

				try {
					$container.isotope({
						filter: selector,
						animationOptions: {
							duration: 500,
							easing: 'linear',
							queue: false
						}
					});
				} catch (err) {

				}
				return false;
			});


			winDow.on('resize', function () {
				var selector = $filter.find('li.active').attr('data-filter');

				$container.isotope({
					filter: selector,
					animationOptions: {
						duration: 500,
						easing: 'linear',
						queue: false
					}
				});
			});


			var filterItemA = $('.filter-btns li');

			filterItemA.on('click', function () {
				var $this = $(this);
				if (!$this.hasClass('active')) {
					filterItemA.removeClass('active');
					$this.addClass('active');
				}
			});
		}
	}
	sortableMasonry();

	//MixitUp Gallery Filters
	if ($('.filter-list').length) {
		$('.filter-list').mixItUp({});
	}

	//Info Popup
	if ($('.info-pop .close-btn').length) {
		$('.info-pop .close-btn').on('click', function (e) {
			e.preventDefault();
			$('.info-pop').slideUp(300);
		});
	}

	//Selectable List Dropdown
	if ($('.selectable-list .btn-box').length) {
		$('.dropdown-menu .filter').on('click', function (e) {
			var AltTextBox = $(this).parents('.selectable-list').find('.btn-box');
			var AltTextTitle = $(this).attr("data-change-text");
			$(AltTextBox).text(AltTextTitle);
		});
	}

	//Tabs Box
	if ($('.tabs-box').length) {
		$('.tabs-box .tab-buttons .tab-btn').on('click', function (e) {
			e.preventDefault();
			var target = $($(this).attr('data-tab'));

			if ($(target).is(':visible')) {
				return false;
			} else {
				target.parents('.tabs-box').find('.tab-buttons').find('.tab-btn').removeClass('active-btn');
				$(this).addClass('active-btn');
				target.parents('.tabs-box').find('.tabs-content').find('.tab').fadeOut(0);
				target.parents('.tabs-box').find('.tabs-content').find('.tab').removeClass('active-tab');
				$(target).fadeIn(300);
				$(target).addClass('active-tab');
			}
		});
	}

	//Accordion Box
	if ($('.accordion-box').length) {
		$(".accordion-box").on('click', '.acc-btn', function () {

			var outerBox = $(this).parents('.accordion-box');
			var target = $(this).parents('.accordion');

			if ($(this).next('.acc-content').is(':visible')) {
				//return false;
				$(this).removeClass('active');
				$(this).next('.acc-content').slideUp(300);
				$(outerBox).children('.accordion').removeClass('active-block');
			} else {
				$(outerBox).find('.accordion .acc-btn').removeClass('active');
				$(this).addClass('active');
				$(outerBox).children('.accordion').removeClass('active-block');
				$(outerBox).find('.accordion').children('.acc-content').slideUp(300);
				target.addClass('active-block');
				$(this).next('.acc-content').slideDown(300);
			}
		});
	}

	//Custom Seclect Box
	if ($('.custom-select-box').length) {
		$('.custom-select-box').selectmenu().selectmenu('menuWidget').addClass('overflow');
	}

	//LightBox / Fancybox
	if ($('.lightbox-image').length) {
		$('.lightbox-image').fancybox({
			openEffect: 'fade',
			closeEffect: 'fade',
			helpers: {
				media: {}
			}
		});
	}

	//Contact Form Validation
	if ($('#contact-form').length) {
		$('#contact-form').validate({
			rules: {
				username: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				subject: {
					required: true
				},
				message: {
					required: true
				}
			}
		});
	}

	// Scroll to a Specific Div
	if ($('.scroll-to-target').length) {
		$(".scroll-to-target").on('click', function () {
			var target = $(this).attr('data-target');
			// animate
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 1500);

		});
	}

	// Elements Animation
	if ($('.wow').length) {
		var wow = new WOW(
			{
				boxClass: 'wow',      // animated element css class (default is wow)
				animateClass: 'animated', // animation css class (default is animated)
				offset: 0,          // distance to the element when triggering the animation (default is 0)
				mobile: false,       // trigger animations on mobile devices (default is true)
				live: true       // act on asynchronously loaded content (default is true)
			}
		);
		wow.init();
	}


	/* ==========================================================================
	   When document is Scrollig, do
	   ========================================================================== */

	$(window).on('scroll', function () {
		headerStyle();
	});

	/* ==========================================================================
	   When document is Resized, do
	   ========================================================================== */

	$(window).on('resize', function () {
		enableDefaultMasonry();
	});

	/* ==========================================================================
	   When document is loading, do
	   ========================================================================== */

	$(window).on('load', function () {
		handlePreloader();
		enableDefaultMasonry();
		sortableMasonry();

	});

})(window.jQuery);

/* ==========================================================================
   Customization
   ========================================================================== */
$("#Category_tab li").click(function () {
	var text = $(this).text();
	if (text == "LightShip") {
		$(".price-box .total_amount .exact_price").text("3,785.49");
		$(".content-inner .main-image img").attr("src", "../public/images/resource/featured-image-1.jpg");
	} else {
		$(".price-box .total_amount .exact_price").text("4,785.49");
		$(".content-inner .main-image img").attr("src", "../public/images/resource/featured-image-2.jpg")
	}
});

$('#interior1').on('change', function (e) {
	if (e.target.checked) {
		$('#interior1_modal').modal();
	}
});
$('#rigging1').on('change', function (e) {
	if (e.target.checked) {
		$('#rigging1_modal').modal();
	}
});
$('#rigging2').on('change', function (e) {
	if (e.target.checked) {
		$('#rigging2_modal').modal();
	}
});

// The drop down menu for my account
$("#myAccount").click(function () {
	$(".hasDown .down").toggle();
});

// Get currency rate from API
// var url = "https://v6.exchangerate-api.com/v6/42b3dbb1da9cfb4a0d9f30c7/latest/AUD";
// $.ajax({
// 	url: url,
// 	method: 'GET',
// 	dataType: 'JSON',
// 	success: function(data) {
// 		$(".converter-value").text(data.conversion_rates.USD);
// },
// error: function(err) {
// 	console.log('error:' + err)
// }
// });

//Default Currency
// Change currency function
var currencyrate = parseFloat($(".converter-value").text());

// $(".language ul li a").click(function () {
// 	var convertPrice = $('.convertPrice').html()
// 	var converter_value = 0.73
// 	var converter_value_us = 1.38;
// 	if ($(this).text() == 'Australia') {
// 		$(".language .txt").text("Australia - AUD ");
// 		$(".link-box .currency_name").text("AUD/USD")
// 		$(".converter-value").text(converter_value)
// 		$(".converter_currency").html("A$")
// 		$(".convertPrice").each(function (index) {
// 			var changedvalue = $(this).text() * 1.38
// 			$(this).text(changedvalue.toFixed(2))
// 		});
// 	} else {
// 		$(".language .txt").text("America - USD ");
// 		$(".converter_currency").html("US$")
// 		$(".link-box .currency_name").text("USD/AUD")
// 		$(".converter-value").text(converter_value_us)
// 		$(".convertPrice").each(function (index) {
// 			var changedvalue = $(this).text() * 0.73;
// 			$(this).text(changedvalue.toFixed(2))
// 		});
// 	}
// });

$(".login-pwd i").click(function () {
	var password = $("#password");
	var pwdtype = password.attr("type")
	if (pwdtype === "password") {
		password.attr("type", "text")
		$(this).removeClass('fa fa-eye').addClass('fa fa-eye-slash')
	} else {
		password.attr("type", "password")
		$(this).removeClass('fa fa-eye-slash').addClass('fa fa-eye')
	}
});


$(".navigation li a").each(function () {
	if ($(this)[0].href == String(window.location)) {
		$(this).parent("li").addClass('current').siblings().removeClass('current')
	}
});

// The function to transfer the empty string to '-' 
$(".info-content .form-control").each(function (index) {
	if ($(this).html().trim() === '') {
		$(this).html('-')
	}
});

// show password validation message
$("#password").focus(function () {
	$("#login_tip").show()
})
$("#password").blur(function () {
	$("#login_tip").hide()
})