/** Spike 3D soal 18: ukuran gzip Three.js yang benar-benar dipakai (tree-shaking). */
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const code = `import { WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, BoxGeometry, ShapeGeometry, Shape, PlaneGeometry,
  MeshStandardMaterial, MeshBasicMaterial, HemisphereLight, DirectionalLight, Color, Vector3, Matrix4, Quaternion, Object3D, LineSegments, EdgesGeometry, LineBasicMaterial } from 'three';
export { WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, InstancedMesh, BoxGeometry, ShapeGeometry, Shape, PlaneGeometry,
  MeshStandardMaterial, MeshBasicMaterial, HemisphereLight, DirectionalLight, Color, Vector3, Matrix4, Quaternion, Object3D, LineSegments, EdgesGeometry, LineBasicMaterial };`;
const dir = mkdtempSync(join(process.cwd(), 'node_modules', '.pt-three-'));
writeFileSync(join(dir, 'entry.js'), code);
await build({
  configFile: false,
  logLevel: 'silent',
  root: process.cwd(),
  build: {
    outDir: join(dir, 'out'),
    minify: true,
    lib: { entry: join(dir, 'entry.js'), formats: ['es'], fileName: 'm' },
  },
});
const f = readdirSync(join(dir, 'out')).find((x) => x.endsWith('.js'))!;
const buf = readFileSync(join(dir, 'out', f));
console.log(
  `three (subset spike): ${(buf.length / 1024).toFixed(1)} KB min, ${(gzipSync(buf).length / 1024).toFixed(1)} KB gzip`,
);
