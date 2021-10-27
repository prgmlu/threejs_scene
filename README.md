# ThreeJS Scene Component

## Installation
```
npm i -S git+ssh://git@gitlab.com:ObsessVR/npm-modules/threejs-scene.git
```

## Usage

```javascript
import Scene, { Hotspot } from '../../../three-js';
```
Available components:  
- Scene
- Hotspot

## Create the Scene

```javascript
<Scene
    sceneId={currentSceneId}
    bgConf={bgConfig}
/>
```
### Scene Options

**_bgConf_** (required)
```javascript
// example
const bgConfig ={
    isFlatScene: true,
    backgroundUrl: 'http://abc.com/bgImage.jpg'
}
```

**_sceneId_** (required)  
Scene unique id that used to determine the scene change


### Events (optional)
Currently supported public callbacks:
- onMouseDown
- onMouseUp
- onMouseMove
- onDrop

```javascript
//Example
<Scene
    sceneId={currentSceneId}
    bgConf={bgConfig}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseMove={onMouseMove}
    onDrop={onDrop}
/>
    allowEventsForMarkerTypeOnly={selectedHotspotType}
```

### Filter
Sometimes we may want to allow access and events only to specific scene object types.

```javascript
//With this configuration only scene objects with type 'hotspot_marker' would react on onClick/onMouseMove and other events
<Scene
    ...
    allowEventsForMarkerTypeOnly='hotspot_marker'
/>
```


<hr/>

# Scene Objects
To place a scene object on the scene, use `<Hotspot/>` component provided by the library.

```javascript
import Scene, { Hotspot } from '../../../three-js';

<Scene >
   <Hotspot
       key={item._id}
       hotspot_type='hotspot'
       collider_transform={item.collider_transform}
       transform={item.transform}
   />
</Scene>
```

##### Scene Object types:
- hotspot
- image_hotspot


