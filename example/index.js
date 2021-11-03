import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Scene from "../src";
import './exampleStyles.scss';




const Page=()=>{
    const [sceneId, setSceneId]=useState(1);


    const scenes=[
        {
                isFlatScene: true,
                backgroundUrl: 'https://cdn.obsess-vr.com/obsess-cms-dev/clients/Mary_Kay/601c753bc1b4f781a3d1ec85/images/flat/mk-entrance-oct8.jpg'
        },
        {
                isFlatScene: false,
                backgroundUrl: 'https://cdn.obsess-vr.com/obsess-cms-dev/clients/Mary_Kay/601c753bc1b4f781a3d1ec85/scenes/5f5150fb1f2c164d4c0ac1b1/images/cube_map/'
        },
        {
                isFlatScene: false,
                backgroundUrl: 'https://cdn.obsess-vr.com/obsess-cms-dev/clients/Mary_Kay/601c753bc1b4f781a3d1ec85/scenes/5f5948292ea4e05c69283ced/images/cube_map/'
        }
    ]

    const bgConf = scenes[sceneId-1];

    console.log('-Page',{sceneId, bgConf});

    return(<div>
        <h2>ThreeJS Scene</h2>
        <SceneSelector
            sceneId={sceneId}
            setSceneId={setSceneId}
        />
        <Scene
            sceneId={sceneId}
            bgConf={bgConf}
            useDebugger={true}
        />
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