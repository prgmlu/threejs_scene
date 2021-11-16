import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeController from '../three-controls/ThreeController';
import {initThreeJSScene, setupRenderer, setupCamera } from './setupThreeEditor';
import { threeEditorMouseEvents } from './threeEditorMouseEvents';
import { Background, ColliderSphere } from '../three-background';
import DebugUI from "../utils/DebugUI";
import './main.scss';




const Scene = (props) => {
    const { sceneId, allowEventsForMarkerTypeOnly, bgConf, useDebugger=false, allowHotspotsToMove, resetBGBeforeImageLoaded=false, children } = props;
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

    sceneRef.current.setUI = setUI;

    const setMaxRenderOrder = (renderOrder) => {
        if (renderOrder >= maxRenderOrder) setMaxRenderOrderAction(renderOrder + 1);
    };



    const animate = (controllerUpdate) => {
        requestAnimationFrame(() => animate(controllerUpdate));
        renderer.render(scene, cameraRef.current);

        if (controllerUpdate) controllerUpdate();
    };





    //1. Mount camera & setup renderer only once!!!
    useEffect(() => {
        console.log('%c >INIT:1 - initThreeJSScene', 'color:green', JSON.parse(JSON.stringify({rendererRef:rendererRef.current})));
        const canvas = canvasRef.current;
        initThreeJSScene(canvasRef, cameraRef, controlsRef, rendererRef, scene);
        setThreeReady(true);

        const handleContextLoss=(e)=>{
            console.log('%c Context lost. restoring context...','color:red;text-decoration:underline');

            e.preventDefault();
            setTimeout((e) => {
                console.log('%c Context lost. restoring context 2...','color:red;text-decoration:underline');

                //restoreContext() will ONLY simulate restoring of the context
                //run restore only if context lost, otherwise error will be thrown
               // if(!glContext) loseExtension?.restoreContext();
                loseExtension?.restoreContext();
                renderer.clear();
            }, 50);
        }


        const handleContextRestored=()=>{
            console.log('%c Context restored', 'color:green;text-decoration:underline');
            setupRenderer(rendererRef.current, canvas);
            scene.add(cameraRef.current);
        }

        renderer.domElement.addEventListener('webglcontextlost', handleContextLoss );
        renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

        return ()=>{
            console.log('%c >INIT:1 - unmounted','color:gray');
            renderer.domElement.removeEventListener('webglcontextlost', handleContextLoss);
            renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
            renderer.dispose();
            // renderer.forceContextLoss();//test
            //cameraRef.current.dispose();
        }
    }, []);



    const initSceneView=()=>{
        // set new reference for cameraRef.current here
        const aspectRatio = canvasRef.current.offsetWidth / canvasRef.current.offsetHeight;
        cameraRef.current = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 1000);
        controlsRef.current = ThreeController.setupControls(cameraRef.current, renderer);
        setupCamera(aspectRatio, cameraRef.current);

        animate(controlsRef.current.update);
    }


    //New Scene INIT
    useEffect(() => {
        console.log('%c >INIT:2 - sceneView', 'color:green' );
        initSceneView();

        return () => {
            controlsRef.current.dispose();
            scene.dispose();
            setUI(false); //Hide UI Modal when scene changed
        };
    }, [sceneId ]);


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
            allowHotspotsToMove,
            props.onMouseDown,
            props.onMouseUp,
            props.onMouseMove
        );

        addThreeEditorMouseEventListeners();

        return () => {
            removeThreeEditorMouseEventListeners();
        };
    }, [sceneId, sceneRef, cameraRef, allowEventsForMarkerTypeOnly, allowHotspotsToMove]); // eslint-disable-line





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
        {useDebugger && <DebugUI
            renderer={rendererRef.current}
            scene={sceneRef.current}
            glContext={glContext}
        />}

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
                        <Background
                            bgConf={bgConf}
                            scene={scene}
                            resetBGBeforeImageLoaded={resetBGBeforeImageLoaded}
                        />
                    </>
                )}

                <div id="canvasUI" className={`canvasUI ${UI ? 'active' : ''}`} style={UI?.style}>
                    {UI && <UI.Component {...UI?.props} sceneRef={sceneRef} />}
                </div>
            </div>
    </>);
};




export default Scene;
