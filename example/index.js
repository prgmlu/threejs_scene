import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Scene, {Hotspot} from "../src";
import './exampleStyles.scss';
import scenes from './mock.json';



const Page=()=>{
    const [sceneId, setSceneId]=useState(1);
    const sceneData = scenes[sceneId-1];

    return(<div>
        <h2>ThreeJS Scene</h2>
        <SceneSelector
            sceneId={sceneId}
            setSceneId={setSceneId}
        />
        <Scene
            sceneId={sceneId}
            bgConf={sceneData.bg}
            useDebugger={true}
            allowHotspotsToMove={false}
        >
            {sceneData?.hotspots?.map((item, i)=>{
                return <Hotspot
                    key={i}
                    type={item.type}
                    collider_transform={item.collider_transform}
                    transform={item.transform}
                    iconConfig={item.iconConfig}
                    imageURL={item.imageURL}
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