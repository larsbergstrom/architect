/**
 * Create primitive in scene from held primitive.
 */
AFRAME.registerComponent('primitive-placer', {
  init: function () {
    var activePrimitiveEl;
    var el = this.el;
    var dingSound;
    var geometry;
    var material;

    // Grab slot.
    activePrimitiveEl = el.querySelector('#activePrimitive');

    dingSound = document.querySelector('#dingSound');
    dingSound.volume = 0.3;

    // Read geometry and material from game state.
    el.sceneEl.addEventListener('gamestatechange', function (evt) {
      geometry = evt.detail.state.paletteGeometry;
      material = evt.detail.state.paletteMaterial;
    });

    el.addEventListener('primitivedragrelease', function (evt) {
      var newEntity;
      var rotation;

      // Update matrix worlds.
      el.sceneEl.object3D.updateMatrixWorld();
      el.parentEl.object3D.updateMatrixWorld();
      activePrimitiveEl.object3D.updateMatrixWorld(true);

      // Create entity by copying selected primitive.
      rotation = activePrimitiveEl.object3D.getWorldRotation();
      newEntity = document.createElement('a-entity');
      newEntity.setAttribute('geometry', geometry, true);
      newEntity.setAttribute('material', material, true);
      newEntity.setAttribute('position', activePrimitiveEl.object3D.getWorldPosition());
      newEntity.setAttribute('rotation', {
        x: THREE.Math.radToDeg(rotation.x),
        y: THREE.Math.radToDeg(rotation.y),
        z: THREE.Math.radToDeg(rotation.z)
      });
      newEntity.setAttribute('scale', {x: 5, y: 5, z: 5});
      newEntity.setAttribute('mixin', 'primitive');

      // Emit.
      newEntity.addEventListener('loaded', function () {
        el.sceneEl.emit('primitiveplace', {el: newEntity});
        dingSound.play();
      });

      // Add primitive.
      el.sceneEl.appendChild(newEntity);
    });
  }
});
