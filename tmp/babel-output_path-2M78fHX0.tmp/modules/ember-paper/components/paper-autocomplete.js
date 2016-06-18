import Ember from 'ember';
import HasBlockMixin from '../mixins/hasblock-mixin';
import { promiseArray } from 'ember-paper/utils/promise-proxies';

var _get = Ember.get;
var set = Ember.set;
var setProperties = Ember.setProperties;
var isEmpty = Ember.isEmpty;
var isEqual = Ember.isEqual;
var observer = Ember.observer;
var computed = Ember.computed;
var ObjectProxy = Ember.ObjectProxy;
var run = Ember.run;
var isArray = Ember.isArray;
var assert = Ember.assert;
var isPresent = Ember.isPresent;
var getProperties = Ember.getProperties;
var not = computed.not;
var alias = computed.alias;
var and = computed.and;
var bool = computed.bool;

function isString(item) {
  return typeof item === 'string' || item instanceof String;
}

/**
 * @name paper-autocomplete
 *
 * @description
 *     Provides material design autocomplete.
 *
 *
 * ## Dependencies
 * - paper-autocomplete-item
 * - paper-autocomplete-list
 * - paper-input
 * - paper-button
 * - input
 */
export default Ember.Component.extend(HasBlockMixin, {
  util: Ember.inject.service(),
  constants: Ember.inject.service(),

  tagName: 'md-autocomplete',
  classNameBindings: ['notFloating:md-default-theme'],
  attributeBindings: ['floating:md-floating-label', 'showDisabled:disabled'],

  // Internal
  hidden: true,
  selectedIndex: 0,
  messages: [],
  noBlur: false,
  hasFocus: false,
  searchText: '',
  // wrap in a computed property so that cache
  // isn't shared among autocomplete instances
  itemCache: computed({
    get: function get() {
      return {};
    }
  }),

  // Public
  fullTextSearch: false,
  disabled: null,
  required: null,
  lookupKey: null,
  placeholder: '',
  delay: 0,
  minLength: 1,
  allowNonExisting: false,
  noCache: false,
  notFoundMessage: 'No matches found for \'%@\'.',

  init: function init() {
    var _this = this;

    this._super.apply(this, arguments);
    var model = _get(this, 'model');
    if (model) {
      // handle the case where model is a promise
      if (model instanceof ObjectProxy) {
        model.then(function (instance) {
          if (!isEmpty(instance)) {
            set(_this, 'searchText', _this.lookupLabelOfItem(instance));
            set(_this, 'model', instance);
          }
          // as this code would run async after the actual component
          // init is made we need a way to monitor the fact of
          // init finish in modelDidChange.
          set(_this, 'initFinished', true);
        });
      } else {
        set(this, 'searchText', this.lookupLabelOfItem(_get(this, 'model')));
        this.searchTextDidChange();
        set(this, 'initFinished', true);
      }
    }
  },

  notFloating: not('floating'),
  notHidden: not('hidden'),

  autocompleteWrapperId: computed('elementId', function () {
    return 'autocomplete-wrapper-' + _get(this, 'elementId');
  }),

  sections: {
    itemTemplate: { isItemTemplate: true },
    notFoundTemplate: { isNotFoundTemplate: true }
  },

  notFoundMsg: computed('searchText', 'notFoundMessage', function () {
    return Ember.String.loc(this.get('notFoundMessage'), [this.get('searchText')]);
  }),

  /**
   * Needed because of false = disabled='false'.
   */
  showDisabled: alias('disabled'),
  notLoading: not('loading'),
  notAllowNonExisting: not('allowNonExisting'),
  notDebouncingState: not('debouncingState'),
  enabled: not('disabled'),
  showLoadingBar: and('notLoading', 'notAllowNonExisting', 'notDebouncingState'),
  enableClearButton: and('searchText', 'enabled'),

  /**
   * Source filtering logic
   */

  searchTextDidChange: observer('searchText', function () {
    var searchText = _get(this, 'searchText');
    if (!isEqual(searchText, _get(this, 'previousSearchText'))) {
      if (_get(this, 'notAllowNonExisting')) {
        set(this, 'model', null);
      } else {
        set(this, 'model', searchText);
      }

      this.sendAction('update-filter', searchText);

      set(this, 'debouncingState', true);
      run.debounce(this, 'setDebouncedSearchText', _get(this, 'delay'));
      set(this, 'previousSearchText', searchText);
    }
  }),

  finishModelChange: function finishModelChange(data) {
    var value = this.lookupLabelOfItem(data);
    // First set previousSearchText then searchText ( do not trigger observer only update value! ).
    set(this, 'previousSearchText', value);
    set(this, 'searchText', value);
    set(this, 'hidden', true);
  },

  modelDidChange: observer('model', function () {
    var _this2 = this;

    // we don't want this hook to run before the async init
    // of the component finishes. null/undefined model value also
    // breaks execution
    if (_get(this, 'initFinished') && !isEmpty(_get(this, 'model'))) {
      var model = _get(this, 'model');
      // sometimes model is a promise.
      if (model.then) {
        model.then(function (data) {
          // the promise content might be null as well
          if (!isEmpty(data)) {
            _this2.finishModelChange(data);
          }
        });
      } else {
        this.finishModelChange(model);
      }
    }
  }),

  setDebouncedSearchText: function setDebouncedSearchText() {
    var searchText = _get(this, 'searchText');
    if (_get(this, 'isMinLengthMet')) {
      this.sendAction('debounced-update-filter', searchText);
      if (!this.cacheGet(searchText)) {
        this.sendAction('cache-miss', searchText);
      } else {
        this.sendAction('cache-hit', searchText);
      }
      this.set('debouncedSearchText', searchText);

      // If the autocomplete is being triggered by a human / not on initial render.
      if (this.get('hasFocus') || this.get('noBlur')) {
        this.set('hidden', false);
      }
    } else {
      this.set('hidden', true);
    }
    this.set('debouncingState', false);
  },

  loading: bool('sourcePromiseArray.isPending').readOnly(),

  //coalesces all promises into PromiseArrays or Arrays
  sourcePromiseArray: computed('source', function () {
    var source = _get(this, 'source');
    if (source && source.then) {
      //coalesce into promise array
      return promiseArray(source);
    } else if (isArray(source)) {
      //return array
      return Ember.A(source);
    } else {
      //Unknown source type
      assert('The provided \'source\' for paper-autocomplete must be an Array or a Promise.', !isPresent(source));
      return Ember.A();
    }
  }).readOnly(),

  suggestions: computed('debouncedSearchText', 'sourcePromiseArray.[]', function () {
    var source = this.get('sourcePromiseArray');
    var lookupKey = this.get('lookupKey');
    var searchText = (this.get('debouncedSearchText') || '').toLowerCase();
    var cachedItems = this.cacheGet(searchText);
    var suggestions;

    if (cachedItems) {
      //We have cached results
      suggestions = cachedItems;
    } else {
      //no cache

      var data = this.filterArray(source, searchText, lookupKey);
      if (source.then && source.get('isFulfilled')) {
        //cache when we have a PromiseArray
        this.cacheSet(searchText, data);
      }
      suggestions = Ember.A(data);
    }
    // If we have no item suggestions, and allowNonExisting is enabled
    // We need to close the paper-autocomplete-list so all mouse events get activated again.
    if (isEqual(suggestions.length, 0) && _get(this, 'allowNonExisting')) {
      set(this, 'hidden', true);
    }
    return suggestions;
  }).readOnly(),

  filterArray: function filterArray(array, searchText, lookupKey) {
    var _this3 = this;

    return array.filter(function (item) {
      assert('You have not defined \'lookupKey\' on paper-autocomplete, when source contained         items that are not of type String. To fix this error provide a         lookupKey=\'key to lookup from source item\'.', isString(item) || isPresent(lookupKey));

      assert('You specified \'' + lookupKey + '\' as a lookupKey on paper-autocomplete,         but at least one of its values is not of type String. To fix this error make sure that every         \'' + lookupKey + '\' value is a string.', isString(item) || isPresent(lookupKey) && isString(_get(item, lookupKey)));

      var search = isString(item) ? item.toLowerCase() : _get(item, lookupKey).toLowerCase();
      if (_get(_this3, 'fullTextSearch')) {
        return search.indexOf(searchText) !== -1;
      } else {
        return search.indexOf(searchText) === 0;
      }
    });
  },

  //TODO move cache to service? Components are not singletons.
  cacheGet: function cacheGet(text) {
    return !_get(this, 'noCache') && _get(this, 'itemCache')[text];
  },

  cacheSet: function cacheSet(text, data) {
    _get(this, 'itemCache')[text] = data;
  },

  shouldHide: not('isMinLengthMet'),

  isMinLengthMet: computed('searchText.length', {
    get: function get() {
      return _get(this, 'searchText.length') >= _get(this, 'minLength');
    }
  }),

  /**
   * Returns the default index based on whether or not autoselect is enabled.
   * @returns {number}
   */
  defaultIndex: computed('autoselect', function () {
    return _get(this, 'autoselect') ? 0 : -1;
  }),

  lookupLabelOfItem: function lookupLabelOfItem(model) {
    return _get(this, 'lookupKey') ? _get(model, _get(this, 'lookupKey')) : model;
  },

  actions: {
    clear: function clear() {
      setProperties(this, {
        searchText: '',
        selectedIndex: -1,
        model: null,
        hidden: _get(this, 'shouldHide')
      });
    },

    pickModel: function pickModel(model) {
      var value = this.lookupLabelOfItem(model);
      setProperties(this, {
        model: model,
        previousSearchText: value,
        searchText: value,
        hidden: true
      });
    },

    inputFocusOut: function inputFocusOut() {
      set(this, 'hasFocus', false);
      if (_get(this, 'noBlur') === false) {
        set(this, 'hidden', true);
      }
    },

    inputFocusIn: function inputFocusIn() {
      setProperties(this, {
        hasFocus: true,
        hidden: _get(this, 'shouldHide')
      });
    },

    inputKeyDown: function inputKeyDown(value, event) {
      var _getProperties = getProperties(this, ['constants', 'selectedIndex', 'suggestions']);

      var constants = _getProperties.constants;
      var selectedIndex = _getProperties.selectedIndex;
      var suggestions = _getProperties.suggestions;

      switch (event.keyCode) {
        case constants.KEYCODE.DOWN_ARROW:
          if (_get(this, 'loading')) {
            return;
          }
          set(this, 'selectedIndex', Math.min(selectedIndex + 1, suggestions.length - 1));
          break;
        case constants.KEYCODE.UP_ARROW:
          if (_get(this, 'loading')) {
            return;
          }
          set(this, 'selectedIndex', selectedIndex < 0 ? suggestions.length - 1 : Math.max(0, selectedIndex - 1));
          break;
        case constants.KEYCODE.TAB:
        case constants.KEYCODE.ENTER:
          if (_get(this, 'hidden') || _get(this, 'loading') || selectedIndex < 0 || suggestions.length < 1) {
            return;
          }
          this.send('pickModel', suggestions.objectAt(selectedIndex));
          break;
        case constants.KEYCODE.ESCAPE:
          setProperties(this, {
            searchText: '',
            selectedIndex: _get(this, 'defaultIndex'),
            model: null,
            hidden: _get(this, 'shouldHide')
          });
          break;
        default:
          break;
      }
    },

    listMouseEnter: function listMouseEnter() {
      set(this, 'noBlur', true);
    },

    listMouseLeave: function listMouseLeave() {
      set(this, 'noBlur', false);
      if (isEqual(_get(this, 'hasFocus'), false)) {
        set(this, 'hidden', true);
      }
    },

    listMouseUp: function listMouseUp() {
      this.$().find('input').focus();
    }
  }

});