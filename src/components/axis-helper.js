AFRAME.registerComponent('axis-helper', {
  schema: {
    size: {type: 'number', default: 0.02}
  },

  update: function () {
    this.el.setObject3D('axishelper', new THREE.AxisHelper(this.data.size));
  },

  remove: function () {
    this.el.removeObject3D('axishelper');
  }
});
