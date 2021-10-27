import {ImageMarker} from "../three-base-components/Markers";

export const renderImageHotspotRecord = (data, sceneRef, setMaxRenderOrder) => {
    // console.log('-render: image HP', {data });
    const marker = new ImageMarker({
        imageURL:data.imageURL,
        renderOrder: data.renderOrder,
        scale: data.scale,
        collider_transform: data.collider_transform,
        transform: data.transform,
        userData: data.userData,
        UIConfig:data.UIConfig
        // UIConfig:{
        //     Component:ImageMarkerUIForm,
        //     style:{left:'0', top:'3em', background:'none'}
        // },
    });

    marker.addToScene(sceneRef.current);

    if (data.renderOrder) setMaxRenderOrder(data.renderOrder);

    return marker;
};