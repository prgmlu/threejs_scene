export const threeEditorKeyboardEvents = (
    controlsRef,
    dispatch,
    allReduxStoreData,
) => {
    const onArrowKeysForSceneRotation = (e) => {
        if (e.shiftKey === false) return;

        e.stopPropagation();
        let needsUpdate = false;

        switch(e.key) {
            case 'ArrowUp':
                controlsRef.current.rotateUp(0.2)
                needsUpdate = true;
                break;
            case 'ArrowDown':
                controlsRef.current.rotateUp(-0.2)
                needsUpdate = true;
                break;
            case 'ArrowLeft':
                controlsRef.current.rotateLeft(0.2)
                needsUpdate = true;
                break;
            case 'ArrowRight':
                controlsRef.current.rotateLeft(-0.2)
                needsUpdate = true;
                break;
            default:
                return;
        }

        if (needsUpdate) {
            e.preventDefault;
            controlsRef.current.update();
        }
    }

    const onArrowKeysToHighlightNavMarker = (e) => {
        if (e.altKey === false) return;

        e.preventDefault();
        switch(e.key) {
            case 'ArrowLeft':
                dispatch(allReduxStoreData?.accessibility?.handleLeftArrowKeyAccessibilityNavIdx())
                break;
            case 'ArrowRight':
                dispatch(allReduxStoreData?.accessibility?.handleRightArrowKeyAccessibilityNavIdx())
                break;
            default:
                return;
        }
    }

    const addThreeEditorKeyboardEvents = () => {
        document.addEventListener('keydown', onArrowKeysForSceneRotation);
        document.addEventListener('keyup', onArrowKeysToHighlightNavMarker);
    };

    const removeThreeEditorKeyboardEvents = () => {
        document.removeEventListener('keydown', onArrowKeysForSceneRotation);
        document.removeEventListener('keyup', onArrowKeysToHighlightNavMarker);
    };

    return {
        addThreeEditorKeyboardEvents,
        removeThreeEditorKeyboardEvents,
    };
};
