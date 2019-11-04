

/*! scrollReveal.js v0.1.3 (c) 2014 Julian Lloyd | MIT license */

/*===========================================================================*/


window.scrollReveal = (function (window) {

    'use strict';
  
    // generator (increments) for the next scroll-reveal-id
    var nextId = 1;
  
    /**
     * RequestAnimationFrame polyfill
     * @function
     * @private
     */
    var requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60);
      };
    }());
  
    function scrollReveal(options) {
  
        this.docElem = window.document.documentElement;
        this.options = this.extend(this.defaults, options);
        this.styleBank = {};
  
        if (this.options.init == true) this.init();
    }
  
    scrollReveal.prototype = {
  
      defaults: {
        after:   '0s',
        enter:   'bottom',
        move:    '24px',
        over:    '0.66s',
        easing:  'ease-in-out',
        opacity: 0,
  
    //  if 0, the element is considered in the viewport as soon as it enters
    //  if 1, the element is considered in the viewport when it's fully visible
        viewportFactor: 0.33,
  
    // if false, animations occur only once
    // if true, animations occur each time an element enters the viewport
        reset: false,
  
    // if true, scrollReveal.init() is automaticaly called upon instantiation
        init: true
      },
  
      /*=============================================================================*/
  
      init: function () {
  
        this.scrolled = false;
  
        var self = this;
  
    //  Check DOM for the data-scrollReveal attribute
    //  and initialize all found elements.
        this.elems = Array.prototype.slice.call(this.docElem.querySelectorAll('[data-scroll-reveal]'));
        this.elems.forEach(function (el, i) {
  
      //  Capture original style attribute
          var id = el.getAttribute("data-scroll-reveal-id");
          if (!id) {
              id = nextId++;
              el.setAttribute("data-scroll-reveal-id", id);
          }
          if (!self.styleBank[id]) {
            self.styleBank[id] = el.getAttribute('style');
          }
  
          self.update(el);
        });
  
        var scrollHandler = function (e) {
          // No changing, exit
          if (!self.scrolled) {
            self.scrolled = true;
            requestAnimFrame(function () {
              self._scrollPage();
            });
          }
        };
  
        var resizeHandler = function () {
  
      //  If weвЂ™re still waiting for settimeout, reset the timer.
          if (self.resizeTimeout) {
            clearTimeout(self.resizeTimeout);
          }
          function delayed() {
            self._scrollPage();
            self.resizeTimeout = null;
          }
          self.resizeTimeout = setTimeout(delayed, 200);
        };
  
        // captureScroll
        window.addEventListener('scroll', scrollHandler, false);
        window.addEventListener('resize', resizeHandler, false);
      },
  
      /*=============================================================================*/
  
      _scrollPage: function () {
          var self = this;
  
          this.elems.forEach(function (el, i) {
            self.update(el);
          });
          this.scrolled = false;
      },
  
      /*=============================================================================*/
  
      parseLanguage: function (el) {
  
    //  Splits on a sequence of one or more commas or spaces.
        var words = el.getAttribute('data-scroll-reveal').split(/[, ]+/),
            parsed = {};
  
        function filter (words) {
          var ret = [],
  
              blacklist = [
                "from",
                "the",
                "and",
                "then",
                "but",
                "with"
              ];
  
          words.forEach(function (word, i) {
            if (blacklist.indexOf(word) > -1) {
              return;
            }
            ret.push(word);
          });
  
          return ret;
        }
  
        words = filter(words);
  
        words.forEach(function (word, i) {
  
          switch (word) {
            case "enter":
              parsed.enter = words[i + 1];
              return;
  
            case "after":
              parsed.after = words[i + 1];
              return;
  
            case "wait":
              parsed.after = words[i + 1];
              return;
  
            case "move":
              parsed.move = words[i + 1];
              return;
  
            case "ease":
              parsed.move = words[i + 1];
              parsed.ease = "ease";
              return;
  
            case "ease-in":
              parsed.move = words[i + 1];
              parsed.easing = "ease-in";
              return;
  
            case "ease-in-out":
              parsed.move = words[i + 1];
              parsed.easing = "ease-in-out";
              return;
  
            case "ease-out":
              parsed.move = words[i + 1];
              parsed.easing = "ease-out";
              return;
  
            case "over":
              parsed.over = words[i + 1];
              return;
  
            default:
              return;
          }
        });
  
        return parsed;
      },
  
  
      /*=============================================================================*/
  
      update: function (el) {
  
        var css   = this.genCSS(el);
        var style = this.styleBank[el.getAttribute("data-scroll-reveal-id")];
  
        if (style != null) style += ";"; else style = "";
  
        if (!el.getAttribute('data-scroll-reveal-initialized')) {
          el.setAttribute('style', style + css.initial);
          el.setAttribute('data-scroll-reveal-initialized', true);
        }
  
        if (!this.isElementInViewport(el, this.options.viewportFactor)) {
          if (this.options.reset) {
            el.setAttribute('style', style + css.initial + css.reset);
          }
          return;
        }
  
        if (el.getAttribute('data-scroll-reveal-complete')) return;
  
        if (this.isElementInViewport(el, this.options.viewportFactor)) {
          el.setAttribute('style', style + css.target + css.transition);
      //  Without reset enabled, we can safely remove the style tag
      //  to prevent CSS specificy wars with authored CSS.
          if (!this.options.reset) {
            setTimeout(function () {
              if (style != "") {
                el.setAttribute('style', style);
              } else {
                el.removeAttribute('style');
              }
              el.setAttribute('data-scroll-reveal-complete',true);
            }, css.totalDuration);
          }
        return;
        }
      },
  
      /*=============================================================================*/
  
      genCSS: function (el) {
        var parsed = this.parseLanguage(el),
            enter,
            axis;
  
        if (parsed.enter) {
  
          if (parsed.enter == "top" || parsed.enter == "bottom") {
            enter = parsed.enter;
            axis = "y";
          }
  
          if (parsed.enter == "left" || parsed.enter == "right") {
            enter = parsed.enter;
            axis = "x";
          }
  
        } else {
  
          if (this.options.enter == "top" || this.options.enter == "bottom") {
            enter = this.options.enter
            axis = "y";
          }
  
          if (this.options.enter == "left" || this.options.enter == "right") {
            enter = this.options.enter
            axis = "x";
          }
        }
  
    //  After all values are parsed, letвЂ™s make sure our our
    //  pixel distance is negative for top and left entrances.
    //
    //  ie. "move 25px from top" starts at 'top: -25px' in CSS.
  
        if (enter == "top" || enter == "left") {
          if (parsed.move) {
            parsed.move = "-" + parsed.move;
          }
          else {
            parsed.move = "-" + this.options.move;
          }
        }
  
        var dist    = parsed.move    || this.options.move,
            dur     = parsed.over    || this.options.over,
            delay   = parsed.after   || this.options.after,
            easing  = parsed.easing  || this.options.easing,
            opacity = parsed.opacity || this.options.opacity;
  
        var transition = "-webkit-transition: -webkit-transform " + dur + " " + easing + " " + delay + ",  opacity " + dur + " " + easing + " " + delay + ";" +
                                 "transition: transform " + dur + " " + easing + " " + delay + ", opacity " + dur + " " + easing + " " + delay + ";" +
                        "-webkit-perspective: 1000;" +
                "-webkit-backface-visibility: hidden;";
  
    //  The same as transition, but removing the delay for elements fading out.
        var reset = "-webkit-transition: -webkit-transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";" +
                            "transition: transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";" +
                   "-webkit-perspective: 1000;" +
           "-webkit-backface-visibility: hidden;";
  
        var initial = "-webkit-transform: translate" + axis + "(" + dist + ");" +
                              "transform: translate" + axis + "(" + dist + ");" +
                                "opacity: " + opacity + ";";
  
        var target = "-webkit-transform: translate" + axis + "(0);" +
                             "transform: translate" + axis + "(0);" +
                               "opacity: 1;";
        return {
          transition: transition,
          initial: initial,
          target: target,
          reset: reset,
          totalDuration: ((parseFloat(dur) + parseFloat(delay)) * 1000)
        };
      },
  
      getViewportH : function () {
        var client = this.docElem['clientHeight'],
          inner = window['innerHeight'];
  
        return (client < inner) ? inner : client;
      },
  
      getOffset : function(el) {
        var offsetTop = 0,
            offsetLeft = 0;
  
        do {
          if (!isNaN(el.offsetTop)) {
            offsetTop += el.offsetTop;
          }
          if (!isNaN(el.offsetLeft)) {
            offsetLeft += el.offsetLeft;
          }
        } while (el = el.offsetParent)
  
        return {
          top: offsetTop,
          left: offsetLeft
        }
      },
  
      isElementInViewport : function(el, h) {
        var scrolled = window.pageYOffset,
            viewed = scrolled + this.getViewportH(),
            elH = el.offsetHeight,
            elTop = this.getOffset(el).top,
            elBottom = elTop + elH,
            h = h || 0;
  
        return (elTop + elH * h) <= viewed
            && (elBottom) >= scrolled
            || (el.currentStyle? el.currentStyle : window.getComputedStyle(el, null)).position == 'fixed';
      },
  
      extend: function (a, b){
        for (var key in b) {
          if (b.hasOwnProperty(key)) {
            a[key] = b[key];
          }
        }
        return a;
      }
    }; // end scrollReveal.prototype
  
    return scrollReveal;
  })(window);
  
  /* 
   * Tipper v3.0.2 - 2014-02-12 
   * A jQuery plugin for simple tooltips. Part of the formstone library. 
   * http://formstone.it/tipper/ 
   * 
   * Copyright 2014 Ben Plum; MIT Licensed 
   */ 
  
  !function(a){"use strict";function b(b){return h.formatter=d,a(this).not(".tipper-attached").addClass("tipper-attached").on("mouseenter.tipper",a.extend({},h,b||{}),c)}function c(b){g=a("body");var c=a(this),d=a.extend(!0,{},b.data,c.data("tipper-options")),h="";h+='<div class="tipper '+d.direction+'">',h+='<div class="tipper-content">',h+=d.formatter.apply(g,[c]),h+='<span class="tipper-caret"</span>',h+="</div>",h+="</div>",d.$target=c,d.$tipper=a(h),g.append(d.$tipper),d.$content=d.$tipper.find(".tipper-content"),d.$caret=d.$tipper.find(".tipper-caret"),d.offset=c.offset(),d.height=c.outerHeight(),d.width=c.outerWidth(),d.tipperPos={},d.caretPos={},d.contentPos={};var i=d.$caret.outerHeight(!0),j=d.$caret.outerWidth(!0),k=d.$content.outerHeight(!0),l=d.$content.outerWidth(!0)+j;"right"===d.direction||"left"===d.direction?(d.caretPos.top=(k-i)/2,d.contentPos.top=-k/2,"right"===d.direction?d.contentPos.left=j+d.margin:"left"===d.direction&&(d.contentPos.left=-(l+d.margin))):(d.caretPos.left=(l-j)/2,d.contentPos.left=-l/2,"bottom"===d.direction?d.contentPos.top=d.margin:"top"===d.direction&&(d.contentPos.top=-(k+d.margin))),d.$content.css(d.contentPos),d.$caret.css(d.caretPos),d.follow?d.$target.on("mousemove.tipper",d,e).trigger("mousemove"):("right"===d.direction||"left"===d.direction?(d.tipperPos.top=d.offset.top+d.height/2,"right"===d.direction?d.tipperPos.left=d.offset.left+d.width:"left"===d.direction&&(d.tipperPos.left=d.offset.left)):(d.tipperPos.left=d.offset.left+d.width/2,"bottom"===d.direction?d.tipperPos.top=d.offset.top+d.height:"top"===d.direction&&(d.tipperPos.top=d.offset.top)),d.$tipper.css(d.tipperPos)),d.$target.one("mouseleave.tipper",d,f)}function d(a){return a.data("title")}function e(a){var b=a.data;b.$tipper.css({left:a.pageX,top:a.pageY})}function f(a){var b=a.data;b.$tipper.remove(),b.$target.off("mousemove.tipper mouseleave.tipper")}var g,h={direction:"top",follow:!1,formatter:a.noop,margin:15},i={defaults:function(b){return h=a.extend(h,b||{}),a(this)},destroy:function(){return a(this).trigger("mouseleave.tipper").off(".tipper").removeClass("tipper-attached")}};a.fn.tipper=function(a){return i[a]?i[a].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof a&&a?this:b.apply(this,arguments)},a.tipper=function(a){"defaults"===a&&i.defaults.apply(this,Array.prototype.slice.call(arguments,1))}}(jQuery);
  
  //	Visible, Sam Sehnert, samatdf, TeamDF, https://github.com/teamdf/jquery-visible/
  //	================================================================================
  
  (function(e){e.fn.visible=function(t,n,r){var i=e(this).eq(0),s=i.get(0),o=e(window),u=o.scrollTop(),a=u+o.height(),f=o.scrollLeft(),l=f+o.width(),c=i.offset().top,h=c+i.height(),p=i.offset().left,d=p+i.width(),v=t===true?h:c,m=t===true?c:h,g=t===true?d:p,y=t===true?p:d,b=n===true?s.offsetWidth*s.offsetHeight:true,r=r?r:"both";if(r==="both")return!!b&&m<=a&&v>=u&&y<=l&&g>=f;else if(r==="vertical")return!!b&&m<=a&&v>=u;else if(r==="horizontal")return!!b&&y<=l&&g>=f}})(jQuery)
  
  
  //	ProBars v1.0, Copyright 2014, Joe Mottershaw, https://github.com/joemottershaw/
  //	===============================================================================
  
      function animateProgressBar() {
          $('.pro-bar').each(function(i, elem) {
              var	elem = $(this),
                  percent = elem.attr('data-pro-bar-percent'),
                  delay = elem.attr('data-pro-bar-delay');
  
              if (!elem.hasClass('animated'))
                  elem.css({ 'width' : '0%' });
  
              if (elem.visible(true)) {
                  setTimeout(function() {
                      elem.animate({ 'width' : percent + '%' }, 2000, 'easeInOutExpo').addClass('animated');
                  }, delay);
              } 
          });
      }
  
      $(document).ready(function() {
          animateProgressBar();
      });
  
      $(window).resize(function() {
          animateProgressBar();
      });
  
      $(window).scroll(function() {
          animateProgressBar();
  
          if ($(window).scrollTop() + $(window).height() == $(document).height())
              animateProgressBar();
      });
  
 