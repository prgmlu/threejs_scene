export const threeEditorKeyboardEvents = (
    controlsRef,
    dispatch,
    allData,
) => {
    const onShiftPressed = (e) => {
        e.preventDefault;
        if (e.key === 'Shift') {
            dispatch(allData.accessibility.setIsShiftKeyPressed(true))
        }
    }
    
    const onShiftReleased = (e) => {
        e.preventDefault;
        if (e.key === 'Shift') {
            dispatch(allData.accessibility.setIsShiftKeyPressed(false))
        }
    }

    const handleKeyDown = (e) => {
        if (!allData?.accessibility?.isShiftKeyPressed) return;

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

    const addThreeEditorKeyboardEvents = () => {
        document.addEventListener('keydown', onShiftPressed);
        document.addEventListener('keyup', onShiftReleased);
        document.addEventListener('keydown', handleKeyDown);
    };

    const removeThreeEditorKeyboardEvents = () => {
        document.removeEventListener('keydown', onShiftPressed)
        document.removeEventListener('keyup', onShiftReleased);
        document.removeEventListener('keydown', handleKeyDown);
    };

    return {
        addThreeEditorKeyboardEvents,
        removeThreeEditorKeyboardEvents,
    };
};
