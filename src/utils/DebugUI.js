import React from 'react';
import { GUI } from 'dat.gui';

/**
 * DebugUI - could be used to see memory usage and other interesting things :)
 */
export default function DebugUI({ renderer, glContext, scene }) {
	//Never use it on prod
	if (
		!['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.187'].includes(
			window.location.hostname,
		)
	)
		return false;

	// Note: WebGLRenderer.forceContextLoss() and WebGLRenderer.forceContextRestore()
	// are used to simulate a context loss and restore based on the WebGL extension WEBGL_lose_context.
	// If you have a real context loss, the mentioned events should be triggered automatically.
	const ext = glContext.getExtension('WEBGL_lose_context');
	const supportedExt = glContext.getSupportedExtensions();

	const restore = (e) => {
		ext.restoreContext();
		renderer.forceContextRestore();
	};

	const { info } = renderer;
	const cap = Object.entries(renderer.capabilities).reduce((acc, [k, v]) => {
		return [
			'isWebGL2',
			'maxCubemapSize',
			'maxTextures',
			'maxTextureSize',
		].includes(k)
			? { ...acc, [k]: v }
			: acc;
	}, {});

	const Tr = ({ label, data, style = {} }) => (
		<tr style={style}>
			<td>{label}:</td>
			<td>{data}</td>
		</tr>
	);

	console.log('%c >DebugUI', 'color:blue', { renderer, info, scene });
	console.table(info.memory);

	return (
		<div
			style={{
				display: 'block',
				width: '100%',
				fontSize: '12px',
				border: '1px dashed',
				padding: '1em',
				wordBreak: 'break-word',
			}}
		>
			<table>
				<tbody>
					<Tr
						label="Scene"
						data={JSON.stringify({
							children: scene.children.length,
						})}
						style={{ minWidth: '10em' }}
					/>
					<Tr label="Memory" data={JSON.stringify(info.memory)} />
					<Tr label="Render" data={JSON.stringify(info.render)} />
					<Tr label="Capabilities" data={JSON.stringify(cap)} />
					<Tr
						label="force Context Loss"
						data={
							<button
								style={{
									backgroundColor: '#CB203FBC',
									color: '#fff',
									border: 'none',
								}}
								onClick={(e) => renderer.forceContextLoss()}
							>
								Call
							</button>
						}
					/>
					<Tr
						label="force Context Restore"
						data={
							<button
								style={{
									backgroundColor: '#85f141bd',
									color: '#fff',
									border: 'none',
								}}
								onClick={restore}
							>
								Call
							</button>
						}
					/>
				</tbody>
			</table>
		</div>
	);
}

const createDatGui = function (obj, folderName) {
	if (!window.DATGUI_DEFINED) {
		var guiDiv = document.createElement('div');
		guiDiv.style.zIndex = 99;
		guiDiv.style.position = 'fixed';
		guiDiv.style.top = '0px';
		var bod = document.getElementsByTagName('body')[0];
		bod.appendChild(guiDiv);
		const gui = new GUI({ autoPlace: false });
		window.gui = gui;
		guiDiv.appendChild(gui.domElement);
		window.DATGUI_DEFINED = true;
	}
	const folder = window.gui.addFolder(folderName);

	folder.add(obj.rotation, 'x').name('rotation x').min(-7).max(7).step(0.001);
	folder.add(obj.rotation, 'y').name('rotation y').min(-7).max(7).step(0.001);
	folder.add(obj.rotation, 'z').name('rotation z').min(-7).max(7).step(0.001);

	folder.add(obj.scale, 'x').name('scale x').min(-10).max(10).step(0.001);
	folder.add(obj.scale, 'y').name('scale y').min(-10).max(10).step(0.001);
	folder.add(obj.scale, 'z').name('scale z').min(-10).max(10).step(0.001);

	folder
		.add(obj.position, 'x')
		.name('position x')
		.min(-20)
		.max(20)
		.step(0.001);
	folder
		.add(obj.position, 'y')
		.name('position y')
		.min(-20)
		.max(20)
		.step(0.001);
	folder
		.add(obj.position, 'z')
		.name('position z')
		.min(-20)
		.max(20)
		.step(0.001);

	folder.open();
};
