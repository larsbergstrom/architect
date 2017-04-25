import {Entity} from 'aframe-react';
import {Component, h} from 'preact';

export function ToolsMenu (props) {
  return (
    <Entity id="toolsMenu" look-at="#leftHand" menu={{enabled: props.enabled}}
            visible="false" layout="type: circle; radius: 0.3; plane: xy">
      <Entity mixin="menuToolOption" data-option="shapes">
        <Entity mixin="menuToolText" text="value: Shapes"/>
      </Entity>
      <Entity mixin="menuToolOption" data-option="material">
        <Entity mixin="menuToolText" text="value: Material"/>
      </Entity>
      <Entity mixin="menuToolOption" data-option="select">
        <Entity mixin="menuToolText" text="value: Select"/>
      </Entity>
      <Entity mixin="menuToolOption" data-option="confirm">
        <Entity mixin="menuToolText" text="value: Confirm"/>
      </Entity>
    </Entity>
  );
}
