import 'aframe-controller-cursor-component';
import 'aframe-event-set-component';
import 'aframe-layout-component';
import 'aframe-physics-system';
import 'aframe-teleport-controls';

import './components/axis-helper';
import './components/create-thing-button';
import './components/gamestate';
import './components/gamestate-bind';
import './components/html-exporter';
import './components/menu';
import './components/palette-handler';
import './components/primitive-cloner';
import './components/primitive-deleter';
import './components/primitive-mover';
import './components/primitive-placer';
import './components/primitive-scaler';

import './state/app';
import './state/menu';

import MaterialTool from './view/MaterialTool';
import Menu from './view/Menu';
import ShapesTool from './view/ShapesTool';
import ToolsMenu from './view/ToolsMenu';

import {h, render} from 'preact';

render((
  <a-scene avatar-replayer="src: recordings/scaleClone.json" html-exporter gamestate
           gamestate-bind="primitive-scaler.entity: app.activePrimitiveId">
    <a-assets timeout="10000">
      <img id="groundTexture" src="assets/img/floor.jpg"/>
      <img id="skyTexture" src="assets/img/sky.jpg"/>
      {/* Primitive mixin in case you want to add debug components (e.g., axis-helper). */}
      <a-mixin id="primitive"></a-mixin>
      <audio id="deleteSound" src="assets/audio/delete.mp3"></audio>
      <audio id="dingSound" src="assets/audio/ding.mp3"></audio>
      <a-mixin id="palettePrimitive" material="color: #888" event-set__mouseenter="_event: mouseenter; material.color: #555; material.opacity: 0.75" event-set__mouseleave="_event: mouseleave; material.color: #888; material.opacity: 1"></a-mixin>
      <a-mixin id="color" geometry="primitive: box; depth: 0.001; height: 0.01; width: 0.01" event-set__mouseenter="_event: mouseenter; material.opacity: 0.75" event-set__mouseleave="_event: mouseleave; material.opacity: 1"></a-mixin>
      <a-mixin id="menuToolOption" geometry="primitive: sphere; radius: 0.075"
               material="color: #EF2D5E"
               event-set__mouseenter="_event: mouseenter; material.opacity: 0.75"
               event-set__mouseleave="_event: mouseleave; material.opacity: 1"></a-mixin>
      <a-mixin id="menuToolText" text="align: center" position="0 0.15 0"></a-mixin>
    </a-assets>

    <a-entity id="entities"></a-entity>

    {/* Hands. */}
    <a-entity id="leftHand"
      hand-controls="left"
      controller-cursor
      raycaster="far: .75"
      shadow="cast: true"
      teleport-controls="type: parabolic; collisionEntities: #ground"
      primitive-cloner
      primitive-scaler>
      {/* Palette. */}
      <a-entity id="palette"
                gamestate-bind="visible: menu.paletteActive"
                geometry="primitive: box; depth: 0.008; height: 0.15; width: 0.15"
                material="color: #333; opacity: 0.85" position="0 0.03 0.015"
                rotation="-90 90 0" visible="false">
        <ShapesTool/>
        <MaterialTool/>
      </a-entity>
    </a-entity>

    <a-entity id="rightHand"
      gamestate-bind="primitive-placer.geometry: menu.paletteGeometry; primitive-placer.material: menu.paletteMaterial"
      hand-controls="right"
      shadow="cast: true"
      controller-cursor
      raycaster="far: 0.2"
      palette-handler
      primitive-cloner
      primitive-mover
      primitive-placer
      primitive-scaler>
      {/* TODO: Specify palette size and actual size of primitives separately. */}
      <a-entity id="activePrimitive" position="0 0 -0.25" scale="5 5 5"></a-entity>
    </a-entity>

    <Menu/>
    <ToolsMenu/>

    {/* Environment. */}
    <a-sky id="bg" radius="30" src="#skyTexture" theta-length="90"></a-sky>
    <a-cylinder id="ground" src="#groundTexture" radius="32" height="0.1" shadow="receive: true"></a-cylinder>
    <a-entity light="type: ambient; color: #BBB"></a-entity>
    <a-entity light="type: directional; color: #FFF; intensity: 0.6; castShadow: true" position="-0.5 1 1"></a-entity>

    <a-camera id="camera"></a-camera>
  </a-scene>
), document.body);
