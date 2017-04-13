AFRAME.registerComponent('hand-action-dispatcher', {
  init: function () {
    var el = this.el;

    el.addEventListener('primitiveplace', function (evt) {
      el.sceneEl.components.gamestate.store.dispatch({
        type: 'primitiveplace',
        entity: {
          entity
        }
      });
    });
  }
});
