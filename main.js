/**
 * VR Theater - Main Application Logic
 * Handles mode switching, video controls, and VR interactions
 */

// Application State
const AppState = {
    currentMode: 'video', // 'video' or 'driving'
    isPlaying: false,
    isVRActive: false,
    steeringAngle: 0,
    speed: 0
};

// DOM Elements (will be initialized when scene loads)
let scene, camera, videoPlayer, steeringWheel, modeIndicator;
let videoModeBtn, drivingModeBtn, playPauseBtn, enterVRBtn, playPauseText;
let curvedScreen;

// Initialize application when scene is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('VR Theater initializing...');
    
    // Get A-Frame scene
    scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        initializeApp();
    } else {
        scene.addEventListener('loaded', initializeApp);
    }
});

/**
 * Initialize all app components
 */
function initializeApp() {
    console.log('Scene loaded, initializing components...');
    
    // Get all DOM elements
    videoPlayer = document.querySelector('#videoPlayer');
    steeringWheel = document.querySelector('#steeringWheel');
    modeIndicator = document.querySelector('#modeIndicator');
    curvedScreen = document.querySelector('#curvedScreen');
    
    // Menu buttons
    videoModeBtn = document.querySelector('#videoModeBtn');
    drivingModeBtn = document.querySelector('#drivingModeBtn');
    playPauseBtn = document.querySelector('#playPauseBtn');
    enterVRBtn = document.querySelector('#enterVRBtn');
    playPauseText = document.querySelector('#playPauseText');
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup VR enter/exit handlers
    setupVRHandlers();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
    
    // Initialize to video mode
    switchToVideoMode();
    
    console.log('VR Theater initialized successfully!');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Video Mode Button
    if (videoModeBtn) {
        videoModeBtn.addEventListener('click', switchToVideoMode);
        videoModeBtn.addEventListener('mouseenter', () => highlightButton(videoModeBtn));
        videoModeBtn.addEventListener('mouseleave', () => unhighlightButton(videoModeBtn));
    }
    
    // Driving Mode Button
    if (drivingModeBtn) {
        drivingModeBtn.addEventListener('click', switchToDrivingMode);
        drivingModeBtn.addEventListener('mouseenter', () => highlightButton(drivingModeBtn));
        drivingModeBtn.addEventListener('mouseleave', () => unhighlightButton(drivingModeBtn));
    }
    
    // Play/Pause Button
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
        playPauseBtn.addEventListener('mouseenter', () => highlightButton(playPauseBtn));
        playPauseBtn.addEventListener('mouseleave', () => unhighlightButton(playPauseBtn));
    }
    
    // Enter VR Button
    if (enterVRBtn) {
        enterVRBtn.addEventListener('click', enterVR);
        enterVRBtn.addEventListener('mouseenter', () => highlightButton(enterVRBtn));
        enterVRBtn.addEventListener('mouseleave', () => unhighlightButton(enterVRBtn));
    }
    
    // Steering wheel interaction (for driving mode)
    if (steeringWheel) {
        steeringWheel.addEventListener('mousedown', onSteeringGrab);
        steeringWheel.addEventListener('mouseup', onSteeringRelease);
    }
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
}

/**
 * Setup VR mode handlers
 */
function setupVRHandlers() {
    if (scene) {
        scene.addEventListener('enter-vr', () => {
            console.log('Entered VR mode');
            AppState.isVRActive = true;
            // Auto-play video when entering VR
            if (!AppState.isPlaying) {
                playVideo();
            }
        });
        
        scene.addEventListener('exit-vr', () => {
            console.log('Exited VR mode');
            AppState.isVRActive = false;
        });
    }
}

/**
 * Switch to Video Mode
 */
function switchToVideoMode() {
    console.log('Switching to Video Mode');
    AppState.currentMode = 'video';
    
    // Hide steering wheel
    if (steeringWheel) {
        steeringWheel.setAttribute('visible', 'false');
        animateElement(steeringWheel, 'scale', '1 1 1', '0.1 0.1 0.1', 300);
    }
    
    // Update mode indicator
    if (modeIndicator) {
        modeIndicator.setAttribute('value', 'VIDEO MODE');
        modeIndicator.setAttribute('color', '#00ffff');
    }
    
    // Update button styles
    updateButtonStates();
    
    // Reset steering
    AppState.steeringAngle = 0;
    AppState.speed = 0;
}

