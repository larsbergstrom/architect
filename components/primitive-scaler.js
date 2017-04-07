AFRAME.registerSystem('primitive-scaler', {
  schema: {
    factor: {default: 0.1}
  },

  init: function () {
    this.activeEntity = null;
    this.activeHands = 0;
    this.currentHandsVector = new THREE.Vector3();
    this.hands = [];
    this.previousHandsVector = new THREE.Vector3();
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
  },

  tick: function () {
    var activeEntity = this.activeEntity;
    var hands = this.hands;
    var currentHandsVector = this.currentHandsVector;
    var scale;
    var scaleAxis;
    var sceneEl = this.sceneEl;
    var stagedPrimitives;
    var worldToLocal;

    // Start scaling when both hands are active.
    if (this.activeHands < 2) { return; }

    // Grab last-placed primitive for now.
    // TODO: Allow user to select primitive or entity to scale.
    if (!activeEntity) {
      stagedPrimitives = sceneEl.getAttribute('gamestate').stagedPrimitives;
      activeEntity = document.querySelector(
        '#' + stagedPrimitives[stagedPrimitives.length - 1].id);
      this.activeEntity = activeEntity;
    }

    // Calculate the vector between both hands.
    currentHandsVector.copy(hands[0].object3D.position).sub(hands[1].object3D.position);

    // Transform vector into local camera space.
    sceneEl.camera.updateMatrixWorld();
    worldToLocal = new THREE.Matrix4().getInverse(sceneEl.camera.matrixWorld);
    currentHandsVector.applyMatrix4(worldToLocal);

    // Determine which axis to scale.
    scaleAxis = getClosestAxis(currentHandsVector);
    console.log(scaleAxis);

    // Determine magnitude of scale.
    scale = activeEntity.getAttribute('scale');
    scale[scaleAxis] = scale[scaleAxis] + (currentHandsVector.length() * this.data.factor);
    activeEntity.setAttribute('scale', scale);

    this.previousHandsVector.copy(currentHandsVector);
  }
});

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
 * Calculate closest aligned axis by getting the largest factor.
 */
function getClosestAxis (vector) {
  var closestAxis = 'x';
  if (Math.abs(vector.y) > Math.abs(vector.x)) { closestAxis = 'y'; }
  if (Math.abs(vector.z) > Math.abs(vector.y)) { closestAxis = 'x'; }
  return closestAxis;
}
