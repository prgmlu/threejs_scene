# ThreeJS Scene Component

## Installation
```
npm i -S git+ssh://git@gitlab.com:ObsessVR/npm-modules/threejs-scene.git


//Or from specific branch
npm i -S git+ssh://git@gitlab.com:ObsessVR/npm-modules/threejs-scene.git#develop

//Or from specific tag
npm i -S git+ssh://git@gitlab.com:ObsessVR/npm-modules/threejs-scene.git#v1.0.4
```

## Usage

```javascript
//In _app.js load library styles  
import 'threejs-scene/lib/main.css';

//Import Library
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
![image](https://user-images.githubusercontent.com/8204364/140197179-2d5e0772-65f8-411a-8d46-5661855c6729.png)

```jsx
<Scene >
   <Hotspot
       key={item._id}
       type='hotspot'
       collider_transform={item.collider_transform}
       transform={item.transform}
       
       //Icon customization props
       imageURL='http://abc.com/image.svg' //provide custom svg icon
       iconConfig={{dotColor:'green'}}
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


## Hotspot UI/Modals (optional)
Hotspot onClick event will show UI if any provided.  
Add `UIConfig` property to configure hotspot UI.

- Component (required): attach any custom component to render
- style (optional): overwrite Scene ui element styles  
- positionNextToTheElement (optional): render UI next to the click position 

```jsx
<Scene >
   <Hotspot
       ...
       UIConfig={{
            Component:HotspotMarkerUIForm,
            style:{left:'0', top:'3em', background:'none'},
            positionNextToTheElement:true,
        }}
   />
</Scene>
```
![image](https://user-images.githubusercontent.com/8204364/140211013-ee046cc2-c25d-4327-ad39-d2f52efacaa8.png)
