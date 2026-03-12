import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

let scene, camera, renderer, video, videoTexture, videoMesh;

const videoInput = document.getElementById('video-input');
const enterBtn = document.getElementById('enter-vr-btn');
const videoPlayer = document.getElementById('video-player');
const fileNameDisplay = document.getElementById('file-name');
const videoInfo = document.getElementById('video-info');

init();

function init() {
    RectAreaLightUniformsLib.init();

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020205);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 1.6, 3); // Start slightly back from center

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    // Append to overlay instead of body
    const container = document.getElementById('vr-overlay');
    container.appendChild(renderer.domElement);

    // 4. VR Button
    const vrButton = VRButton.createButton(renderer);
    vrButton.style.display = 'none';
    document.body.appendChild(vrButton);

    // Check for VR Support and Protocol
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isSecure) {
        const protocolWarning = document.getElementById('protocol-warning');
        if (protocolWarning) protocolWarning.classList.remove('hidden');
        showVRWarning("⚠️ Insecure Connection (HTTP). VR requires HTTPS to work on Meta Quest.");
    }


    if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
            if (!supported) {
                showVRWarning("VR not supported on this device/browser.");
            }
        }).catch((e) => {
            console.error(e);
            showVRWarning("WebXR Error: Connectivity or permission issue.");
        });
    } else {
        showVRWarning("WebXR not found. Please use a VR-compatible browser.");
    }


    // 5. Galaxy/Environment
    createGalaxy();

    // 6. Cinema Screen
    createCinemaScreen();

    // 7. Event Listeners
    videoInput.addEventListener('change', handleVideoUpload);
    enterBtn.addEventListener('click', () => {
        console.log("Enter VR Button Clicked");
        if (videoPlayer.src) {
            vrButton.click(); // Trigger native WebXR entry
        } else {
            alert("Please select a video file first!");
        }
    });

    // Make the enter button visibly disabled but clickable for feedback if needed
    // or keep it disabled and show a prompt. Let's keep it disabled for now but add a title.
    enterBtn.title = "Select a video to enable";

    window.addEventListener('resize', onWindowResize);

    // Start Animation Loop
    renderer.setAnimationLoop(render);
}

function showVRWarning(message) {
    const warning = document.createElement('div');
    warning.style.color = '#ff4d4d';
    warning.style.marginTop = '1rem';
    warning.style.fontSize = '0.9rem';
    warning.style.fontWeight = '600';
    warning.textContent = message;
    document.querySelector('.card').appendChild(warning);
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoPlayer.src = url;
        fileNameDisplay.textContent = `Selected: ${file.name}`;
        videoInfo.classList.remove('hidden');
        enterBtn.disabled = false;

        // Setup video texture
        if (videoTexture) videoTexture.dispose();
        videoTexture = new THREE.VideoTexture(videoPlayer);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        videoMesh.material.map = videoTexture;
        videoMesh.material.color.set(0xffffff); // Ensure material is pure white for full brightness
        videoMesh.material.needsUpdate = true;

        videoPlayer.play();
    }
}

function createGalaxy() {
    // Procedural Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add some "Nebula" glow points
    const nebulaColors = [0x7d5fff, 0x3dcfcf, 0xff5f7d];
    nebulaColors.forEach((color, idx) => {
        const nebulaGeo = new THREE.SphereGeometry(200, 32, 32);
        const nebulaMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.03,
            side: THREE.BackSide
        });
        const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
        nebula.position.set(
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500
        );
        scene.add(nebula);
    });

    // Subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
}

function createCinemaScreen() {
    // Large Screen Geometry (16:9 ratio)
    const screenWidth = 16;
    const screenHeight = 9;
    const geometry = new THREE.PlaneGeometry(screenWidth, screenHeight);

    // Placeholder material until video is loaded
    const material = new THREE.MeshBasicMaterial({
        color: 0x000000, // Black until video starts
        side: THREE.FrontSide
    });

    videoMesh = new THREE.Mesh(geometry, material);
    videoMesh.position.set(0, 4, -10); // Elevated and in front
    scene.add(videoMesh);

    // Add a subtle border/frame to the screen
    const frameGeo = new THREE.PlaneGeometry(screenWidth + 0.2, screenHeight + 0.2);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 4, -10.01);
    scene.add(frame);

    // Add a subtle floor for depth perception
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x050510,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.5
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    scene.add(floor);

    // Add a grid helper for depth
    const grid = new THREE.GridHelper(50, 50, 0x111122, 0x111122);
    grid.position.y = -1.99;
    scene.add(grid);

    // Light for the floor (simulating screen glow) - boosted intensity
    const rectLight = new THREE.RectAreaLight(0xffffff, 8, screenWidth, screenHeight);
    rectLight.position.set(0, 4, -9.9);
    rectLight.lookAt(0, 4, 0);
    scene.add(rectLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(time) {
    // Subtle rotation of stars for "alive" feeling
    scene.children.forEach(child => {
        if (child.isPoints) {
            child.rotation.y = time * 0.00005;
        }
    });

    renderer.render(scene, camera);
}