/**
 * Switch to Driving Mode
 */
function switchToDrivingMode() {
    console.log('Switching to Driving Mode');
    AppState.currentMode = 'driving';
    
    // Show steering wheel with animation
    if (steeringWheel) {
        steeringWheel.setAttribute('visible', 'true');
        animateElement(steeringWheel, 'scale', '0.1 0.1 0.1', '1 1 1', 300);
        
        // Add subtle hover animation
        steeringWheel.setAttribute('animation__hover', {
            property: 'position',
            to: '0 0.95 -0.6',
            dur: 1000,
            easing: 'easeInOutSine',
            loop: true,
            dir: 'alternate'
        });
    }
    
    // Update mode indicator
    if (modeIndicator) {
        modeIndicator.setAttribute('value', 'DRIVING MODE');
        modeIndicator.setAttribute('color', '#ff6b35');
    }
    
    // Update button styles
    updateButtonStates();
}

/**
 * Toggle Play/Pause
 */
function togglePlayPause() {
    if (AppState.isPlaying) {
        pauseVideo();
    } else {
        playVideo();
    }
}

/**
 * Play video
 */
function playVideo() {
    if (videoPlayer) {
        videoPlayer.play()
            .then(() => {
                AppState.isPlaying = true;
                if (playPauseText) {
                    playPauseText.setAttribute('value', 'PAUSE');
                    playPauseText.setAttribute('color', '#ffaa00');
                }
                console.log('Video playing');
            })
            .catch(err => {
                console.error('Error playing video:', err);
            });
    }
}

/**
 * Pause video
 */
function pauseVideo() {
    if (videoPlayer) {
        videoPlayer.pause();
        AppState.isPlaying = false;
        if (playPauseText) {
            playPauseText.setAttribute('value', 'PLAY');
            playPauseText.setAttribute('color', '#00ff00');
        }
        console.log('Video paused');
    }
}

/**
 * Enter VR mode
 */
function enterVR() {
    if (scene && !AppState.isVRActive) {
        scene.enterVR();
    }
}

/**
 * Update button states based on current mode
 */
function updateButtonStates() {
    if (AppState.currentMode === 'video') {
        // Video mode button active
        if (videoModeBtn) {
            videoModeBtn.querySelector('.button-bg').setAttribute('color', '#00ffff');
            videoModeBtn.querySelector('a-text').setAttribute('color', '#000000');
        }
        // Driving mode button inactive
        if (drivingModeBtn) {
            drivingModeBtn.querySelector('.button-bg').setAttribute('color', '#2a2a2a');
            drivingModeBtn.querySelector('a-text').setAttribute('color', '#00ffff');
        }
    } else {
        // Driving mode button active
        if (drivingModeBtn) {
            drivingModeBtn.querySelector('.button-bg').setAttribute('color', '#ff6b35');
            drivingModeBtn.querySelector('a-text').setAttribute('color', '#000000');
        }
        // Video mode button inactive
        if (videoModeBtn) {
            videoModeBtn.querySelector('.button-bg').setAttribute('color', '#2a2a2a');
            videoModeBtn.querySelector('a-text').setAttribute('color', '#00ffff');
        }
    }
}

/**
 * Highlight button on hover
 */
function highlightButton(button) {
    const bg = button.querySelector('.button-bg');
    if (bg) {
        const currentColor = bg.getAttribute('color');
        bg.setAttribute('animation__glow', {
            property: 'opacity',
            to: 1,
            dur: 200,
            easing: 'easeInOutQuad'
        });
    }
}

/**
 * Unhighlight button
 */
function unhighlightButton(button) {
    const bg = button.querySelector('.button-bg');
    if (bg) {
        bg.removeAttribute('animation__glow');
    }
}

