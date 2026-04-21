import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 5, 3);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);//for first render, as no resize will be called(initialization)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);//equal in all points
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);//sun
    directionalLight.position.set(2.5, 4, -4);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.02;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 20;

    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);//bulb
    pointLight.position.set(-6, 2, 2);
    scene.add(pointLight);

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();
    let model;//for reference

    loader.load("/snacks2.glb", (gltf) => {
      model = gltf.scene;

      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      model.rotation.y = Math.PI / 3;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
    })

    new RGBELoader().load('/indoor.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);//to dynamically change render size on every screen resize

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();//to apply camera aspect on screen resize       
    })

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default App;