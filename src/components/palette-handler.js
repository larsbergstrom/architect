AFRAME.registerComponent('palette-handler', {
  init: function () {
    var el = this.el;
    var activePrimitiveEl = el.querySelector('#activePrimitive');
    var material;

    this.hasSelectedPrimitive = false;

    // Read selected material from state.
    el.sceneEl.addEventListener('gamestatechange', function (evt) {
      material = evt.detail.state.menu.paletteMaterial;
    });

    // Select primitive from palette with mousedown.
    el.addEventListener('mousedown', evt => {
      var targetEl = evt.detail.intersectedEl;

      if (!targetEl) { return; }

      // Select primitive.
      if (targetEl.classList.contains('palettePrimitive')) {
        var geometry = targetEl.getDOMAttribute('geometry');
        // Set.
        activePrimitiveEl.setAttribute('geometry', geometry);
        activePrimitiveEl.setAttribute('material', material);
        // Emit.
        el.emit('paletteprimitiveselect', {geometry: geometry});
        this.hasSelectedPrimitive = true;
      }

      // Select color.
      if (targetEl.classList.contains('color')) {
        var color = targetEl.getAttribute('material').color;
        // Emit.
        el.emit('palettecolorselect', {color: color});
      }
    });

    // Release primitive, pass off to entity-placer.
    el.addEventListener('triggerup', evt => {
      if (!this.hasSelectedPrimitive) { return; }
      el.emit('primitivedragrelease');
    });

    // Reset activePrimitiveEl once primitive is placed.
    el.parentNode.addEventListener('primitiveplace', evt => {
      this.hasSelectedPrimitive = false;
      activePrimitiveEl.removeAttribute('geometry');
      activePrimitiveEl.removeAttribute('material');
    });
  }
});
