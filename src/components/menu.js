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
    var menuPosition = new THREE.Vector3(0, 0, -0.5);
    var self = this;

    handEl.addEventListener('menudown', onHold);
    handEl.addEventListener('menuup', onRelease);
    handEl.addEventListener('ybuttondown', onHold);
    handEl.addEventListener('ybuttonup', onRelease);

    /**
     * Open menu.
     */
    function onHold () {
      var position;
      if (!self.data.enabled) { return; }
      el.setAttribute('visible', true);
      // Local point to world position to place the menu.
      handEl.object3D.localToWorld(menuPosition);
      el.setAttribute('position', menuPosition);
      menuPosition.set(0, 0, -0.5);
    }

    /**
     * Select option, close menu.
     */
    function onRelease () {
      var intersectedEl;

      if (!self.data.enabled) { return; }

      el.setAttribute('visible', false);

      intersectedEl = handEl.components['controller-cursor'].intersectedEl;

      if (!intersectedEl) { return; }

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
