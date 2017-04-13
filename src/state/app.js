/* global AFRAME */
module.exports = AFRAME.registerReducer('app', {
  initialState: {
    activePrimitive: {},
    entityId: 0,
    entities: [],
    stagedPrimitives: []
  },

  reducer: function (state, action) {
    var newState = Object.assign({}, state || this.initialState);

    switch (action.type) {
      case 'primitiveplace': {
        // Add primitive to staged primitives.
        var entity = action;
        entity.setAttribute('id', 'entity' + newState.entityId++);
        entity.classList.add('stagedPrimitive');
        newState.stagedPrimitives.push({
          id: entity.getAttribute('id'),
          geometry: entity.getDOMAttribute('geometry'),
          material: entity.getDOMAttribute('material'),
          position: entity.getAttribute('position'),
          rotation: entity.getAttribute('rotation'),
          scale: entity.getAttribute('scale')
        });
        break;
      }

      // Update active primitive geometry.
      case 'paletteprimitiveselect': {
        var data = action;
        newState.activePrimitive.geometry = data.geometry;
        newState.activePrimitive.scale = data.scale;
        break;
      }

      // Update active primitive material.
      case 'palettecolorselect': {
        var data = action;
        newState.activePrimitive.material = {color: data.color};
        break;
      }

      // Update active primitive material.
      case 'createthingbuttonpress': {
        // Move staged primitives to entities.
        newState.entities.push(newState.stagedPrimitives.slice());

        // Reset staged primitives.
        newState.stagedPrimitives.length = 0;
        break;
      }

      // Delete primitive.
      case 'primitivedelete': {
        var deletedEntityId = action.id;
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
        break;
      }
    }

    return newState;
  }
});
