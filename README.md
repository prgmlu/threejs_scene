# ThreeJS Scene Component

## Installation
```
npm i -S git+ssh://git@gitlab.com:ObsessVR/npm-modules/threejs-scene.git
```

## Usage

```javascript
import Scene, { Hotspot } from 'threejs-scene';
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

```jsx
//With this configuration only scene objects with type 'hotspot_marker' would react on onClick/onMouseMove and other events
<Scene
    ...
    allowEventsForMarkerTypeOnly='hotspot_marker'
/>
```


<hr/>

# Scene Objects

To place scene object on the scene, use `<Hotspot/>` component provided by the library.

##### Types:
- hotspot
- image_hotspot


### Hotspot Marker
![image](https://user-images.githubusercontent.com/8204364/139121711-2f4e815d-9351-40c4-a90f-861225eadaa7.png)

```jsx
<Scene >
   <Hotspot
       key={item._id}
       type='hotspot'
       collider_transform={item.collider_transform}
       transform={item.transform}
   />
</Scene>
```

### Image Hotspot Marker

![image](https://user-images.githubusercontent.com/8204364/139122331-74d0b7a1-841b-4ab2-b898-c98d67de58c1.png)

```jsx
<Scene >
   <Hotspot
       key={item._id}
       type='image_hotspot'
       collider_transform={item.collider_transform}
       transform={item.transform}
       scale={item.scale}
       renderOrder={item.renderOrder}
       imageURL='http://abc.com/bgImage.jpg'
   />
</Scene>
```
