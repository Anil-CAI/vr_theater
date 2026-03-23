<div align="center">

# 🌌 Galaxy Cinema VR

### An immersive WebXR virtual movie theater set in a cosmic galaxy environment

<p>
  <img src="https://img.shields.io/badge/WebXR-FF4B4B?style=for-the-badge&logo=webxr&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Meta_Quest_3-1C1C1C?style=for-the-badge&logo=meta&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/github/last-commit/Anil-CAI/vr_theater?color=00B4D8&style=flat-square" />
  <img src="https://img.shields.io/github/languages/top/Anil-CAI/vr_theater?color=00B4D8&style=flat-square" />
  <img src="https://img.shields.io/badge/Platform-Meta%20Quest%203-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square" />
</p>

</div>

---

## 📖 What is Galaxy Cinema VR?

**Galaxy Cinema VR** is a browser-based Virtual Reality application that lets users watch their own locally stored video files inside a fully immersive, peaceful 3D galaxy environment — no uploads, no subscriptions, no cloud storage required.

The user selects any video file from their device, presses a single button, and is transported into a virtual cosmic cinema where a giant screen floats among 15,000 procedurally generated stars and glowing nebulae.

> Built as a solo project to explore the intersection of **WebXR**, **3D real-time rendering**, and **immersive user experience design** — the three pillars of next-generation VR game development.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌟 **Procedural Galaxy** | 15,000 stars dynamically generated and animated in a massive 3D sphere |
| 🌌 **Nebula Clouds** | Transparent volumetric gas clouds placed for depth and atmosphere |
| 🎬 **Local Video Playback** | Plays any video from device storage — no upload or server required |
| 📺 **16:9 Cinema Screen** | Full-scale virtual screen with real-time video texturing via Three.js |
| 💡 **Dynamic Screen Lighting** | Rectangular light attached to the screen simulates real cinema glow |
| 🥽 **Meta Quest 3 Optimized** | Full stereoscopic WebXR rendering for immersive VR headset experience |
| 🔒 **Privacy First** | All video processing happens in browser memory — no data ever leaves the device |
| 🌐 **Zero Installation** | Runs entirely in a web browser — no app store, no download required |

---

## 🎯 Project Motivation

This project was born from two parallel interests:

1. **VR Game Development** — Learning to build real-time 3D environments using Three.js and WebXR, understanding spatial rendering, lighting physics, and immersive UX design patterns used in modern VR games.

2. **Japan Career Goal** — Japan's game and XR industry (Nintendo, Sony Interactive, Capcom, Bandai Namco) leads the world. This project demonstrates hands-on capability with the exact technologies these studios use and value: real-time 3D rendering, VR interface design, and hardware-native WebXR APIs.

---

## 🛠️ Technologies Used

