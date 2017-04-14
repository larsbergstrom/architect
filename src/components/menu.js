AFRAME.registerComponent('menu', {
  init: function () {
    var el = this.el;
    var handEl = el.sceneEl.querySelector('#leftHand');

    handEl.addEventListener('menudown', function () {
      var position;
      var rotation;

      el.setAttribute('visible', true);

      position = handEl.object3D.getWorldPosition();
      rotation = handEl.object3D.getWorldRotation();

      position.z += 0.5;
      el.setAttribute('position', position);
    });

    handEl.addEventListener('menuup', function () {
      // Select tool.
      el.setAttribute('visible', false);
    });
  }
});