/**
 * Handle steering wheel grab
 */
function onSteeringGrab(event) {
    if (AppState.currentMode === 'driving') {
        console.log('Steering grabbed');
        // Add grab animation
        if (steeringWheel) {
            steeringWheel.setAttribute('animation__grab', {
                property: 'scale',
                to: '1.1 1.1 1.1',
                dur: 100,
                easing: 'easeOutQuad'
            });
        }
    }
}

/**
 * Handle steering wheel release
 */
function onSteeringRelease(event) {
    if (AppState.currentMode === 'driving') {
        console.log('Steering released');
        // Release animation
        if (steeringWheel) {
            steeringWheel.setAttribute('animation__release', {
                property: 'scale',
                to: '1 1 1',
                dur: 200,
                easing: 'easeOutElastic'
            });
        }
    }
}

/**
 * Handle keyboard controls
 */
function handleKeyPress(event) {
    switch(event.key.toLowerCase()) {
        case '1':
            switchToVideoMode();
            break;
        case '2':
            switchToDrivingMode();
            break;
        case ' ':
            event.preventDefault();
            togglePlayPause();
            break;
        case 'v':
            enterVR();
            break;
        case 'a':
        case 'arrowleft':
            if (AppState.currentMode === 'driving') {
                steerLeft();
            }
            break;
        case 'd':
        case 'arrowright':
            if (AppState.currentMode === 'driving') {
                steerRight();
            }
            break;
        case 'w':
        case 'arrowup':
            if (AppState.currentMode === 'driving') {
                accelerate();
            }
            break;
        case 's':
        case 'arrowdown':
            if (AppState.currentMode === 'driving') {
                decelerate();
            }
            break;
    }
}

/**
 * Steering controls
 */
function steerLeft() {
    AppState.steeringAngle = Math.max(AppState.steeringAngle - 5, -45);
    updateSteeringVisual();
    console.log('Steering left:', AppState.steeringAngle);
}

function steerRight() {
    AppState.steeringAngle = Math.min(AppState.steeringAngle + 5, 45);
    updateSteeringVisual();
    console.log('Steering right:', AppState.steeringAngle);
}

function accelerate() {
    AppState.speed = Math.min(AppState.speed + 1, 10);
    console.log('Speed:', AppState.speed);
}

function decelerate() {
    AppState.speed = Math.max(AppState.speed - 1, 0);
    console.log('Speed:', AppState.speed);
}

/**
 * Update steering wheel visual rotation
 */
function updateSteeringVisual() {
    if (steeringWheel) {
        const rotation = `0 0 ${-AppState.steeringAngle * 3}`; // Multiply for more visible rotation
        steeringWheel.setAttribute('animation__steer', {
            property: 'rotation',
            to: rotation,
            dur: 100,
            easing: 'easeOutQuad'
        });
    }
}

/**
 * Utility: Animate element property
 */
function animateElement(element, property, from, to, duration) {
    if (element) {
        element.setAttribute('animation', {
            property: property,
            from: from,
            to: to,
            dur: duration,
            easing: 'easeInOutQuad'
        });
    }
}

/**
 * Animation loop for continuous updates
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Add any continuous animations or updates here
    if (AppState.currentMode === 'driving' && AppState.isVRActive) {
        // Could add speed-based effects, etc.
    }
}

// Start animation loop
animate();

// Log controls for user
console.log(`
╔══════════════════════════════════════════════════════════╗
║           VR THEATER - CONTROLS                          ║
╠══════════════════════════════════════════════════════════╣
║ Key 1:           Switch to Video Mode                    ║
║ Key 2:           Switch to Driving Mode                  ║
║ Space:           Play/Pause Video                        ║
║ V:               Enter VR Mode                           ║
║                                                          ║
║ Driving Mode Controls:                                   ║
║ W/↑:             Accelerate                              ║
║ S/↓:             Decelerate                              ║
║ A/←:             Steer Left                              ║
║ D/→:             Steer Right                             ║
╚══════════════════════════════════════════════════════════╝
`);
