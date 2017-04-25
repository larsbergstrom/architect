import {Entity} from 'aframe-react';
import {h} from 'preact';

export function MaterialTool (props) {
  return (
    <Entity id="materialTool" visible={props.visible}
              layout="type: line; margin: 0.02" position="-0.05 -0.05 0.015">
      <Entity class="color" mixin="color" material="color: red"/>
      <Entity class="color" mixin="color" material="color: orange"/>
      <Entity class="color" mixin="color" material="color: yellow"/>
      <Entity class="color" mixin="color" material="color: green"/>
      <Entity class="color" mixin="color" material="color: blue"/>
      <Entity class="color" mixin="color" material="color: purple"/>
    </Entity>
  );
}
