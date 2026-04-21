//Rotation(Euler) and Quaternion(Advanced)
//materials -- mesh basic and standard, transparency, opacity
//geometry -- box, sphere
//grouping and relative changes--scale, position, rotation

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function App() {

  const canvasRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(1,1,1);
    const geometry2 = new THREE.SphereGeometry(0.5, 18, 18);
    const material = new THREE.MeshBasicMaterial({color: 0x966f33});
    // const material2 = new THREE.MeshBasicMaterial({color: 'blue', transparent: true, opacity: 0.5});
    
    const cube1 = new THREE.Mesh(geometry, material);
    const cube2 = new THREE.Mesh(geometry, material);
    const cube3 = new THREE.Mesh(geometry, material);

    cube1.position.x = -2;
    cube2.position.x = 0;
    cube3.position.x = 2;
    
    const group = new THREE.Group();//a group is just like a scene
    group.add(cube1);
    group.add(cube2);
    group.add(cube3);

    group.position.y = 2;
    group.scale.setScalar(2);

    cube2.position.y = -1; //applies relative to the group(2+(-1))=lies at 1
    cube2.scale.setScalar(0.5); //relative to group (0.5*2 = 1)

    scene.add(group);

    scene.fog = new THREE.Fog(0x000000, 2, 15)
    scene.background = new THREE.Color(0x000000);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-2, 4, 3);
    scene.add(directionalLight)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      30
    );
    camera.position.set(0,6,8);
    scene.add(camera);

    const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper); //not just scene, axesHelper can be set across any mesh also

    // cube1.add(axesHelper);
    // cube1.rotation.y = 1; //expressed in radians
    //cube1.rotation.x = Math.PI * 2; // pi equals half rotation, 2 pi full rotation->no change
    //for clockwise rotation use -ve sign
    // cube1.rotation.x = THREE.MathUtils.degToRad(45) //if we want to specify in degrees

    //rotating on X then Y is same as rotating on Y then X as rotation.order is XYZ by default. it can be changed to a different order
    // cube1.rotation.reorder('YXZ') //CALL THIS BEFORE ROTATION TO REORDER

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    })

    const textureLoader = new THREE.TextureLoader();
    const woodTexture = textureLoader.load('/wood.jpg');
    
    material.map = woodTexture;//wrapping a texture on a material
    woodTexture.repeat.set(1, 2);
    woodTexture.wrapS = THREE.MirroredRepeatWrapping;
    woodTexture.wrapT = THREE.MirroredRepeatWrapping;

    const clock = new THREE.Clock();

    function animate(){
      requestAnimationFrame(animate);

      const currentTime = clock.getElapsedTime();

      cube2.rotation.x += 0.05;
      cube2.scale.y = Math.abs(Math.sin(currentTime));
      
      cube2.position.y = Math.sin(currentTime) * 2;

      // console.log(scene.children)//returns an array of whatever is present in the scene(Mesh, light,camera,..)
      //if we want same rotation to be applied on all the meshes
      // scene.children.forEach((child) => {
      //   if(child.isGroup){//or isMesh or if(child instanceOf THREE.Mesh)
      //     child.rotation.y += 0.01;
      //   }
      // })

      renderer.render(scene, camera);
      controls.update();
    }
    animate()

  }, [])
  return (
    <>
    <canvas ref={canvasRef} className="three"></canvas>
    </>
  )
}

export default App
