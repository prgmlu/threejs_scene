export const threeEditorKeyboardEvents = (
	controlsRef,
) => {
	const onArrowKeysForSceneRotation = (e) => {
		if (e.shiftKey === false) return;

		e.stopPropagation();
		let needsUpdate = false;

		switch (e.key) {
			case 'ArrowUp':
				controlsRef.current.rotateUp(0.2);
				needsUpdate = true;
				break;
			case 'ArrowDown':
				controlsRef.current.rotateUp(-0.2);
				needsUpdate = true;
				break;
			case 'ArrowLeft':
				controlsRef.current.rotateLeft(0.2);
				needsUpdate = true;
				break;
			case 'ArrowRight':
				controlsRef.current.rotateLeft(-0.2);
				needsUpdate = true;
				break;
			default:
				return;
		}

		if (needsUpdate) {
			controlsRef.current.update();
		}
	};


	const addThreeEditorKeyboardEvents = () => {
		document.addEventListener('keydown', onArrowKeysForSceneRotation);
	};

	const removeThreeEditorKeyboardEvents = () => {
		document.removeEventListener('keydown', onArrowKeysForSceneRotation);
	};

	return {
		addThreeEditorKeyboardEvents,
		removeThreeEditorKeyboardEvents,
	};
};
