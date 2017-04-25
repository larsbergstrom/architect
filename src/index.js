import 'aframe-controller-cursor-component';
import 'aframe-event-set-component';
import 'aframe-layout-component';
import 'aframe-physics-system';
import 'aframe-teleport-controls';

import './components/axis-helper';
import './components/create-thing-button';
import './components/html-exporter';
import './components/menu';
import './components/palette-handler';
import './components/primitive-cloner';
import './components/primitive-deleter';
import './components/primitive-mover';
import './components/primitive-placer';
import './components/primitive-scaler';

import {createStore, initEventProxies} from './state/index';
import './state/app';
import './state/menu';

import {MaterialTool} from './view/MaterialTool';
import {Menu} from './view/Menu';
import {ShapesTool} from './view/ShapesTool';
import {ToolsMenu} from './view/ToolsMenu';

import {Component, h, options as preactOptions, render} from 'preact';
import {Entity, Scene} from 'aframe-react';

preactOptions.syncComponentUpdates = true;

class App extends Component {
  constructor () {
    super();

    // Create store.
    this.store = createStore();
    this.store.subscribe(() => {
      this.forceUpdate();
    });

    this.sceneCallback = this.sceneCallback.bind(this);
  }

  sceneCallback (sceneEl) {
    initEventProxies(this.store, sceneEl);
  }

  render () {
    return (
      <AppScene gamestate={this.store.getState()} sceneCallback={this.sceneCallback}/>
    );
  }
}

function AppScene (props) {
  const gamestate = props.gamestate;

  return (
    <a-scene avatar-replayer="src: recordings/scaleClone.json" html-exporter
             primitive-scaler={{entity: gamestate.app.activePrimitiveId}}
             ref={props.sceneCallback}>
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

      <Entity id="entities"/>

      {/* Hands. */}
      <Entity id="leftHand"
        hand-controls="left"
        controller-cursor
        raycaster="far: .75"
        shadow="cast: true"
        teleport-controls="type: parabolic; collisionEntities: #ground"
        primitive-cloner
        primitive-scaler>
        {/* Palette. */}
        <Entity id="palette"
                  geometry={{primitive: 'box', depth: 0.008, height: 0.15, width: 0.15}}
                  material="color: #333; opacity: 0.85" position="0 0.03 0.015"
                  rotation="-90 90 0" visible={gamestate.menu.paletteActive}>
          <ShapesTool visible={gamestate.menu.shapeToolActive}/>
          <MaterialTool visible={gamestate.menu.materialToolActive}/>
        </Entity>
      </Entity>

      <Entity id="rightHand"
        hand-controls="right"
        shadow="cast: true"
        controller-cursor
        raycaster="far: 0.2"
        palette-handler={{material: gamestate.menu.paletteMaterial}}
        primitive-cloner
        primitive-mover
        primitive-placer={{geometry: gamestate.menu.paletteGeometry, material: gamestate.menu.paletteMaterial}}
        primitive-scaler>
        {/* TODO: Specify palette size and actual size of primitives separately. */}
        <Entity id="activePrimitive" position="0 0 -0.25" scale="5 5 5"/>
      </Entity>

      <Menu enabled={!gamestate.menu.toolsMenuActive}/>
      <ToolsMenu enabled={gamestate.menu.toolsMenuActive}/>

      {/* Environment. */}
      <a-sky id="bg" radius="30" src="#skyTexture" theta-length="90"></a-sky>
      <a-cylinder id="ground" src="#groundTexture" radius="32" height="0.1" shadow="receive: true"></a-cylinder>
      <Entity light="type: ambient; color: #BBB"/>
      <Entity light="type: directional; color: #FFF; intensity: 0.6; castShadow: true" position="-0.5 1 1"/>

      <a-camera id="camera"></a-camera>
    </a-scene>
  );
}

render(<App/>, document.body);
