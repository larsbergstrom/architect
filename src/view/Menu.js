import {Component, h} from 'preact';

export default class Menu extends Component {
  render () {
    return (
      <a-entity id="menu" look-at="#leftHand" menu visible="false"
                gamestate-bind="menu.enabled: !menu.toolsMenuActive"
                layout="type: circle; radius: 0.3; plane: xy">
        <a-entity mixin="menuToolOption" data-option="update">
          <a-entity mixin="menuToolText" text="value: Update"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-option="create">
          <a-entity mixin="menuToolText" text="value: Create"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-option="settings">
          <a-entity mixin="menuToolText" text="value: Settings"></a-entity>
        </a-entity>
        <a-entity mixin="menuToolOption" data-options="environment">
          <a-entity mixin="menuToolText" text="value: Environment"></a-entity>
        </a-entity>
      </a-entity>
    );
  }
}
