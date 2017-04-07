/**
 * Grab.
 */
AFRAME.registerComponent('primitive-mover', {
  init: function () {
    var handEl = this.el;
    var sceneEl = this.el.sceneEl;
    this.activePrimitiveEl = null;
    this.activePrimitiveObject3D = null;

    // Grab.
    handEl.addEventListener('mousedown', evt => {
      var activePrimitiveEl;
      var intersectedPrimitive = evt.detail.intersectedEl;
      var worldToLocal;

      if (!intersectedPrimitive) { return; }
      if (!intersectedPrimitive.classList.contains('stagedPrimitive')) { return; }

      // Set active primitive.
      activePrimitiveEl = this.activePrimitiveEl = intersectedPrimitive;
      activePrimitiveObject3D = activePrimitiveEl.object3D;
      console.log('Grabbed', activePrimitiveEl);

      // World to local transform so position and rotation do not change when moved.
      handEl.object3D.updateMatrixWorld();
      worldToLocal = new THREE.Matrix4().getInverse(handEl.object3D.matrixWorld);
      activePrimitiveObject3D.applyMatrix(worldToLocal);

      // Move entity's three.js Object3D into hand.
      handEl.object3D.add(activePrimitiveObject3D);
    });

    // Ungrab.
    handEl.addEventListener('mouseup', () => {
      var activePrimitiveEl = this.activePrimitiveEl;
      var position;
      var rotation;

      if (!activePrimitiveEl) { return; }
      console.log('Ungrabbed', this.activePrimitiveEl);

      // Get world transforms.
      position = activePrimitiveObject3D.getWorldPosition();
      rotation = activePrimitiveObject3D.getWorldRotation();

      // Move primitive back to scene.
      sceneEl.object3D.add(activePrimitiveObject3D);

      // Sync world transforms back to entity.
      activePrimitiveEl.setAttribute('position', position);
      activePrimitiveEl.setAttribute('rotation', {
        x: THREE.Math.radToDeg(rotation.x),
        y: THREE.Math.radToDeg(rotation.y),
        z: THREE.Math.radToDeg(rotation.z)
      });

      // Reset.
      this.activePrimitiveEl = null;
      this.activePrimitiveObject3D = null;
    });
  }
});
