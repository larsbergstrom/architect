/**
 * Handle toggling visibility of menu in front of hand.
 * Uses controller-cursor laser for selection.
 * Emit event when option selected or deselected giving `data-option` of selected option.
 */
AFRAME.registerComponent('menu', {
  schema: {
    enabled: {default: true}
  },

  init: function () {
    var el = this.el;
    var handEl = el.sceneEl.querySelector('#leftHand');
    var self = this;

    handEl.addEventListener('menudown', onHold);
    handEl.addEventListener('menuup', onRelease);
    handEl.addEventListener('surfacetouchstart', onHold);
    handEl.addEventListener('surfacetouchend', onRelease);

    /**
     * Open menu.
     */
    function onHold () {
      var position;
      if (!self.data.enabled) { return; }
      el.setAttribute('visible', true);
      position = handEl.object3D.getWorldPosition();
      position.z -= 0.5;
      el.setAttribute('position', position);
    }

    /**
     * Select option, close menu.
     */
    function onRelease () {
      var intersectedEl;

      if (!self.data.enabled) { return; }

      el.setAttribute('visible', false);

      intersectedEl = handEl.components['controller-cursor'].intersectedEl;

      // If released and not select option, emit `unselect`.
      if (!intersectedEl.hasAttribute('data-option')) {
        el.emit('menuunselect');
        return;
      }

      // Option selected.
      el.emit('menuoptionselect', {optionName: intersectedEl.getAttribute('data-option')});
    }
  }
});
