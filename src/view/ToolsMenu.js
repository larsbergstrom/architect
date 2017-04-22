import {Component, h} from 'preact';

export default class ToolsMenu extends Component {
  render () {
    return (
      <a-entity id="toolsMenu" look-at="#leftHand" menu="enabled: false" visible="false"
                gamestate-bind="menu.enabled: menu.toolsMenuActive"
                layout="type: circle; radius: 0.3; plane: xy">
        <a-entity mixin="menuToolOption" data-option="shapes">
          <a-entity mixin="menuToolText" text="value: Shapes"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-option="material">
          <a-entity mixin="menuToolText" text="value: Material"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-option="select">
          <a-entity mixin="menuToolText" text="value: Select"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-option="confirm">
          <a-entity mixin="menuToolText" text="value: Confirm"></a-entity>
        </a-entity>
      </a-entity>
    );
  }
}
