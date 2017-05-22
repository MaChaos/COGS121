//
// jquery.selectable.js - Turn a collection of HTML elements into a selectable list
//
// Developed by Cory LaViska for A Beautiful Site, LLC
//
// Licensed under the MIT license: http://opensource.org/licenses/MIT
//
if(jQuery) (function($) {
  'use strict';

  // Defaults
  $.selectable = {
    defaults: {
      getValue: function() {
        return $(this).attr('data-value');
      },
      items: 'li',
      multiple: false,
      disabledClass: 'disabled',
      selectedClass: 'selected'
    }
  };

  // Create the plugin
  $.extend($.fn, {
    selectable: function(method, options) {
      if(typeof method === 'object') options = method;

      // Public API
      switch(method) {
      case 'change':
        return $(this).each(fireChange);

      case 'destroy':
        return $(this).each(destroy);

      case 'disable':
        return $(this).each(options === false ? enable : disable);

      case 'getElements':
        return getElements.call(this, options);

      case 'selectAll':
        return $(this).each(selectAll);

      case 'selectNone':
        return $(this).each(selectNone);

      case 'value':
        if(options === undefined) {
          return get.call(this);
        }
        return $(this).each(function() {
          set.call(this, options);
        });

      default:
        return $(this).each(function() {
          create.call(this, $.extend({}, $.selectable.defaults, options));
        });
      }
    }
  });

  // Create (initialize) it
  function create(options) {
    var container = this;

    $(container)
      .data('options.selectable', options)
      .on('click.selectable dblclick.selectable', options.items, function(event) {
        // Prevent clicks on links from hijacking the page
        if($(event.target).parents().addBack().is('a')) {
          event.preventDefault();
        }
        toggle.call(container, this, event);
      });
  }

  // Destroy it
  function destroy() {
    $(this)
      .removeData('disabled.selectable')
      .removeData('lastChange.selectable')
      .removeData('lastIndex.selectable')
      .removeData('options.selectable')
      .off('click.selectable')
      .off('dblclick.selectable');
  }

  // Disable it
  function disable() {
    var container = this;
    var options = $(container).data('options.selectable');

    $(container)
      .data('disabled.selectable', true)
      .find(options.items)
      .addClass(options.disabledClass);
  }

  // Enable it
  function enable() {
    var container = this;
    var options = $(container).data('options.selectable');

    $(container)
      .removeData('disabled.selectable')
      .find(options.items)
      .removeClass(options.disabledClass);
  }

  // Check for changes and fire the change callback
  function fireChange() {
    var container = this;
    var options = $(container).data('options.selectable');
    var thisChange = get.call(container);
    var lastChange = $(container).data('lastChange.selectable');

    if(!lastChange || lastChange !== thisChange) {
      if(options.change) {
        options.change.call(container, thisChange, getElements.call(container, true));
      }
    }
  }

  // Get values from the current selection
  function get() {
    var container = this;
    var options = $(container).data('options.selectable');
    var values = [];

    // Find items that have the selection class and grab their values
    $(container)
      .find(options.items + '.' + options.selectedClass)
      .each(function() {
        values.push(options.getValue.call(this));
      });

    return options.multiple ? values : values[0];
  }

  // Return HTML elements for all items
  function getElements(which) {
    var container = this;
    var options = $(container).data('options.selectable');
    var matching = [];

    if(which === true) {
      // Return selected
      return $(container).find(options.items + '.' + options.selectedClass).toArray();
    } else if(which === undefined || which === null || which === false) {
      // Return all
      return $(container).find(options.items).toArray();
    } else {
      // Return matching
      if(typeof which === 'string') which = [which];
      $(container).find(options.items).each(function() {
        if($.inArray(options.getValue.call(this), which) > -1) {
          matching.push(this);
        }
      });
      return matching;
    }
  }

  // Select all items
  function selectAll() {
    var container = this;
    var options = $(container).data('options.selectable');

    // Don't select anything if multiple selections aren't enabled
    if(!options.multiple) return;

    $(container)
      .find(options.items)
      .addClass(options.selectedClass);

    // Fire change callback
    fireChange.call(container);
  }

  // Clear selection from all items
  function selectNone() {
    var container = this;
    var options = $(container).data('options.selectable');

    $(container)
      .find(options.items)
      .removeClass(options.selectedClass);

    // Fire change callback
    fireChange.call(container);
  }

  // Set the current selection to one or more values
  function set(values) {
    var container = this;
    var options = $(container).data('options.selectable');

    if(typeof values === 'string') values = [values];

    // Only select the first item if multiple selections aren't enabled
    if(!options.multiple) values = [values[0]];

    // Find items that match the specified values and add the selection class
    $(container)
      .find(options.items)
      .each(function() {
        $(this).toggleClass(options.selectedClass, $.inArray(options.getValue.call(this), values) > -1);
      });

    // Fire change callback
    fireChange.call(container);
  }

  // Toggle selection for an item
  function toggle(item, event) {
    var container = this;
    var options = $(container).data('options.selectable');
    var items = $(container).find(options.items);
    var lastIndex = $(container).data('lastIndex.selectable');
    var thisIndex;
    var i;

    // Determine the current item's index (might not be a sibling, so we can't use `index()`)
    for(i = 0; i < items.length; i++) {
      if($(items).eq(i).is(item)) thisIndex = i;
    }

    // Don't modify selection when disabled
    if($(container).data('disabled.selectable')) return;

    // Fire click callback
    if(event.type === 'click' && options.click) {
      if(
        options.click.call(container, options.getValue.call(item), item, event) === false ||
        event.isDefaultPrevented()
      ) {
        // Don't toggle if false is returned or default is prevented
        return;
      }
    }

    // Fire doubleClick callback
    if(event.type === 'dblclick' && options.doubleClick) {
      if(
        options.doubleClick.call(container, options.getValue.call(item), item, event) === false ||
        event.isDefaultPrevented()
      ) {
        // Don't toggle if false is returned or default is prevented
        return;
      }
    }

    // Toggle selection
    if(options.multiple && event.shiftKey && lastIndex !== undefined) {
      // Select a range of items
      $(container)
        .find(options.items)
        .slice(Math.min(lastIndex, thisIndex), Math.max(lastIndex, thisIndex) + 1)
        .toggleClass(options.selectedClass, !$(item).hasClass(options.selectedClass));
    } else if(options.multiple && (event.metaKey || event.ctrlKey)) {
      // Select multiple items
      $(item).toggleClass(options.selectedClass);
    } else {
      // Select just one item
      if($(container).find('.' + options.selectedClass).length > 1) {
        // If a group is selected, move selection to the current item
        $(item).addClass(options.selectedClass);
      } else {
        // Otherwise, toggle the current item
        $(item).toggleClass(options.selectedClass);
      }

      // Clear selection on all other items
      $(container)
        .find(options.items)
        .not(item)
        .removeClass(options.selectedClass);
    }

    // Fire change callback
    fireChange.call(container);

    // Remember last index and change
    $(container)
    .data('lastIndex.selectable', thisIndex)
    .data('lastChange.selectable', get.call(container));
  }
})(jQuery);
