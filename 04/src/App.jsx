import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);//equal in all points
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);//sun
    directionalLight.position.set(3, 2, 3);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();
    let model;//for reference

    loader.load("/spider.glb", (gltf) => {
      model = gltf.scene;

      model.scale.set(1, 1, 1);
      model.position.set(0, -1, 0);

      // model.rotation.x = THREE.MathUtils.degToRad(-30);

      scene.add(model);
      });

      const textureLoader = new THREE.TextureLoader();
      const webBg = textureLoader.load('/bg.jpg');
      scene.background = webBg;

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);//to dynamically change render size on every screen resize

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();//to apply camera aspect on screen resize       
    })

    function animate() {
      requestAnimationFrame(animate);
      controls.update();

      if(model){
        model.rotation.y += 0.05;
      }

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default App;