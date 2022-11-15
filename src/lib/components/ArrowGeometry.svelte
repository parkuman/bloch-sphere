<script lang="ts">
	import * as Threlte from '@threlte/core';
	import { Text } from '@threlte/extras';
	import * as Three from 'three';
	import * as Utils from 'three/src/math/MathUtils';
	import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';

	export let dir: Three.Spherical;
	export let origin: Three.Vector3Tuple;
	export let color: number;
	export let thickness: number;
	export let text: string = '';
	export let cameraPos: Threlte.Position;

	$: dirVec3 = new Three.Vector3().setFromSpherical(dir);
</script>

<Threlte.Line2
	points={[origin, [dirVec3.x, dirVec3.y, dirVec3.z]]}
	material={new LineMaterial({ worldUnits: true, linewidth: thickness, color })}
/>

<Threlte.Mesh
	geometry={new Three.SphereGeometry(thickness)}
	material={new Three.MeshStandardMaterial({ color })}
	position={dirVec3}
/>

<Text
	{text}
	position={new Three.Vector3().setFromSpherical(
		new Three.Spherical(dir.radius + 0.2, dir.phi, dir.theta)
	)}
	textAlign="center"
	anchorX="center"
	anchorY="top"
	font="/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf"
	lookAt={cameraPos}
	fontSize={0.05}
/>
<!-- <Threlte.Mesh
	geometry={new Three.CylinderGeometry(0.05, 0.05, length, 6, 4)}
	material={new Three.MeshStandardMaterial({ color })}
	lookAt={{ x: newDir.x, y: newDir.y, z: newDir.z }}
	rotation={{x: Utils.DEG2RAD * 90}}
/> -->
