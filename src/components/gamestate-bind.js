var setComponentProperty = AFRAME.utils.entity.setComponentProperty;

/**
 * Bind game state to a component property.
 */
AFRAME.registerComponent('gamestate-bind', {
  schema: {
    default: {},
    parse: function (value) {
      var data;
      var properties;

      if (value.constructor === Object) { return value; }

      data = {};
      properties = value.split(';');
      properties.forEach(function parsePairs (pairStr) {
        var pair = pairStr.trim().split(':');
        data[pair[0].trim()] = pair[1].trim();
      });
      return data;
    }
  },

  init: function () {
    this.unsubscribe = null;
  },

  play: function () {
    var data = this.data;
    var el = this.el;
    var store;

    // Reset handler.
    if (this.unsubscribe) { this.unsubscribe(); }

    // Subscribe to store and register handler to do data-binding to components.
    store = el.sceneEl.components.gamestate.store;
    this.unsubscribe = store.subscribe(handler);
    handler();

    function handler () {
      var state = store.getState();
      Object.keys(data).forEach(function syncComponent (componentPropertyName) {
        var stateSelector = data[componentPropertyName];
        setComponentProperty(el, componentPropertyName, select(state, stateSelector));
      });
    }
  },

  remove: function () {
    if (this.unsubscribe) { this.unsubscribe(); }
  }
});

/**
 * Select value from store.
 *
 * @param {object} state - Redux store state.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 */
function select (state, selector) {
  var useNotOperator = false;
  var value = state;

  if (selector.indexOf('!') === 0) {
    useNotOperator = true;
    selector = selector.substring(1, selector.length);
  }

  selector.split('.').forEach(function dig (key) {
    value = value[key];
  });

  if (useNotOperator) { return !value; }
  return value;
}
