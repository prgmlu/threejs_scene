import * as THREE from 'three';
const imageLoader = new THREE.ImageLoader();

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
	const levelsToPreLoad = [1];
	levelsToPreLoad.forEach((level) => {
		linkedScenes.forEach((item) => {
			buildLODUrls(
				item?.cube_map_dir,
				'front',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));
			buildLODUrls(
				item?.cube_map_dir,
				'left',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));
			buildLODUrls(
				item?.cube_map_dir,
				'right',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));

			buildLODUrls(
				item?.cube_map_dir,
				'top',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));

			buildLODUrls(
				item?.cube_map_dir,
				'bottom',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));

			buildLODUrls(
				item?.cube_map_dir,
				'back',
				level,
				item?.imageIntegrity,
				item?.useWebp,
			).map((item) => imageLoader.load(item));
		});
	});
};
