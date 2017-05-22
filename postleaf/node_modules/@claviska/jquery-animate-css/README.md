# jquery.animateCSS.js - A micro-plugin for using Animate.css with jQuery.

Developed by Cory LaViska for A Beautiful Site, LLC

Licensed under the MIT license: http://opensource.org/licenses/MIT

## Overview:

[Animate.CSS](https://daneden.github.io/animate.css/) is amazing, but it's a bit limited out-of-the-box. This plugin makes it easier to use with jQuery.

Features:

- Apply any Animate.css effect.
- Custom durations without adding CSS.
- Optional delay before animation.
- Callback for when animations complete.
- Compact! (About 70 lines)

## Installing

Include the minified version of this plugin in your project or install via NPM:

```
npm install --save @claviska/jquery-animate-css
```

## Using the plugin

The plugin accepts multiple argument signatures. Examples:

```javascript
// Animation only
$(el).animateCSS('bounce');

// Animation with duration
$(el).animateCSS('bounce', 1000);

// Animation with duration and callback
$(el).animateCSS('bounce', 1000, function() {
  // Animation complete!
});

// Animation with callback
$(el).animateCSS('bounce', function() {
  // Animation complete!
});

// Animation with all options
$(el).animateCSS('fadeOut', {
  delay: 1000,
  duration: 300,
  complete: function() {
    $(this).remove();
  }
});
```

### Animation

The first argument is always the animation you want to use. You can find an up-to-date list in the Animate.css [readme file](https://github.com/daneden/animate.css).

If an animation isn't working, make sure you're using the latest version of Animate.css and that your selector is correct.

### Options

When an object is passed as the second argument, it may contain the following properties:

- `delay`: how long to wait (in milliseconds) before applying the animation (default `0`).
- `duration`: the animation duration (default `1000`).
- `complete`: a callback to run after the animation is complete. Called in the context of the target element.
