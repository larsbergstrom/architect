import {Component, h} from 'preact';

export default class ShapesTool extends Component {
  render () {
    return (
      <a-entity id="shapeTool" gamestate-bind="visible: menu.shapeToolActive" visible="false"
                layout="type: line; margin: 0.03" position="-0.05 0 0.015">
        <a-entity class="palettePrimitive" mixin="palettePrimitive" geometry="primitive: box; depth: 0.01; height: 0.01; width: 0.01"></a-entity>
        <a-entity class="palettePrimitive" mixin="palettePrimitive" geometry="primitive: sphere; radius: 0.01"></a-entity>
        <a-entity class="palettePrimitive" mixin="palettePrimitive" geometry="primitive: cylinder; height: 0.01; radius: 0.01"></a-entity>
        <a-entity class="palettePrimitive" mixin="palettePrimitive" geometry="primitive: torus; radius: 0.01; radiusTubular: 0.001"></a-entity>
      </a-entity>
    );
  }
}
