/* global AFRAME */
AFRAME.registerReducer('app', {
  initialState: {
    entityId: 0,
    entities: [],
    paletteGeometry: {},
    paletteMaterial: {color: 'red'},
    stagedPrimitives: []
  },

  handlers: {
    /**
     * Add primitive to staged primitives.
     */
    primitiveplace: function (newState, action) {
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
      return newState
    },

    /**
     * Update active primitive material.
     */
    createthingbuttonpress: function (newState, payload) {
      // Move staged primitives to entities.
      newState.entities.push(newState.stagedPrimitives.slice());

      // Reset staged primitives.
      newState.stagedPrimitives.length = 0;
      return newState;
    },

    /**
     * Update entity object with new clone.
     */
    primitiveclone: function (newState, payload) {
      var cloneData;
      var cloneEl = payload.el;
      var i;

      // FIXME: Breaks cloning
      cloneEl.setAttribute('id', 'entity' + newState.entityId++);

      for (i = 0; i < newState.stagedPrimitives.length; i++) {
        var primitive = newState.stagedPrimitives[i];
        if (primitive.id !== payload.sourceEl.getAttribute('id')) { return; }
        cloneData = Object.assign({}, primitive);
        cloneData.id = cloneEl.getAttribute('id');
        cloneData.position = cloneEl.getAttribute('position');
        cloneData.rotation = cloneEl.getAttribute('rotation');
        newState.stagedPrimitives.push(cloneData);
        break;
      }

      return newState;
    },

    /**
     * Delete primitive.
     */
    primitivedelete: function (newState, payload) {
      var deletedEntityId = payload.id;
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
    },

    primitivescale: function (newState, payload) {
      var el = payload.el;
      var i;
      var stagedPrimitive;

      for (i = 0; i < newState.stagedPrimitives.length; i++) {
        stagedPrimitive = newState.stagedPrimitives[i];
        if (stagedPrimitive.id === el.getAttribute('id')) {
          stagedPrimitive.scale = el.getAttribute('scale');
        }
      }

      return newState;
    }
  }
});
