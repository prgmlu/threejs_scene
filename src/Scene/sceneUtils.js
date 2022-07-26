import * as THREE from 'three';

export const LOD_TO_GRID_SEGMENTS_MAP = Object.freeze({
	0: 1,
	1: 2,
	2: 4,
	3: 8,
});

export const LOD_TO_RESOLUTION = Object.freeze({
	0: '512',
	1: '1k',
	2: '2k',
	3: '4k',
});

export const buildLODUrls = (
	baseUrl,
	face,
	LOD,
	imageIntegrity,
	useWebp = false,
) => {
	if (!baseUrl) return null;

	const loadOrder = [];
	const iterations = LOD_TO_GRID_SEGMENTS_MAP[LOD];
	const resolution = LOD_TO_RESOLUTION[LOD];

	for (let i = iterations - 1; i >= 0; i -= 1) {
		for (let j = 0; j < iterations; j += 1) {
			const imageName = `${baseUrl}${resolution}_${face}_${i}_${j}.${
				useWebp ? 'webp' : 'jpg'
			}?v=${imageIntegrity}`;
			loadOrder.push(imageName);
		}
	}
	return loadOrder;
};

export const preLoadConnectedScenes = (linkedScenes) => {
	const imageLoader = new THREE.ImageLoader();
	linkedScenes.forEach((item) => {
		buildLODUrls(
			item?.cube_map_dir,
			'front',
			1,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'front',
			2,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'left',
			1,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'left',
			2,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'right',
			1,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'right',
			2,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'top',
			1,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'bottom',
			2,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
		buildLODUrls(
			item?.cube_map_dir,
			'back',
			1,
			item?.imageIntegrity,
			item?.useWebp,
		).map((item) => imageLoader.load(item));
	});
};
