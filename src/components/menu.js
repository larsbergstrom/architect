AFRAME.registerComponent('menu', {
  schema: {
    enabled: {default: true}
  },

  init: function () {
    var el = this.el;
    var data = this.data;
    var handEl = el.sceneEl.querySelector('#leftHand');
    var self = this;

    handEl.addEventListener('menudown', onHold);
    handEl.addEventListener('menuup', onRelease);
    handEl.addEventListener('surfacetouchstart', onHold);
    handEl.addEventListener('surfacetouchend', onRelease);

    function onHold () {
      var position;
      if (!self.data.enabled) { return; }
      el.setAttribute('visible', true);
      position = handEl.object3D.getWorldPosition();
      position.z -= 0.5;
      el.setAttribute('position', position);
    }

    function onRelease () {
      // Select tool.
      if (!self.data.enabled) { return; }
      el.setAttribute('visible', false);
      el.emit('menucreateoptionselect');
    }
  },
});
