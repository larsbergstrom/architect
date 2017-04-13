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
    var reducers = [];
    var self = this;
    var store;

    // Instantiate registered reducers.
    Object.keys(REDUCERS).forEach(function (reducerName) {
      reducers.push(new REDUCERS[reducerName].Reducer())
    });

    // Compose reducers and create store.
    combinedReducers = Redux.compose.apply(this,
      reducers.map(reducer => reducer.reducer)
    );
    store = this.store = Redux.createStore(
      combinedReducers,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    // Sync initial state to component.
    this.data = store.getState();

    // Notify.
    el.emit('gamestateinitialized', {state: this.data});

    // Set up subscriber to emit changes to A-Frame.
    var previousState = Object.assign({}, this.data);
    store.subscribe(() => {
      var newState = store.getState();
      this.data = newState;
      el.emit('gamestatechanged', {
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
  actions: {},
  initialState: {},
  reducer: function (state, action) {
    return state || this.initialState;
  }
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
  NewReducer.prototype.reducer = function (state, action) {
    return definition.reducer.call(NewReducer.prototype, state, action);
  };

  REDUCERS[name] = {
    Reducer: NewReducer,
    actions: NewReducer.prototype.actions,
    initialState: NewReducer.prototype.initialState,
    reducer: NewReducer.prototype.reducer
  };
  return NewReducer;
};
