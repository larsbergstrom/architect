import {Component, h} from 'preact';

export default class MaterialTool extends Component {
  render () {
    return (
      <a-entity id="materialTool" gamestate-bind="visible: menu.materialToolActive"
                visible="false" layout="type: line; margin: 0.02" position="-0.05 -0.05 0.015">
        <a-entity class="color" mixin="color" material="color: red"></a-entity>
        <a-entity class="color" mixin="color" material="color: orange"></a-entity>
        <a-entity class="color" mixin="color" material="color: yellow"></a-entity>
        <a-entity class="color" mixin="color" material="color: green"></a-entity>
        <a-entity class="color" mixin="color" material="color: blue"></a-entity>
        <a-entity class="color" mixin="color" material="color: purple"></a-entity>
      </a-entity>
    );
  }
}
