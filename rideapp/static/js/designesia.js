 /* --------------------------------------------------
  * © Copyright 2025 - Rentaly by Designesia
  * --------------------------------------------------*/
(function($) {
    'use strict';

     var rtl_mode = 'off'; // on - for enable RTL, off - for deactive RTL
     var preloader = 'on'; // on - for enable preloader, off - for disable preloader
     var preloader_custom_image = 'off'; // insert image url to enable custom image, off - for disable custom image
     var loading_text = "Loading..."; // text for preloader. If you don't use text just leave it blank
     var loading_text_position = "0px"; // set position for loading text. Default value is 0px

     /* predefined vars begin */
     var mobile_menu_show = 0;
     var v_count = '0';
     var mb;
     var instances = [];
     var $window = $(window);
     var $op_header_autoshow = 0;
     var grid_size = 10;
     /* predefined vars end */

     function de_loader(){        
        if(preloader_custom_image=="off"){
            var myHtml = $("<div/>")
            .addClass("de-preloader")
            .append( $("<div/>").addClass("car")
            .append( $("<div/>").addClass("strike strike"))
            .append( $("<div/>").addClass("strike strike2"))
            .append( $("<div/>").addClass("strike strike3"))
            .append( $("<div/>").addClass("strike strike4"))
            .append( $("<div/>").addClass("strike strike5"))
            .append( $("<div/>").addClass("car-detail spoiler"))
            .append( $("<div/>").addClass("car-detail back"))
            .append( $("<div/>").addClass("car-detail center"))
            .append( $("<div/>").addClass("car-detail center1"))
            .append( $("<div/>").addClass("car-detail front"))
            .append( $("<div/>").addClass("car-detail wheel"))
            .append( $("<div/>").addClass("car-detail wheel wheel2"))
            .append( $("<div/>").addClass("text").text(loading_text))
            )            
        }else{
            var myHtml = $("<div/>")
            .addClass("de-preloader")
            .append( $("<div/>").addClass("custom-loader-image")
            .append( $("<div/>").addClass("text").text(loading_text))
            )
        }
        $("#de-preloader").append(myHtml);        
        $('.custom-loader-image').prepend('<img src="'+preloader_custom_image+'" />');
        $('.text').css('margin-top',loading_text_position);
     }
     
     de_loader();
     
     /* --------------------------------------------------
      * header | sticky
      * --------------------------------------------------*/
     function header_sticky() {
         jQuery("header").addClass("clone", 1000, "easeOutBounce");
         var $document = $(document);
         var vscroll = 0;
         var header = jQuery("header.autoshow");
         if ($document.scrollTop() >= 50 && vscroll == 0) {
             header.removeClass("scrollOff");
             header.addClass("scrollOn");
             header.css("height", "auto");
             vscroll = 1;
         } else {
             header.removeClass("scrollOn");
             header.addClass("scrollOff");
             vscroll = 0;
         }
     }
     /* --------------------------------------------------
      * plugin | magnificPopup
      * --------------------------------------------------*/
     function load_magnificPopup() {
         jQuery('.simple-ajax-popup-align-top').magnificPopup({
             type: 'ajax',
             alignTop: true,
             overflowY: 'scroll'
         });
         jQuery('.simple-ajax-popup').magnificPopup({
             type: 'ajax'
         });
         // zoom gallery
         jQuery('.zoom-gallery').magnificPopup({
             delegate: 'a',
             type: 'image',
             closeOnContentClick: false,
             closeBtnInside: false,
             mainClass: 'mfp-with-zoom mfp-img-mobile',
             image: {
                 verticalFit: true,
                 titleSrc: function(item) {
                     return item.el.attr('title');
                     //return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
                 }
             },
             gallery: {
                 enabled: true
             },
             zoom: {
                 enabled: true,
                 duration: 300, // don't foget to change the duration also in CSS
                 opener: function(element) {
                     return element.find('img');
                 }
             }
         });
         // popup youtube, video, gmaps
         jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
             disableOn: 700,
             type: 'iframe',
             mainClass: 'mfp-fade',
             removalDelay: 160,
             preloader: false,
             fixedContentPos: false
         });
         // Initialize popup as usual
         $('.image-popup').magnificPopup({
             type: 'image',
             mainClass: 'mfp-with-zoom', // this class is for CSS animation below

             zoom: {
                 enabled: true, // By default it's false, so don't forget to enable it

                 duration: 300, // duration of the effect, in milliseconds
                 easing: 'ease-in-out', // CSS transition easing function

                 // The "opener" function should return the element from which popup will be zoomed in
                 // and to which popup will be scaled down
                 // By defailt it looks for an image tag:
                 opener: function(openerElement) {
                     // openerElement is the element on which popup was initialized, in this case its <a> tag
                     // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                     return openerElement.is('img') ? openerElement : openerElement.find('img');
                 }
             }

         });
         $('.image-popup-vertical-fit').magnificPopup({
             type: 'image',
             closeOnContentClick: true,
             mainClass: 'mfp-img-mobile',
             image: {
                 verticalFit: true
             }
         });
         $('.image-popup-fit-width').magnificPopup({
             type: 'image',
             closeOnContentClick: true,
             image: {
                 verticalFit: false
             }
         });
         $('.image-popup-no-margins').magnificPopup({
             type: 'image',
             closeOnContentClick: true,
             closeBtnInside: false,
             fixedContentPos: true,
             mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
             image: {
                 verticalFit: true
             },
             zoom: {
                 enabled: true,
                 duration: 300 // don't foget to change the duration also in CSS
             }
         });
         $('.image-popup-gallery').magnificPopup({
             type: 'image',
             closeOnContentClick: false,
             closeBtnInside: false,
             mainClass: 'mfp-with-zoom mfp-img-mobile',
             image: {
                 verticalFit: true,
                 titleSrc: function(item) {
                     return item.el.attr('title');
                     //return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
                 }
             },
             gallery: {
                 enabled: true
             }
         });
         $('.images-group').each(function() { // the containers for all your galleries
             $(this).magnificPopup({
                 delegate: 'a', // the selector for gallery item
                 type: 'image',
                 gallery: {
                     enabled: true
                 }
             });
         });

         $('.images-popup').magnificPopup({
             delegate: 'a', // child items selector, by clicking on it popup will open
             type: 'image'
             // other options
         });
     }
     /* --------------------------------------------------
      * plugin | enquire.js
      * --------------------------------------------------*/
     function init_resize() {
         enquire.register("screen and (min-width: 993px)", {
             match: function() {
                 mobile_menu_show = 1;
             },
             unmatch: function() {
                 mobile_menu_show = 0;
                 jQuery("#menu-btn").show();
             }
         });
         enquire.register("screen and (max-width: 993px)", {
             match: function() {
                 $('header').addClass("header-mobile");
                 var body = jQuery('body');
                 if (body.hasClass('side-content')) {
                     body.removeClass('side-layout');
                 }
             },
             unmatch: function() {
                 $('header').removeClass("header-mobile");
                 var body = jQuery('body');
                 if (body.hasClass('side-content')) {
                     body.addClass('side-layout');
                 }
             }
         });
         init();
         init_de();
         video_autosize();
         
         var header = $('header');
         header.removeClass('smaller');
         header.removeClass('logo-smaller');
         header.removeClass('clone');

         var mx = window.matchMedia("(max-width: 992px)");
         var osw = jQuery('.owl-slide-wrapper');
         if (mx.matches) {           
             osw.find("img").css("height", $(window).innerHeight());
             osw.find("img").css("width", "auto");
             if($op_header_autoshow==1){
                 header.removeClass('autoshow');
             }
             
         } else {
             osw.find("img").css("width", "100%");
             osw.find("img").css("height", "auto");
             if($op_header_autoshow==1){
                 header.addClass('autoshow');
             }
         }


     };
     /* --------------------------------------------------
      * plugin | owl carousel
      * --------------------------------------------------*/
     function load_owl() {
        jQuery("#items-carousel").owlCarousel({
            center: false,
            items:3,
            rewind:true,
            margin:25,
            nav:true,
            thumbs: false,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            dots:false,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });

        jQuery("#items-carousel-alt-2").owlCarousel({
            center: true,
            items:3,
            loop:true,
            margin:25,
            nav:true,
            thumbs: false,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            dots:false,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });

        jQuery("#slider-carousel").owlCarousel({
                loop: true,
                items: 1,
                dots: false,
                thumbs: true,
                thumbImage: true,
                thumbContainerClass: 'owl-thumbs',
                thumbItemClass: 'owl-thumb-item'
            });

        jQuery("#collection-carousel").owlCarousel({
            center: false,
            items:4,
            loop:true,
            margin:25,
            nav:true,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            dots:false,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });

        jQuery("#collection-carousel-alt").owlCarousel({
            center: false,
            items:5,
            loop:true,
            margin:25,
            nav:true,
            navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            dots:false,
            responsive:{
                1000:{
                    items:5
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });

         jQuery("#item-carousel-big").owlCarousel({
            loop:true,
            margin:25,
            nav:false,
            dots:false,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });

         jQuery("#item-carousel-big-type-2").owlCarousel({
            autoplay:true,
            loop:true,
            margin:25,
            nav:false,
            dots:false,
            responsive:{
                1000:{
                    items:1
                },
                600:{
                    items:1
                },
                0:{
                    items:1
                }
            }
         });

         var owl = $('#item-carousel-big');
         owl.owlCarousel();
         $('.d-carousel .d-arrow-right').click(function() {
             owl.trigger('next.owl.carousel');
         })
         $('.d-carousel .d-arrow-left').click(function() {
             owl.trigger('prev.owl.carousel');
         });

         var owl_2 = $('#item-carousel-big-type-2');
         owl_2.owlCarousel();
         $('.d-carousel .d-arrow-right').click(function() {
             owl_2.trigger('next.owl.carousel');
         })
         $('.d-carousel .d-arrow-left').click(function() {
             owl_2.trigger('prev.owl.carousel');
         });

         $(".owl-thumb-item").on("click", function() {
            $(this).parent().find(".owl-thumb-item").removeClass('active');
             $(this).addClass("active");
         });

         jQuery("#event-carousel").owlCarousel({
            center: false,
            items:3,
            loop:true,
            margin:0,
            nav:false,
            dots:false,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:3
                },
                0:{
                    items:1
                }
            }
         });

         jQuery("#crypto-carousel").owlCarousel({
            center: false,
            items:4,
            loop:true,
            margin:25,
            nav:false,
            dots:false,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:3
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#ss-carousel").owlCarousel({
            center: true,
            items:4,
            loop:true,
            margin:60,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:3
                },
                0:{
                    items:2
                }
            }
         });

        jQuery(".rtl #testimonial-carousel").owlCarousel({
            center: false,
            loop:true,
            margin:30,
            thumbs: false,
            rtl: true,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:1
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#testimonial-carousel").owlCarousel({
            center: false,
            loop:true,
            margin:30,
            thumbs: false,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:1
                },
                0:{
                    items:1
                }
            }
         });

         jQuery("#testimonial-carousel-1-col").owlCarousel({
            center: false,
            loop:true,
            margin:30,
            thumbs:false,
            responsive:{
                1000:{
                    items:1
                },
                600:{
                    items:1
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#blog-carousel").owlCarousel({
            center: false,
            items:3,
            loop:true,
            margin:25,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#blog-carousel-3").owlCarousel({
            center: true,
            items:5,
            loop:true,
            margin:20,
            responsive:{
                1000:{
                    items:3
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#owl-logo").owlCarousel({
            center: false,
            items:6,
            loop:true,
            dots: false,
            margin:25,
            autoplay:true,
            autoplayTimeout:2000,
            responsive:{
                1000:{
                    items:6
                },
                600:{
                    items:4
                },
                0:{
                    items:2
                }
            }
         });
         
         jQuery(".project-carousel-4-nav").owlCarousel({
            center: true,
            items:4,
            loop:true,
            margin:15,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:3
                },
                0:{
                    items:1
                }
            }
         });
         
         jQuery("#owl-features").owlCarousel({
            center: true,
            items:4,
            loop:true,
            dots: true,
            margin:25,
            autoplay:false,
            autoplayTimeout:0,
            responsive:{
                1000:{
                    items:4
                },
                600:{
                    items:2
                },
                0:{
                    items:1
                }
            }
         });
         
         // Custom Navigation owlCarousel
         $(".next").on("click", function() {
             $(this).parent().parent().find('.blog-slide').trigger('owl.next');
         });
         $(".prev").on("click", function() {
             $(this).parent().parent().find('.blog-slide').trigger('owl.prev');
         });

         jQuery('.owl-custom-nav').each(function() {
             var owl = $('.owl-custom-nav').next();
             var ow = parseInt(owl.css("height"), 10);
             $(this).css("margin-top", (ow / 2) - 25);
             owl.owlCarousel();
             // Custom Navigation Events
             $(".btn-next").on("click", function() {
                 owl.trigger('owl.next');
             });
             $(".btn-prev").on("click", function() {
                 owl.trigger('owl.prev');
             });
         });


         // custom navigation for slider
         var ows = $('#custom-owl-slider');
         var arr = $('.owl-slider-nav');
         var doc_height = $(window).innerHeight();
         arr.css("top", (doc_height / 2) - 25);
         ows.owlCarousel();
         // Custom Navigation Events
         arr.find(".next").on("click", function() {
             ows.trigger('owl.next');
         });
         arr.find(".prev").on("click", function() {
             ows.trigger('owl.prev');
         });

         jQuery(".owl-slide-wrapper").on("mouseenter", function() {
             arr.find(".next").css("right", "40px");
             arr.find(".prev").css("left", "40px");
         }).on("mouseleave", function() {
             arr.find(".next").css("right", "-50px");
             arr.find(".prev").css("left", "-50px");
         })
     }

     /* Lenis begin */
     const lenis = new Lenis()

     lenis.on('scroll', (e) => {
       console.log(e)
     })

     function raf(time) {
       lenis.raf(time)
       requestAnimationFrame(raf)
     }

     requestAnimationFrame(raf)
     /* Lenis end */
     
     /* --------------------------------------------------
      * plugin | isotope
      * --------------------------------------------------*/
     function filter_gallery() {
         var $container = jQuery('#gallery');
         $container.isotope({
             itemSelector: '.item',
             filter: '*'
         });
         jQuery('#filters a').on("click", function() {
             var $this = jQuery(this);
             if ($this.hasClass('selected')) {
                 return false;
             }
             var $optionSet = $this.parents();
             $optionSet.find('.selected').removeClass('selected');
             $this.addClass('selected');
             var selector = jQuery(this).attr('data-filter');
             $container.isotope({
                 filter: selector
             });
             return false;
         });
     }

     function masonry() {
         var $container = jQuery('.row-masonry');
         $container.isotope({
             itemSelector: '.item',
         });
         jQuery('#filters a').on("click", function() {
             var $this = jQuery(this);
             if ($this.hasClass('selected')) {
                 return false;
             }
             var $optionSet = $this.parents();
             $optionSet.find('.selected').removeClass('selected');
             $this.addClass('selected');
             var selector = jQuery(this).attr('data-filter');
             $container.isotope({
                 filter: selector
             });
             return false;
         });
     }
     /* --------------------------------------------------
      * plugin | fitvids
      * --------------------------------------------------*/
     /*!
      * FitVids 1.0
      *
      * Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
      * Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
      * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
      *
      * Date: Thu Sept 01 18:00:00 2011 -0500
      */
     ! function(a) {
         a.fn.fitVids = function(b) {
             var c = {
                     customSelector: null
                 },
                 d = document.createElement("div"),
                 e = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0];
             return d.className = "fit-vids-style", d.innerHTML = "&shy;<style> .fluid-width-video-wrapper { width: 100%; position: relative; padding: 0; } .fluid-width-video-wrapper iframe, .fluid-width-video-wrapper object, .fluid-width-video-wrapper embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; } </style>", e.parentNode.insertBefore(d, e), b && a.extend(c, b), this.each(function() {
                 var b = ["iframe[src*='player.vimeo.com']", "iframe[src*='www.youtube.com']", "iframe[src*='www.kickstarter.com']", "object", "embed"];
                 c.customSelector && b.push(c.customSelector);
                 var d = a(this).find(b.join(","));
                 d.each(function() {
                     var b = a(this);
                     if (!("embed" == this.tagName.toLowerCase() && b.parent("object").length || b.parent(".fluid-width-video-wrapper").length)) {
                         var c = "object" == this.tagName.toLowerCase() || b.attr("height") ? b.attr("height") : b.height(),
                             d = b.attr("width") ? b.attr("width") : b.width(),
                             e = c / d;
                         if (!b.attr("id")) {
                             var f = "fitvid" + Math.floor(999999 * Math.random());
                             b.attr("id", f)
                         }
                         b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * e + "%"), b.removeAttr("height").removeAttr("width")
                     }
                 })
             })
         }
     }(jQuery);
     /* --------------------------------------------------
      * back to top
      * --------------------------------------------------*/
     var scrollTrigger = 500; // px
     var t = 0;

     function backToTop() {
         var scrollTop = $(window).scrollTop();
         if (scrollTop > scrollTrigger) {
             $('#back-to-top').addClass('show');
             $('#back-to-top').removeClass('hide');
             t = 1;
         }

         if (scrollTop < scrollTrigger && t == 1) {
             $('#back-to-top').addClass('hide');
         }

         $('#back-to-top').on('click', function(e) {
             e.preventDefault();
             $('html,body').stop(true).animate({
                 scrollTop: 0
             }, 700);
         });
     };
     /* --------------------------------------------------
      * plugin | scroll to
      * --------------------------------------------------*/
     /*!
      * jquery.scrollto.js 0.0.1 - https://github.com/yckart/jquery.scrollto.js
      * Scroll smooth to any element in your DOM.
      *
      * Copyright (c) 2012 Yannick Albert (http://yckart.com)
      * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
      * 2013/02/17
      **/
     $.scrollTo = $.fn.scrollTo = function(x, y, options) {
         if (!(this instanceof $)) return $.fn.scrollTo.apply($('html, body'), arguments);

         options = $.extend({}, {
             gap: {
                 x: 0,
                 y: 0
             },
             animation: {
                 easing: 'easeInOutExpo',
                 duration: 600,
                 complete: $.noop,
                 step: $.noop
             }
         }, options);

         return this.each(function() {

             if (!jQuery('body').hasClass('side-layout')) {
                 var h = 69;
             } else {
                 var h = 0;
             }

             var elem = $(this);
             elem.stop().animate({
                 scrollLeft: !isNaN(Number(x)) ? x : $(y).offset().left + options.gap.x,
                 scrollTop: !isNaN(Number(y)) ? y : $(y).offset().top + options.gap.y - h // *edited
             }, options.animation);
         });
     };
     /* --------------------------------------------------
      * counting number
      * --------------------------------------------------*/
     function de_counter() {
         jQuery('.timer').each(function() {
             var imagePos = jQuery(this).offset().top;
             var topOfWindow = jQuery(window).scrollTop();
             if (imagePos < topOfWindow + jQuery(window).height() && v_count == '0') {
                 jQuery(function($) {
                     // start all the timers
                     jQuery('.timer').each(count);

                     function count(options) {
                         v_count = '1';
                         var $this = jQuery(this);
                         options = $.extend({}, options || {}, $this.data('countToOptions') || {});
                         $this.countTo(options);
                     }
                 });
             }
         });
     }
     /* --------------------------------------------------
      * progress bar
      * --------------------------------------------------*/

     function text_rotate() {
         var quotes = $(".text-rotate-wrap .text-item");
         var quoteIndex = -1;

         function showNextQuote() {
             ++quoteIndex;
             quotes.eq(quoteIndex % quotes.length)
                 .fadeIn(1)
                 .delay(1500)
                 .fadeOut(1, showNextQuote);
         }

         showNextQuote();

     };
     /* --------------------------------------------------
      * custom background
      * --------------------------------------------------*/
     function custom_bg() {
         $("body,div,section,span,form").css('background-color', function() {
            if ($(this).is('[data-bgcolor]')) {
                jQuery(this).addClass("bgcustom");
            }
             return jQuery(this).data('bgcolor');
         });
         $("body,div,section").css('background', function() {
            if ($(this).is('[data-bgimage]')) {
                jQuery(this).addClass("bgcustom");
            }
             return jQuery(this).data('bgimage');
         });
         $("body,div,section").css('background-size', function() {
             return '100% auto';
         });

         $("body,div,section").css('background-repeat', function() {
             return 'no-repeat';
         });
     }
     /* --------------------------------------------------
      * custom elements
      * --------------------------------------------------*/
     function custom_elements() {
         // --------------------------------------------------
         // tabs
         // --------------------------------------------------
         jQuery('.de_tab').find('.de_tab_content > div').hide();
         jQuery('.de_tab').find('.de_tab_content > div:first').show();
         jQuery('li').find('.v-border').fadeTo(150, 0);
         jQuery('li.active').find('.v-border').fadeTo(150, 1);
         jQuery('.de_nav li').on("click", function() {
             jQuery(this).parent().find('li').removeClass("active");
             jQuery(this).addClass("active");
             jQuery(this).parent().parent().find('.v-border').fadeTo(150, 0);
             jQuery(this).parent().parent().find('.de_tab_content > div').hide();
             var indexer = jQuery(this).index(); //gets the current index of (this) which is #nav li
             jQuery(this).parent().parent().find('.de_tab_content > div:eq(' + indexer + ')').fadeIn(); //uses whatever index the link has to open the corresponding box 
             jQuery(this).find('.v-border').fadeTo(150, 1);
         });
         // request quote function
         var rq_step = 1;
         jQuery('#request_form .btn-right').on("click", function() {
             var rq_name = $('#rq_name').val();
             var rq_email = $('#rq_email').val();
             var rq_phone = $('#rq_phone').val();
             if (rq_step == 1) {
                 if (rq_name.length == 0) {
                     $('#rq_name').addClass("error_input");
                 } else {
                     $('#rq_name').removeClass("error_input");
                 }
                 if (rq_email.length == 0) {
                     $('#rq_email').addClass("error_input");
                 } else {
                     $('#rq_email').removeClass("error_input");
                 }
                 if (rq_phone.length == 0) {
                     $('#rq_phone').addClass("error_input");
                 } else {
                     $('#rq_phone').removeClass("error_input");
                 }
             }
             if (rq_name.length != 0 && rq_email.length != 0 && rq_phone.length != 0) {
                 jQuery("#rq_step_1").hide();
                 jQuery("#rq_step_2").fadeIn();
             }
         });
         // --------------------------------------------------
         // tabs
         // --------------------------------------------------
         jQuery('.de_review').find('.de_tab_content > div').hide();
         jQuery('.de_review').find('.de_tab_content > div:first').show();
         //jQuery('.de_review').find('.de_nav li').fadeTo(150,.5);
         jQuery('.de_review').find('.de_nav li:first').fadeTo(150, 1);
         jQuery('.de_nav li').on("click", function() {
             jQuery(this).parent().find('li').removeClass("active");
             //jQuery(this).parent().find('li').fadeTo(150,.5);
             jQuery(this).addClass("active");
             jQuery(this).fadeTo(150, 1);
             jQuery(this).parent().parent().find('.de_tab_content > div').hide();
             var indexer = jQuery(this).index(); //gets the current index of (this) which is #nav li
             jQuery(this).parent().parent().find('.de_tab_content > div:eq(' + indexer + ')').show(); //uses whatever index the link has to open the corresponding box 
         });
         // --------------------------------------------------
         // toggle
         // --------------------------------------------------
         jQuery(".toggle-list h2").addClass("acc_active");
         jQuery(".toggle-list h2").toggle(function() {
             jQuery(this).addClass("acc_noactive");
             jQuery(this).next(".ac-content").slideToggle(200);
         }, function() {
             jQuery(this).removeClass("acc_noactive").addClass("acc_active");
             jQuery(this).next(".ac-content").slideToggle(200);
         })
         // --------------------------------------------------
         // toggle
         // --------------------------------------------------
         jQuery(".expand-custom .toggle").click(function() {
             jQuery(this).stop().toggleClass("clicked");
             jQuery(this).stop().parent().parent().parent().find(".details").slideToggle(500);
         })
     }
     /* --------------------------------------------------
      * video autosize
      * --------------------------------------------------*/
     function video_autosize() {
         jQuery('.de-video-container').each(function() {
             var height_1 = jQuery(this).css("height");
             var height_2 = jQuery(this).find(".de-video-content").css("height");
             var newheight = (height_1.substring(0, height_1.length - 2) - height_2.substring(0, height_2.length - 2)) / 2;
             jQuery(this).find('.de-video-overlay').css("height", height_1);
             jQuery(this).find(".de-video-content").animate({
                 'margin-top': newheight
             }, 'fast');
         });
     }
     /* --------------------------------------------------
      * center x and y
      * --------------------------------------------------*/
     function center_xy() {
         jQuery('.center-xy').each(function() {
             jQuery(this).parent().find("img").on('load', function() {
                 var w = parseInt(jQuery(this).parent().find(".center-xy").css("width"), 10);
                 var h = parseInt(jQuery(this).parent().find(".center-xy").css("height"), 10);
                 var pic_w = jQuery(this).css("width");
                 var pic_h = jQuery(this).css("height");
                 var tp = jQuery(this).parent();
                 tp.find(".center-xy").css("left", parseInt(pic_w, 10) / 2 - w / 2);
                 tp.find(".center-xy").css("top", parseInt(pic_h, 10) / 2 - h / 2);
                 tp.find(".bg-overlay").css("width", pic_w);
                 tp.find(".bg-overlay").css("height", pic_h);
             }).each(function() {
                 if (this.complete) $(this).load();
             });
         });
     }
     /* --------------------------------------------------
      * add arrow for mobile menu
      * --------------------------------------------------*/
     function menu_arrow() {
         // mainmenu create span
         jQuery('#mainmenu li a').each(function() {
             if ($(this).next("ul").length > 0) {
                 $("<span></span>").insertAfter($(this));
             }
         });
         // mainmenu arrow click
         jQuery("#mainmenu > li > span").on("click", function() {
             
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     $(this).addClass("active");
                     $(this).parent().find("ul:first").css("height", "auto");
                     var curHeight = $(this).parent().find("ul:first").height();
                     $(this).parent().find("ul:first").css("height", "0");
                     $(this).parent().find("ul:first").animate({
                         'height': curHeight
                     }, 300, 'easeOutQuint');
                     break;
                 case 2:
                    var curHeight = $(this).parent().find("ul:first").height();
                     $(this).removeClass("active");
                     $(this).parent().find("ul:first").animate({
                         'height': "0"
                     }, 300, 'easeOutQuint');
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
         jQuery("#mainmenu > li > ul > li > span").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     $(this).addClass("active");
                     $(this).parent().find("ul:first").css("height", "auto");
                     $(this).parent().parent().parent().find("ul:first").css("height", "auto");
                     var curHeight = $(this).parent().find("ul:first").height();
                     $(this).parent().find("ul:first").css("height", "0");
                     $(this).parent().find("ul:first").animate({
                         'height': curHeight
                     }, 400, 'easeInOutQuint');
                     break;
                 case 2:
                     $(this).removeClass("active");
                     $(this).parent().find("ul:first").animate({
                         'height': "0"
                     }, 400, 'easeInOutQuint');
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });

         jQuery(".de-country .d-title").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             
             switch (iteration) {
                 case 1:
                     jQuery(this).parent().addClass("expand");
                     break;
                 case 2:
                     jQuery(this).parent().removeClass("expand");
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });

         jQuery("#de-click-menu-profile").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             
             switch (iteration) {
                 case 1:
                     $('#de-submenu-profile').show();
                     $('#de-submenu-profile').addClass('open');
                     $('#de-submenu-notification').removeClass('open');
                     $('#de-submenu-notification').hide();
                     $('#de-click-menu-notification').data('iteration', 1);
                     break;
                 case 2:
                     $('#de-submenu-profile').removeClass('open');
                     $('#de-submenu-profile').hide();        
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });


         jQuery("#de-click-menu-notification").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             
             switch (iteration) {
                 case 1:
                     $('#de-submenu-notification').show();
                     $('#de-submenu-notification').addClass('open');
                     $('#de-submenu-profile').removeClass('open');
                     $('#de-submenu-profile').hide();
                     $('#de-click-menu-profile').data('iteration', 1);
                     break;
                 case 2:
                     $('#de-submenu-notification').removeClass('open');
                     $('#de-submenu-notification').hide();        
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
     }
     /* --------------------------------------------------
      * show gallery item sequence
      * --------------------------------------------------*/
     function sequence() {
         var sq = jQuery(".sequence > .gallery-item .picframe");
         var count = sq.length;
         sq.addClass("fadeIn");
         sq.find("img").addClass("slideInUp");
         for (var i = 0; i <= count; i++) {
             var sqx = jQuery(".sequence > .gallery-item:eq(" + i + ") .picframe");
             sqx.attr('data-wow-delay', (i / 8) + 's');
             sqx.find("img").attr('data-wow-delay', (i / 16) + 's');
         }
     }
     /* --------------------------------------------------
      * show gallery item sequence
      * --------------------------------------------------*/
     function sequence_a() {
         var sq = jQuery(".sequence").find(".sq-item");
         var count = sq.length;
         sq.addClass("fadeInUp");
         for (var i = 0; i <= count; i++) {
             var sqx = jQuery(".sequence").find(".sq-item:eq(" + i + ")");
             sqx.attr('data-wow-delay', (i / 8) + 's');
             sqx.attr('data-wow-speed', '1s');
         }
     }
     /* --------------------------------------------------
      * custom scroll
      * --------------------------------------------------*/
     $.fn.moveIt = function() {
         $(this).each(function() {
             instances.push(new moveItItem($(this)));
         });
     }

     function moveItItemNow() {
         var scrollTop = $window.scrollTop();
         instances.forEach(function(inst) {
             inst.update(scrollTop);
         });
     }

     function moveItItem(el) {
         this.el = $(el);
         this.speed = parseInt(this.el.attr('data-scroll-speed'));
     };
     moveItItem.prototype.update = function(scrollTop) {
         var pos = scrollTop / this.speed;
         this.el.css('transform', 'translateY(' + pos + 'px)');
     };
     $(function() {
         $('[data-scroll-speed]').moveIt();
     });
     /* --------------------------------------------------
      * multiple function
      * --------------------------------------------------*/
     function init() {
         var sh = jQuery('#de-sidebar').css("height");
         var dh = jQuery(window).innerHeight();
         var h = parseInt(sh) - parseInt(dh);

         function scrolling() {
             var mq = window.matchMedia("(min-width: 993px)");
             var ms = window.matchMedia("(min-width: 768px)");
             if (mq.matches) {
                 var distanceY = window.pageYOffset || document.documentElement.scrollTop,
                     shrinkOn = 0,
                     header = jQuery("header");
                 if (distanceY > shrinkOn) {
                     header.addClass("smaller");
                 } else {
                     if (header.hasClass('smaller')) {
                         header.removeClass('smaller');
                     }
                 }
             }
             if (mq.matches) {
                 if (jQuery("header").hasClass("side-header")) {
                     if (jQuery(document).scrollTop() >= h) {
                         jQuery('#de-sidebar').css("position", "fixed");
                         if (parseInt(sh) > parseInt(dh)) {
                             jQuery('#de-sidebar').css("top", -h);
                         }
                         jQuery('#main').addClass("col-md-offset-3");
                         jQuery('h1#logo img').css("padding-left", "7px");
                         jQuery('header .h-content').css("padding-left", "7px");
                         jQuery('#mainmenu li').css("width", "103%");
                     } else {
                         jQuery('#de-sidebar').css("position", "relative");
                         if (parseInt(sh) > parseInt(dh)) {
                             jQuery('#de-sidebar').css("top", 0);
                         }
                         jQuery('#main').removeClass("col-md-offset-3");
                         jQuery('h1#logo img').css("padding-left", "0px");
                         jQuery('header .h-content').css("padding-left", "0px");
                         jQuery('#mainmenu li').css("width", "100%");
                     }
                 }

             }
         }

         // --------------------------------------------------
         // looping background
         // --------------------------------------------------

         scrolling();


         jQuery(".activity-filter > li").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                    jQuery('.activity-list > li').hide();                    
                    if(jQuery(this).hasClass("filter_by_followings")){                        
                        jQuery('li.act_follow').show();
                    }else if(jQuery(this).hasClass("filter_by_sales")){                        
                        jQuery('li.act_sale').show();
                    }else if(jQuery(this).hasClass("filter_by_offers")){                        
                        jQuery('li.act_offer').show();
                    }else if(jQuery(this).hasClass("filter_by_likes")){                        
                        jQuery('li.act_like').show();
                    };
                    jQuery('.activity-filter > li').removeClass('active');
                    jQuery(this).addClass('active');
                    break;
                 case 2:
                     
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });

         jQuery(".filter__r").on("click", function() {
            jQuery('.activity-filter > li').removeClass('active');
            jQuery('.activity-list > li').show();   
         });

         jQuery(".btn-close").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     jQuery('#popup-box').addClass('popup-hide');
                     jQuery('#popup-box').removeClass('popup-show');
                     break;
                 case 2:

                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
         
     }
      // init_de begin //
     function init_de() {
         jQuery('.de-team-list').each(function() {
             jQuery(this).find("img").on('load', function() {
                 var w = jQuery(this).css("width");
                 var h = jQuery(this).css("height");
                 var tpp = jQuery(this).parent().parent();
                 tpp.find(".team-pic").css("height", h);
                 tpp.find(".team-desc").css("width", w);
                 tpp.find(".team-desc").css("height", h);
                 tpp.find(".team-desc").css("top", h);
             }).each(function() {
                 if (this.complete) $(this).load();
             });
         });
         jQuery(".de-team-list").on("mouseenter", function() {
             var h;
             h = jQuery(this).find("img").css("height");
             jQuery(this).find(".team-desc").stop(true).animate({
                 'top': "0px"
             }, 350, 'easeOutQuad');
             jQuery(this).find("img").stop(true).animate({
                 'margin-top': "-100px"
             }, 400, 'easeOutQuad');
         }).on("mouseleave", function() {
             var h;
             h = jQuery(this).find("img").css("height");
             jQuery(this).find(".team-desc").stop(true).animate({
                 'top': h
             }, 350, 'easeOutQuad');
             jQuery(this).find("img").stop(true).animate({
                 'margin-top': "0px"
             }, 400, 'easeOutQuad');
         })
         // portfolio
         jQuery('.item .picframe').each(function() {
             var img = jQuery(this).find("img");
             img.css("width", "100%");
             img.css("height", "auto");
             img.on('load', function() {
                 var w = jQuery(this).css("width");
                 var h = jQuery(this).css("height");
                 //nh = (h.substring(0, h.length - 2)/2)-48;
                 jQuery(this).parent().css("height", h);
             }).each(function() {
                 if (this.complete) $(this).load();
             });
         });
         // --------------------------------------------------
         // portfolio hover
         // --------------------------------------------------
         jQuery('.overlay').fadeTo(1, 0);
         // gallery hover
         jQuery(".item .picframe").on("mouseenter", function() {
             var ov = jQuery(this).parent().find(".overlay");
             ov.width(jQuery(this).find("img").css("width"));
             ov.height(jQuery(this).find("img").css("height"));
             ov.stop(true).fadeTo(200, 1);
             var picheight = jQuery(this).find("img").css("height");
             var newheight;
             newheight = (picheight.substring(0, picheight.length - 2) / 2) - 10;
             //alert(newheight);
             //jQuery(this).parent().find(".pf_text").stop(true).animate({'margin-top': newheight},200,'easeOutCubic');
             jQuery(this).parent().find(".pf_text").css('margin-top', newheight);
             jQuery(this).parent().find(".pf_text").stop(true).animate({
                 'opacity': '1'
             }, 1000, 'easeOutCubic');
             var w = jQuery(this).find("img").css("width");
             var h = jQuery(this).find("img").css("height");
             var w = parseInt(w, 10);
             var h = parseInt(h, 10);
             var $scale = 1;
             //alert(w);
             jQuery(this).find("img").stop(true).animate({
                 width: w * $scale,
                 height: h * $scale,
                 'margin-left': -w * ($scale - 1) / 2,
                 'margin-top': -h * ($scale - 1) / 2
             }, 400, 'easeOutCubic');
         }).on("mouseleave", function() {
             var newheight;
             var picheight = jQuery(this).find("img").css("height");
             newheight = (picheight.substring(0, picheight.length - 2) / 2) - 10;
             //jQuery(this).parent().find(".pf_text").stop(true).animate({'margin-top': newheight - 30},200,'easeOutCubic');
             jQuery(this).parent().find(".pf_text").stop(true).animate({
                 'opacity': '0'
             }, 400, 'easeOutCubic');
             jQuery(this).parent().find(".overlay").stop(true).fadeTo(200, 0);
             jQuery(this).find("img").stop(true).animate({
                 width: '100%',
                 height: '100%',
                 'margin-left': 0,
                 'margin-top': 0
             }, 400, 'easeOutQuad');
         })
         jQuery('.overlay').fadeTo(1, 0);
         
        jQuery('.grid.border').css('padding-top', grid_size);
        jQuery('.grid.border').css('padding-left', grid_size);

        jQuery("#selector .opt.tc1").addClass("active");
        
        jQuery("#selector .opt").on("click", function() {
            jQuery("#selector .opt").removeClass("active");
            var color = jQuery(this).data('color');
            jQuery("#colors").attr("href", 'css/colors/'+color+'.css');
            jQuery(this).addClass("active");
         });
     }
     // de_init end //
     
     // rtl begin //
      if (rtl_mode=="on") {
            jQuery("body").addClass('rtl');
            jQuery("#bootstrap").attr("href", 'css/bootstrap.rtl.min.css');
            jQuery("#bootstrap-grid").attr("href", 'css/bootstrap-grid.rtl.min.css');
            jQuery("#bootstrap-reboot").attr("href", 'css/bootstrap-reboot.rtl.min.css');
            jQuery("#mdb").attr("href", 'css/mdb.rtl.min.css');
            jQuery('html').attr("dir","rtl")
        };
     // rtl end // 

     if(preloader=="off"){
            jQuery("#de-preloader").hide();
     }

     function f_rtl(){
         jQuery("#selector #demo-rtl").on("click", function() {
            var iteration = $(this).data('iteration') || 1;
             switch (iteration) {
                 case 1:
                     jQuery("body").addClass('rtl');
                     jQuery("#bootstrap").attr("href", 'css/bootstrap.rtl.min.css');
                     jQuery("#bootstrap-grid").attr("href", 'css/bootstrap-grid.rtl.min.css');
                     jQuery("#bootstrap-reboot").attr("href", 'css/bootstrap-reboot.rtl.min.css');
                     jQuery("#mdb").attr("href", 'css/mdb.rtl.min.css');
                     jQuery('html').attr("dir","rtl");
                     jQuery(this).find(".sc-val").text('Click to Disable');
                     break;
                 case 2:
                    jQuery("body").removeClass('rtl');
                    jQuery("#bootstrap").attr("href", 'css/bootstrap.min.css');
                    jQuery("#bootstrap-grid").attr("href", 'css/bootstrap-grid.min.css');
                    jQuery("#bootstrap-reboot").attr("href", 'css/bootstrap-reboot.min.css');
                    jQuery("#mdb").attr("href", 'css/mdb.min.css');
                    jQuery('html').attr("dir","ltr");
                    jQuery(this).find(".sc-val").text('Click to Enable');
                    break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });
     }

     jQuery("#dark-mode").on("click", function() {
        if(jQuery('body').hasClass('dark-scheme')){
            window.location.href = 'https://www.designesia.com/themes/gospace/index.html';
        }else{
            window.location.href = 'https://www.designesia.com/themes/gospace/02_dark-index.html';
        }
     });

     function grid_gallery() {
            jQuery('.grid-item').each(function () {
                var this_col = Number(jQuery(this).parent().attr('data-col'));
                var this_gridspace = Number(jQuery(this).parent().attr('data-gridspace'));
                var this_ratio = eval($(this).parent().attr('data-ratio'));
                jQuery(this).parent().css('padding-left', this_gridspace);
                var w = (($(document).width() - (this_gridspace * this_col + 1)) / this_col) - (this_gridspace / this_col);
                var gi = $(this);
                var h = w * this_ratio;
                gi.css('width', w)
                gi.css('height', h);
                gi.find(".pf_title").css('margin-top', (h / 2) - 10);
                gi.css('margin-right', this_gridspace);
                gi.css('margin-bottom', this_gridspace);
                $(this).parent().css('padding-top',this_gridspace);
                if (gi.hasClass('large')) {
                    $(this).css('width', (w * 2) + this_gridspace);
                    $(this).css('height', (h * 2) + this_gridspace);
                }
                if (gi.hasClass('large-width')) {
                    $(this).css('width', (w * 2) + this_gridspace);
                    $(this).css('height', h);
                }
                if (gi.hasClass('large-height')) {
                    $(this).css('height', (h * 2) + this_gridspace);
                    gi.find(".pf_title").css('margin-top', (h) - 20);
                }
            })
        }

     /* --------------------------------------------------
      * center-y
      * --------------------------------------------------*/
     function centerY() {
         jQuery('.full-height').each(function() {
             var dh = jQuery(window).innerHeight();
             jQuery(this).css("min-height", dh);
         });
     }

     /* --------------------------------------------------
      * progress bar
      * --------------------------------------------------*/
     function de_progress() {
         jQuery('.de-progress').each(function() {
             var pos_y = jQuery(this).offset().top;
             var value = jQuery(this).find(".progress-bar").attr('data-value');
             var topOfWindow = jQuery(window).scrollTop();
             if (pos_y < topOfWindow + 550) {
                 jQuery(this).find(".progress-bar").css({
                     'width': value
                 }, "slow");
             }

             jQuery(this).find('.value').text(jQuery(this).find('.progress-bar').attr('data-value'));
         });
     }

     function de_countdown() {
         $('.de_countdown').each(function() {
             var y = $(this).data('year');
             var m = $(this).data('month');
             var d = $(this).data('day');
             var h = $(this).data('hour');
             $(this).countdown({until: new Date(y, m-1, d, h)});
         });
    }

    // --------------------------------------------------
    // preloader
    // --------------------------------------------------

    function copyText(element) {
      var $copyText = jQuery(element).text();
      var button = jQuery('#btn_copy');
      navigator.clipboard.writeText($copyText).then(function() {
        var originalText = button.text();
        button.html('Copied!');        
        button.addClass('clicked');
        setTimeout(function(){
          button.html(originalText);
          button.removeClass('clicked');
          }, 750);
      }, function() {
        button.html('Error');
      });
    } 

    // --------------------------------------------------
    // custom dropdown
    // --------------------------------------------------   
    function dropdown(e){
        var obj = $(e+'.dropdown');
        var btn = obj.find('.btn-selector');
        var dd = obj.find('ul');
        var opt = dd.find('li');
        
            obj.on("mouseenter", function() {
                dd.show();
            }).on("mouseleave", function() {
                dd.hide();
            })
            
            opt.on("click", function() {
                dd.hide();
                var txt = $(this).text();
                opt.removeClass("active");
                $(this).addClass("active");
                btn.text(txt);
            });
    }

    function de_sidebar(){
        enquire.register("screen and (min-width: 993px)", {
             match: function() {
                if ($('.sidebar_inner').length){
                     $('.sidebar_inner').sticky({
                         top: 130,
                         bottom: 20,
                         stopOn: 'footer',
                         disableOn: 993
                     });
                };

                if ($('#search_location').length){
                     $('#search_location').sticky({
                         top: 130,
                         bottom: 20,
                         stopOn: 'footer',
                         disableOn: 993
                     });
                };
            }
         });
    }

    function de_share(){
        var url = window.location.href;
        $('.fa-twitter').on("click", function() { window.open('https://twitter.com/share?url='+url,'_blank'); });
        $('.fa-facebook').on("click", function() { window.open('https://www.facebook.com/sharer/sharer.php?u='+url,'_blank'); });
        $('.fa-reddit').on("click", function() { window.open('http://www.reddit.com/submit?url='+url,'_blank'); });
        $('.fa-linkedin').on("click", function() { window.open('https://www.linkedin.com/shareArticle?mini=true&url='+url,'_blank'); });
        $('.fa-pinterest').on("click", function() { window.open('https://www.pinterest.com/pin/create/button/?url='+url,'_blank'); });
        $('.fa-stumbleupon').on("click", function() { window.open('http://www.stumbleupon.com/submit?url='+url,'_blank'); });
        $('.fa-delicious').on("click", function() { window.open('https://delicious.com/save?v=5&noui&jump=close&url='+url,'_blank'); });
        $('.fa-envelope').on("click", function() { window.open('mailto:?subject=Share With Friends&body='+url,'_blank'); });

    }

     /* --------------------------------------------------
      * document ready
      * --------------------------------------------------*/
     jQuery(document).ready(function() {
         'use strict';
         f_rtl();
         load_magnificPopup();
         center_xy();
         init_de();
         grid_gallery();
         init_resize();
         de_progress();
         de_countdown();
         dropdown('#select_lang');
         dropdown('#select_hour_format');
         de_sidebar();
         de_share();
         $(".jarallax").jarallax();

        $(function() {
            $('.lazy').lazy();
        });


        function formatState (state) {
          if (!state.id) { return state.text; }
          var $state = $(
            '<span><img src="' + $(state.element).attr('data-src') + '" class="img-flag" /> ' + state.text + '</span>'
          );
          return $state;
        };
        $('#vehicle_type').select2({
          minimumResultsForSearch: Infinity,
          templateResult: formatState,
          templateSelection: formatState,
          width: '100%'
        });

        $('.server_location').select2({
           minimumResultsForSearch: Infinity,
           templateResult: formatState,
           templateSelection: formatState,
           width: '100%'
         });

        /* detepicker */
        
        $('#date-picker').daterangepicker({
                "singleDatePicker": true,
                "showISOWeekNumbers": true,
                "timePicker": false,
                "autoUpdateInput": true,
                "locale": {
                    "format": "MMMM DD, YYYY",
                    "separator": " - ",
                    "applyLabel": "Apply",
                    "cancelLabel": "Cancel",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "Custom",
                    "weekLabel": "W",
                    "daysOfWeek": [
                        "Su",
                        "Mo",
                        "Tu",
                        "We",
                        "Th",
                        "Fr",
                        "Sa"
                    ],
                    "monthNames": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ],
                    "firstDay": 1
                },
                "linkedCalendars": true,
                "showCustomRangeLabel": false,
                "startDate": 1,
                "endDate": moment().startOf('hour').add(24, 'hour'),
                "opens": "right"
            });


        $('#date-picker-2').daterangepicker({
                "singleDatePicker": true,
                "showISOWeekNumbers": true,
                "timePicker": false,
                "autoUpdateInput": true,
                "locale": {
                    "format": "MMMM DD, YYYY",
                    "separator": " - ",
                    "applyLabel": "Apply",
                    "cancelLabel": "Cancel",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "Custom",
                    "weekLabel": "W",
                    "daysOfWeek": [
                        "Su",
                        "Mo",
                        "Tu",
                        "We",
                        "Th",
                        "Fr",
                        "Sa"
                    ],
                    "monthNames": [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ],
                    "firstDay": 1
                },
                "linkedCalendars": true,
                "showCustomRangeLabel": false,
                "startDate": 1,
                "endDate": moment().startOf('hour').add(24, 'hour'),
                "opens": "right"
            });

        // switch

        $('.opt-2').css('display','none');

         $("#sw-1").click(function() {
            if($(this).is(":checked")){
                $('.opt-1').css('display','none');
                $('.opt-2').css('display','inline-block');
            }else{
                $('.opt-2').css('display','none');
                $('.opt-1').css('display','inline-block');
            }
        });

         // --------------------------------------------------
         // custom positiion
         // --------------------------------------------------
         var $doc_height = jQuery(window).innerHeight();
         jQuery('#homepage #content.content-overlay').css("margin-top", $doc_height);
         //jQuery('.full-height').css("height", $doc_height);
         //var picheight = jQuery('.center-y').css("height");
         //picheight = parseInt(picheight, 10);
         //jQuery('.center-y').css('margin-top', (($doc_height - picheight) / 2)-100);
         jQuery('.full-height .de-video-container').css("min-height", $doc_height);

         
        if(jQuery('header').hasClass("autoshow")){
            $op_header_autoshow = 1;
        }

        jQuery("#btn_copy").on("click", function() {
            copyText("#wallet");
        });

        $('#mainmenu > li:has(ul)').addClass('menu-item-has-children');

        $(".d-item").slice(0, 8).show();
          $("#loadmore").on("click", function(e){
            e.preventDefault();
            $(".d-item:hidden").slice(0, 4).slideDown();
            if($(".d-item:hidden").length == 0) {
              //$("#loadmore").text("No Content").addClass("noContent");
              $("#loadmore").hide();
            }
        });

         centerY();

         $('#mainmenu li:has(ul)').addClass('has-child');

         // bootstrap
         var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
         var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
           return new bootstrap.Tooltip(tooltipTriggerEl)
         })

         var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
         var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
           return new bootstrap.Popover(popoverTriggerEl)
         })

         // close bootstrap

         // --------------------------------------------------
         // blog list hover
         // --------------------------------------------------
         jQuery(".blog-list").on("mouseenter", function() {
             var v_height = jQuery(this).find(".blog-slide").css("height");
             var v_width = jQuery(this).find(".blog-slide").css("width");
             var newheight = (v_height.substring(0, v_height.length - 2) / 2) - 40;
             var owa = jQuery(this).find(".owl-arrow");
             owa.css("margin-top", newheight);
             owa.css("width", v_width);
             owa.fadeTo(150, 1);
             //alert(v_height);
         }).on("mouseleave", function() {
             jQuery(this).find(".owl-arrow").fadeTo(150, 0);
         })
         // --------------------------------------------------
         // navigation for mobile
         // --------------------------------------------------
         jQuery('#menu-btn').on("click", function() {

            var h = jQuery('header')[0].scrollHeight;
            
             if (mobile_menu_show == 0) {
                 jQuery('header').addClass('menu-open');
                 jQuery('header').css('height',$(window).innerHeight());
                 mobile_menu_show = 1;
             } else {
                jQuery('header').removeClass('menu-open');
                jQuery('header').css('height','auto');
                 mobile_menu_show = 0;
             }
         })
         jQuery("a.btn").on("click", function(evn) {
             if (this.href.indexOf('#') != -1) {
                 evn.preventDefault();
                 jQuery('html,body').scrollTo(this.hash, this.hash);
             }
         });
         jQuery('.de-gallery .item .icon-info').on("click", function() {
             jQuery('.page-overlay').show();
             url = jQuery(this).attr("data-value");
             jQuery("#loader-area .project-load").load(url, function() {
                 jQuery("#loader-area").slideDown(500, function() {
                     jQuery('.page-overlay').hide();
                     jQuery('html, body').animate({
                         scrollTop: jQuery('#loader-area').offset().top - 70
                     }, 500, 'easeOutCubic');
                     //
                     jQuery(".image-slider").owlCarousel({
                         items: 1,
                         singleItem: true,
                         navigation: false,
                         pagination: true,
                         autoPlay: false
                     });
                     jQuery(".container").fitVids();
                     jQuery('#btn-close-x').on("click", function() {
                         jQuery("#loader-area").slideUp(500, function() {
                             jQuery('html, body').animate({
                                 scrollTop: jQuery('#section-portfolio').offset().top - 70
                             }, 500, 'easeOutCirc');
                         });
                         return false;
                     });
                 });
             });
         });
         jQuery('.de-gallery .item').on("click", function() {
             $('#navigation').show();
         });
         // btn arrow up
         jQuery(".arrow-up").on("click", function() {
             jQuery(".coming-soon .coming-soon-content").fadeOut("medium", function() {
                 jQuery("#hide-content").fadeIn(600, function() {
                     jQuery('.arrow-up').animate({
                         'bottom': '-40px'
                     }, "slow");
                     jQuery('.arrow-down').animate({
                         'top': '0'
                     }, "slow");
                 });
             });
         });
         // btn arrow down
         jQuery(".arrow-down").on("click", function() {
             jQuery("#hide-content").fadeOut("slow", function() {
                 jQuery(".coming-soon .coming-soon-content").fadeIn(800, function() {
                     jQuery('.arrow-up').animate({
                         'bottom': '0px'
                     }, "slow");
                     jQuery('.arrow-down').animate({
                         'top': '-40'
                     }, "slow");
                 });
             });
         });

         jQuery(".d-item_like").on("click", function() {
             var iteration = $(this).data('iteration') || 1;
             
             switch (iteration) {
                 case 1:
                     $(this).find("i").addClass("active");
                     var val = parseInt($(this).find("span").text())+1;
                     $(this).find("span").text(val);
                     break;
                 case 2:
                     $(this).find("i").removeClass("active");
                     var val = parseInt($(this).find("span").text())-1;
                     $(this).find("span").text(val);                   
                     break;
             }
             iteration++;
             if (iteration > 2) iteration = 1;
             $(this).data('iteration', iteration);
         });


         /* --------------------------------------------------
          after window load
          * --------------------------------------------------*/
         
        setTimeout(function () {
        $("#cookieConsent").fadeIn(400);
         }, 2000);
        $("#closeCookieConsent, .cookieConsentOK").click(function() {
            $("#cookieConsent").fadeOut(400);
        });

        $(".switch-with-title .checkbox").change(function() {
            if(this.checked) {
                jQuery(this).parent().parent().find('.hide-content').show();
            }else{
                jQuery(this).parent().parent().find('.hide-content').hide();
            }
        });

         video_autosize();
         filter_gallery();
         masonry();
         custom_bg();
         menu_arrow();
         load_owl();
         custom_elements();
         init(); 
         
         new WOW().init();

         // one page navigation
         /**
          * This part causes smooth scrolling using scrollto.js
          * We target all a tags inside the nav, and apply the scrollto.js to it.
          */
         $("#homepage nav a, .scroll-to").on("click", function(evn) {
             if (this.href.indexOf('#') != -1) {
                 evn.preventDefault();
                 jQuery('html,body').scrollTo(this.hash, this.hash);
             }
         });
         sequence();
         sequence_a();
    
        $('.accordion-section-title').click(function(e){
         var currentAttrvalue = $(this).data('tab');
         if($(e.target).is('.active')){
             $(this).removeClass('active');
             $('.accordion-section-content:visible').slideUp(300);
         } else {
             $('.accordion-section-title').removeClass('active').filter(this).addClass('active');
             $('.accordion-section-content').slideUp(300).filter(currentAttrvalue).slideDown(300);
         }
        });

        $('#get_file,#get_file_2').click(function(){
            $('#upload_file').click();
         });

        $('#upload_file').change(function(){
            var file = $(this).val();
            var filename = file.replace(/^.*\\/, "");
            $('#file_name').text(filename);
         });

        jQuery.each(jQuery('textarea[data-autoresize]'), function() {
            var offset = this.offsetHeight - this.clientHeight;
         
            var resizeTextarea = function(el) {
                jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
        });
        

         /* --------------------------------------------------
          * window | on resize
          * --------------------------------------------------*/
         $(window).resize(function() {
             init_resize();
             centerY();
             grid_gallery();
             $("#vehicle_type").hide();
         });

         /* --------------------------------------------------
          * window | on scroll
          * --------------------------------------------------*/
         jQuery(window).on("scroll", function() {
             /* functions */
             header_sticky();
             de_counter();
             de_progress();
             init();
             backToTop();
             moveItItemNow();

            /* scroll zoom */
            var scroll = $(window).scrollTop();
            $(".scroll-zoom").css({
                backgroundSize: (100 + scroll/15)  + "%",
                top: -(scroll/10)  + "%",
            });
             
             /* fade base scroll position */
             var target = $('.fadeScroll');
             var targetHeight = target.outerHeight();
             var scrollPercent = (targetHeight - window.scrollY) / targetHeight;
             if (scrollPercent >= 0) {
                 target.css('opacity', scrollPercent);
             } else {
                 target.css('opacity', 0);
             }
             /* custom page with background on side
             jQuery('.side-bg').each(function() {
                 jQuery(this).find(".image-container").css("height", jQuery(this).find(".image-container").parent().css("height"));
             }); */
             /* go to anchor */
             jQuery('#mainmenu li a').each(function() {
                 var cur = jQuery(this);
                 if (this.href.indexOf('#') != -1) {
                     var href = jQuery(this).attr('href');
                    if (location.hash!=="") {
                         if (jQuery(window).scrollTop() > jQuery(href).offset().top - 140) {
                             clearTimeout($.data(this, "scrollCheck"));
                             $.data(this, "scrollCheck", setTimeout(function() {
                                 jQuery('#mainmenu li a').removeClass('active');
                                 cur.addClass('active');
                             }, 250));

                         }
                     }
                 }
             });
             
             // acc
             $('.toggle').click(function(e) {
                e.preventDefault();
              
                var $this = $(this);
              
                if ($this.next().hasClass('show')) {
                    $this.next().removeClass('show');
                    $this.next().slideUp(350);
                } else {
                    $this.parent().parent().find('li .inner').removeClass('show');
                    $this.parent().parent().find('li .inner').slideUp(350);
                    $this.next().toggleClass('show');
                    $this.next().slideToggle(350);
                }
            });



         });
         $(function() {
             "use strict";
             var x = 0;
             setInterval(function() {
                 x -= 1;
                 $('.bg-loop').css('background-position', x + 'px 0');
             }, 50);
         });

         // price range slider

         const rangeInput = document.querySelectorAll(".range-input input"),
           priceInput = document.querySelectorAll(".price-input input"),
           range = document.querySelector(".slider .progress");
         let priceGap = 0;

         priceInput.forEach((input) => {
           input.addEventListener("input", (e) => {
             let minPrice = parseInt(priceInput[0].value),
               maxPrice = parseInt(priceInput[1].value);

             if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
               if (e.target.className === "input-min") {
                 rangeInput[0].value = minPrice;
                 range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
               } else {
                 rangeInput[1].value = maxPrice;
                 range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
               }
             }
           });
         });

         rangeInput.forEach((input) => {
           input.addEventListener("input", (e) => {
             let minVal = parseInt(rangeInput[0].value),
               maxVal = parseInt(rangeInput[1].value);

             if (maxVal - minVal < priceGap) {
               if (e.target.className === "range-min") {
                 rangeInput[0].value = maxVal - priceGap;
               } else {
                 rangeInput[1].value = minVal + priceGap;
               }
             } else {
               priceInput[0].value = minVal;
               priceInput[1].value = maxVal;
               if($('body').hasClass('rtl')){
                range.style.right = (minVal / rangeInput[0].max) * 100 + "%";
                range.style.left = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
               }else{                
                range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
               }
             }
           });
         });
     });

    // scroll magic begin
    var new_scroll_position = 0;
    var last_scroll_position;
    var header = $("header");

    jQuery(window).on("scroll", function() {
      last_scroll_position = window.scrollY;

      // Scrolling down
      if (new_scroll_position < last_scroll_position && last_scroll_position > 80) {
        // header.removeClass('slideDown').addClass('nav-up');
        header.addClass("scroll-down");
        header.removeClass("nav-up");

      // Scrolling up
      } else if (new_scroll_position > last_scroll_position) {
        // header.removeClass('nav-up').addClass('slideDown');
        header.removeClass("scroll-down");
        header.addClass("nav-up");
      }

      new_scroll_position = last_scroll_position;
    });
    // scroll magic end

    $(window).on('load', function() {
        jQuery('#de-preloader').fadeOut(500);
        filter_gallery();
        load_owl();  
        window.dispatchEvent(new Event('resize'));


        $('.grid').isotope({
            itemSelector: '.grid-item'
        });
        grid_gallery();
    });
    
 })(jQuery);

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("jquery")):"function"==typeof define&&define.amd?define(["jquery"],e):(t=t||self).parsley=e(t.jQuery)}(this,function(h){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(){return(l=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t}).apply(this,arguments)}function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var i=[],r=!0,n=!1,s=void 0;try{for(var a,o=t[Symbol.iterator]();!(r=(a=o.next()).done)&&(i.push(a.value),!e||i.length!==e);r=!0);}catch(t){n=!0,s=t}finally{try{r||null==o.return||o.return()}finally{if(n)throw s}}return i}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function u(t){return function(t){if(Array.isArray(t)){for(var e=0,i=new Array(t.length);e<t.length;e++)i[e]=t[e];return i}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var t=1,e={},d={attr:function(t,e,i){var r,n,s,a=new RegExp("^"+e,"i");if(void 0===i)i={};else for(r in i)i.hasOwnProperty(r)&&delete i[r];if(!t)return i;for(r=(s=t.attributes).length;r--;)(n=s[r])&&n.specified&&a.test(n.name)&&(i[this.camelize(n.name.slice(e.length))]=this.deserializeValue(n.value));return i},checkAttr:function(t,e,i){return t.hasAttribute(e+i)},setAttr:function(t,e,i,r){t.setAttribute(this.dasherize(e+i),String(r))},getType:function(t){return t.getAttribute("type")||"text"},generateID:function(){return""+t++},deserializeValue:function(e){var t;try{return e?"true"==e||"false"!=e&&("null"==e?null:isNaN(t=Number(e))?/^[\[\{]/.test(e)?JSON.parse(e):e:t):e}catch(t){return e}},camelize:function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},dasherize:function(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()},warn:function(){var t;window.console&&"function"==typeof window.console.warn&&(t=window.console).warn.apply(t,arguments)},warnOnce:function(t){e[t]||(e[t]=!0,this.warn.apply(this,arguments))},_resetWarnings:function(){e={}},trimString:function(t){return t.replace(/^\s+|\s+$/g,"")},parse:{date:function(t){var e=t.match(/^(\d{4,})-(\d\d)-(\d\d)$/);if(!e)return null;var i=o(e.map(function(t){return parseInt(t,10)}),4),r=(i[0],i[1]),n=i[2],s=i[3],a=new Date(r,n-1,s);return a.getFullYear()!==r||a.getMonth()+1!==n||a.getDate()!==s?null:a},string:function(t){return t},integer:function(t){return isNaN(t)?null:parseInt(t,10)},number:function(t){if(isNaN(t))throw null;return parseFloat(t)},boolean:function(t){return!/^\s*false\s*$/i.test(t)},object:function(t){return d.deserializeValue(t)},regexp:function(t){var e="";return t=/^\/.*\/(?:[gimy]*)$/.test(t)?(e=t.replace(/.*\/([gimy]*)$/,"$1"),t.replace(new RegExp("^/(.*?)/"+e+"$"),"$1")):"^"+t+"$",new RegExp(t,e)}},parseRequirement:function(t,e){var i=this.parse[t||"string"];if(!i)throw'Unknown requirement specification: "'+t+'"';var r=i(e);if(null===r)throw"Requirement is not a ".concat(t,': "').concat(e,'"');return r},namespaceEvents:function(t,e){return(t=this.trimString(t||"").split(/\s+/))[0]?h.map(t,function(t){return"".concat(t,".").concat(e)}).join(" "):""},difference:function(t,i){var r=[];return h.each(t,function(t,e){-1==i.indexOf(e)&&r.push(e)}),r},all:function(t){return h.when.apply(h,u(t).concat([42,42]))},objectCreate:Object.create||function(t){if(1<arguments.length)throw Error("Second argument not supported");if("object"!=n(t))throw TypeError("Argument must be an object");i.prototype=t;var e=new i;return i.prototype=null,e},_SubmitSelector:'input[type="submit"], button:submit'};function i(){}function r(){this.__id__=d.generateID()}var s={namespace:"data-parsley-",inputs:"input, textarea, select",excluded:"input[type=button], input[type=submit], input[type=reset], input[type=hidden]",priorityEnabled:!0,multiple:null,group:null,uiEnabled:!0,validationThreshold:3,focus:"first",trigger:!1,triggerAfterFailure:"input",errorClass:"parsley-error",successClass:"parsley-success",classHandler:function(){},errorsContainer:function(){},errorsWrapper:'<ul class="parsley-errors-list"></ul>',errorTemplate:"<li></li>"};r.prototype={asyncSupport:!0,_pipeAccordingToValidationResult:function(){function t(){var t=h.Deferred();return!0!==e.validationResult&&t.reject(),t.resolve().promise()}var e=this;return[t,t]},actualizeOptions:function(){return d.attr(this.element,this.options.namespace,this.domOptions),this.parent&&this.parent.actualizeOptions&&this.parent.actualizeOptions(),this},_resetOptions:function(t){for(var e in this.domOptions=d.objectCreate(this.parent.options),this.options=d.objectCreate(this.domOptions),t)t.hasOwnProperty(e)&&(this.options[e]=t[e]);this.actualizeOptions()},_listeners:null,on:function(t,e){return this._listeners=this._listeners||{},(this._listeners[t]=this._listeners[t]||[]).push(e),this},subscribe:function(t,e){h.listenTo(this,t.toLowerCase(),e)},off:function(t,e){var i=this._listeners&&this._listeners[t];if(i)if(e)for(var r=i.length;r--;)i[r]===e&&i.splice(r,1);else delete this._listeners[t];return this},unsubscribe:function(t){h.unsubscribeTo(this,t.toLowerCase())},trigger:function(t,e,i){e=e||this;var r,n=this._listeners&&this._listeners[t];if(n)for(var s=n.length;s--;)if(!1===(r=n[s].call(e,e,i)))return r;return!this.parent||this.parent.trigger(t,e,i)},asyncIsValid:function(t,e){return d.warnOnce("asyncIsValid is deprecated; please use whenValid instead"),this.whenValid({group:t,force:e})},_findRelated:function(){return this.options.multiple?h(this.parent.element.querySelectorAll("[".concat(this.options.namespace,'multiple="').concat(this.options.multiple,'"]'))):this.$element}};function c(t){h.extend(!0,this,t)}c.prototype={validate:function(t,e){if(this.fn)return 3<arguments.length&&(e=[].slice.call(arguments,1,-1)),this.fn(t,e);if(Array.isArray(t)){if(!this.validateMultiple)throw"Validator `"+this.name+"` does not handle multiple values";return this.validateMultiple.apply(this,arguments)}var i=arguments[arguments.length-1];if(this.validateDate&&i._isDateInput())return arguments[0]=d.parse.date(arguments[0]),null!==arguments[0]&&this.validateDate.apply(this,arguments);if(this.validateNumber)return!t||!isNaN(t)&&(arguments[0]=parseFloat(arguments[0]),this.validateNumber.apply(this,arguments));if(this.validateString)return this.validateString.apply(this,arguments);throw"Validator `"+this.name+"` only handles multiple values"},parseRequirements:function(t,e){if("string"!=typeof t)return Array.isArray(t)?t:[t];var i=this.requirementType;if(Array.isArray(i)){for(var r=function(t,e){var i=t.match(/^\s*\[(.*)\]\s*$/);if(!i)throw'Requirement is not an array: "'+t+'"';var r=i[1].split(",").map(d.trimString);if(r.length!==e)throw"Requirement has "+r.length+" values when "+e+" are needed";return r}(t,i.length),n=0;n<r.length;n++)r[n]=d.parseRequirement(i[n],r[n]);return r}return h.isPlainObject(i)?function(t,e,i){var r=null,n={};for(var s in t)if(s){var a=i(s);"string"==typeof a&&(a=d.parseRequirement(t[s],a)),n[s]=a}else r=d.parseRequirement(t[s],e);return[r,n]}(i,t,e):[d.parseRequirement(i,t)]},requirementType:"string",priority:2};function a(t,e){this.__class__="ValidatorRegistry",this.locale="en",this.init(t||{},e||{})}var p={email:/^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))$/,number:/^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,integer:/^-?\d+$/,digits:/^\d+$/,alphanum:/^\w+$/i,date:{test:function(t){return null!==d.parse.date(t)}},url:new RegExp("^(?:(?:https?|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]-*)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:/\\S*)?$")};p.range=p.number;function f(t){var e=(""+t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);return e?Math.max(0,(e[1]?e[1].length:0)-(e[2]?+e[2]:0)):0}function m(s,a){return function(t){for(var e=arguments.length,i=new Array(1<e?e-1:0),r=1;r<e;r++)i[r-1]=arguments[r];return i.pop(),a.apply(void 0,[t].concat(u((n=s,i.map(d.parse[n])))));var n}}function g(t){return{validateDate:m("date",t),validateNumber:m("number",t),requirementType:t.length<=2?"string":["string","string"],priority:30}}a.prototype={init:function(t,e){for(var i in this.catalog=e,this.validators=l({},this.validators),t)this.addValidator(i,t[i].fn,t[i].priority);window.Parsley.trigger("parsley:validator:init")},setLocale:function(t){if(void 0===this.catalog[t])throw new Error(t+" is not available in the catalog");return this.locale=t,this},addCatalog:function(t,e,i){return"object"===n(e)&&(this.catalog[t]=e),!0===i?this.setLocale(t):this},addMessage:function(t,e,i){return void 0===this.catalog[t]&&(this.catalog[t]={}),this.catalog[t][e]=i,this},addMessages:function(t,e){for(var i in e)this.addMessage(t,i,e[i]);return this},addValidator:function(t,e,i){if(this.validators[t])d.warn('Validator "'+t+'" is already defined.');else if(s.hasOwnProperty(t))return void d.warn('"'+t+'" is a restricted keyword and is not a valid validator name.');return this._setValidator.apply(this,arguments)},hasValidator:function(t){return!!this.validators[t]},updateValidator:function(t,e,i){return this.validators[t]?this._setValidator.apply(this,arguments):(d.warn('Validator "'+t+'" is not already defined.'),this.addValidator.apply(this,arguments))},removeValidator:function(t){return this.validators[t]||d.warn('Validator "'+t+'" is not defined.'),delete this.validators[t],this},_setValidator:function(t,e,i){for(var r in"object"!==n(e)&&(e={fn:e,priority:i}),e.validate||(e=new c(e)),(this.validators[t]=e).messages||{})this.addMessage(r,t,e.messages[r]);return this},getErrorMessage:function(t){var e;"type"===t.name?e=(this.catalog[this.locale][t.name]||{})[t.requirements]:e=this.formatMessage(this.catalog[this.locale][t.name],t.requirements);return e||this.catalog[this.locale].defaultMessage||this.catalog.en.defaultMessage},formatMessage:function(t,e){if("object"!==n(e))return"string"==typeof t?t.replace(/%s/i,e):"";for(var i in e)t=this.formatMessage(t,e[i]);return t},validators:{notblank:{validateString:function(t){return/\S/.test(t)},priority:2},required:{validateMultiple:function(t){return 0<t.length},validateString:function(t){return/\S/.test(t)},priority:512},type:{validateString:function(t,e,i){var r=2<arguments.length&&void 0!==i?i:{},n=r.step,s=void 0===n?"any":n,a=r.base,o=void 0===a?0:a,l=p[e];if(!l)throw new Error("validator type `"+e+"` is not supported");if(!t)return!0;if(!l.test(t))return!1;if("number"===e&&!/^any$/i.test(s||"")){var u=Number(t),d=Math.max(f(s),f(o));if(f(u)>d)return!1;var h=function(t){return Math.round(t*Math.pow(10,d))};if((h(u)-h(o))%h(s)!=0)return!1}return!0},requirementType:{"":"string",step:"string",base:"number"},priority:256},pattern:{validateString:function(t,e){return!t||e.test(t)},requirementType:"regexp",priority:64},minlength:{validateString:function(t,e){return!t||t.length>=e},requirementType:"integer",priority:30},maxlength:{validateString:function(t,e){return t.length<=e},requirementType:"integer",priority:30},length:{validateString:function(t,e,i){return!t||t.length>=e&&t.length<=i},requirementType:["integer","integer"],priority:30},mincheck:{validateMultiple:function(t,e){return t.length>=e},requirementType:"integer",priority:30},maxcheck:{validateMultiple:function(t,e){return t.length<=e},requirementType:"integer",priority:30},check:{validateMultiple:function(t,e,i){return t.length>=e&&t.length<=i},requirementType:["integer","integer"],priority:30},min:g(function(t,e){return e<=t}),max:g(function(t,e){return t<=e}),range:g(function(t,e,i){return e<=t&&t<=i}),equalto:{validateString:function(t,e){if(!t)return!0;var i=h(e);return i.length?t===i.val():t===e},priority:256},euvatin:{validateString:function(t){if(!t)return!0;return/^[A-Z][A-Z][A-Za-z0-9 -]{2,}$/.test(t)},priority:30}}};var v={};v.Form={_actualizeTriggers:function(){var e=this;this.$element.on("submit.Parsley",function(t){e.onSubmitValidate(t)}),this.$element.on("click.Parsley",d._SubmitSelector,function(t){e.onSubmitButton(t)}),!1!==this.options.uiEnabled&&this.element.setAttribute("novalidate","")},focus:function(){if(!(this._focusedField=null)===this.validationResult||"none"===this.options.focus)return null;for(var t=0;t<this.fields.length;t++){var e=this.fields[t];if(!0!==e.validationResult&&0<e.validationResult.length&&void 0===e.options.noFocus&&(this._focusedField=e.$element,"first"===this.options.focus))break}return null===this._focusedField?null:this._focusedField.focus()},_destroyUI:function(){this.$element.off(".Parsley")}},v.Field={_reflowUI:function(){if(this._buildUI(),this._ui){var t=function t(e,i,r){for(var n=[],s=[],a=0;a<e.length;a++){for(var o=!1,l=0;l<i.length;l++)if(e[a].assert.name===i[l].assert.name){o=!0;break}o?s.push(e[a]):n.push(e[a])}return{kept:s,added:n,removed:r?[]:t(i,e,!0).added}}(this.validationResult,this._ui.lastValidationResult);this._ui.lastValidationResult=this.validationResult,this._manageStatusClass(),this._manageErrorsMessages(t),this._actualizeTriggers(),!t.kept.length&&!t.added.length||this._failedOnce||(this._failedOnce=!0,this._actualizeTriggers())}},getErrorsMessages:function(){if(!0===this.validationResult)return[];for(var t=[],e=0;e<this.validationResult.length;e++)t.push(this.validationResult[e].errorMessage||this._getErrorMessage(this.validationResult[e].assert));return t},addError:function(t,e){var i=1<arguments.length&&void 0!==e?e:{},r=i.message,n=i.assert,s=i.updateClass,a=void 0===s||s;this._buildUI(),this._addError(t,{message:r,assert:n}),a&&this._errorClass()},updateError:function(t,e){var i=1<arguments.length&&void 0!==e?e:{},r=i.message,n=i.assert,s=i.updateClass,a=void 0===s||s;this._buildUI(),this._updateError(t,{message:r,assert:n}),a&&this._errorClass()},removeError:function(t,e){var i=(1<arguments.length&&void 0!==e?e:{}).updateClass,r=void 0===i||i;this._buildUI(),this._removeError(t),r&&this._manageStatusClass()},_manageStatusClass:function(){this.hasConstraints()&&this.needsValidation()&&!0===this.validationResult?this._successClass():0<this.validationResult.length?this._errorClass():this._resetClass()},_manageErrorsMessages:function(t){if(void 0===this.options.errorsMessagesDisabled){if(void 0!==this.options.errorMessage)return t.added.length||t.kept.length?(this._insertErrorWrapper(),0===this._ui.$errorsWrapper.find(".parsley-custom-error-message").length&&this._ui.$errorsWrapper.append(h(this.options.errorTemplate).addClass("parsley-custom-error-message")),this._ui.$errorClassHandler.attr("aria-describedby",this._ui.errorsWrapperId),this._ui.$errorsWrapper.addClass("filled").attr("aria-hidden","false").find(".parsley-custom-error-message").html(this.options.errorMessage)):(this._ui.$errorClassHandler.removeAttr("aria-describedby"),this._ui.$errorsWrapper.removeClass("filled").attr("aria-hidden","true").find(".parsley-custom-error-message").remove());for(var e=0;e<t.removed.length;e++)this._removeError(t.removed[e].assert.name);for(e=0;e<t.added.length;e++)this._addError(t.added[e].assert.name,{message:t.added[e].errorMessage,assert:t.added[e].assert});for(e=0;e<t.kept.length;e++)this._updateError(t.kept[e].assert.name,{message:t.kept[e].errorMessage,assert:t.kept[e].assert})}},_addError:function(t,e){var i=e.message,r=e.assert;this._insertErrorWrapper(),this._ui.$errorClassHandler.attr("aria-describedby",this._ui.errorsWrapperId),this._ui.$errorsWrapper.addClass("filled").attr("aria-hidden","false").append(h(this.options.errorTemplate).addClass("parsley-"+t).html(i||this._getErrorMessage(r)))},_updateError:function(t,e){var i=e.message,r=e.assert;this._ui.$errorsWrapper.addClass("filled").find(".parsley-"+t).html(i||this._getErrorMessage(r))},_removeError:function(t){this._ui.$errorClassHandler.removeAttr("aria-describedby"),this._ui.$errorsWrapper.removeClass("filled").attr("aria-hidden","true").find(".parsley-"+t).remove()},_getErrorMessage:function(t){var e=t.name+"Message";return void 0!==this.options[e]?window.Parsley.formatMessage(this.options[e],t.requirements):window.Parsley.getErrorMessage(t)},_buildUI:function(){if(!this._ui&&!1!==this.options.uiEnabled){var t={};this.element.setAttribute(this.options.namespace+"id",this.__id__),t.$errorClassHandler=this._manageClassHandler(),t.errorsWrapperId="parsley-id-"+(this.options.multiple?"multiple-"+this.options.multiple:this.__id__),t.$errorsWrapper=h(this.options.errorsWrapper).attr("id",t.errorsWrapperId),t.lastValidationResult=[],t.validationInformationVisible=!1,this._ui=t}},_manageClassHandler:function(){if("string"==typeof this.options.classHandler&&h(this.options.classHandler).length)return h(this.options.classHandler);var t=this.options.classHandler;if("string"==typeof this.options.classHandler&&"function"==typeof window[this.options.classHandler]&&(t=window[this.options.classHandler]),"function"==typeof t){var e=t.call(this,this);if(void 0!==e&&e.length)return e}else{if("object"===n(t)&&t instanceof jQuery&&t.length)return t;t&&d.warn("The class handler `"+t+"` does not exist in DOM nor as a global JS function")}return this._inputHolder()},_inputHolder:function(){return this.options.multiple&&"SELECT"!==this.element.nodeName?this.$element.parent():this.$element},_insertErrorWrapper:function(){var t=this.options.errorsContainer;if(0!==this._ui.$errorsWrapper.parent().length)return this._ui.$errorsWrapper.parent();if("string"==typeof t){if(h(t).length)return h(t).append(this._ui.$errorsWrapper);"function"==typeof window[t]?t=window[t]:d.warn("The errors container `"+t+"` does not exist in DOM nor as a global JS function")}return"function"==typeof t&&(t=t.call(this,this)),"object"===n(t)&&t.length?t.append(this._ui.$errorsWrapper):this._inputHolder().after(this._ui.$errorsWrapper)},_actualizeTriggers:function(){var t,e=this,i=this._findRelated();i.off(".Parsley"),this._failedOnce?i.on(d.namespaceEvents(this.options.triggerAfterFailure,"Parsley"),function(){e._validateIfNeeded()}):(t=d.namespaceEvents(this.options.trigger,"Parsley"))&&i.on(t,function(t){e._validateIfNeeded(t)})},_validateIfNeeded:function(t){var e=this;t&&/key|input/.test(t.type)&&(!this._ui||!this._ui.validationInformationVisible)&&this.getValue().length<=this.options.validationThreshold||(this.options.debounce?(window.clearTimeout(this._debounced),this._debounced=window.setTimeout(function(){return e.validate()},this.options.debounce)):this.validate())},_resetUI:function(){this._failedOnce=!1,this._actualizeTriggers(),void 0!==this._ui&&(this._ui.$errorsWrapper.removeClass("filled").children().remove(),this._resetClass(),this._ui.lastValidationResult=[],this._ui.validationInformationVisible=!1)},_destroyUI:function(){this._resetUI(),void 0!==this._ui&&this._ui.$errorsWrapper.remove(),delete this._ui},_successClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass)},_errorClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass)},_resetClass:function(){this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass)}};function y(t,e,i){this.__class__="Form",this.element=t,this.$element=h(t),this.domOptions=e,this.options=i,this.parent=window.Parsley,this.fields=[],this.validationResult=null}var _={pending:null,resolved:!0,rejected:!1};y.prototype={onSubmitValidate:function(t){var e=this;if(!0!==t.parsley){var i=this._submitSource||this.$element.find(d._SubmitSelector)[0];if(this._submitSource=null,this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!0),!i||null===i.getAttribute("formnovalidate")){window.Parsley._remoteCache={};var r=this.whenValidate({event:t});"resolved"===r.state()&&!1!==this._trigger("submit")||(t.stopImmediatePropagation(),t.preventDefault(),"pending"===r.state()&&r.done(function(){e._submit(i)}))}}},onSubmitButton:function(t){this._submitSource=t.currentTarget},_submit:function(t){if(!1!==this._trigger("submit")){if(t){var e=this.$element.find(".parsley-synthetic-submit-button").prop("disabled",!1);0===e.length&&(e=h('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element)),e.attr({name:t.getAttribute("name"),value:t.getAttribute("value")})}this.$element.trigger(l(h.Event("submit"),{parsley:!0}))}},validate:function(t){if(1<=arguments.length&&!h.isPlainObject(t)){d.warnOnce("Calling validate on a parsley form without passing arguments as an object is deprecated.");var e=Array.prototype.slice.call(arguments);t={group:e[0],force:e[1],event:e[2]}}return _[this.whenValidate(t).state()]},whenValidate:function(t){var e,i=this,r=0<arguments.length&&void 0!==t?t:{},n=r.group,s=r.force,a=r.event;(this.submitEvent=a)&&(this.submitEvent=l({},a,{preventDefault:function(){d.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`"),i.validationResult=!1}})),this.validationResult=!0,this._trigger("validate"),this._refreshFields();var o=this._withoutReactualizingFormOptions(function(){return h.map(i.fields,function(t){return t.whenValidate({force:s,group:n})})});return(e=d.all(o).done(function(){i._trigger("success")}).fail(function(){i.validationResult=!1,i.focus(),i._trigger("error")}).always(function(){i._trigger("validated")})).pipe.apply(e,u(this._pipeAccordingToValidationResult()))},isValid:function(t){if(1<=arguments.length&&!h.isPlainObject(t)){d.warnOnce("Calling isValid on a parsley form without passing arguments as an object is deprecated.");var e=Array.prototype.slice.call(arguments);t={group:e[0],force:e[1]}}return _[this.whenValid(t).state()]},whenValid:function(t){var e=this,i=0<arguments.length&&void 0!==t?t:{},r=i.group,n=i.force;this._refreshFields();var s=this._withoutReactualizingFormOptions(function(){return h.map(e.fields,function(t){return t.whenValid({group:r,force:n})})});return d.all(s)},refresh:function(){return this._refreshFields(),this},reset:function(){for(var t=0;t<this.fields.length;t++)this.fields[t].reset();this._trigger("reset")},destroy:function(){this._destroyUI();for(var t=0;t<this.fields.length;t++)this.fields[t].destroy();this.$element.removeData("Parsley"),this._trigger("destroy")},_refreshFields:function(){return this.actualizeOptions()._bindFields()},_bindFields:function(){var n=this,t=this.fields;return this.fields=[],this.fieldsMappedById={},this._withoutReactualizingFormOptions(function(){n.$element.find(n.options.inputs).not(n.options.excluded).not("[".concat(n.options.namespace,"excluded=true]")).each(function(t,e){var i=new window.Parsley.Factory(e,{},n);if("Field"===i.__class__||"FieldMultiple"===i.__class__){var r=i.__class__+"-"+i.__id__;void 0===n.fieldsMappedById[r]&&(n.fieldsMappedById[r]=i,n.fields.push(i))}}),h.each(d.difference(t,n.fields),function(t,e){e.reset()})}),this},_withoutReactualizingFormOptions:function(t){var e=this.actualizeOptions;this.actualizeOptions=function(){return this};var i=t();return this.actualizeOptions=e,i},_trigger:function(t){return this.trigger("form:"+t)}};function b(t,e,i,r,n){var s=window.Parsley._validatorRegistry.validators[e],a=new c(s);l(this,{validator:a,name:e,requirements:i,priority:r=r||t.options[e+"Priority"]||a.priority,isDomConstraint:n=!0===n}),this._parseRequirements(t.options)}function w(t,e,i,r){this.__class__="Field",this.element=t,this.$element=h(t),void 0!==r&&(this.parent=r),this.options=i,this.domOptions=e,this.constraints=[],this.constraintsByName={},this.validationResult=!0,this._bindConstraints()}var F={pending:null,resolved:!0,rejected:!(b.prototype={validate:function(t,e){var i;return(i=this.validator).validate.apply(i,[t].concat(u(this.requirementList),[e]))},_parseRequirements:function(i){var r=this;this.requirementList=this.validator.parseRequirements(this.requirements,function(t){return i[r.name+((e=t)[0].toUpperCase()+e.slice(1))];var e})}})};w.prototype={validate:function(t){1<=arguments.length&&!h.isPlainObject(t)&&(d.warnOnce("Calling validate on a parsley field without passing arguments as an object is deprecated."),t={options:t});var e=this.whenValidate(t);if(!e)return!0;switch(e.state()){case"pending":return null;case"resolved":return!0;case"rejected":return this.validationResult}},whenValidate:function(t){var e,i=this,r=0<arguments.length&&void 0!==t?t:{},n=r.force,s=r.group;if(this.refresh(),!s||this._isInGroup(s))return this.value=this.getValue(),this._trigger("validate"),(e=this.whenValid({force:n,value:this.value,_refreshed:!0}).always(function(){i._reflowUI()}).done(function(){i._trigger("success")}).fail(function(){i._trigger("error")}).always(function(){i._trigger("validated")})).pipe.apply(e,u(this._pipeAccordingToValidationResult()))},hasConstraints:function(){return 0!==this.constraints.length},needsValidation:function(t){return void 0===t&&(t=this.getValue()),!(!t.length&&!this._isRequired()&&void 0===this.options.validateIfEmpty)},_isInGroup:function(t){return Array.isArray(this.options.group)?-1!==h.inArray(t,this.options.group):this.options.group===t},isValid:function(t){if(1<=arguments.length&&!h.isPlainObject(t)){d.warnOnce("Calling isValid on a parsley field without passing arguments as an object is deprecated.");var e=Array.prototype.slice.call(arguments);t={force:e[0],value:e[1]}}var i=this.whenValid(t);return!i||F[i.state()]},whenValid:function(t){var r=this,e=0<arguments.length&&void 0!==t?t:{},i=e.force,n=void 0!==i&&i,s=e.value,a=e.group;if(e._refreshed||this.refresh(),!a||this._isInGroup(a)){if(this.validationResult=!0,!this.hasConstraints())return h.when();if(null==s&&(s=this.getValue()),!this.needsValidation(s)&&!0!==n)return h.when();var o=this._getGroupedConstraints(),l=[];return h.each(o,function(t,e){var i=d.all(h.map(e,function(t){return r._validateConstraint(s,t)}));if(l.push(i),"rejected"===i.state())return!1}),d.all(l)}},_validateConstraint:function(t,e){var i=this,r=e.validate(t,this);return!1===r&&(r=h.Deferred().reject()),d.all([r]).fail(function(t){i.validationResult instanceof Array||(i.validationResult=[]),i.validationResult.push({assert:e,errorMessage:"string"==typeof t&&t})})},getValue:function(){var t;return null==(t="function"==typeof this.options.value?this.options.value(this):void 0!==this.options.value?this.options.value:this.$element.val())?"":this._handleWhitespace(t)},reset:function(){return this._resetUI(),this._trigger("reset")},destroy:function(){this._destroyUI(),this.$element.removeData("Parsley"),this.$element.removeData("FieldMultiple"),this._trigger("destroy")},refresh:function(){return this._refreshConstraints(),this},_refreshConstraints:function(){return this.actualizeOptions()._bindConstraints()},refreshConstraints:function(){return d.warnOnce("Parsley's refreshConstraints is deprecated. Please use refresh"),this.refresh()},addConstraint:function(t,e,i,r){if(window.Parsley._validatorRegistry.validators[t]){var n=new b(this,t,e,i,r);"undefined"!==this.constraintsByName[n.name]&&this.removeConstraint(n.name),this.constraints.push(n),this.constraintsByName[n.name]=n}return this},removeConstraint:function(t){for(var e=0;e<this.constraints.length;e++)if(t===this.constraints[e].name){this.constraints.splice(e,1);break}return delete this.constraintsByName[t],this},updateConstraint:function(t,e,i){return this.removeConstraint(t).addConstraint(t,e,i)},_bindConstraints:function(){for(var t=[],e={},i=0;i<this.constraints.length;i++)!1===this.constraints[i].isDomConstraint&&(t.push(this.constraints[i]),e[this.constraints[i].name]=this.constraints[i]);for(var r in this.constraints=t,this.constraintsByName=e,this.options)this.addConstraint(r,this.options[r],void 0,!0);return this._bindHtml5Constraints()},_bindHtml5Constraints:function(){null!==this.element.getAttribute("required")&&this.addConstraint("required",!0,void 0,!0),null!==this.element.getAttribute("pattern")&&this.addConstraint("pattern",this.element.getAttribute("pattern"),void 0,!0);var t=this.element.getAttribute("min"),e=this.element.getAttribute("max");null!==t&&null!==e?this.addConstraint("range",[t,e],void 0,!0):null!==t?this.addConstraint("min",t,void 0,!0):null!==e&&this.addConstraint("max",e,void 0,!0),null!==this.element.getAttribute("minlength")&&null!==this.element.getAttribute("maxlength")?this.addConstraint("length",[this.element.getAttribute("minlength"),this.element.getAttribute("maxlength")],void 0,!0):null!==this.element.getAttribute("minlength")?this.addConstraint("minlength",this.element.getAttribute("minlength"),void 0,!0):null!==this.element.getAttribute("maxlength")&&this.addConstraint("maxlength",this.element.getAttribute("maxlength"),void 0,!0);var i=d.getType(this.element);return"number"===i?this.addConstraint("type",["number",{step:this.element.getAttribute("step")||"1",base:t||this.element.getAttribute("value")}],void 0,!0):/^(email|url|range|date)$/i.test(i)?this.addConstraint("type",i,void 0,!0):this},_isRequired:function(){return void 0!==this.constraintsByName.required&&!1!==this.constraintsByName.required.requirements},_trigger:function(t){return this.trigger("field:"+t)},_handleWhitespace:function(t){return!0===this.options.trimValue&&d.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"'),"squish"===this.options.whitespace&&(t=t.replace(/\s{2,}/g," ")),"trim"!==this.options.whitespace&&"squish"!==this.options.whitespace&&!0!==this.options.trimValue||(t=d.trimString(t)),t},_isDateInput:function(){var t=this.constraintsByName.type;return t&&"date"===t.requirements},_getGroupedConstraints:function(){if(!1===this.options.priorityEnabled)return[this.constraints];for(var t=[],e={},i=0;i<this.constraints.length;i++){var r=this.constraints[i].priority;e[r]||t.push(e[r]=[]),e[r].push(this.constraints[i])}return t.sort(function(t,e){return e[0].priority-t[0].priority}),t}};function C(){this.__class__="FieldMultiple"}C.prototype={addElement:function(t){return this.$elements.push(t),this},_refreshConstraints:function(){var t;if(this.constraints=[],"SELECT"===this.element.nodeName)return this.actualizeOptions()._bindConstraints(),this;for(var e=0;e<this.$elements.length;e++)if(h("html").has(this.$elements[e]).length){t=this.$elements[e].data("FieldMultiple")._refreshConstraints().constraints;for(var i=0;i<t.length;i++)this.addConstraint(t[i].name,t[i].requirements,t[i].priority,t[i].isDomConstraint)}else this.$elements.splice(e,1);return this},getValue:function(){if("function"==typeof this.options.value)return this.options.value(this);if(void 0!==this.options.value)return this.options.value;if("INPUT"===this.element.nodeName){var t=d.getType(this.element);if("radio"===t)return this._findRelated().filter(":checked").val()||"";if("checkbox"===t){var e=[];return this._findRelated().filter(":checked").each(function(){e.push(h(this).val())}),e}}return"SELECT"===this.element.nodeName&&null===this.$element.val()?[]:this.$element.val()},_init:function(){return this.$elements=[this.$element],this}};function A(t,e,i){this.element=t,this.$element=h(t);var r=this.$element.data("Parsley");if(r)return void 0!==i&&r.parent===window.Parsley&&(r.parent=i,r._resetOptions(r.options)),"object"===n(e)&&l(r.options,e),r;if(!this.$element.length)throw new Error("You must bind Parsley on an existing element.");if(void 0!==i&&"Form"!==i.__class__)throw new Error("Parent instance must be a Form instance");return this.parent=i||window.Parsley,this.init(e)}A.prototype={init:function(t){return this.__class__="Parsley",this.__version__="2.9.2",this.__id__=d.generateID(),this._resetOptions(t),"FORM"===this.element.nodeName||d.checkAttr(this.element,this.options.namespace,"validate")&&!this.$element.is(this.options.inputs)?this.bind("parsleyForm"):this.isMultiple()?this.handleMultiple():this.bind("parsleyField")},isMultiple:function(){var t=d.getType(this.element);return"radio"===t||"checkbox"===t||"SELECT"===this.element.nodeName&&null!==this.element.getAttribute("multiple")},handleMultiple:function(){var t,e,r=this;if(this.options.multiple=this.options.multiple||(t=this.element.getAttribute("name"))||this.element.getAttribute("id"),"SELECT"===this.element.nodeName&&null!==this.element.getAttribute("multiple"))return this.options.multiple=this.options.multiple||this.__id__,this.bind("parsleyFieldMultiple");if(!this.options.multiple)return d.warn("To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.",this.$element),this;this.options.multiple=this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g,""),t&&h('input[name="'+t+'"]').each(function(t,e){var i=d.getType(e);"radio"!==i&&"checkbox"!==i||e.setAttribute(r.options.namespace+"multiple",r.options.multiple)});for(var i=this._findRelated(),n=0;n<i.length;n++)if(void 0!==(e=h(i.get(n)).data("Parsley"))){this.$element.data("FieldMultiple")||e.addElement(this.$element);break}return this.bind("parsleyField",!0),e||this.bind("parsleyFieldMultiple")},bind:function(t,e){var i;switch(t){case"parsleyForm":i=h.extend(new y(this.element,this.domOptions,this.options),new r,window.ParsleyExtend)._bindFields();break;case"parsleyField":i=h.extend(new w(this.element,this.domOptions,this.options,this.parent),new r,window.ParsleyExtend);break;case"parsleyFieldMultiple":i=h.extend(new w(this.element,this.domOptions,this.options,this.parent),new C,new r,window.ParsleyExtend)._init();break;default:throw new Error(t+"is not a supported Parsley type")}return this.options.multiple&&d.setAttr(this.element,this.options.namespace,"multiple",this.options.multiple),void 0!==e?this.$element.data("FieldMultiple",i):(this.$element.data("Parsley",i),i._actualizeTriggers(),i._trigger("init")),i}};var E=h.fn.jquery.split(".");if(parseInt(E[0])<=1&&parseInt(E[1])<8)throw"The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";E.forEach||d.warn("Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim");var x=l(new r,{element:document,$element:h(document),actualizeOptions:null,_resetOptions:null,Factory:A,version:"2.9.2"});l(w.prototype,v.Field,r.prototype),l(y.prototype,v.Form,r.prototype),l(A.prototype,r.prototype),h.fn.parsley=h.fn.psly=function(t){if(1<this.length){var e=[];return this.each(function(){e.push(h(this).parsley(t))}),e}if(0!=this.length)return new A(this[0],t)},void 0===window.ParsleyExtend&&(window.ParsleyExtend={}),x.options=l(d.objectCreate(s),window.ParsleyConfig),window.ParsleyConfig=x.options,window.Parsley=window.psly=x,x.Utils=d,window.ParsleyUtils={},h.each(d,function(t,e){"function"==typeof e&&(window.ParsleyUtils[t]=function(){return d.warnOnce("Accessing `window.ParsleyUtils` is deprecated. Use `window.Parsley.Utils` instead."),d[t].apply(d,arguments)})});var $=window.Parsley._validatorRegistry=new a(window.ParsleyConfig.validators,window.ParsleyConfig.i18n);window.ParsleyValidator={},h.each("setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator hasValidator".split(" "),function(t,e){window.Parsley[e]=function(){return $[e].apply($,arguments)},window.ParsleyValidator[e]=function(){var t;return d.warnOnce("Accessing the method '".concat(e,"' through Validator is deprecated. Simply call 'window.Parsley.").concat(e,"(...)'")),(t=window.Parsley)[e].apply(t,arguments)}}),window.Parsley.UI=v,window.ParsleyUI={removeError:function(t,e,i){var r=!0!==i;return d.warnOnce("Accessing UI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method."),t.removeError(e,{updateClass:r})},getErrorsMessages:function(t){return d.warnOnce("Accessing UI is deprecated. Call 'getErrorsMessages' on the instance directly."),t.getErrorsMessages()}},h.each("addError updateError".split(" "),function(t,a){window.ParsleyUI[a]=function(t,e,i,r,n){var s=!0!==n;return d.warnOnce("Accessing UI is deprecated. Call '".concat(a,"' on the instance directly. Please comment in issue 1073 as to your need to call this method.")),t[a](e,{message:i,assert:r,updateClass:s})}}),!1!==window.ParsleyConfig.autoBind&&h(function(){h("[data-parsley-validate]").length&&h("[data-parsley-validate]").parsley()});function V(){d.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley")}var P=h({});function O(e,i){return e.parsleyAdaptedCallback||(e.parsleyAdaptedCallback=function(){var t=Array.prototype.slice.call(arguments,0);t.unshift(this),e.apply(i||P,t)}),e.parsleyAdaptedCallback}var T="parsley:";function M(t){return 0===t.lastIndexOf(T,0)?t.substr(T.length):t}return h.listen=function(t,e){var i;if(V(),"object"===n(arguments[1])&&"function"==typeof arguments[2]&&(i=arguments[1],e=arguments[2]),"function"!=typeof e)throw new Error("Wrong parameters");window.Parsley.on(M(t),O(e,i))},h.listenTo=function(t,e,i){if(V(),!(t instanceof w||t instanceof y))throw new Error("Must give Parsley instance");if("string"!=typeof e||"function"!=typeof i)throw new Error("Wrong parameters");t.on(M(e),O(i))},h.unsubscribe=function(t,e){if(V(),"string"!=typeof t||"function"!=typeof e)throw new Error("Wrong arguments");window.Parsley.off(M(t),e.parsleyAdaptedCallback)},h.unsubscribeTo=function(t,e){if(V(),!(t instanceof w||t instanceof y))throw new Error("Must give Parsley instance");t.off(M(e))},h.unsubscribeAll=function(e){V(),window.Parsley.off(M(e)),h("form,input,textarea,select").each(function(){var t=h(this).data("Parsley");t&&t.off(M(e))})},h.emit=function(t,e){V();var i=e instanceof w||e instanceof y,r=Array.prototype.slice.call(arguments,i?2:1);r.unshift(M(t)),i||(e=window.Parsley),e.trigger.apply(e,u(r))},h.extend(!0,x,{asyncValidators:{default:{fn:function(t){return 200<=t.status&&t.status<300},url:!1},reverse:{fn:function(t){return t.status<200||300<=t.status},url:!1}},addAsyncValidator:function(t,e,i,r){return x.asyncValidators[t]={fn:e,url:i||!1,options:r||{}},this}}),x.addValidator("remote",{requirementType:{"":"string",validator:"string",reverse:"boolean",options:"object"},validateString:function(t,e,i,r){var n,s,a={},o=i.validator||(!0===i.reverse?"reverse":"default");if(void 0===x.asyncValidators[o])throw new Error("Calling an undefined async validator: `"+o+"`");-1<(e=x.asyncValidators[o].url||e).indexOf("{value}")?e=e.replace("{value}",encodeURIComponent(t)):a[r.element.getAttribute("name")||r.element.getAttribute("id")]=t;var l=h.extend(!0,i.options||{},x.asyncValidators[o].options);n=h.extend(!0,{},{url:e,data:a,type:"GET"},l),r.trigger("field:ajaxoptions",r,n),s=h.param(n),void 0===x._remoteCache&&(x._remoteCache={});function u(){var t=x.asyncValidators[o].fn.call(r,d,e,i);return t=t||h.Deferred().reject(),h.when(t)}var d=x._remoteCache[s]=x._remoteCache[s]||h.ajax(n);return d.then(u,u)},priority:-1}),x.on("form:submit",function(){x._remoteCache={}}),r.prototype.addAsyncValidator=function(){return d.warnOnce("Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`"),x.addAsyncValidator.apply(x,arguments)},x.addMessages("en",{defaultMessage:"This value seems to be invalid.",type:{email:"This value should be a valid email.",url:"This value should be a valid url.",number:"This value should be a valid number.",integer:"This value should be a valid integer.",digits:"This value should be digits.",alphanum:"This value should be alphanumeric."},notblank:"This value should not be blank.",required:"This value is required.",pattern:"This value seems to be invalid.",min:"This value should be greater than or equal to %s.",max:"This value should be lower than or equal to %s.",range:"This value should be between %s and %s.",minlength:"This value is too short. It should have %s characters or more.",maxlength:"This value is too long. It should have %s characters or fewer.",length:"This value length is invalid. It should be between %s and %s characters long.",mincheck:"You must select at least %s choices.",maxcheck:"You must select %s choices or fewer.",check:"You must select between %s and %s choices.",equalto:"This value should be the same.",euvatin:"It's not a valid VAT Identification Number."}),x.setLocale("en"),(new function(){var r=this,n=window||global;l(this,{isNativeEvent:function(t){return t.originalEvent&&!1!==t.originalEvent.isTrusted},fakeInputEvent:function(t){r.isNativeEvent(t)&&h(t.target).trigger("input")},misbehaves:function(t){r.isNativeEvent(t)&&(r.behavesOk(t),h(document).on("change.inputevent",t.data.selector,r.fakeInputEvent),r.fakeInputEvent(t))},behavesOk:function(t){r.isNativeEvent(t)&&h(document).off("input.inputevent",t.data.selector,r.behavesOk).off("change.inputevent",t.data.selector,r.misbehaves)},install:function(){if(!n.inputEventPatched){n.inputEventPatched="0.0.3";for(var t=0,e=["select",'input[type="checkbox"]','input[type="radio"]','input[type="file"]'];t<e.length;t++){var i=e[t];h(document).on("input.inputevent",i,{selector:i},r.behavesOk).on("change.inputevent",i,{selector:i},r.misbehaves)}}},uninstall:function(){delete n.inputEventPatched,h(document).off(".inputevent")}})}).install(),x});
//# sourceMappingURL=parsley.min.js.map

function togglePassword(inputId, icon) {
    var input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}