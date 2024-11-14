import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x87ceeb);

const sunLight = new THREE.PointLight(0xffff00, 1, 100);
sunLight.position.set(10, 10, 10);
sunLight.castShadow = true;

scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd00,
    emissive: 0xffdd00,
    emissiveIntensity: 1,
    transparent: true,
    opacity: 0.8
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(10, 10, 10);

scene.add(sunMesh);

const houseGroup = new THREE.Object3D();

const textureLoader = new THREE.TextureLoader();


const houseGeometry = new THREE.BoxGeometry(4, 4, 4);
const houseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.set(0, 2, 0);
houseGroup.add(house);

const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, 5, 0);
roof.rotation.y = Math.PI / 4;
houseGroup.add(roof);

const cardGeometry = new THREE.PlaneGeometry(2, 1);
const cardMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const card = new THREE.Mesh(cardGeometry, cardMaterial);
card.position.set(0, 2, 2.01);
houseGroup.add(card);

const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Ender lives here', {
        font: font,
        size: 0.175,
        height: 0.1
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff6347 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.set(-0.82, -0.12, -0.09);
    card.add(textMesh);
});

scene.add(houseGroup);

const grassTexture = textureLoader.load('src/textures/seamless-green-grass-pattern_1284-52275.avif');

grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(5, 5);

const grassGeometry = new THREE.PlaneGeometry(20, 20);
const grassMaterial = new THREE.MeshBasicMaterial({ 
    map: grassTexture,
    side: THREE.DoubleSide
});
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;

grass.castShadow = false;
grass.receiveShadow = false; 
scene.add(grass);

const gltfLoader = new GLTFLoader();
gltfLoader.load(
    'assets/maple_tree.glb',
    (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(.05, .05, .05);
        tree.position.set(5, -0.5, 0);
        scene.add(tree);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Failed to load the tree model', error);
    }
);

camera.position.set(0, 3, 10);
camera.lookAt(new THREE.Vector3(0, 2, 0));

function animate() {
    requestAnimationFrame(animate);



    camera.position.x = 10 * Math.sin(Date.now() * 0.0001);
    camera.position.z = 10 * Math.cos(Date.now() * 0.0001);
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
}
animate();
