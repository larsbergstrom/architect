const Redux = require('redux');

const REDUCERS = {};  // Registered reducers.
const Reducers = {};  // Reducer instances.

export function createStore () {
  const reducers = {};  // Reducer functions.

  // Instantiate registered reducers.
  Object.keys(REDUCERS).forEach(function (reducerName) {
    Reducers[reducerName] = new REDUCERS[reducerName].Reducer();
    reducers[reducerName] = Reducers[reducerName].reducer;
  });

  // Create store
  return Redux.createStore(
    Redux.combineReducers(reducers),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

/**
 * Dispatch action to store.
 *
 * @param {string} actionName
 * @param {object} payload
 */
export function dispatch (store, actionName, payload) {
  store.dispatch(Object.assign({
    type: actionName,
    toJSON: function () {
      // toJSON just for redux-devtools-extension to serialize DOM elements.
      var serializedPayload = {};
      Object.keys(payload).forEach(function (key) {
        if (payload[key].tagName) {
          serializedPayload[key] = 'element#' + payload[key].getAttribute('id');
        } else {
          serializedPayload[key] = payload[key];
        }
      });
      return Object.assign({type: actionName}, serializedPayload);
    }
  }, payload));
}

/**
 * Proxy events to action dispatches so components can just bubble actions up as events.
 */
export function initEventProxies (store, el) {
  Object.keys(Reducers).forEach(function (reducerName) {
    // Use reducer's declared handlers to know what events to listen to.
    Object.keys(Reducers[reducerName].handlers).forEach(function (actionName) {
      el.addEventListener(actionName, function (evt) {
        var payload = {};
        Object.keys(evt.detail).forEach(function (key) {
          if (key === 'target') { return; }
          payload[key] = evt.detail[key];
        });
        dispatch(store, actionName, payload);
      });
    });
  });
}

/**
 * Base reducer prototype.
 */
const Reducer = function () { /* no-op */ };
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
