import { ImageMarker } from '../Hotspot/_constructors';

export const renderImageHotspotRecord = (data, sceneRef, setMaxRenderOrder) => {
    const marker = new ImageMarker(data);
    marker.addToScene(sceneRef.current);

    if (data.renderOrder) setMaxRenderOrder(data.renderOrder);

    return marker;
};

export const createAndRenderImageHotspot = (props, sceneRef, point) => {
    //1. Create Image Marker
    const marker = new ImageMarker({
        imageURL: props.imageURL,
        renderOrder: props.renderOrder,
        scale: props.scale,
        userData: props.userData,
        UIConfig: props.UIConfig,
    });

    //2. Render Marker
    marker.addToScene(sceneRef.current);

    //3. Set Position
    marker.setPosition(point.x, point.y, point.z);
    marker.lookAt();
    // marker.setUserData({imageId});

    //4. Get Transform data
    // const transforms = marker.getTransforms();
    // await sleep(1000); //Important!!! Do not delete sleep method from here!!!!!

    //7. Update marker.userData value
    // marker.setUserData(record);
    marker.onClick();
    return marker;
};

// export const addImageHotspotOnDrop = async (e, position, storeId, currentSceneId, cameraRef, folderId, products, maxRenderOrder, scene, setMaxRenderOrder, reduxDispatch) => {
// e.preventDefault();
// const imageId = e.dataTransfer.getData('id');
// const image = products[folderId].find((item) => item._id === imageId);
// const renderOrder = maxRenderOrder;
// const scale = 1;
//
// setMaxRenderOrder(renderOrder);

// //1. Create Image Marker
// const marker = new ImageMarker({
//     imageURL:formURL(image.image),
//     renderOrder,
//     scale,
//     userData: {},
//     UIConfig:{
//         Component:ImageMarkerUIForm,
//         style:{left:0, top:'3em', background:'none'}
//     }
// });
//
// //2. Render Marker
// marker.addToScene(scene);
//
// //3. Set Position
// marker.setPosition(position.x, position.y, position.z);
// marker.lookAt();
// marker.setUserData({imageId});
//
// //4. Get Transform data
// const transforms = marker.getTransforms();
// await sleep(1000); //Important!!! Do not delete sleep method from here!!!!!
//
//
// //6. Create Hotspot record
// const HOTSPOT_TYPE = 'product_image';
// const record = await  apiCreateHotspotByType(HOTSPOT_TYPE, storeId, currentSceneId, {
//     type: 'HotspotMarker',
//     scene: currentSceneId,
//     collider_transform: transforms.colliderTransform.elements,
//     transform: transforms.visualTransform.elements,
//     props: {
//         show_icon: true, //Where it used?
//         renderOrder: renderOrder,
//         scale: scale,
//         hotspot_type: HOTSPOT_TYPE,
//         image: imageId,
//     },
// });
//
// //7. Update marker.userData value
// marker.setUserData(record);
// marker.onClick();
// };
