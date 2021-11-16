import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Scene, {Hotspot} from "../src";
import './exampleStyles.scss';
import scenes from './mock.json';


const HotspotInfo=({Marker, Modal})=>{
    return(<div style={{padding:'1em'}}>
        <div onClick={e=>Modal.closeModal()} style={{position:'absolute', right:0, top:0}} >x</div>
        {Marker?.userData?.name || 'Hotspot'}
    </div>)
}

const Page=()=>{
    const [sceneId, setSceneId]=useState(1);
    const [sceneData, setSceneData] = useState(scenes[sceneId-1]);

    const uiConf ={
        Component: HotspotInfo,
        positionNextToTheElement:true,
    };


    const onMouseUp=(e, sceneObject, marker, isDragEvent)=>{
        // console.log('-onMouseUp',{e, sceneObject, marker, isDragEvent});
        //Open marker UI
        if (marker && marker?.sceneObject) marker.onClick(e);
        else{
            if(!isDragEvent){
                const newData = {...sceneData};
                newData.hotspots.push({
                    type:'hotspot',
                    userData:{},
                })

                setSceneData(newData);

            }
        }
    }


    return(<div>
        <h2>ThreeJS Scene</h2>


        <SceneSelector
            sceneId={sceneId}
            setSceneId={setSceneId}
        />


        <Scene
            sceneId={sceneId}
            bgConf={sceneData.bg}
            onMouseUp={onMouseUp}
            useDebugger={true}
            // allowHotspotsToMove={false}
        >
            {sceneData?.hotspots?.map((item, i)=>{
                return <Hotspot
                    key={i}
                    type={item.type}
                    collider_transform={item.collider_transform}
                    transform={item.transform}
                    iconConfig={item.iconConfig}
                    imageURL={item.imageURL}
                    userData={item.userData}
                    UIConfig={uiConf}
                />
            })}


        </Scene>
    </div>)
}




const SceneSelector=({sceneId, setSceneId})=>{
    return(<ul className='sceneSelector'>
        <li className={sceneId==1 ? 'active':''} onClick={e=>setSceneId(1)}>Scene #1</li>
        <li className={sceneId==2 ? 'active':''} onClick={e=>setSceneId(2)}>Scene #2</li>
        <li className={sceneId==3 ? 'active':''} onClick={e=>setSceneId(3)}>Scene #3</li>
    </ul>);
}


ReactDOM.render(
    <Page/>,
    document.getElementById('sceneRoot')
);