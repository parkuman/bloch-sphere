<script lang="ts">
	import * as Threlte from '@threlte/core';
	import { Text } from '@threlte/extras';
	import * as Three from 'three';
	import * as Utils from 'three/src/math/MathUtils';
	import * as mathjs from 'mathjs';

	import ArrowGeometry from '../lib/components/ArrowGeometry.svelte';
	import { X, Y, Z, H, S, St, T, Tt } from '../lib/utils/gates';

	const gridHelper = new Three.GridHelper(5, 5);
	const axesHelper = new Three.AxesHelper(1.3);

	let phi = 0; // between 0 and 2pi
	let theta = 0; // between 0 and pi

	let showPhiTheta = true;

	let radius = 1; // radians
	let wSeg = 20,
		hSeg = 20;

	let camera: any;
	let cameraPos = { x: 5, y: 5, z: 5 };

	let probabilityAmplitude0 = mathjs.complex(1, 0) as any;
	let probabilityAmplitude1 = mathjs.complex(0, 0) as any;
	let inclinationRads = 0;
	let azimuthRads = 0;

	function setCameraPos() {
		cameraPos = camera.position;
	}

	function applyGate(gate: math.Matrix) {
		const currentState = mathjs.matrix([[probabilityAmplitude0], [probabilityAmplitude1]]);
		const newQuantumState = mathjs.multiply(gate, currentState);
		console.log('gate: ', gate);
		console.log('currentState: ', currentState);
		console.log('newQuantumState: ', newQuantumState);

		probabilityAmplitude0 = mathjs.subset(newQuantumState, mathjs.index(0, 0));
		probabilityAmplitude1 = mathjs.subset(newQuantumState, mathjs.index(1, 0));
		console.log('probabilityAmplitude0: ', probabilityAmplitude0);
		console.log('probabilityAmplitude1: ', probabilityAmplitude1);

		// solve for inverse of cos(theta/2)
		inclinationRads = 2 * mathjs.acos(mathjs.abs(probabilityAmplitude0));
		azimuthRads =
			(probabilityAmplitude1.toPolar().phi - probabilityAmplitude0.toPolar().phi + Math.PI * 2) %
			(Math.PI * 2);

		console.log('inclinationRads: ', inclinationRads);
		console.log('azimuthRads: ', azimuthRads);
	}
</script>

<div class="control-panel-1">
	<label for="showPhiTheta">Show Phi and Theta</label>
	<input type="checkbox" bind:checked={showPhiTheta} />

	<label for="phi">phi</label>
	<input
		type="range"
		min="0"
		max={2 * Math.PI}
		step="0.01"
		bind:value={phi}
		class="slider"
		id="phi"
	/>
	<p>{phi} rad</p>

	<label for="theta">theta</label>
	<input
		type="range"
		min="0"
		max={Math.PI}
		step="0.01"
		bind:value={theta}
		class="slider"
		id="theta"
	/>
	<p>{theta} rad</p>

	<br />
	<p>Gates</p>
	<button class="gate-btn" on:click={() => applyGate(X)}>X</button>
	<button class="gate-btn" on:click={() => applyGate(Y)}>Y</button>
	<button class="gate-btn" on:click={() => applyGate(Z)}>Z</button>
	<button class="gate-btn" on:click={() => applyGate(H)}>H</button>
	<button class="gate-btn" on:click={() => applyGate(S)}>S</button>
	<button class="gate-btn" on:click={() => applyGate(St)}>St</button>
	<button class="gate-btn" on:click={() => applyGate(T)}>T</button>
	<button class="gate-btn" on:click={() => applyGate(Tt)}>Tt</button>
</div>

<!-- <div class="control-panel-2">
	<p>
		|Ψ> = (√{probabilityAmplitude0.re.toFixed(2)})|0> + (√{probabilityAmplitude1.re.toFixed(2) +
			(prob1 < 0 ? ' - ' : ' + ') +
			Math.abs(imaginary1).toFixed(2) +
			'i'})(e^(iπ))|1>
	</p>
</div> -->

