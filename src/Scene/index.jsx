import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ThreeController from '../three-controls/ThreeController';
import { setupRenderer, setupCamera } from './setupThreeEditor';
import { threeEditorMouseEvents } from './threeEditorMouseEvents';
import { Background, ColliderSphere } from '../three-background';
import {renderHotspotRecord, renderImageHotspotRecord} from '../utils';
import styles from './ThreeEditor.module.scss';




const ThreeEditor = (props) => {
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

    // Stringify children keys to prevent re-rendering
    const childrenIds = React.Children.map(children, child =>child.key).filter((v) => v !== null).join('__');

    // useRef used to prevent ThreeEditor from losing variable references.
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
        return ()=>{
            renderer.dispose();
            // renderer.forceContextLoss();//test
            //cameraRef.current.dispose();
        }
    }, []);



    //New Scene INIT
    useEffect(() => {
        // console.log('%c- New Scene INIT 2', 'color:green', { cameraRef, controlsRef, rendererRef });
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


    //Scene Children
    useEffect(() => {
        console.log('%c- INIT Scene children', 'color:green', { children, sChildren: scene.children, sceneRef });
        const removeSceneHotspots = () => {
            let total = 0;
            let idx = 0;
            while (scene.children.some((item) => ['visualObject', 'marker'].includes(item.name))) {
                // console.log('-loop start',  );
                const collider = scene.children[idx];
                if (['visualObject', 'marker'].includes(collider.name)) {
                    if (collider.dispose) collider.dispose();
                    // collider.owner.dispose();
                    sceneRef.current.remove(scene.children[idx]);
                    total++;
                } else {
                    // console.log('-loop continue', {sChildren:scene.children});
                    idx++;
                }
            }
            console.log(`__TOTAL removed:${total}`, { sCHildr: JSON.parse(JSON.stringify(scene.children)) });
        };

        const loadSceneObjects = () => {
            let total = 0;
            React.Children.map(children, item =>{
                const { type } = item.props;

                if (type == 'hotspot') {
                    renderHotspotRecord(item.props, sceneRef);
                    total++;
                } else if (type == 'image_hotspot') {
                    renderImageHotspotRecord(item.props, sceneRef, setMaxRenderOrder);
                    total++;
                }
            })
            // console.log('__TOTAL loaded:', total);
        };

        removeSceneHotspots(); //Remove Scene colliders/objects ( markers elements)
        loadSceneObjects(); //Load New Scene Objects

        return () => {
            console.log('%c- INIT Children __cleanup', 'color:red', { children, scene: sceneRef.current });
        };
        // string of children keys used to prevent re-rendering,
        // Dont forget to always use unique component key
    }, [childrenIds]);

    return (
        <div
            id="canvas-wrapper"
            className={styles['canvas-wrapper']}
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => props.onDrop(e, cameraRef, maxRenderOrder, scene, setMaxRenderOrder)}
        >
            {/*{threeReady && children}*/}
            {threeReady && (
                <>
                    <ColliderSphere scene={scene} />
                    <Background bgConf={bgConf} scene={scene} />
                </>
            )}

            <div id="canvasUI" className={`${styles['canvasUI']} ${UI ? styles['active'] : ''}`} style={UI?.style}>
                {UI && <UI.Component {...UI?.props} sceneRef={sceneRef} />}
            </div>
        </div>
    );
};

export default ThreeEditor;
