/* global AFRAME */

AFRAME.registerReducer('app', {
  initialState: {
    activePrimitive: {},
    entityId: 0,
    entities: [],
    stagedPrimitives: []
  },

  handlers: {
    primitiveplace: function (newState, action) {
      // Add primitive to staged primitives.
      var el = action.el;
      el.setAttribute('id', 'entity' + newState.entityId++);
      el.classList.add('stagedPrimitive');
      newState.stagedPrimitives.push({
        id: el.getAttribute('id'),
        geometry: el.getDOMAttribute('geometry'),
        material: el.getDOMAttribute('material'),
        position: el.getAttribute('position'),
        rotation: el.getAttribute('rotation'),
        scale: el.getAttribute('scale')
      });
      return newState;
    },

      // Update active primitive geometry.
    paletteprimitiveselect: function (newState, data) {
      newState.activePrimitive.geometry = data.geometry;
      newState.activePrimitive.scale = data.scale;
      return newState;
    },

      // Update active primitive material.
    palettecolorselect: function (newState, data) {
      newState.activePrimitive.material = {color: data.color};
      return newState
    },

    // Update active primitive material.
    createthingbuttonpress: function (newState, data) {
      // Move staged primitives to entities.
      newState.entities.push(newState.stagedPrimitives.slice());

      // Reset staged primitives.
      newState.stagedPrimitives.length = 0;
      return newState;
    },

    // Delete primitive.
    primitivedelete: function (newState, data) {
      var deletedEntityId = data.id;
      var i;
      var stagedPrimitive;

      // Clone array for clean state.
      newState.stagedPrimitives = newState.stagedPrimitives.slice();

      // Remove from stagedPrimitives array.
      for (i = 0; i < newState.stagedPrimitives.length; i++) {
        stagedPrimitive = newState.stagedPrimitives[i];
        if (stagedPrimitive.id === deletedEntityId) {
          newState.stagedPrimitives.splice(i, 1);
          break;
        }
      }

      // TODO: If not in stagedPrimitives, but in entities, then delete the group.
      return newState
    }
  }
});
