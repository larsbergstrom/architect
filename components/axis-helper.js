AFRAME.registerComponent('axis-helper', {
  init: function () {
    this.el.setObject3D('axishelper', new THREE.AxisHelper(0.02));
  },

  remove: function () {
    this.el.removeObject3D('axishelper');
  }
});
