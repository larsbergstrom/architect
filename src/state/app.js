let ENTITY_ID = 0;
let PRIMITIVE_ID = 0;

/**
 * General app state.
 *
 * @member {number} activePrimitiveId - Focused primitive to be target of global actions.
 * @member {object} entities - Source of truth for all entities placed in the scene.
 * @member {array} stagedPrimitives - List of primitives comprising the working entity.
 */
AFRAME.registerReducer('app', {
  initialState: {
    activePrimitiveId: null,
    entities: [],
    stagedPrimitives: []
  },

  handlers: {
    /**
     * Add primitive to staged primitives.
     */
    primitiveplace: function (newState, payload) {
      var el = payload.el;
      var id = `primitive${PRIMITIVE_ID++}`;
      el.setAttribute('id', id);
      el.classList.add('stagedPrimitive');
      newState.stagedPrimitives.push({
        id: id,
        geometry: el.getDOMAttribute('geometry'),
        material: el.getDOMAttribute('material'),
        position: el.getAttribute('position'),
        rotation: el.getAttribute('rotation'),
        scale: el.getAttribute('scale')
      });
      newState.activePrimitiveId = `#${id}`;
      return newState;
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
      var id;
      var primitive;

      id = `primitive${PRIMITIVE_ID++}`;
      cloneEl.setAttribute('id', id);

      primitive = findPrimitive(newState.stagedPrimitives, cloneEl);
      cloneData = Object.assign({}, primitive);
      cloneData.id = id;
      cloneData.position = cloneEl.getAttribute('position');
      cloneData.rotation = cloneEl.getAttribute('rotation');
      newState.stagedPrimitives.push(cloneData);
      newState.activePrimitiveId = `#${id}`;
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

      // Change active primitive.
      let stagedPrimitives = newState.stagedPrimitives;
      newState.activePrimitiveId = `#${stagedPrimitives[stagedPrimitives.length - 1].id}`;

      // TODO: If not in stagedPrimitives, but in entities, then delete the group.
      return newState;
    },

    primitivemove: function (newState, payload) {
      var el = payload.el;
      var primitive = findPrimitive(newState.stagedPrimitives, el);
      primitive.position = el.getAttribute('position');
      primitive.rotation = el.getAttribute('rotation');
      newState.activePrimitiveId = `#${primitive.id}`;
      return newState;
    },

    primitivescale: function (newState, payload) {
      var el = payload.el;
      var primitive = findPrimitive(newState.stagedPrimitives, el);
      primitive.scale = el.getAttribute('scale');
      return newState;
    }
  }
});

/**
 * Find primitive data corresponding to entity.
 */
function findPrimitive (primitives, el) {
  return primitives.find(primitive => primitive.id === el.getAttribute('id'));
}
