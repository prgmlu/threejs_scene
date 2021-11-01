import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeController from '../three-controls/ThreeController';
import { setupRenderer, setupCamera } from './setupThreeEditor';
import { threeEditorMouseEvents } from './threeEditorMouseEvents';
import { Background, ColliderSphere } from '../three-background';
import './main.scss';




const Scene = (props) => {
    const { sceneId, allowEventsForMarkerTypeOnly, bgConf, children } = props;
    const [threeReady, setThreeReady] = useState(false);
    const [maxRenderOrder, setMaxRenderOrderAction] = useState(1);
    const [UI, setUI] = useState();

    //Scene
    const sceneRef = useRef(new THREE.Scene());
    const scene = sceneRef.current;

    //Renderer
    const rendererRef = useRef(new THREE.WebGLRenderer());
    let renderer = rendererRef.current;
    const glContext = renderer?.domElement.getContext('webgl');
    const loseExtension = glContext.getExtension("WEBGL_lose_context");

    // useRef used to prevent Scene from losing variable references.
    const canvasRef = useRef();
    const cameraRef = useRef();
    const controlsRef = useRef();
    const clock = new THREE.Clock();
    sceneRef.current.setUI = setUI;

    const setMaxRenderOrder = (renderOrder) => {
        if (renderOrder >= maxRenderOrder) setMaxRenderOrderAction(renderOrder + 1);
    };





    //1. Mount camera & setup renderer only once!!!
    useEffect(() => {
        const canvas = canvasRef.current;
        const aspectRatio = canvas.offsetWidth / canvas.offsetHeight;
        cameraRef.current = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);

        setupRenderer(rendererRef.current, canvas);
        scene.add(cameraRef.current);

        const handleContextLoss=(e)=>{
            e.preventDefault();
            setTimeout((e) => {
                console.log('restoring context...');
                loseExtension?.restoreContext();
                renderer.clear();
            }, 50);
        }

        const handleContextRestore=()=>{
            console.log('Context restored');
            setupRenderer(rendererRef.current, canvas);
            scene.add(cameraRef.current);
        }

        renderer.domElement.addEventListener('webglcontextlost', handleContextLoss );
        renderer.domElement.addEventListener('webglcontextrestored', handleContextRestore);

        return ()=>{
            renderer.domElement.removeEventListener('webglcontextlost', handleContextLoss);
            renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestore);
            renderer.dispose();
            // renderer.forceContextLoss();//test
            //cameraRef.current.dispose();
        }
    }, []);



    //New Scene INIT
    useEffect(() => {
        const aspectRatio = canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;

        // set new reference for cameraRef.current here
        cameraRef.current = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);
        controlsRef.current = ThreeController.setupControls(cameraRef.current, renderer);

        const animate = (controllerUpdate) => {
            requestAnimationFrame(() => animate(controllerUpdate));
            renderer.render(scene, cameraRef.current);

            if (controllerUpdate) controllerUpdate();
        };

        setupCamera(aspectRatio, cameraRef.current);


        clock.start();
        animate(controlsRef.current.update);
        setThreeReady(true);

        return () => {
            controlsRef.current.dispose();
            scene.dispose();
            setUI(false); //Hide UI Modal when scene changed
        };
    }, [sceneId, cameraRef, controlsRef ]);


    //Events
    useEffect(() => {
        const canvasContainer = canvasRef.current;

        // mouse event listeners
        const { addThreeEditorMouseEventListeners, removeThreeEditorMouseEventListeners } = threeEditorMouseEvents(
            sceneRef,
            renderer,
            controlsRef,
            cameraRef,
            canvasContainer,
            allowEventsForMarkerTypeOnly,
            props.onMouseDown,
            props.onMouseUp,
            props.onMouseMove
        );

        addThreeEditorMouseEventListeners();

        return () => {
            removeThreeEditorMouseEventListeners();
        };
    }, [sceneId, sceneRef, cameraRef, allowEventsForMarkerTypeOnly]); // eslint-disable-line





    //windowResizer placed separately because it requires to track and call UI & setUI
    //while at same time we DO NOT WANT to remount all events each time when UI changed
    //reminder: UI changed on each on scene click
    useEffect(() => {
        const windowResizeHandler = () => {
            const canvasContainer = canvasRef.current;
            const width = canvasContainer.offsetWidth;
            const height = canvasContainer.offsetHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            renderer.setSize(width, height);

            if (UI) setUI(false); //destroy UI
        };

        window.addEventListener('resize', windowResizeHandler);
        return ()=>{
            window.removeEventListener('resize', windowResizeHandler);
        }
    },[UI]);





    const onDropEvent=(e)=>{
        e.preventDefault();

        // Set Position to in front of camera
        const position = new THREE.Vector3(0, 0, -10);
        position.applyQuaternion(cameraRef.current.quaternion);
        sceneRef.current.userData.clickData={e, point:position};
        setMaxRenderOrder(maxRenderOrder);

        if(props.onDrop) props.onDrop(e, position, maxRenderOrder);
    }




    return (<>
        {/*{true && <DebugUI renderer={rendererRef.current} scene={sceneRef.current} glContext={glContext}/>}*/}
            <div
                id="canvas-wrapper"
                className={'canvas-wrapper'}
                ref={canvasRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDropEvent}
            >
                {/*{threeReady && children}*/}
                {threeReady && React.Children.map(children, child => React.cloneElement(child, {sceneRef, setMaxRenderOrder}))}

                {threeReady && (
                    <>
                        <ColliderSphere scene={scene} />
                        <Background bgConf={bgConf} scene={scene} />
                    </>
                )}

                <div id="canvasUI" className={`canvasUI ${UI ? 'active' : ''}`} style={UI?.style}>
                    {UI && <UI.Component {...UI?.props} sceneRef={sceneRef} />}
                </div>
            </div>
    </>);
};


