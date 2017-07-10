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

import {Assets} from './view/Assets';
import {MaterialTool} from './view/MaterialTool';
import {Menu} from './view/Menu';
import {ShapesTool} from './view/ShapesTool';
import {ToolsMenu} from './view/ToolsMenu';

import {Component, h, options as preactOptions, render} from 'preact';
import {Entity} from 'aframe-react';

// Disable batching.
preactOptions.syncComponentUpdates = true;

/**
 * Connect Scene to Redux store.
 */
class App extends Component {
  constructor () {
    super();

    // Create Redux store.
    this.store = createStore();
    this.store.subscribe(() => {
      this.forceUpdate();
    });

    this.sceneCallback = this.sceneCallback.bind(this);
  }

  /**
   * Dispatch A-Frame events as actions on the Redux store.
   */
  sceneCallback (sceneEl) {
    initEventProxies(this.store, sceneEl);
  }

  render () {
    return (
      <Scene gamestate={this.store.getState()} sceneCallback={this.sceneCallback}/>
    );
  }
}

/**
 * A-Frame Scene.
 */
function Scene (props) {
  const gamestate = props.gamestate;

  return (
    <a-scene avatar-replayer="src: recordings/scaleClone.json" html-exporter
             primitive-scaler={{entity: gamestate.app.activePrimitiveId}}
             ref={props.sceneCallback}>
      <Assets/>

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
      <Entity environment={{preset: 'forest'}}/>

      <a-camera id="camera"></a-camera>
    </a-scene>
  );
}

// Render.
render(<App/>, document.body);