### Core Stack
- **[Three.js](https://threejs.org/)** — 3D graphics engine for scene, camera, geometry, materials, and lighting
- **[WebXR API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)** — Web standard for VR hardware interface, stereoscopic rendering, and headset tracking
- **[Vite](https://vitejs.dev/)** — Build tool and development server for fast module bundling
- **HTML5 / CSS3 / JavaScript** — Pre-VR UI dashboard and application logic

### Key Web APIs
- `navigator.xr` — WebXR device detection and session management
- `URL.createObjectURL()` — In-browser video blob processing (no server upload)
- `THREE.VideoTexture` — Real-time video frame piping to 3D canvas material
- `THREE.RectAreaLight` — Physically accurate rectangular cinema screen light

---

## 🏗️ System Architecture

```
Galaxy Cinema VR
│
├── A. Initialization
│   ├── 3D Scene + Camera setup
│   ├── HTTPS security check (required for WebXR on Meta Quest)
│   └── WebXR hardware compatibility check
│
├── B. Pre-VR Dashboard (2D UI)
│   ├── Local video file selector
│   ├── In-browser blob URL generation (privacy-safe)
│   └── "Enter Galaxy" button (unlocked after valid file)
│
├── C. Galaxy Environment
│   ├── Procedural star field (15,000 points, random 3D sphere)
│   ├── Nebula gas clouds (transparent colored spheres)
│   └── Continuous ambient star rotation (time-based animation)
│
├── D. Cinema Screen
│   ├── 16:9 geometry canvas positioned at default camera focus
│   ├── THREE.VideoTexture — live video → 3D material
│   ├── RectAreaLight attached to screen coordinates
│   └── Floor grid for spatial depth/scale reference
│
└── E. WebXR Session
    ├── Flat browser → stereoscopic headset rendering
    └── Video playback begins on 3D cinema screen
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) and npm installed
- A WebXR-compatible browser (Chrome, Edge, Firefox Reality)
- Meta Quest 3 headset **or** any WebXR browser (desktop VR mode works too)
- Project must be served over **HTTPS** for VR features (required by WebXR)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anil-CAI/vr_theater.git

# Navigate into the project
cd vr_theater

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Running on Meta Quest 3

```bash
# Build for production (serves over HTTPS via Vite)
npm run build
npm run preview

# Or use a local HTTPS tunnel for development:
npx vite --https
```

Then on your Meta Quest 3:
1. Open the Meta Quest Browser
2. Navigate to your local HTTPS URL
3. Select your video file from device storage
4. Press **"Enter Galaxy"** — put on your headset and enjoy 🌌

---

## 📁 Project Structure

```
vr_theater/
├── index.html          # Entry point + pre-VR dashboard UI
├── main.js             # Core application logic
│   ├── sceneSetup()    # Three.js scene, camera, renderer
│   ├── buildGalaxy()   # Procedural star + nebula generation
│   ├── buildScreen()   # Cinema screen + video texture + lighting
│   └── enterVR()       # WebXR session initialization
├── style.css           # Pre-VR dashboard styling
├── package.json        # Vite + dependencies
└── vite.config.js      # Build configuration
```

---

## 🗺️ Roadmap

- [x] Procedural galaxy environment (stars + nebulae)
- [x] Local video file playback in VR
- [x] Meta Quest 3 WebXR integration
- [x] Dynamic cinema screen lighting
- [ ] Hand tracking support (Meta Quest 3 native)
- [ ] Spatial audio — video sound positioned from screen direction
- [ ] Multiple theater environments (space station, underwater, forest)
- [ ] VR UI panel — play/pause/seek controls usable in headset
- [ ] Playlist support — queue multiple local videos
- [ ] Multi-user mode — watch together in the same galaxy (WebRTC)

---

## 🔗 Skills Demonstrated

This project directly demonstrates skills relevant to **VR game development and XR engineering roles**:

| Skill Area | Demonstrated By |
|---|---|
| Real-time 3D rendering | Three.js scene, materials, lighting, animation loop |
| VR hardware interface | WebXR API session management, stereoscopic rendering |
| Procedural generation | Mathematical star field generation (15,000 points) |
| Immersive UX design | HTTPS security flow, progressive UI unlock, spatial anchoring |
| Performance optimization | Blob URL video processing, efficient render loop |
| Web standards | WebXR, HTML5 Video, Canvas API, ES Modules |

---

## 🇯🇵 Japan Connection

This project aligns directly with the XR and game development work done at Japanese studios I'm targeting:

- **Sony Interactive Entertainment** — PlayStation VR2 experience design
- **Telexistence (TX Inc.)** — VR interface engineering for remote robot control
- **Bandai Namco** — Immersive VR arcade and home experience development
- **Capcom** — Real-time 3D environment and rendering engineering

> 日本語: このプロジェクトはVR技術とWebXR開発の実践的なスキルを示しています。日本のゲーム・ロボティクス企業で働くことが目標です。
>
> *(This project demonstrates practical VR and WebXR development skills. My goal is to work at a Japanese game or robotics company.)*

---

## 👤 About the Developer

**Anil Kumar** — VR Game Developer & Robotics Engineer from India, working toward a career in Japan's game and XR industry.

<p>
  <a href="https://github.com/Anil-CAI">
    <img src="https://img.shields.io/badge/GitHub-Anil--CAI-181717?style=flat-square&logo=github" />
  </a>
  <a href="mailto:ballaanilkumar369@gmail.com">
    <img src="https://img.shields.io/badge/Email-ballaanilkumar369%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/anil-k-balla">
    <img src="https://img.shields.io/badge/LinkedIn-Anil%20K%20Balla-0077B5?style=flat-square&logo=linkedin" />
  </a>
</p>

- Currently learning: **ROS2 · C++ · OpenXR · Japanese (JLPT N5)**
- Open to: **VR Developer / XR Engineer roles in Japan**
- Other projects: [ROS-Turtlesim-Guide](https://github.com/Anil-CAI/Ros-_Turtlesim_Guide) · [Python-AI-ML-Experiments](https://github.com/Anil-CAI/python_workspace)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with passion for VR, space, and the future of immersive technology · India → Japan 🇮🇳 → 🇯🇵</sub>
</div>
