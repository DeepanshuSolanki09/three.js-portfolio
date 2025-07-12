import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

//scene
const scene = new THREE.Scene();

//size
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//light
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(0, 10, 0);
sunlight.castShadow = true;

// Shadow
// sunlight.shadow.mapSize.width = 2048;
// sunlight.shadow.mapSize.height = 2048;
// sunlight.shadow.camera.near = 1;
// sunlight.shadow.camera.far = 50;
// sunlight.shadow.camera.left = -15;
// sunlight.shadow.camera.right = 15;
// sunlight.shadow.camera.top = 15;
// sunlight.shadow.camera.bottom = -15;
sunlight.shadow.bias = -0.01;
sunlight.shadow.normalBias = 0.01;

scene.add(sunlight);

scene.add(new THREE.AmbientLight(0xffffff, 1));

//loading progress
let loadingprogress = 0;

//loader
const loader = document.querySelector(".loader");
const heading = document.querySelector(".heading");
const progress = document.querySelector(".progress");
const tl = gsap.timeline({ paused: true });
const audio = document.querySelector("#introsound");
audio.loop = true;

gsap.from(heading, {
  opacity: 0,
  y: 50,
  ease: "power2.inOut",
});

tl.to(loader, {
  scale: 0.98,
  duration: 3,
  delay: 2,
  ease: "power3.inOut",
});

tl.to(loader, {
  y: 1000,
  duration: 3,
  delay: 2,
  ease: "power3.inOut",
  display: "none",
});

window.addEventListener("load", () => {
  audio.play();
});

//loading manager
const loadingmanager = new THREE.LoadingManager(() => {
  tl.play();
});

loadingmanager.onProgress = function (url, loaded, total) {
  loadingprogress = (loaded / total) * 100;
  progress.style.width = `${loadingprogress}%`;
};

//object
const gltfloader = new GLTFLoader(loadingmanager);
gltfloader.load("/isometric_room_3d.glb", (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
    if (child.isMesh && child.material.map) {
      child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
      child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
      child.material.map.magFilter = THREE.LinearFilter;
      child.material.needsUpdate = true;
    }
    // if (child.isMesh) {
    //   child.material = new THREE.MeshStandardMaterial();
    // }
  });
  model.scale.set(5, 5, 5);
  scene.add(model);
});

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);
camera.position.z = 15;
camera.position.x = 5;
camera.position.y = 10;
scene.add(camera);

//canvas
const canvas = document.querySelector(".webgl");

//controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

controls.minPolarAngle = -Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

