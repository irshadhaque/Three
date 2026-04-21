import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "blue" });
    const material2 = new THREE.MeshStandardMaterial({ 
      color: "red",
      // metalness: 1,
      roughness: 0 //shiny
    });//reacts with light, if no light, not visible
    const cube = new THREE.Mesh(geometry, material);//shape and color like properties
    cube.position.x = -2
    scene.add(cube);

    const cube2 = new THREE.Mesh(geometry, material2);//shape and color like properties
    cube2.position.x = 2

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      30
    );//(field of view, aspect ratio w/h, near, far)anything far or near from this cannot be seen

    camera.position.z = 3; //important to position camera

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);//(color,intensity)equal in all directions
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);//works on meshStdMaterial
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    function animate() {
      requestAnimationFrame(animate);//recursive call

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.01;

      cube2.rotation.x += 0.01;

      controls.update();//if using enableDamping true(for OrbitControls)

      renderer.render(scene, camera);//in every frame it is rendering so renderer is inside animate
    }

    animate();

  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="threejs"></canvas>
    </>
  );
}

export default App;