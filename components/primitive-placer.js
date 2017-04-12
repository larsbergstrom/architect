AFRAME.registerComponent('primitive-placer', {
  init: function () {
    var el = this.el;
    var activePrimitiveEl = el.querySelector('#activePrimitive');
    var dingSound = document.querySelector('#dingSound');
    dingSound.volume = 0.3;

    // Hook up to game state.
    var activePrimitive;
    el.sceneEl.addEventListener('gamestateinitialized', function (evt) {
      activePrimitive = el.sceneEl.getAttribute('gamestate').activePrimitive;
    });

    var workaround = 0;
    el.addEventListener('primitivedragrelease', function (evt) {
      var newEntity;
      var rotation;

      workaround++;
      if (workaround % 2 !== 0) { return; }

      // Update matrix worlds.
      el.sceneEl.object3D.updateMatrixWorld();
      el.parentEl.object3D.updateMatrixWorld();
      activePrimitiveEl.object3D.updateMatrixWorld(true);

      // Create entity by copying selected primitive.
      rotation = activePrimitiveEl.object3D.getWorldRotation();
      newEntity = document.createElement('a-entity');
      newEntity.setAttribute('geometry', activePrimitive.geometry, true);
      newEntity.setAttribute('material', activePrimitive.material, true);
      newEntity.setAttribute('position', activePrimitiveEl.object3D.getWorldPosition());
      newEntity.setAttribute('rotation', {
        x: THREE.Math.radToDeg(rotation.x),
        y: THREE.Math.radToDeg(rotation.y),
        z: THREE.Math.radToDeg(rotation.z)
      });
      newEntity.setAttribute('scale', {x: 5, y: 5, z: 5});
      newEntity.setAttribute('axis-helper', '');

      // Emit.
      newEntity.addEventListener('loaded', function () {
        el.sceneEl.emit('primitiveplace', newEntity);
        dingSound.play();
        console.log('Primitive placed', newEntity);
      });

      // Add primitive.
      el.sceneEl.appendChild(newEntity);
    });
  }
});
