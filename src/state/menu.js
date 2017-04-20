var debug = AFRAME.utils.debug;
var warn = debug('state:menu:warn');

AFRAME.registerReducer('menu', {
  initialState: {
    paletteActive: false,
    paletteGeometry: {},
    paletteMaterial: {color: 'red'},
    toolsMenuActive: false,
    shapeToolActive: false,
    materialToolActive: false
  },

  handlers: {
    /**
     * Update active primitive geometry.
     */
    paletteprimitiveselect: function (newState, payload) {
      newState.paletteGeometry = payload.geometry;
      return newState;
    },

    /**
     * Update active primitive material.
     */
    palettecolorselect: function (newState, payload) {
      newState.paletteMaterial = {color: payload.color};
      return newState;
    },

    /**
     * Handle menu option select.
     */
    menuoptionselect: function (newState, payload) {
      switch (payload.optionName) {
        case 'create': {
          newState.toolsMenuActive = true;
          break;
        }
        case 'shapes': {
          newState.paletteActive = true;
          newState.materialToolActive = false;
          newState.shapeToolActive = true;
          break;
        }
        case 'material': {
          newState.paletteActive = true;
          newState.materialToolActive = true;
          newState.shapeToolActive = false;
          break;
        }
        default: {
          warn('Unknown or unimplemented menu option', payload.optionName);
        }
      }
      return newState;
    },

    menuunselect: function (newState, payload) {
      newState.paletteActive = false;
      newState.materialToolActive = false;
      newState.shapeToolActive = false;
      return newState;
    }
  }
});
