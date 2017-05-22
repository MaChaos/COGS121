//
// jquery.animateCSS.js - A micro-plugin for using Animate.css with jQuery.
//
// Developed by Cory LaViska for A Beautiful Site, LLC
//
// Licensed under the MIT license: http://opensource.org/licenses/MIT
//
if(jQuery) (function($) {
  'use strict';

  function animate(el, options) {
    var animationEnd = 'animationend mozAnimationEnd MSAnimationEnd oanimationend webkitAnimationEnd';

    $(el)
      .addClass('animated ' + options.animation)
      // .one() doesn't seem to work as reliably as .on() + .off()
      .on(animationEnd, function() {
        $(this).off(animationEnd);

        // Remove classes when animation ends
        $(el).removeClass('animated ' + options.animation);

        // Run complete callback
        options.complete.call(el);
      });
  }

  $.extend($.fn, {
    animateCSS: function(animation) {
      var options = {};

      // Detect signature
      if(typeof arguments[1] === 'object') {
        // $(el).animateCSS('animation', options)
        options = arguments[1];
      } else if(typeof arguments[1] === 'function') {
        // $(el).animateCSS('animation', complete)
        options.complete = arguments[1];
      } else if(typeof arguments[1] === 'number') {
        // $(el).animateCSS('animation', duration, [complete])
        options.duration = arguments[1];
        if(typeof arguments[2] === 'function') options.complete = arguments[2];
      }

      // Merge options with defaults
      options = $.extend(true, {
        animation: animation,
        complete: function() {},
        delay: 0,
        duration: 1000
      }, options);

      // Apply animation to each element
      $(this).each(function() {
        var el = this;

        // Set duration
        if(options.duration) {
          $(el).css({
            '-moz-animation-duration': options.duration + 'ms',
            '-o-animation-duration': options.duration + 'ms',
            '-webkit-animation-duration': options.duration + 'ms',
            'animation-duration': options.duration + 'ms'
          });
        }

        // Animate it
        if(options.delay <= 0) {
          //
          // Note: using setTimeout with a zero duration causes execution to wait for the next tick,
          // resulting in a minor performance issue. For example, the following would result in a
          // quick visual blip in some browsers after the element is made visible but before
          // animation starts:
          //
          //  $(el).property('hidden', false).animateCSS('slideInUp')
          //
          // This is why we don't use setTimeout when no delay is desired.
          //
          animate(el, options);
        } else {
          // Delay before animating
          setTimeout(function() {
            animate(el, options);
          }, options.delay);
        }
      });

      return this;
    }
  });

})(jQuery);
