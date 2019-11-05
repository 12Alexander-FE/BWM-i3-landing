$(document).ready(function(){
    initFixedHeader();
    initSliderMain();
    initMobileMenu();
    initDesignedSlider();
    initFormStyles();
    initScrollReveal();
    initformValidation();
    initRemoveErr();
    initAjaxForm();
    initMobileSliders();
    initAnchorScrolling();
});

function initFixedHeader(){
	var fixedItem = jQuery("header"),
		win = jQuery(window);
	win.on('load resize scroll', function(e){
        var winTop = win.scrollTop();
        if($(window).width()>768){
            if(winTop && winTop > 100) {
                fixedItem.addClass("slideUp");
            }else {
                fixedItem.removeClass("slideUp");
            }
            pointRemember = winTop;   
        }
        // else fixedItem.addClass("slideUp");
    });
};

function initAnchorScrolling(){
    var anchors = $('.anchor');
    anchors.click(function(e){
        e.preventDefault();
        var anchorDest = $($(this).attr('href')).offset().top;
        if($(window).width > 768){
            $("html, body").animate({ scrollTop: (anchorDest - 750) }, 600, 'swing');
        }
        else{
            $("html, body").animate({ scrollTop: (anchorDest - 300) }, 600, 'swing');
        }
        
        return false;
    })
}

function initSliderMain(){

    var slickElement = $('.main-slider-slick');

    function setProgress(index) {
        var calc = ((index + 1) / (slickElement.slick('getSlick').slideCount)) * 100;
        $progressBar
          .css('background-size', '100% ' + calc + '%')
          .attr('aria-valuenow', calc );
      
        $progressBarLabel.text(calc + '% completed');
      }

      var $progressBar = $('.progress');
      var $progressBarLabel = $( '.slider__label' );
      
      slickElement.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
        setProgress(nextSlide);
    });


    slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
        var statusCurrent = $('.slider-counter-current');
        var statusLast = $('.slider-counter-last');
        //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
        var i = (currentSlide ? currentSlide : 0) + 1;
        statusCurrent.text('0'+i);
        statusLast.text('0'+slick.slideCount);
    });
    
    slickElement.slick({
        infinire: true,
        fade: true,
        cssEase: 'linear',
        speed: 500,
        prevArrow:$('.ms-arrow-prev'),
        nextArrow:$('.ms-arrow-next')
    });

    setProgress(0);
};

function initMobileMenu(){
    $(".hamburger").click(function(e) {
      e.preventDefault();
      $(this).toggleClass("active");
      $('.main-nav').toggleClass('open');
      $('header .btn-contact').toggleClass('show');   
    //   $('body').toggleClass('scroll-off');
  });
};

function initDesignedSlider(){
    $('.designed-slider').slick({
        infinire: true,
        fade: true,
        cssEase: 'linear',
        speed: 300,
        prevArrow:$('.d-arrow-prev'),
        nextArrow:$('.d-arrow-next'),
        dots: true,
    });
};

function initFormStyles(){

    // form label styles
    var inputFocus = jQuery('.form-wrapper input');

    jQuery(inputFocus).focus(function(){
        jQuery(this).parents('.form-group').addClass('focused');
    });


    // css effect in active input
    jQuery(inputFocus).blur(function(){
        var inputValue = jQuery(this).val();
        if ( inputValue == "" ) {
            jQuery(this).removeClass('filled');
            jQuery(this).parents('.form-group').removeClass('focused');
        } else {
            jQuery(this).addClass('filled');
        }
    });


    // enter numbers only
    jQuery('input#phone').bind("change keyup input click", function() {
        if (this.value.match(/[^0-9]/g)) {
            this.value = this.value.replace(/[^0-9]/g, '');
        }
    });


    // style on active checkbox
    jQuery("input[type=checkbox]").click(function () {
        jQuery(".checkmark").toggleClass("active");
        jQuery(".send-form").toggleClass("disabled");
        return false;
    });

    //upload file
    var inputUpload = jQuery("input.inputfile");
    jQuery(inputUpload).attr("data-multiple-caption", "{count} files selected");
    jQuery(inputUpload).attr('multiple', '');

};

function initScrollReveal(){
    window.scrollReveal = new scrollReveal();
};

function initformValidation() {
    jQuery('#btn-submit').click(function(e) {
        e.preventDefault();
        var firstName = jQuery(this).parents('form').find('input[name=firstName]');
        var lastName = jQuery(this).parents('form').find('input[name=lastName]');
        var tel = jQuery(this).parents('form').find('input[name=phone]');
        // var email = jQuery(this).parents('form').find('input[name=email]');

        if (firstName.val() == '') {
            firstName.addClass('has-error');
        } else firstName.removeClass('has-error');

        if (lastName.val() == '') {
            lastName.addClass('has-error');
        } else lastName.removeClass('has-error');

        if (tel.val() == '') {
            tel.addClass('has-error');
        } else tel.removeClass('has-error');

        // if (email.val()=='') {
        //     email.addClass('error');
        // } else email.removeClass('error');
    });
};

function initRemoveErr(){
    jQuery('input[name=name],input[name=email],input[name=phone]').focusout(function() {
        initformValidation();
    });
};

function initAjaxForm(){
    jQuery('#btn-submit').on('click', function(e) {
        e.preventDefault();
        initformValidation();
        var errors = jQuery('#contact-form .has-error');
        if (errors.length) {
            return false;
        }
        var form_data = jQuery('#contact-form').serialize();
        jQuery.ajax({ //telegram to admins 
            type: "POST",
            url: "telegram.php",
            data: form_data,
            success: function() {
                jQuery('.thank-massage').addClass('done');
                setTimeout(function() { jQuery('.thank-massage').removeClass('done'); }, 3000);
            },
        });
        // jQuery.ajax({ //send to amocrm 
        //     type: "POST",
        //     url: "send-contact.php",
        //     data: form_data,
        //     success: function() {
        //         jQuery('.thank-massage').addClass('done');
        //         setTimeout(function() { jQuery('.thank-massage').removeClass('done'); }, 3000);
        //     },
        // });
        return false;
    })
};

function initMobileSliders(){
    if($(window).width() < 769){
        $('.mobile-charging-slider').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
        });
        $('.mobile-wallbox-slider').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            responsive: [
                {
                  breakpoint: 450,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }
                }],
        })
    }
}
