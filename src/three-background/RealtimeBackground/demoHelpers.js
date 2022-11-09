export const adjustHotspots = (scene) => {

    scene.children.forEach((i) => {
        if (i.material) {
            try {
                // i.material.color.set('red'); i.material.transparent=true; i.material.opacity=.5
            }
            catch {
                null;
            }

        }
    })


    let keep = [];

    let hotspots = scene.children.filter((i) => { return i.name == 'visualObject' });
    keep = hotspots.slice(0, 5);

    let imgHotspotCollider = scene.children.filter((i) => (i.position.x > 2.1 && i.position.x < 2.2) && (i.position.y > -1.34) && (i.position.y < -1.33))[0];
    keep.push(imgHotspotCollider);
    scene.children.filter((i) => { return i.name == 'marker' || i.name == 'visualObject' }).filter((i) => { return i.position.y < 0 }).forEach((i, counter) => {

        // i.visible=false;
        if (!keep.includes(i)) {
            scene.remove(i);
        }
    }
    )
    scene.children.filter((i) => { return i.name == 'marker' || i.name == 'visualObject' }).filter((i) => { return i.position.y > .4 && i.position.y < .46 }).forEach((i) => {
        i.visible = false
        if (!keep.includes(i)) {
            scene.remove(i);
        }
        scene.remove(i);
    }
    )


    //places hotspots on each screen on model
    // let p1 = {
    //     "x": -5.56657119791007,
    //     "y": 3.7894894046744367 - STORE_Y_OFFSET,
    //     "z": -15.51534531884996
    // };
    // // let p1 = {
    // //     "x": -16.785934164911918,
    // //     "y": 5.6425801124847075 - STORE_Y_OFFSET,
    // //     "z": -83.36578334635435
    // // };

    // let p2 = {
    //     "x": 4.7606882099595484,
    //     "y": 4.150883711860357 - STORE_Y_OFFSET,
    //     "z": -33.04735738044753
    // };

    // let p3 = {
    //     "x": -7.150272793757341,
    //     "y": 3.5322949254596274 - STORE_Y_OFFSET,
    //     "z": -48.36916063882032
    // };

    // let p4 = {
    //     "x": -0.7399595117439449,
    //     "y": 0.8593903398853591 - STORE_Y_OFFSET,
    //     "z": 1.4681797967616268
    // };

    // let p5 = {
    //     "x": 4.638044328136257,
    //     "y": 1.4693053604289863 - STORE_Y_OFFSET,
    //     "z": -1.3084047785031137
    // };

    let p1 = {
        "x": -16.785934164911918,
        "y": 5.6425801124847075 - STORE_Y_OFFSET,
        "z": -83.36578334635435
    };

    let p2 = {
        "x": -5.637201390871835,
        "y": 3.459358627466774 - STORE_Y_OFFSET,
        "z": -15.496365175432201 +.25
    };

    let p3 = {
        "x": 2.3190075711822984,
        "y": -3.3395727798587025 - 2.5,
        "z": -2.6079405506375197
    };

    let p4 = {
        "x": 3.745760587020106,
        "y": -3.247059092703031 - 2.5,
        "z": 2.4947902359627814
    };

    let p5 = {
        "x": 3.674265287951267,
        "y": -5.088030871259041 - 2.5,
        "z": 3.546999497832575
    };


    let textureLoader = new THREE.ImageBitmapLoader();
    let texture = null;
    textureLoader.load("https://cdn.obsess-vr.com/play-hotspot.png", (imageBitmap) => {
        texture = new THREE.CanvasTexture(imageBitmap);
        // hair.material.map = texture;
        // hair.material.needsUpdate = true
    });


    window.interval = setInterval(() => {
        try {
            if (!window.positionSet) {

                console.log('trying')
                let objs = scene.children.filter((i) => { return (!keep.includes(i)) && (i.name == 'marker' || i.name == 'visualObject') });
                objs[4] = imgHotspotCollider;

                objs[0].position.set(p1.x, p1.y + STORE_Y_OFFSET, p1.z);
                objs[1].position.set(p2.x, p2.y + STORE_Y_OFFSET, p2.z);
                objs[2].position.set(p3.x, p3.y + STORE_Y_OFFSET, p3.z);
                objs[3].position.set(p4.x, p4.y + STORE_Y_OFFSET, p4.z);
                objs[4].position.set(p5.x, p5.y + STORE_Y_OFFSET, p5.z);

                keep[0].position.set(p1.x, p1.y + STORE_Y_OFFSET, p1.z);

                if (texture) {
                    keep[0].material.map = texture;
                    keep[0].material.needsUpdate = true;

                    keep[1].material.map = texture;
                    keep[1].material.needsUpdate = true;

                    keep[2].material.map = texture;
                    keep[2].material.needsUpdate = true;

                    keep[3].material.map = texture;
                    keep[3].material.needsUpdate = true;
                }

                keep[1].position.set(p2.x, p2.y + STORE_Y_OFFSET, p2.z);
                keep[2].position.set(p3.x, p3.y + STORE_Y_OFFSET, p3.z);
                keep[3].position.set(p4.x, p4.y + STORE_Y_OFFSET, p4.z);
                keep[4].position.set(p5.x, p5.y + STORE_Y_OFFSET, p5.z);

                window.keep = keep;

                getDistanceOfHotspots([p1, p2, p3, p4, p5], window.femaleModel, keep);
                window.positionSet = true;
                window.keep[0].scale.set(1,1,1)
                window.keep[1].scale.set(.5,.5,.5)
                // window.keep[2].scale.set(1,1,1)
                // window.keep[3].scale.set(1,1,1)

                window.keep.forEach((i) => {
                    i.material.color.set('#330D0D');
                });

                window.keep[1].material.color.set('white');
                
                window.keep.forEach((i) => {
                    i.material.depthTest = true;
                    i.material.needsUpdate = true;
                });

            }
        }
        catch (e) {
            null;
        }
    }, 1000)

}