/**
 * DebugUI - could be used to see memory usage and other interesting things :)
 */
const DebugUI=({renderer, glContext, scene})=>{
    //Never use it on prod
    if(window.location.hostname !== "127.0.0.1") return false;

    // Note: WebGLRenderer.forceContextLoss() and WebGLRenderer.forceContextRestore()
    // are used to simulate a context loss and restore based on the WebGL extension WEBGL_lose_context.
    // If you have a real context loss, the mentioned events should be triggered automatically.
    const ext = glContext.getExtension('WEBGL_lose_context');

    // console.log('%c ------- DEBUG ------- ', 'color:green', {
    //     renderer,
    //     glContext,
    //     debug: renderer.debug,
    //     info: renderer.info,
    //     ext
    // });

    const restore=(e)=>{
        ext.restoreContext();
        renderer.forceContextRestore()
    }

    const {info} = renderer;
    const cap = Object.entries(renderer.capabilities).reduce((acc, [k,v])=>{
        return ['isWebGL2', 'maxCubemapSize','maxTextures','maxTextureSize'].includes(k) ?  {...acc, [k]: v} : acc;
    },{});

    const Tr=({label, data, style={}})=>(<tr style={style}>
        <td>{label}:</td>
        <td>{ data }</td>
    </tr>);

    return(<div style={{display:'block', width:'100%', margin: '3em 0 0em', fontSize:'12px', border:'1px dashed', padding:'1em', wordBreak: 'break-word'}}>
        <table >
            <tbody>
                <Tr label='Scene' data={JSON.stringify({children: scene.children.length}) } style={{minWidth:'10em'}}/>
                <Tr label='Memory' data={JSON.stringify(info.memory)}/>
                <Tr label='Render' data={JSON.stringify(info.render)}/>
                <Tr label='Capabilities' data={JSON.stringify(cap)}/>
                <Tr label='force Context Loss' data={(<button style={{backgroundColor: '#CB203FBC', color:'#fff', border: 'none' }}  onClick={e=>renderer.forceContextLoss()}>Call</button>)}/>
                <Tr label='force Context Restore' data={(<button style={{backgroundColor: '#85f141bd', color:'#fff', border: 'none' }} onClick={restore}>Call</button>)}/>
            </tbody>
        </table>
    </div>)
}

export default Scene;
