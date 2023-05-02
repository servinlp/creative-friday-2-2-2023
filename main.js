import { AnimationMixer, AxesHelper, BoxGeometry, CylinderGeometry, Clock, DoubleSide, GridHelper, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer, DirectionalLight } from 'three'
import { OrbitControls, GLTFLoader, DRACOLoader } from 'three-stdlib'
import Stats from 'stats.js'
import './style.css'
import CapeFragmentShader from './shader/cape/fragment.frag'
import CapeVertexShader from './shader/cape/vertex.vert'

const stats = new Stats()
document.body.appendChild(stats.domElement)

const scene = new Scene()

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight,  0.1, 1000)

camera.position.y = 2
camera.position.z = -3

const renderer = new WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// const box = new Mesh(
//   new BoxGeometry(1, 1,1),
//   new MeshStandardMaterial({ color: "hotpink"})
// )

// scene.add(box)

const axesHelper = new AxesHelper(10)
const gridHelper = new GridHelper()

scene.add(axesHelper, gridHelper)

new OrbitControls(camera, renderer.domElement)

const hemLight = new HemisphereLight()
const dirLight = new DirectionalLight()

dirLight.position.set(0, 2, -1)

scene.add(hemLight, dirLight)

// const planeGeometry = new PlaneGeometry(0.6,1.5, 20, 20)
const planeGeometry = new CylinderGeometry( 0.3, 1, 2, 50, 50, true, 2.5, 1.5 );
// const planeMaterial = new MeshStandardMaterial({color: 'red', side: DoubleSide})
const planeMaterial = new ShaderMaterial({
  fragmentShader: CapeFragmentShader,
  vertexShader: CapeVertexShader,
  side: DoubleSide,
  wireframe: true,
  uniforms: {
    uTime: { value: 0 }
  }
})
const plane = new Mesh(planeGeometry, planeMaterial)
plane.position.set(0.05,0.55,-0.5)
plane.rotation.x = Math.PI *2 / 10

scene.add(plane)

const actions = {}
let mixer
const loader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/' );
loader.setDRACOLoader( dracoLoader );

loader.load(
	'./model/character.glb',
	function ( gltf ) {

    console.log(gltf)
		scene.add( gltf.scene );

    mixer = new AnimationMixer(gltf.scene);
    const animations = gltf.animations;

    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;
    });

    actions["Armature|mixamo.com|Layer0"].play();

    render()

	},
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	function ( error ) {

		console.log( 'An error happened' );

	}
);

const clock = new Clock()


function render() {
  stats.begin()
  const delta = clock.getDelta()
  mixer.update(delta)
  const elapsedTime = clock.getElapsedTime();
  planeMaterial.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(render)
}

resize()
window.addEventListener('resize', resize)

function resize() {
  const width = window.innerWidth
  const height = window.innerHeight
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}