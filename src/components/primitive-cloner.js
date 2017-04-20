/* global AFRAME */

AFRAME.registerSystem('primitive-cloner', {
  init: function () {
    this.activeEntity = null;
    // [{handEl, intersectedEl}, {handEl, intersectedEl}].
    this.activeHands = [];
    this.hands = [];
  },

  clone: function (sourceEl, handEl) {
    var cloneEl;
    var sceneEl = this.sceneEl;

    // Get world position and rotation.
    sourceEl.object3D.updateMatrixWorld();

    // TODO: Clone using game state.
    sourceEl.flushToDOM();
    cloneEl = sourceEl.cloneNode();
    handEl.object3D.add(cloneEl.object3D);
    sceneEl.appendChild(cloneEl);

    sceneEl.emit('primitiveclone', {el: cloneEl, sourceEl: sourceEl});
  },

  /**
   * Set hand active.
   *
   * @param {object} handEl - Hand entity.
   * @param {object} intersectedEl - Interesected entity at time of becoming active.
   */
  setHandActive: function (handEl, intersectedEl) {
    var activeHands = this.activeHands;

    // No intersectedEl, nothing to potentially clone.
    if (!intersectedEl) { return; }

    // Keep track of active hands.
    activeHands.push({
      handEl: handEl,
      intersectedEl: intersectedEl
    });

    // Check if both hands are active on the same entity.
    // If so, initiate cloning.
    if (activeHands.length >= 2 &&
        activeHands[0].intersectedEl === activeHands[1].intersectedEl) {
      this.clone(intersectedEl, activeHands[1].handEl);
    }
  },

  /**
   * Set hand inactive.
   */
  setHandInactive: function (handEl) {
    var activeHands = this.activeHands;
    var index = -1;

    // Remove hand from active hands if there.
    activeHands.forEach(function (handObj, i) {
      if (handObj.handEl === handEl) { index = i; }
    });
    activeHands.splice(index, 1);
  },

  registerHand: function (handEl) {
    this.hands.push(handEl);
  },

  /**
   * Handle component remove, clean up.
   */
  unregisterHand: function (handEl) {
    var activeHands = this.activeHands;
    var hands = this.hands;

    hands.splice(hands.indexOf(handEl), 1);
    activeHands.splice(activeHands.indexOf(handEl), 1);
  }
});

AFRAME.registerComponent('primitive-cloner', {
  init: function () {
    var el = this.el;
    var system = this.system;

    system.registerHand(el);

    el.addEventListener('triggerdown', () => {
      system.setHandActive(el, el.components['controller-cursor'].intersectedEl);
    });

    el.addEventListener('triggerup', () => {
      system.setHandInactive(el);
    });
  },

  remove: function () {
    this.system.unregisterHand(this.el);
  }
});
