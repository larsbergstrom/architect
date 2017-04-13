/* global AFRAME */
var Redux = require('redux');

var REDUCERS = {};

AFRAME.registerComponent('gamestate', {
  schema: {
    parse: function (val) {
      if (typeof val === 'string') { val = JSON.parse; }
      return val;
    },
    stringify: function (val) {
      return JSON.stringify(val);
    }
  },

  init: function () {
    var combinedReducers;
    var el = this.el;
    var reducers = this.reducers = [];
    var self = this;
    var store;

    // Instantiate registered reducers.
    Object.keys(REDUCERS).forEach(function (reducerName) {
      reducers.push(new REDUCERS[reducerName].Reducer())
    });

    // Compose reducers.
    combinedReducers = Redux.compose.apply(this,
      reducers.map(reducer => reducer.reducer)
    );

    // Create store
    store = this.store = Redux.createStore(
      combinedReducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    // Set component data accessible by `.getAttribute()`.
    this.data = store.getState();

    this.initEventProxies();
    this.initSubscribe();
  },

  /**
   * Initial event emissions here so they don't emit before components have initialized.
   */
  play: function () {
    var el = this.el;
    el.emit('gamestateinitialize', {state: this.data});
    el.emit('gamestatechange', {action: 'INIT', state: this.data});
  },

  /**
   * Dispatch action to store.
   */
  dispatch: function (actionName, data) {
    this.store.dispatch(Object.assign({
      type: actionName,
      toJSON: function () {
        // toJSON just for redux-devtools-extension to serialize DOM elements.
        var serializedData = {};
        Object.keys(data).forEach(function (key) {
          if (data[key].tagName) {
            serializedData[key] = 'element#' + data[key].getAttribute('id')
          } else {
            serializedData[key] = data[key];
          }
        });
        return {type: actionName};
      }
    }, data));
  },

  /**
   * Proxy events to action dispatches so components can just bubble actions up as events.
   */
  initEventProxies: function () {
    var el = this.el;
    var reducers = this.reducers;
    var self = this;

    reducers.forEach(function (reducer) {
      // Use reducer's declared handlers to know what events to listen to.
      Object.keys(reducer.handlers).forEach(function (actionName) {
        el.addEventListener(actionName, function (evt) {
          var payload = {};
          Object.keys(evt.detail).forEach(function (key) {
            if (key === 'target') { return; }
            payload[key] = evt.detail[key];
          });
          self.dispatch(actionName, payload);
        });
      });
    });
  },

  /**
   * Subscribe to store.
   * When state changes, emit event containing relevant state change data so that
   * components don't have to know about the store.
   */
  initSubscribe: function () {
    var el = this.el;
    var previousState;
    var self = this;
    var store = this.store;

    // Keep track of previous state.
    previousState = Object.assign({}, this.data);

    store.subscribe(function () {
      var newState = store.getState();
      self.data = newState;
      el.emit('gamestatechange', {
        action: newState.lastAction,
        diff: AFRAME.utils.diff(previousState, newState),
        state: newState
      });
      previousState = newState;
    });
  }
});

/**
 * Base reducer prototype.
 */
var Reducer = function () { };
Reducer.prototype = {
  initialState: {},
  handlers: {}
};

/**
 * API for registering reducers.
 */
AFRAME.registerReducer = function (name, definition) {
  var NewReducer;
  var proto;

  if (REDUCERS[name]) {
    throw new Error('The reducer `' + name + '` has been already registered. ' +
                    'Check that you are not loading two versions of the same reducer ' +
                    'or two different reducers of the same name.');
  }

  // Format definition object to prototype object.
  proto = {};
  Object.keys(definition).forEach(function convertToPrototype (key) {
    proto[key] = {
      value: definition[key],
      writable: true
    };
  });

  // Extend base prototype.
  NewReducer = function () { Reducer.call(this); };
  NewReducer.prototype = Object.create(Reducer.prototype, proto);
  NewReducer.prototype.name = name;
  NewReducer.prototype.constructor = NewReducer;

  // Wrap reducer to bind `this` to prototype. Redux would bind `window`.
  // Combine all handlers into one reducer function.
  NewReducer.prototype.reducer = function (state, action) {
    state = Object.assign({}, state || NewReducer.prototype.initialState);
    if (!definition.handlers[action.type]) { return state; }
    return definition.handlers[action.type].call(NewReducer.prototype, state, action);
  };

  REDUCERS[name] = {
    Reducer: NewReducer,
    initialState: NewReducer.prototype.initialState,
    handlers: NewReducer.prototype.handlers,
    reducer: NewReducer.prototype.reducer
  };
  return NewReducer;
};
