import {Entity} from 'aframe-react';
import {h} from 'preact';

export function Menu (props) {
  return (
    <Entity id="menu" look-at="#leftHand" menu={{enabled: props.enabled}}
            visible="false" layout="type: circle; radius: 0.3; plane: xy">
      <Entity mixin="menuToolOption" data-option="update">
        <Entity mixin="menuToolText" text="value: Update"/>
      </Entity>
      <Entity mixin="menuToolOption" data-option="create">
        <Entity mixin="menuToolText" text="value: Create"/>
      </Entity>
      <Entity mixin="menuToolOption" data-option="settings">
        <Entity mixin="menuToolText" text="value: Settings"/>
      </Entity>
      <Entity mixin="menuToolOption" data-options="environment">
        <Entity mixin="menuToolText" text="value: Environment"/>
      </Entity>
    </Entity>
  );
}
