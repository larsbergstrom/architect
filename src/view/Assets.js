import {Component, h} from 'preact';

export function Assets (props) {
  return (
    <a-assets timeout="10000">
      <img id="groundTexture" src="assets/img/floor.jpg"/>
      <img id="skyTexture" src="assets/img/sky.jpg"/>
      {/* Primitive mixin in case you want to add debug components (e.g., axis-helper). */}
      <a-mixin id="primitive"></a-mixin>
      <audio id="deleteSound" src="assets/audio/delete.mp3"></audio>
      <audio id="dingSound" src="assets/audio/ding.mp3"></audio>
      <a-mixin id="palettePrimitive" material="color: #888"
               event-set__mouseenter="_event: mouseenter; material.color: #555; material.opacity: 0.75"
               event-set__mouseleave="_event: mouseleave; material.color: #888; material.opacity: 1"></a-mixin>
      <a-mixin id="color"
               geometry="primitive: box; depth: 0.001; height: 0.01; width: 0.01"
               event-set__mouseenter="_event: mouseenter; material.opacity: 0.75"
               event-set__mouseleave="_event: mouseleave; material.opacity: 1"></a-mixin>
      <a-mixin id="menuToolOption" geometry="primitive: sphere; radius: 0.075"
               material="color: #EF2D5E"
               event-set__mouseenter="_event: mouseenter; material.opacity: 0.75"
               event-set__mouseleave="_event: mouseleave; material.opacity: 1"></a-mixin>
      <a-mixin id="menuToolText" text="align: center" position="0 0.15 0"></a-mixin>
    </a-assets>
  );
}