controls.minAzimuthAngle = -Math.PI / 36;
controls.maxAzimuthAngle = Math.PI / 2;

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(size.width, size.height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

//resize
window.addEventListener("resize", () => {
  size.width = innerWidth;
  size.height = innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix;

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//raycaster
const raycaster = new THREE.Raycaster();
const checkarray = [];
const mouse = new THREE.Vector2();

//font->test
//base
const basegeo = new THREE.BoxGeometry(10, 8, 0);
const basemal = new THREE.MeshBasicMaterial();
const base = new THREE.Mesh(basegeo, basemal);
scene.add(base);
base.position.set(17, 0.01, -1);
base.rotateX(-Math.PI / 2);
base.scale.set(2, 2, 2);

//font
const Fontloader = new FontLoader(loadingmanager);

Fontloader.load("/helvetiker_regular.typeface.json", (font) => {
  const textloader = new TextGeometry("I ' M  DEEPANSHU", {
    font: font,
    size: 1.6,
    height: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });

  const material = new THREE.MeshBasicMaterial({ color: "black" });
  const text1 = new THREE.Mesh(textloader, material);
  text1.rotateX(-Math.PI / 2);
  text1.position.y = -49.9;
  text1.position.z = -1;
  text1.position.x = 9;
  text1.userData = { type: "text1" };
  scene.add(text1);
});

Fontloader.load("/helvetiker_regular.typeface.json", (font) => {
  const textloader = new TextGeometry("=> SKILLS", {
    font: font,
    size: 1.3,
    height: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });

  const material = new THREE.MeshBasicMaterial({ color: "black" });
  const text2 = new THREE.Mesh(textloader, material);
  text2.rotateX(-Math.PI / 2);
  text2.position.y = -50;
  text2.position.z = 1.5;
  text2.position.x = 9;
  text2.userData = { type: "text2" };
  checkarray.push(text2);
  scene.add(text2);
});

Fontloader.load("/helvetiker_regular.typeface.json", (font) => {
  const textloader = new TextGeometry("=> PROJECT", {
    font: font,
    size: 1.3,
    height: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });

  const material = new THREE.MeshBasicMaterial({ color: "black" });
  const text3 = new THREE.Mesh(textloader, material);
  text3.rotateX(-Math.PI / 2);
  text3.position.y = -50;
  text3.position.z = 3;
  text3.position.x = 9;
  text3.userData = { type: "text3" };
  checkarray.push(text3);
  scene.add(text3);
});

Fontloader.load("/helvetiker_regular.typeface.json", (font) => {
  const textloader = new TextGeometry("=> CONTACT", {
    font: font,
    size: 1.3,
    height: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
  });

  const material = new THREE.MeshBasicMaterial({ color: "black" });
  const text4 = new THREE.Mesh(textloader, material);
  text4.rotateX(-Math.PI / 2);
  text4.position.y = -50;
  text4.position.z = 4.5;
  text4.position.x = 9;
  text4.userData = { type: "text4" };
  checkarray.push(text4);
  scene.add(text4);
});
console.log(checkarray);

//popupmodel function
const popupmodel = (type) => {
  const content = document.querySelector(".content");
  content.classList.add("temp");

  if (type == "text2") {
    content.innerHTML = `<div class="temp3">
        <div>
        <img style="height: 40px; width: 40px;" src="/circle-xmark (1).png" class="close">
      </div>
        <h1 style="color: white; text-align: center; margin-bottom: 1rem;">MY SKILLS</h1>
        <div class="temp2">
          <h2>REACT</h2>
          <img src="data:image/png;base64,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">
        </div>
        <div class="temp2">
          <h2>HTML</h2>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj5K08rKxUEHZsgxTHElnQc6bFEmuVzD6FUg&s">
        </div>
        <div class="temp2">
          <h2>CSS</h2>
          <img src="https://blog.openreplay.com/images/css-image-reflections/images/hero.png">
        </div>
        <div class="temp2">
          <h2>JAVASCRIPT</h2>
          <img src="https://files.ably.io/ghost/prod/2023/12/choosing-the-best-javascript-frameworks-for-your-next-project.png">
        </div>
        <div class="temp2">
          <h2>NODE</h2>
          <img src="https://railsware.com/blog/wp-content/uploads/2018/09/2400%D1%851260-rw-blog-node-js.png">
        </div>
        <div class="temp2">
          <h2>MONGO DB</h2>
          <img src="https://miro.medium.com/v2/resize:fit:1400/1*QJnvahq_EBdUGjYQUYrhvA.png">
        </div>
        <div class="temp2">
          <h2>THREE.JS</h2>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1--FvWsdTG1Y8rNH3DDVyX8Q-p1dTzHQEQ&s">
        </div>
      </div>`;
  }

  if (type == "text3") {
    content.innerHTML = `<div class="temp3">
        <div>
        <img style="height: 40px; width: 40px;" src="/circle-xmark (1).png" class="close">
      </div>
        <h1 style="color: white; text-align: center; margin-bottom: 1rem;">MY PROJECTS</h1>
        <h2 style="color: white;">This Is My First Project. I'll Update This Section Soon</h2>
      </div>`;
  }

  if (type == "text4") {
    content.innerHTML = `<div class="temp3">
        <div>
        <img style="height: 40px; width: 40px;" src="/circle-xmark (1).png" class="close">
      </div>
        <h1 style="color: white; text-align: center; margin-bottom: 1rem;">MY CONTACTS</h1>
        <div style="display: flex;gap:10px; align-items: center;color: black;">
          <img style="width: 30px; height: 30px;" src="/instagram.png"> 
          <h3><a href="https://www.instagram.com/i_m___deepanshusolanki/?hl=en">i_m_deepanshusolanki</a></h3>
        </div>
        <div style="display: flex;gap:10px; align-items: center;color: white;">
          <img style="width: 30px; height: 30px;" src="/linkedin.png"> 
          <h3><a href="https://www.linkedin.com/in/deepanshu-solanki-081346318/">Deepanshu Solanki</a></h3>
        </div>
        <div style="display: flex;gap:10px; align-items: center;color: white;">
          <img style="width: 30px; height: 30px;" src="/discord.png"> 
          <h3><a href="">_strawberry._</a></h3>
        </div>
        <div style="display: flex;gap:10px; align-items: center;color: white;">
          <img style="width: 30px; height: 30px;" src="/github.png"> 
          <h3><a href="https://github.com/DeepanshuSolanki09">DeepanshuSolanki09</a></h3>
        </div>
      </div>`;
  }
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    content.classList.remove("temp");
  });
};

window.addEventListener("dblclick", (e) => {
  const X = (e.clientX / window.innerWidth) * 2 - 1;
  const Y = -(e.clientY / window.innerHeight) * 2 + 1;

  mouse.x = X;
  mouse.y = Y;
  raycaster.setFromCamera(mouse, camera);
  const intersection = raycaster.intersectObjects(checkarray);
  if (intersection.length > 0) {
    const type = intersection[0].object.userData.type;
    popupmodel(type);
  }
  console.log(intersection);
});

//tick
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
  window.requestAnimationFrame(tick);
};
tick();
