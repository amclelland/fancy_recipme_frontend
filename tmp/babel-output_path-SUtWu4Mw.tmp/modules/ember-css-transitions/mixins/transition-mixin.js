var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

import Ember from 'ember';
var Mixin = Ember.Mixin;
var inject = Ember.inject;
var computed = Ember.computed;
var run = Ember.run;

var __DEV__ = Ember.environment === 'development';
var TICK = 17;
var NO_EVENT_TIMEOUT = 5000;
var noEventListener = null,
    EMPTY_ARRAY = [];

if (__DEV__) {
  noEventListener = function () {
    Ember.Logger.warn('transition(): tried to perform an animation without ' + 'an animationend or transitionend event after timeout (' + (NO_EVENT_TIMEOUT + 'ms). You should either disable this') + 'transition in JS or add a CSS animation/transition.');
  };
}

export default Mixin.create({

  classNameBindings: ['joinedTransitionClasses'],

  joinedTransitionClasses: computed('transitionClasses.[]', function () {
    return this.get('transitionClasses').join(' ');
  }),

  addClass: function addClass(className, $element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').addObject(className);
    } else {
      $element.addClass(className);
    }
  },

  removeClass: function removeClass(className, $element) {
    if (!this.get('isDestroying')) {
      this.get('transitionClasses').removeObject(className);
    } else {
      $element.removeClass(className);
    }
  },

  transitionEvents: inject.service('transition-events'),

  shouldTransition: computed.bool('transitionClass'),

  'transition-class': computed.alias('transitionClass'),

  init: function init() {
    this._super.apply(this, arguments);
    this.classNameQueue = [];
    this.transitionClasses = Ember.A();
  },

  /**
   * Transitions a DOMElement.
   * @param DOMElement node Dom node to add transition classes to.
   * @param animationType The animation type, e.g. "enter" or "leave".
   * @param finishCallback The callback to use when transition was finished.
   */
  transitionDomNode: function transitionDomNode(node, transitionClass, animationType, finishCallback) {
    var _this = this;

    var $element = Ember.$(node);

    if (!node) {
      if (finishCallback) {
        finishCallback();
      }
      return;
    }

    var className = transitionClass + '-' + animationType;
    var activeClassName = className + '-active';

    var noEventTimeout = null;

    var endListener = function endListener(e) {
      if (e && e.target !== node) {
        return;
      }
      if (__DEV__) {
        clearTimeout(noEventTimeout);
      }

      _this.removeClass(className, $element);
      _this.removeClass(activeClassName, $element);

      _this.get('transitionEvents').removeEndEventListener(node, endListener);

      // Usually this optional callback is used for informing an owner of
      // a leave animation and telling it to remove the child.
      if (finishCallback) {
        finishCallback();
      }
    };

    this.get('transitionEvents').addEndEventListener(node, endListener);

    this.addClass(className, $element);

    // Need to do this to actually trigger a transition.
    this.queueClass($element, activeClassName);

    if (__DEV__) {
      noEventTimeout = setTimeout(noEventListener, NO_EVENT_TIMEOUT);
    }
  },

  /**
   * Queues a class on a jQuery Element.
   * Sets a timeout based on TICK, after TICK is done it sets the classes on the $element.
   * @param $element
   * @param className
   */
  queueClass: function queueClass($element, className) {
    var _this2 = this;

    this.classNameQueue.push(className);

    if (!this.timeout) {
      this.timeout = setTimeout(function () {
        _this2.flushClassNameQueue($element);
      }, TICK);
    }
  },

  /**
   * Flushes queued classes on the $element given and resets the timer.
   * @param $element The element to apply classNameQueue on.
   */
  flushClassNameQueue: function flushClassNameQueue($element) {
    var _this3 = this;

    // Add classes one and one to ensure animation correctness: e.g.: x-enter, x-enter-active
    this.classNameQueue.forEach(function (className) {
      _this3.addClass(className, $element);
    });
    this.classNameQueue = [];
    this.timeout = null;
  },

  willDestroyElement: function willDestroyElement() {
    var _this4 = this;

    if (this.get('shouldTransition')) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      // This is currently the only way of doing this (since willDestroyElement is not promise based).
      var clone = this.$().clone();
      var parent = this.$().parent();
      var idx = parent.children().index(this.$());
      run.scheduleOnce('afterRender', function () {
        _this4.addDestroyedElementClone(parent, idx, clone);
        _this4.transitionDomNode(clone[0], _this4.get('transitionClass'), 'leave', function () {
          _this4.didTransitionOut(clone);
        });
      });
    }
  },

  /**
   * Default placement  of the cloned element when being destroyed.
   */
  addDestroyedElementClone: function addDestroyedElementClone(parent, idx, clone) {
    if (idx === 0) {
      parent.prepend(clone);
    } else {
      Ember.$(parent.children()[idx - 1]).after(clone);
    }
  },

  /**
   * Called after transition in was done. Will always be called after didInsertElement.
   */
  didTransitionIn: Ember.K,

  /**
   * Called when the transition out is called.
   * @param clone The cloned jQuery element. Normally .remove() should be called to remove the element after transition is done.
   */
  didTransitionOut: function didTransitionOut(clone) {
    clone.remove();
  },

  didInsertElement: function didInsertElement() {
    var _this5 = this;

    if (this.get('shouldTransition')) {
      run.scheduleOnce('afterRender', function () {
        _this5.transitionDomNode(_this5.get('element'), _this5.get('transitionClass'), 'enter', _this5.didTransitionIn);
      });
    }
  },

  /**
   * A list of properties that can control the transitions.  Functions just like
   * Ember.Component.classNameBindings, and can be formatted in the same way.
   *
   * @property transitionTriggers
   * @type Array
   * @default []
   * @public
   */
  transitionTriggers: EMPTY_ARRAY,

  _triggerTransitions: function _triggerTransitions(newAttrs) {
    var _this6 = this;

    var transitionTriggers = this.get('transitionTriggers');
    transitionTriggers.forEach(function (value) {
      var _value$split = value.split(':');

      var _value$split2 = _slicedToArray(_value$split, 2);

      var propName = _value$split2[0];
      var className = _value$split2[1];

      if (!className) {
        className = Ember.String.dasherize(propName);
      }

      if (newAttrs[propName].value) {
        _this6.addClass(className, _this6.$());
        _this6.transitionDomNode(_this6.get('element'), className, 'add');
      } else {
        _this6.transitionDomNode(_this6.get('element'), className, 'remove', function () {
          _this6.removeClass(className, _this6.$());
        });
      }
    });
  },

  didUpdateAttrs: function didUpdateAttrs(options) {
    this._super.apply(this, arguments);
    this._triggerTransitions(options.newAttrs);
  }

});