<Threlte.Canvas>
	<!-- <Threlte.Object3DInstance object={gridHelper} /> -->
	<Threlte.Object3DInstance object={axesHelper} />

	<!-- Camera and Controls -->
	<Threlte.PerspectiveCamera position={cameraPos} fov={50} bind:camera>
		<Threlte.OrbitControls on:change={setCameraPos} />
	</Threlte.PerspectiveCamera>

	<!-- Lighting -->
	<Threlte.AmbientLight color="white" intensity={0.2} />
	<!-- <Threlte.DirectionalLight color="white" intensity={2} position={{ x: 10, y: 10 }} /> -->

	<!-- bloch sphere -->
	<!-- <Threlte.Mesh
		geometry={new Three.SphereGeometry(radius, wSeg, hSeg)}
		material={new Three.MeshStandardMaterial({ color: 'white', opacity: 0.25, transparent: true })}
	/> -->

	<!-- equator ring -->
	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
		rotation={{ x: Utils.DEG2RAD * 90 }}
	/>

	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
	/>

	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
		rotation={{ y: Utils.DEG2RAD * 90 }}
	/>

	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
		rotation={{ y: Utils.DEG2RAD * 45 }}
	/>

	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
	/>

	<Threlte.Mesh
		geometry={new Three.RingGeometry(radius, radius + radius * 0.01, 200)}
		material={new Three.MeshStandardMaterial({ color: 'white', side: Three.DoubleSide })}
		rotation={{ y: Utils.DEG2RAD * -45 }}
	/>

	<!-- state arrow -->
	<ArrowGeometry
		thickness={0.02}
		origin={[0, 0, 0]}
		dir={new Three.Spherical(1, inclinationRads, azimuthRads)}
		color={0x0f62fe}
		text="state"
		{cameraPos}
	/>

	<!-- phi -->
	{#if showPhiTheta}
		<Threlte.Group>
			<Threlte.Mesh
				geometry={new Three.CircleGeometry(1, 200, Math.PI / 2, -phi)}
				material={new Three.MeshStandardMaterial({
					color: 'orange',
					side: Three.DoubleSide,
					transparent: true,
					opacity: 0.25
				})}
				rotation={{ x: Utils.DEG2RAD * 90 }}
			/>
			<Text
				text="phi"
				position={new Three.Vector3().setFromSpherical(
					new Three.Spherical(0.5, Math.PI / 2 - 0.01, phi / 2)
				)}
				textAlign="center"
				anchorX="center"
				anchorY="middle"
				font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
				rotation={{ x: Utils.DEG2RAD * -90 }}
				fontSize={0.05}
			/>
		</Threlte.Group>

		<!-- theta -->
		<Threlte.Group>
			<Threlte.Mesh
				geometry={new Three.CircleGeometry(1, 200, Math.PI / 2, theta)}
				material={new Three.MeshStandardMaterial({
					color: 'blue',
					side: Three.DoubleSide,
					transparent: true,
					opacity: 0.25
				})}
				rotation={{ y: Math.PI / 2 + phi }}
			/>

			<Text
				text="theta"
				position={new Three.Vector3().setFromSpherical(
					new Three.Spherical(0.5, theta / 2, phi - 0.01)
				)}
				textAlign="center"
				anchorX="center"
				anchorY="middle"
				font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
				fontSize={0.05}
				rotation={{ y: phi + Utils.DEG2RAD * -90 }}
			/>
		</Threlte.Group>
	{/if}

	<Text
		text="x"
		position={{
			x: 1.4,
			y: 0,
			z: 0
		}}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
		lookAt={cameraPos}
	/>

	<Text
		text="y"
		position={{
			x: 0,
			y: 1.4,
			z: 0
		}}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
		lookAt={cameraPos}
	/>

	<Text
		text="z"
		position={{
			x: 0,
			y: 0,
			z: 1.4
		}}
		textAlign="center"
		anchorX="center"
		anchorY="middle"
		font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
		lookAt={cameraPos}
	/>

	<Threlte.Group>
		<Threlte.Mesh
			geometry={new Three.SphereGeometry(0.02, wSeg, hSeg)}
			material={new Three.MeshStandardMaterial({ color: 'red' })}
			position={{
				x: 0,
				y: 1,
				z: 0
			}}
		/>
		<Text
			text="|0>"
			position={{
				x: 0,
				y: 1.15,
				z: 0
			}}
			anchorY="top"
			font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
			lookAt={cameraPos}
		/>
	</Threlte.Group>

	<Threlte.Group>
		<Threlte.Mesh
			geometry={new Three.SphereGeometry(0.02, wSeg, hSeg)}
			material={new Three.MeshStandardMaterial({ color: 'red' })}
			position={{
				x: 0,
				y: -1,
				z: 0
			}}
		/>
		<Text
			text="|1>"
			position={{
				x: 0,
				y: -1.1,
				z: 0
			}}
			font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
			lookAt={cameraPos}
		/>
	</Threlte.Group>
</Threlte.Canvas>

<style>
	.control-panel-1 {
		font-family: var(--font-mono);
		color: var(--color-text);
		font-size: 0.8rem;
		background-color: var(--color-bg);

		padding: 10px;
		border-radius: 5px;
		position: absolute;
		top: 10px;
		left: 10px;
		width: 200px;
		height: 400px;
	}

	.control-panel-2 {
		font-family: var(--font-mono);
		color: var(--color-text);
		font-size: 1.2rem;
		background-color: var(--color-bg);

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 10px;
		border-radius: 5px;
		position: absolute;
		top: 10px;
		right: 10px;
		width: 600px;
		height: 100px;
	}

	.gate-btn {
		border: none;
		padding: 10px;
		margin-top: 8px;
		width: 30px;
		height: 30px;
		text-align: center;
		background-color: #585858;
		color: var(--color-text);
		cursor: pointer;
	}

	.gate-btn:hover {
		background-color: #6f6f6f;
	}
</style>
