var AXES = [
  {name: 'z', direction: new THREE.Vector3(0, 0, 1)},
  {name: 'y', direction: new THREE.Vector3(0, 1, 0)},
  {name: 'x', direction: new THREE.Vector3(1, 0, 0)}
];

var transformedBasisVector = new THREE.Vector3();

/**
 * System taking into account both hands.
 */
AFRAME.registerSystem('primitive-scaler', {
  schema: {
    axisThreshold: {default: 0.8},
    factor: {default: 0.1}
  },

  init: function () {
    this.activeEntity = null;
    this.activeHands = 0;
    this.handsVector = new THREE.Vector3();
    this.hands = [];
  },

  tick: function () {
    var activeEntity = this.activeEntity;
    var axis;
    var handsVector = this.handsVector;
    var data = this.data;
    var distanceChange;
    var hands = this.hands;
    var handsDistance;
    var sceneEl = this.sceneEl;
    var stagedPrimitives;

    // Start scaling when both hands are active. Else, reset.
    if (this.activeHands < 2) {
      this.activeEntity = null;
      this.originalEntityScale = null;
      this.originalHandsDistance = 0;
      return;
    }

    handsDistance = hands[0].object3D.position.distanceTo(hands[1].object3D.position);

    // Grab last-placed primitive for now. Set up scaling.
    if (!activeEntity) {
      // TODO: Decouple from game state. Allow selecting primitive to scale.
      stagedPrimitives = sceneEl.getAttribute('gamestate').stagedPrimitives;
      if (!stagedPrimitives.length) { return; }
      activeEntity = document.querySelector(
        '#' + stagedPrimitives[stagedPrimitives.length - 1].id);

      this.activeEntity = activeEntity;
      // Store original scale of entity and original distance between controllers.
      this.originalEntityScale = activeEntity.getAttribute('scale');
      this.originalHandsDistance = handsDistance;
    }

    // Calculate vector between both hands.
    handsVector.copy(hands[1].object3D.position).sub(hands[0].object3D.position);

    // Get closest axis to determine which direction to scale.
    axis = getClosestAxis(handsVector.normalize(), activeEntity.object3D.quaternion);

    // Set scale.
    distanceChange = handsDistance - this.originalHandsDistance;
    activeEntity.setAttribute('scale', {
      [axis]: this.originalEntityScale[axis] + distanceChange * 10
    })
  },

  registerHand: function (hand) {
    this.hands.push(hand);
  },

  unregisterHand: function (hand) {
    this.hands.splice(this.hands.indexOf(hand), 1);
  },

  setHandActive: function () {
    this.activeHands++;
  },

  setHandInactive: function () {
    this.activeHands--;
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
 * Calculate closest aligned axis using dot product and threshold.
 *
 * @param {object} vector - THREE.Vector3.
 * @param {object} objectTransform - THREE.Quaternion.
 */
function getClosestAxis (vector, objectTransform) {
  var axis;
  var axisSimilarity;
  var axisSimilarityThreshold = 0.8;
  var i;

  for (i = 0; i < AXES.length; i++) {
    axis = AXES[i];

    // Transform basis vector to object space.
    transformedBasisVector.copy(axis.direction).applyQuaternion(objectTransform);

    // Calculate similarity with dot product.
    axisSimilarity = vector.dot(transformedBasisVector);

    // Return axis if it meets the threshold.
    if (axisSimilarity > axisSimilarityThreshold || axisSimilarity < -1 * axisSimilarityThreshold) {
      return axis.name;
    }
  }
}
