var AXES = [
  {name: 'x', direction: new THREE.Vector3(1, 0, 0)},
  {name: 'y', direction: new THREE.Vector3(0, 1, 0)},
  {name: 'z', direction: new THREE.Vector3(0, 0, 1)}
];

var handsVector = new THREE.Vector3();
var transformedBasisVector = new THREE.Vector3();

/**
 * System taking into account both hands.
 */
AFRAME.registerSystem('primitive-scaler', {
  init: function () {
    this.activeEntity = null;
    this.activeHands = 0;
    this.axis = '';
    this.currentScalingAxis = 0;
    this.handsVector = new THREE.Vector3();
    this.hands = [];
  },

  /**
   * Update scale of entity if both hands active.
   */
  tick: function () {
    var activeEntity = this.activeEntity;
    var axis = this.axis;
    var distanceChange;
    var hands = this.hands;
    var handsDistance;
    var stagedPrimitives;

    // Scale only if both hands are active.
    if (this.activeHands < 2 || !this.axis) { return; }

    // Calculate distance between both hands to determine how much to scale by.
    handsDistance = hands[0].object3D.position.distanceTo(hands[1].object3D.position);
    distanceChange = handsDistance - this.originalHandsDistance;

    // Update scale.
    activeEntity.setAttribute('scale', {
      [axis]: this.originalEntityScale[axis] + distanceChange * 10
    })
  },

  /**
   * Set hand active. Set up state if both hands are active.
   */
  setHandActive: function () {
    var hands = this.hands;  // Hand entities.
    var sceneEl = this.sceneEl;

    // Update active hands.
    this.activeHands++;

    if (this.activeHands < 2) { return; }

    // Set up state.
    // Grab last-placed primitive for now.
    // TODO: Decouple from game state. Allow selecting primitive to scale.
    stagedPrimitives = sceneEl.getAttribute('gamestate').stagedPrimitives;
    if (!stagedPrimitives.length) { return; }
    activeEntity = document.querySelector(
      '#' + stagedPrimitives[stagedPrimitives.length - 1].id);

    // Entity which we'll be scaling.
    this.activeEntity = activeEntity;

    // Store original scale of entity and original distance between controllers.
    this.originalEntityScale = activeEntity.getAttribute('scale');
    this.originalHandsDistance = hands[0].object3D.position.distanceTo(
      hands[1].object3D.position);

    // Determine which axis to scale on. Calculate vector between both hands.
    handsVector.copy(hands[1].object3D.position).sub(hands[0].object3D.position);

    // Get closest axis to determine which direction to scale.
    this.axis = getClosestAxis(handsVector.normalize(),
                               this.activeEntity.object3D.quaternion);
  },

  /**
   * Set hand inactive. Reset state if both hands are inactive.
   */
  setHandInactive: function () {
    this.activeHands--;

    if (this.activeHands < 2) { return; }

    // Reset state.
    this.activeEntity = null;
    this.axis = '';
    this.originalEntityScale = null;
    this.originalHandsDistance = 0;
  },

  registerHand: function (hand) {
    this.hands.push(hand);
  },

  unregisterHand: function (hand) {
    this.hands.splice(this.hands.indexOf(hand), 1);
  }
});

/**
 * For individual hand.
 */
AFRAME.registerComponent('primitive-scaler', {
  init: function () {
    var el = this.el;
    var system = this.system;

    system.registerHand(el);

    el.addEventListener('triggerdown', () => {
      system.setHandActive();
    });

    el.addEventListener('triggerup', () => {
      system.setHandInactive();
    });
  },

  remove: function () {
    system.unregisterHand(el);
  }
});

/**
 * Calculate closest aligned axis using dot product.
 *
 * @param {object} vector - THREE.Vector3.
 * @param {object} objectTransform - THREE.Quaternion.
 */
function getClosestAxis (vector, objectTransform) {
  var axis;
  var axisSimilarities = {x: null, y: null, z: null};
  var closestAxis;
  var i;

  // Calculate all axis similarities.
  for (i = 0; i < AXES.length; i++) {
    axis = AXES[i];

    // Transform basis vector to object space.
    transformedBasisVector.copy(axis.direction).applyQuaternion(objectTransform);

    // Calculate similarity with dot product.
    axisSimilarities[axis.name] = vector.dot(transformedBasisVector);
  }

  // Get largest similarity in absolute value.
  closestAxis = 'x';
  if (Math.abs(axisSimilarities.y) > Math.abs(axisSimilarities[closestAxis])) {
    closestAxis = 'y';
  }
  if (Math.abs(axisSimilarities.z) > Math.abs(axisSimilarities[closestAxis])) {
    closestAxis = 'z';
  }

  return closestAxis;
}
