import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

gsap.registerPlugin(ScrollTrigger);

// --- 1. SETUP BASE OPTIMIZADO ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050507, 0.012); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 55); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 3); 
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// --- 2. VARIABLES GLOBALES Y SISTEMA DE ESTADOS ---
const figures = [];      
const targetPoints = []; 
let animationState = 0;  
let solidTextMesh; 

const colors = [0xffffff, 0x88ffcc]; 
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clock = new THREE.Clock(); 

let activeObject = null;
let activeObjectType = null; 
let isTransitioning = false; 

let globalHovered = null;
let globalHoveredType = null;

const raycastTargetsMonoliths = [];
const raycastTargetsPlanets = [];
const raycastTargetsShips = [];

const FLOOR_LEVEL = -50;       
const HISTORY_X_OFFSET = 250;  
const CONTACT_Y_LEVEL = 70;    
const FOOTER_Y_LEVEL = 170; // Nueva coordenada Y superior

const serviceMonoliths = []; 
const serviceTitles = ["INNOVACION", "CRECIMIENTO", "ALCANCE", "SEGURIDAD"];
const serviceDescs = [
    "Soluciones tecnologicas\navanzadas para la\nexpansion digital.",
    "Analisis de datos y\noptimizacion de\nmetricas corporativas.",
    "Infraestructura global\ncon servidores de\nalta disponibilidad.",
    "Sistemas encriptados y\nbovedas digitales de\nmaxima proteccion."
];

const historyPlanets = [];
const historyTitles = ["INICIO", "EXPANSION", "CONSOLIDACION", "FUTURO"];
const historyDescs = [
    "El origen del ecosistema.\nNuestra primera linea\nde codigo en el abismo.",
    "Despliegue de modulos.\nConquistamos y abrimos\nnuevos sectores del mercado.",
    "Estabilidad y control.\nNuestra arquitectura\nse vuelve un estandar global.",
    "El salto cuantico.\nPreparando la tecnologia\npara el proximo siglo."
];

const contactShips = [];
const contactTitles = ["CONTACTANOS", "TE CONTACTAMOS"];

const nexusGroup = new THREE.Group(); // Contenedor global para el objeto final

function crearTexturaPanel() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(256, 128, 20, 256, 128, 250);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);
    return new THREE.CanvasTexture(canvas);
}
const panelTexture = crearTexturaPanel();

const textureLoader = new THREE.TextureLoader();
const planetTextures = [
    textureLoader.load('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1024&auto=format&fit=crop'), 
    textureLoader.load('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1024&auto=format&fit=crop'), 
    textureLoader.load('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1024&auto=format&fit=crop'), 
    textureLoader.load('https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1024&auto=format&fit=crop')  
];
planetTextures.forEach(tex => { tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping; });

const planetColors = [
    new THREE.Color(0xff6622), new THREE.Color(0x00ccff), 
    new THREE.Color(0x00ff66), new THREE.Color(0xff00ff)  
];

// --- 3. CARGA DE FUENTE Y CREACIÓN DE ESCENARIOS ---
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/gentilis_bold.typeface.json', function (font) {
    
    const textGeo = new TextGeometry('EDVYNKARIS', { font: font, size: 7.5, height: 1.5, curveSegments: 5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1 });
    textGeo.center();
    solidTextMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
    scene.add(solidTextMesh);

    const posAttr = textGeo.getAttribute('position');
    
    const particleGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25); 
    const mat1 = new THREE.MeshStandardMaterial({ color: colors[0], roughness: 0.3, metalness: 0.8 });
    const mat2 = new THREE.MeshStandardMaterial({ color: colors[1], roughness: 0.3, metalness: 0.8 });
    const step = Math.max(1, Math.floor(posAttr.count / 1500)); 

    for (let i = 0; i < posAttr.count; i += step) {
        targetPoints.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
        const mesh = new THREE.Mesh(particleGeo, i % 2 === 0 ? mat1 : mat2);
        mesh.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 60);
        scene.add(mesh);
        figures.push(mesh);
    }

    crearMonolitos3D(font);
    crearPlanetas3D(font); 
    crearHalconesMilenarios(font);
    crearNucleoFinal3D(font); // Nuevo
    iniciarSecuencia();
});

function crearMonolitos3D(font) {
    const geoCristal = new THREE.OctahedronGeometry(2, 0); 
    const floorLight = new THREE.PointLight(0x88ffcc, 800, 150);
    floorLight.position.set(0, FLOOR_LEVEL - 5, 5); 
    scene.add(floorLight);
    const panelGeo = new THREE.PlaneGeometry(16, 8);
    const basePanelMat = new THREE.MeshBasicMaterial({ map: panelTexture, transparent: true, opacity: 0, depthWrite: false });

    for(let i=0; i<4; i++) {
        const nodeContainer = new THREE.Group(); 
        const spinGroup = new THREE.Group(); 
        
        const matCristal = new THREE.MeshStandardMaterial({ color: 0x0a1118, roughness: 0.1, metalness: 0.9, transparent: true });
        const cristal = new THREE.Mesh(geoCristal, matCristal); cristal.scale.set(1.5, 3.5, 1.5); 
        const wireframe = new THREE.Mesh(geoCristal, new THREE.MeshBasicMaterial({ color: 0x88ffcc, wireframe: true, transparent: true, opacity: 0.3 })); wireframe.scale.set(1.6, 3.6, 1.6); 
        spinGroup.add(cristal); spinGroup.add(wireframe);
        
        const textGeo = new TextGeometry(serviceTitles[i], { font: font, size: 1.6, height: 0.2, bevelEnabled: false }); textGeo.center();
        const textMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false })); textMesh.position.set(0, 8, 0); textMesh.scale.set(0.1, 0.1, 0.1); 
        
        const panelMesh = new THREE.Mesh(panelGeo, basePanelMat.clone()); panelMesh.position.set(0, 6, 2); 
        const descGeo = new TextGeometry(serviceDescs[i], { font: font, size: 0.8, height: 0.05, bevelEnabled: false }); descGeo.center();
        const descMesh = new THREE.Mesh(descGeo, new THREE.MeshStandardMaterial({ color: 0x050507, transparent: true, opacity: 0 })); descMesh.position.set(0, 6, 2.5); descMesh.scale.set(0.1, 0.1, 0.1);
        
        nodeContainer.add(spinGroup); nodeContainer.add(textMesh); nodeContainer.add(panelMesh); nodeContainer.add(descMesh);
        const radio = 26; const angulo = (i - 1.5) * 0.65; 
        nodeContainer.position.set(Math.sin(angulo) * radio, FLOOR_LEVEL - 5, Math.cos(angulo) * radio - 12);
        spinGroup.rotation.x = Math.PI / 8;
        
        nodeContainer.userData = { cristal: cristal, wireframe: wireframe, text: textMesh, spinGroup: spinGroup, panel: panelMesh, descText: descMesh, isOpen: false };
        scene.add(nodeContainer); serviceMonoliths.push(nodeContainer);
        raycastTargetsMonoliths.push(cristal); 
    }
}

function crearPlanetas3D(font) {
    const geoEsfera = new THREE.SphereGeometry(3, 32, 32);
    const geoAnillo = new THREE.TorusGeometry(5, 0.05, 16, 100);
    const planetLight = new THREE.PointLight(0x8a0303, 1500, 200);
    planetLight.position.set(HISTORY_X_OFFSET, FLOOR_LEVEL, 20);
    scene.add(planetLight);
    const innerWorldGeo = new THREE.SphereGeometry(1, 64, 64);

    for(let i=0; i<4; i++) {
        const nodeContainer = new THREE.Group();
        const spinGroup = new THREE.Group();
        
        const planeta = new THREE.Mesh(geoEsfera, new THREE.MeshStandardMaterial({ color: 0x020305, roughness: 0.5, metalness: 0.7, transparent: true }));
        const wireSphere = new THREE.Mesh(new THREE.SphereGeometry(3.1, 16, 16), new THREE.MeshBasicMaterial({ color: 0x8a0303, wireframe: true, transparent: true, opacity: 0.15 }));
        const anillo = new THREE.Mesh(geoAnillo, new THREE.MeshBasicMaterial({ color: 0x8a0303, transparent: true, opacity: 0.4, side: THREE.DoubleSide })); anillo.rotation.x = Math.PI / 2.5;
        spinGroup.add(planeta); spinGroup.add(wireSphere); spinGroup.add(anillo);
        
        const textGeo = new TextGeometry(historyTitles[i], { font: font, size: 1.5, height: 0.2, bevelEnabled: false }); textGeo.center();
        const textMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false })); textMesh.position.set(0, 7, 0); textMesh.scale.set(0.1, 0.1, 0.1);
        
        const innerWorldGroup = new THREE.Group();
        const innerBg = new THREE.Mesh(innerWorldGeo, new THREE.MeshBasicMaterial({ map: planetTextures[i], color: 0x050101, side: THREE.BackSide, transparent: true, opacity: 0, blending: THREE.NormalBlending }) );
        const innerGrid = new THREE.Mesh(new THREE.IcosahedronGeometry(0.98, 6), new THREE.MeshBasicMaterial({ color: 0x8a0303, wireframe: true, transparent: true, opacity: 0.25, side: THREE.BackSide }));
        innerWorldGroup.add(innerBg); innerWorldGroup.add(innerGrid); innerWorldGroup.scale.set(0.01, 0.01, 0.01); 
        
        const descGeo = new TextGeometry(historyDescs[i], { font: font, size: 1.2, height: 0.1, bevelEnabled: false }); descGeo.center();
        const descMesh = new THREE.Mesh(descGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })); descMesh.scale.set(0.1, 0.1, 0.1); 
        
        nodeContainer.add(spinGroup); nodeContainer.add(textMesh); nodeContainer.add(innerWorldGroup); nodeContainer.add(descMesh);
        const radio = 30; const angulo = (i - 1.5) * 0.6; nodeContainer.position.set(HISTORY_X_OFFSET + (Math.sin(angulo) * radio), FLOOR_LEVEL, Math.cos(angulo) * radio - 10); spinGroup.rotation.z = (Math.random() - 0.5) * 0.5;
        
        nodeContainer.userData = { planeta: planeta, wire: wireSphere, anillo: anillo, text: textMesh, spinGroup: spinGroup, innerWorld: innerWorldGroup, innerBg: innerBg, innerGrid: innerGrid, targetBgColor: planetColors[i], descText: descMesh, isOpen: false };
        scene.add(nodeContainer); historyPlanets.push(nodeContainer);
        raycastTargetsPlanets.push(planeta); 
    }
}

function crearHalconesMilenarios(font) {
    const spaceLight = new THREE.PointLight(0xffffff, 800, 200);
    spaceLight.position.set(HISTORY_X_OFFSET, CONTACT_Y_LEVEL + 10, 20);
    scene.add(spaceLight);

    const saucerGeo = new THREE.CylinderGeometry(4, 4, 1.2, 32);
    const mandibleGeo = new THREE.BoxGeometry(2.5, 1, 5);
    const cockpitTubeGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.5, 16);
    const cockpitPodGeo = new THREE.CylinderGeometry(1, 1, 1.8, 16);
    const radarGeo = new THREE.CylinderGeometry(1.2, 0.5, 0.5, 16);
    const engineGeo = new THREE.BoxGeometry(6, 0.8, 0.5);
    const wireSaucerGeo = new THREE.CylinderGeometry(4.2, 4.2, 1.4, 16);
    const plasmaGeo = new THREE.PlaneGeometry(1, 1);
    
    const hullMat = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1 });
    const textColor = 0x050507; 
    const textGrayMat = new THREE.MeshBasicMaterial({color: 0xaaaaaa});

    for(let i=0; i<2; i++) {
        const shipContainer = new THREE.Group();
        const shipBody = new THREE.Group();
        const engineColor = i === 0 ? 0x88ffcc : 0x8a0303;

        const saucer = new THREE.Mesh(saucerGeo, hullMat);
        const mandLeft = new THREE.Mesh(mandibleGeo, hullMat); mandLeft.position.set(-2, 0, 4); 
        const mandRight = new THREE.Mesh(mandibleGeo, hullMat); mandRight.position.set(2, 0, 4);
        const cockpitTube = new THREE.Mesh(cockpitTubeGeo, hullMat); cockpitTube.rotation.z = Math.PI / 2; cockpitTube.position.set(4, 0, 1.5);
        const cockpitPod = new THREE.Mesh(cockpitPodGeo, hullMat); cockpitPod.rotation.z = Math.PI / 2; cockpitPod.position.set(6, 0, 1.5);
        const radar = new THREE.Mesh(radarGeo, hullMat); radar.position.set(-1.5, 0.8, -1); radar.rotation.x = 0.5;
        const engine = new THREE.Mesh(engineGeo, new THREE.MeshStandardMaterial({ color: engineColor, emissive: engineColor, emissiveIntensity: 1 })); engine.position.set(0, 0, -4);
        const wireSaucer = new THREE.Mesh(wireSaucerGeo, new THREE.MeshBasicMaterial({ color: engineColor, wireframe: true, transparent: true, opacity: 0.15 }));
        const shipLight = new THREE.PointLight(engineColor, 1500, 80); shipLight.position.set(0, 0, -6);
        
        shipBody.add(saucer); shipBody.add(mandLeft); shipBody.add(mandRight); shipBody.add(cockpitTube); shipBody.add(cockpitPod); shipBody.add(radar); shipBody.add(engine); shipBody.add(wireSaucer); shipBody.add(shipLight);
        shipBody.scale.set(1.5, 1.5, 1.5);
        
        shipBody.children.forEach(piece => { 
            if(piece.isMesh) {
                piece.userData.parentShip = shipContainer; 
                raycastTargetsShips.push(piece);
            }
        });

        const textGeo = new TextGeometry(contactTitles[i], { font: font, size: 2.5, height: 0.4, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.02 });
        textGeo.center();
        const textMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthTest: false }));
        textMesh.position.set(0, 14, 0); 
        textMesh.scale.set(0.1, 0.1, 0.1);

        const contentGroup = new THREE.Group();
        const plasmaScreen = new THREE.Mesh(plasmaGeo, new THREE.MeshBasicMaterial({ color: engineColor, transparent: true, opacity: 0 }));
        contentGroup.add(plasmaScreen);
        
        if (i === 0) {
            const tGeo1 = new TextGeometry("CONEXION DIRECTA", { font: font, size: 1.5, height: 0.05 }); tGeo1.center();
            const tMesh1 = new THREE.Mesh(tGeo1, new THREE.MeshBasicMaterial({ color: textColor })); tMesh1.position.set(0, 4, 0.5);
            const tGeo2 = new TextGeometry("CEO: Eduardo\nIngenieria: EdvynKaris\nSede: Valparaiso, Chile\nEmail: contacto@edvynkaris.com", { font: font, size: 1, height: 0.05 }); tGeo2.center();
            const tMesh2 = new THREE.Mesh(tGeo2, new THREE.MeshBasicMaterial({ color: textColor })); tMesh2.position.set(0, -1, 0.5);
            contentGroup.add(tMesh1); contentGroup.add(tMesh2);
        } else {
            const fTitleGeo = new TextGeometry("TRANSMITIR DATOS", { font: font, size: 1.5, height: 0.05 }); fTitleGeo.center();
            const fTitle = new THREE.Mesh(fTitleGeo, new THREE.MeshBasicMaterial({ color: textColor })); fTitle.position.set(0, 5, 0.5);
            const inputMat = new THREE.MeshBasicMaterial({color: 0x0a0a0a, opacity: 0.9, transparent: true});
            const inp1 = new THREE.Mesh(new THREE.PlaneGeometry(18, 2.5), inputMat); inp1.position.set(0, 1.5, 0.5);
            const txt1Geo = new TextGeometry("Nombre...", {font: font, size: 0.8, height: 0.01}); txt1Geo.center(); inp1.add(new THREE.Mesh(txt1Geo, textGrayMat));
            const inp2 = new THREE.Mesh(new THREE.PlaneGeometry(18, 2.5), inputMat); inp2.position.set(0, -2, 0.5);
            const txt2Geo = new TextGeometry("Correo...", {font: font, size: 0.8, height: 0.01}); txt2Geo.center(); inp2.add(new THREE.Mesh(txt2Geo, textGrayMat));
            const btn = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5), new THREE.MeshBasicMaterial({color: 0xffffff})); btn.position.set(0, -6, 0.5);
            const btnTxtGeo = new TextGeometry("ENVIAR", {font: font, size: 0.8, height: 0.05}); btnTxtGeo.center(); btn.add(new THREE.Mesh(btnTxtGeo, new THREE.MeshBasicMaterial({color: 0x8a0303})));
            contentGroup.add(fTitle); contentGroup.add(inp1); contentGroup.add(inp2); contentGroup.add(btn);
        }

        contentGroup.position.set(0, 0, -8); 
        contentGroup.rotation.y = Math.PI; 
        contentGroup.scale.set(0.01, 0.01, 0.01);
        contentGroup.visible = false;

        shipContainer.add(shipBody); 
        shipContainer.add(textMesh);
        shipContainer.add(contentGroup);

        const separacion = i === 0 ? -22 : 22; 
        const basePosX = HISTORY_X_OFFSET + separacion;
        const basePosY = CONTACT_Y_LEVEL;
        const basePosZ = -25;
        
        shipContainer.position.set(basePosX, basePosY, basePosZ);
        const baseRotY = i === 0 ? 0.3 : -0.3;
        shipContainer.rotation.set(0.2, baseRotY, 0); 

        shipContainer.userData = { 
            body: shipBody, text: textMesh, contentGroup: contentGroup, plasmaScreen: plasmaScreen,
            basePosX: basePosX, basePosY: basePosY, basePosZ: basePosZ, baseRotX: 0.2, baseRotY: baseRotY,
            engine: engine, wireHull: wireSaucer, light: shipLight, isOpen: false 
        };
        
        scene.add(shipContainer); contactShips.push(shipContainer);
    }
}

// --- NUEVO: CREACIÓN DE LA ETAPA 5 (EL NÚCLEO) ---
function crearNucleoFinal3D(font) {
    const coreLight = new THREE.PointLight(0x8a0303, 3000, 300);
    // Posicionado exactamente a medio camino en X y en lo más alto en Y
    coreLight.position.set(HISTORY_X_OFFSET / 2, FOOTER_Y_LEVEL, 20);
    scene.add(coreLight);

    // Coraza perimetral metálica oscura (Ingeniería pesada)
    const shellGeo = new THREE.IcosahedronGeometry(12, 2);
    const shellMat = new THREE.MeshStandardMaterial({
        color: 0x050507, 
        roughness: 0.1,
        metalness: 0.9,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);

    // Bóveda central interior (Roja intensa)
    const innerGeo = new THREE.OctahedronGeometry(8, 0);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x8a0303,
        emissive: 0x4a0101,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);

    nexusGroup.add(shell);
    nexusGroup.add(innerCore);

    // Letrero 3D bajo el núcleo
    const textGeo = new TextGeometry("EDVYNKARIS", { font: font, size: 3, height: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05 });
    textGeo.center();
    const textMesh = new THREE.Mesh(textGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
    textMesh.position.set(0, -18, 0);
    nexusGroup.add(textMesh);

    nexusGroup.position.set(HISTORY_X_OFFSET / 2, FOOTER_Y_LEVEL, -15);
    scene.add(nexusGroup);
}

function iniciarSecuencia() {
    animationState = 0; 
    setTimeout(() => {
        animationState = 1;
        figures.forEach(fig => { gsap.to(fig.position, { y: -10, duration: 1.2, ease: "bounce.out" }); gsap.to(fig.rotation, { x: Math.PI / 2, z: Math.random() * Math.PI, duration: 1 }); });
    }, 2500);

    setTimeout(() => {
        animationState = 2;
        gsap.to(solidTextMesh.material, { opacity: 1, duration: 2.5, delay: 1.2, ease: "power2.inOut" });
        figures.forEach((fig, index) => {
            if(targetPoints[index]) {
                gsap.to(fig.position, { x: targetPoints[index].x, y: targetPoints[index].y, z: targetPoints[index].z, duration: 2, ease: "power3.inOut", delay: Math.random() * 0.6 });
                gsap.to(fig.rotation, { x: 0, y: 0, z: 0, duration: 2 });
            }
        });
        setTimeout(configurarTimelineMundos, 4000);
    }, 4500);
}

// --- 5. EL VIAJE ESPACIAL Y AUTO-CIERRE EN SCROLL ---
function configurarTimelineMundos() {
    animationState = 3; 
    
    const tl = gsap.timeline({ 
        scrollTrigger: { 
            trigger: ".scroll-track", start: "top top", end: "bottom bottom", scrub: 0.5,
            onUpdate: () => {
                if (activeObject && !isTransitioning) cerrarObjetoGlobal();
            }
        } 
    });

    tl.to(solidTextMesh.material, { opacity: 0, duration: 0.05 }, 0);
    figures.forEach((fig) => { tl.to(fig.position, { x: (Math.random() - 0.2) * 350, y: (Math.random() - 0.5) * 300, z: (Math.random() - 0.5) * 250, duration: 1 }, 0); });

    tl.to(camera.position, { y: FLOOR_LEVEL + 4, z: 45, duration: 0.25, ease: "power2.inOut" }, 0);
    tl.to("#servicios-header", { opacity: 1, duration: 0.05 }, 0.2); 
    tl.to(camera.position, { z: 42, duration: 0.1, ease: "none" }, 0.25); 

    tl.to("#servicios-header", { opacity: 0, duration: 0.05 }, 0.35); 
    tl.to(camera.position, { x: HISTORY_X_OFFSET, z: 45, duration: 0.25, ease: "power2.inOut" }, 0.35); 
    tl.to("#historia-header", { opacity: 1, duration: 0.05 }, 0.55);
    tl.to(camera.position, { z: 42, duration: 0.1, ease: "none" }, 0.6); 

    tl.to("#historia-header", { opacity: 0, duration: 0.05 }, 0.7); 
    tl.to(camera.position, { y: CONTACT_Y_LEVEL, z: 45, duration: 0.25, ease: "power2.inOut" }, 0.7); 
    tl.to("#contacto-header", { opacity: 1, duration: 0.05 }, 0.9);
    tl.to(camera.position, { z: 42, duration: 0.1, ease: "none" }, 0.95);

    // --- LÓGICA DE VIAJE PARA LA ETAPA 5 (NUEVO) ---
    tl.to("#contacto-header", { opacity: 0, duration: 0.05 }, 1.05); 
    // Movimiento hacia la punta superior (X e Y intermedios para generar la pirámide)
    tl.to(camera.position, { x: HISTORY_X_OFFSET / 2, y: FOOTER_Y_LEVEL, z: 50, duration: 0.3, ease: "power2.inOut" }, 1.05); 
    tl.to("#footer-header", { opacity: 1, duration: 0.05 }, 1.35);
    tl.to(camera.position, { z: 45, duration: 0.15, ease: "none" }, 1.4); 
}

// --- 6. EVENTOS DE CONTROL ---
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    if (isTransitioning) return; 
    
    raycaster.setFromCamera(mouse, camera);
    let clickedContainer = null;
    let clickedType = null;

    if (camera.position.x < HISTORY_X_OFFSET / 2 && camera.position.y < FLOOR_LEVEL + 30) {
        const intersects = raycaster.intersectObjects(raycastTargetsMonoliths);
        if(intersects.length > 0) { clickedContainer = intersects[0].object.parent.parent; clickedType = 'monolith'; }
    } else if (camera.position.x >= HISTORY_X_OFFSET / 2 && camera.position.y < FLOOR_LEVEL + 30) {
        const intersects = raycaster.intersectObjects(raycastTargetsPlanets);
        if(intersects.length > 0) { clickedContainer = intersects[0].object.parent.parent; clickedType = 'planet'; }
    } else if (camera.position.x >= HISTORY_X_OFFSET / 2 && camera.position.y >= FLOOR_LEVEL + 30 && camera.position.y < CONTACT_Y_LEVEL + 30) {
        const intersects = raycaster.intersectObjects(raycastTargetsShips);
        if(intersects.length > 0) { clickedContainer = intersects[0].object.userData.parentShip; clickedType = 'ship'; }
    }

    if (clickedContainer) {
        if (activeObject === clickedContainer) {
            cerrarObjetoGlobal(); 
        } else {
            if (activeObject) cerrarObjetoGlobal(); 
            abrirObjetoGlobal(clickedContainer, clickedType);
        }
    } else if (activeObject) {
        cerrarObjetoGlobal(); 
    }
});

function abrirObjetoGlobal(container, type) {
    isTransitioning = true;
    activeObject = container;
    activeObjectType = type;
    container.userData.isOpen = true;

    if (type === 'monolith') {
        gsap.to(container.userData.cristal.scale, {x: 3.5, y: 0.2, z: 3.5, duration: 0.6, ease: "power3.inOut"});
        gsap.to(container.userData.cristal.material, {opacity: 0.3, duration: 0.4}); 
        gsap.to(container.userData.wireframe.scale, {x: 4, y: 5, z: 4, duration: 0.8, ease: "back.out(1.2)"});
        gsap.to(container.userData.text.position, {y: 12, duration: 0.6, ease: "power2.out"});
        gsap.to(container.userData.panel.material, {opacity: 1, duration: 0.5, delay: 0.2});
        gsap.to(container.userData.descText.scale, {x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.5)", delay: 0.3});
        gsap.to(container.userData.descText.material, {opacity: 1, duration: 0.4, delay: 0.3, onComplete: () => isTransitioning = false});
    } 
    else if (type === 'planet') {
        gsap.to(container.userData.planeta.material, {opacity: 0, duration: 0.5}); gsap.to(container.userData.wire.material, {opacity: 0, duration: 0.5}); gsap.to(container.userData.anillo.material, {opacity: 0, duration: 0.5}); gsap.to(container.userData.text.material, {opacity: 0, duration: 0.3}); 
        gsap.to(container.userData.innerWorld.scale, {x: 120, y: 120, z: 120, duration: 1.5, ease: "power2.inOut"});
        gsap.to(container.userData.innerBg.material, { opacity: 0.85, duration: 1.5, delay: 0.8 });
        gsap.to(container.userData.innerBg.material.color, { r: container.userData.targetBgColor.r, g: container.userData.targetBgColor.g, b: container.userData.targetBgColor.b, duration: 1.5, delay: 0.8, onComplete: () => isTransitioning = false });
        const targetPos = camera.position.clone().add(new THREE.Vector3(0, 0, -20).applyQuaternion(camera.quaternion)); 
        container.worldToLocal(targetPos); container.userData.descText.position.copy(targetPos); container.userData.descText.lookAt(camera.position);
        gsap.to(container.userData.descText.scale, {x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.2)", delay: 0.8}); 
        gsap.to(container.userData.descText.material, {opacity: 1, duration: 0.5, delay: 0.8});
    }
    else if (type === 'ship') {
        gsap.to(container.userData.text.scale, {x: 0.01, y: 0.01, z: 0.01, duration: 0.3});
        gsap.to(container.userData.text.material, {opacity: 0, duration: 0.3});
        gsap.to(container.position, {x: HISTORY_X_OFFSET, y: CONTACT_Y_LEVEL, z: 10, duration: 1.2, ease: "power3.inOut"});
        gsap.to(container.rotation, {x: 0.1, y: Math.PI, z: 0, duration: 1.2, ease: "power3.inOut"});
        
        container.userData.contentGroup.visible = true;
        gsap.to(container.userData.plasmaScreen.scale, {x: 24, y: 12, z: 1, duration: 0.8, ease: "power2.out", delay: 0.8});
        gsap.to(container.userData.plasmaScreen.material, { opacity: 0.8, duration: 0.8, delay: 0.8 });
        gsap.to(container.userData.contentGroup.scale, {x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(1.2)", delay: 1.0, onComplete: () => isTransitioning = false});
    }
}

function cerrarObjetoGlobal() {
    if(!activeObject) return;
    isTransitioning = true;
    const container = activeObject;
    const type = activeObjectType;
    container.userData.isOpen = false;

    if (type === 'monolith') {
        gsap.to(container.userData.panel.material, {opacity: 0, duration: 0.3});
        gsap.to(container.userData.descText.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.3});
        gsap.to(container.userData.descText.material, {opacity: 0, duration: 0.2});
        gsap.to(container.userData.cristal.scale, {x: 1.5, y: 3.5, z: 1.5, duration: 0.4});
        gsap.to(container.userData.cristal.material.color, {r: 0.04, g: 0.07, b: 0.09, duration: 0.4}); 
        gsap.to(container.userData.cristal.material, {opacity: 1, duration: 0.4}); 
        gsap.to(container.userData.wireframe.material, {opacity: 0.3, duration: 0.4});
        gsap.to(container.userData.wireframe.scale, {x: 1.6, y: 3.6, z: 1.6, duration: 0.4});
        gsap.to(container.userData.text.position, {y: 8, duration: 0.4, onComplete: limpiarEstado}); 
    } 
    else if (type === 'planet') {
        gsap.to(container.userData.descText.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.5}); gsap.to(container.userData.descText.material, {opacity: 0, duration: 0.3});
        gsap.to(container.userData.innerBg.material, { opacity: 0, duration: 0.8 }); gsap.to(container.userData.innerBg.material.color, { r: 0.0196, g: 0.0039, b: 0.0039, duration: 0.8 });
        gsap.to(container.userData.innerWorld.scale, {x: 0.01, y: 0.01, z: 0.01, duration: 1.2, ease: "power2.inOut", delay: 0.2, onComplete: limpiarEstado});
        setTimeout(() => { 
            gsap.to(container.userData.planeta.scale, {x: 1, y: 1, z: 1, duration: 0.4}); gsap.to(container.userData.planeta.material.color, {r: 0.01, g: 0.01, b: 0.02, duration: 0.4}); 
            gsap.to(container.userData.planeta.material, {opacity: 1, duration: 0.4}); gsap.to(container.userData.wire.scale, {x: 1, y: 1, z: 1, duration: 0.4});
            gsap.to(container.userData.wire.material, {opacity: 0.15, duration: 0.4}); gsap.to(container.userData.anillo.scale, {x: 1, y: 1, z: 1, duration: 0.4});
            gsap.to(container.userData.anillo.material, {opacity: 0.4, duration: 0.4}); gsap.to(container.userData.text.position, {y: 7, duration: 0.4}); 
            gsap.to(container.userData.text.material, {opacity: 0, duration: 0.2}); 
        }, 500); 
    } 
    else if (type === 'ship') {
        gsap.to(container.userData.contentGroup.scale, {x: 0.01, y: 0.01, z: 0.01, duration: 0.4});
        gsap.to(container.userData.plasmaScreen.scale, {x: 1, y: 1, z: 1, duration: 0.4});
        gsap.to(container.userData.plasmaScreen.material, { opacity: 0, duration: 0.4 });
        setTimeout(() => { container.userData.contentGroup.visible = false; }, 400);

        gsap.to(container.position, { x: container.userData.basePosX, y: container.userData.basePosY, z: container.userData.basePosZ, duration: 1.2, ease: "power3.inOut", onComplete: limpiarEstado });
        gsap.to(container.rotation, { x: container.userData.baseRotX, y: container.userData.baseRotY, z: 0, duration: 1.2, ease: "power3.inOut" });
        gsap.to(container.userData.text.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.4, delay: 0.8});
        gsap.to(container.userData.text.material, {opacity: 0, duration: 0.2});
        
        gsap.to(container.userData.engine.scale, { z: 1, duration: 0.5 }); 
        gsap.to(container.userData.engine.material, { emissiveIntensity: 1, duration: 0.5 });
        gsap.to(container.userData.light, { intensity: 1500, duration: 0.5 }); 
        gsap.to(container.userData.body.rotation, { x: 0.2, duration: 0.5, ease: "power2.out" }); 
        gsap.to(container.userData.wireHull.material, { opacity: 0.15, duration: 0.3 });
        gsap.to(container.userData.body.position, { x: 0, y: 0, duration: 0.1 }); 
    }
}

function limpiarEstado() {
    activeObject = null;
    activeObjectType = null;
    isTransitioning = false;
}

// --- 7. BUCLE RENDER Y HOVER EFECTOS ---
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime(); 

    if (animationState === 0) {
        figures.forEach((fig, i) => { fig.position.x += Math.sin(time * 8+i)*0.15; fig.position.y += Math.cos(time * 12+i)*0.15; fig.position.z += Math.sin(time * 10+i)*0.15; });
    }

    if (animationState === 2 || animationState === 3) {
        if(animationState === 2) scene.rotation.y = Math.sin(time * 0.3) * 0.08; 
        if(animationState === 3) { 
            figures.forEach((fig, i) => { fig.rotation.x += 0.002; fig.rotation.y += 0.003; fig.position.y += Math.sin(time * 0.5+i)*0.02; }); 
            // NUEVO: Físicas de rotación del núcleo final
            if (nexusGroup.children.length > 0) {
                nexusGroup.rotation.y += 0.003;
                nexusGroup.children[0].rotation.x += 0.002; // Coraza exterior
                nexusGroup.children[0].rotation.z += 0.001;
                nexusGroup.children[1].rotation.x -= 0.005; // Centro interno rojo
            }
        }
        
        serviceMonoliths.forEach((container, i) => {
            container.position.y = (FLOOR_LEVEL - 5) + Math.sin(time * 1.5 + i) * 0.5;
            const speed = container.userData.isOpen ? 0.02 : 0.005;
            container.userData.spinGroup.rotation.y += speed; container.userData.wireframe.rotation.y -= (speed * 1.5);
            container.userData.text.lookAt(camera.position); container.userData.panel.lookAt(camera.position); container.userData.descText.lookAt(camera.position);
            if(container.userData.text.material.opacity > 0 && !container.userData.isOpen) { container.userData.text.position.y = 8 + Math.sin(time * 4) * 0.4; }
        });

        historyPlanets.forEach((container, i) => {
            container.position.y = FLOOR_LEVEL + Math.sin(time * 1.2 + i) * 0.8; 
            if(container.userData.isOpen) {
                container.userData.innerGrid.rotation.y += 0.002; container.userData.innerGrid.rotation.x += 0.001;
                container.userData.innerBg.rotation.y -= 0.0005; container.userData.innerBg.material.map.offset.x += 0.0005;
                container.userData.descText.lookAt(camera.position);
            } else {
                container.userData.spinGroup.rotation.y += 0.002; container.userData.wire.rotation.y -= 0.005; container.userData.anillo.rotation.z += 0.01;
                container.userData.text.lookAt(camera.position);
                if(container.userData.text.material.opacity > 0) container.userData.text.position.y = 7 + Math.sin(time * 4) * 0.4;
            }
        });

        contactShips.forEach((container, i) => {
            if (!container.userData.isOpen) container.position.y = CONTACT_Y_LEVEL + Math.sin(time * 1.5 + i) * 0.5; 
            container.userData.text.lookAt(camera.position);
            if(container.userData.text.material.opacity > 0 && !container.userData.isOpen) container.userData.text.position.y = 14 + Math.sin(time * 5) * 0.4;
        });

        raycaster.setFromCamera(mouse, camera);
        let currentHit = null;
        let currentHitType = null;

        if (!isTransitioning) {
            if (camera.position.x < HISTORY_X_OFFSET / 2 && camera.position.y < FLOOR_LEVEL + 30) {
                const intersects = raycaster.intersectObjects(raycastTargetsMonoliths);
                if(intersects.length > 0) { currentHit = intersects[0].object.parent.parent; currentHitType = 'monolith'; }
            } else if (camera.position.x >= HISTORY_X_OFFSET / 2 && camera.position.y < FLOOR_LEVEL + 30) {
                const intersects = raycaster.intersectObjects(raycastTargetsPlanets);
                if(intersects.length > 0) { currentHit = intersects[0].object.parent.parent; currentHitType = 'planet'; }
            } else if (camera.position.x >= HISTORY_X_OFFSET / 2 && camera.position.y >= FLOOR_LEVEL + 30 && camera.position.y < CONTACT_Y_LEVEL + 30) {
                const intersects = raycaster.intersectObjects(raycastTargetsShips);
                if(intersects.length > 0) { currentHit = intersects[0].object.userData.parentShip; currentHitType = 'ship'; }
            }
        }

        if (currentHit && currentHit.userData.isOpen) currentHit = null;

        if (globalHovered !== currentHit) {
            if (globalHovered && !globalHovered.userData.isOpen) {
                if (globalHoveredType === 'monolith') {
                    gsap.to(globalHovered.userData.cristal.scale, {x: 1.5, y: 3.5, z: 1.5, duration: 0.4});
                    gsap.to(globalHovered.userData.cristal.material.color, {r: 0.04, g: 0.07, b: 0.09, duration: 0.4}); 
                    gsap.to(globalHovered.userData.wireframe.material, {opacity: 0.3, duration: 0.4});
                    gsap.to(globalHovered.userData.wireframe.scale, {x: 1.6, y: 3.6, z: 1.6, duration: 0.4});
                    gsap.to(globalHovered.userData.text.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.4});
                    gsap.to(globalHovered.userData.text.material, {opacity: 0, duration: 0.2});
                } else if (globalHoveredType === 'planet') {
                    gsap.to(globalHovered.userData.planeta.scale, {x: 1, y: 1, z: 1, duration: 0.4});
                    gsap.to(globalHovered.userData.planeta.material.color, {r: 0.01, g: 0.01, b: 0.02, duration: 0.4}); 
                    gsap.to(globalHovered.userData.wire.scale, {x: 1, y: 1, z: 1, duration: 0.4});
                    gsap.to(globalHovered.userData.wire.material, {opacity: 0.15, duration: 0.4});
                    gsap.to(globalHovered.userData.anillo.scale, {x: 1, y: 1, z: 1, duration: 0.4});
                    gsap.to(globalHovered.userData.anillo.material, {opacity: 0.4, duration: 0.4});
                    gsap.to(globalHovered.userData.text.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.4});
                    gsap.to(globalHovered.userData.text.material, {opacity: 0, duration: 0.2});
                } else if (globalHoveredType === 'ship') {
                    gsap.to(globalHovered.userData.engine.scale, { z: 1, duration: 0.5 }); 
                    gsap.to(globalHovered.userData.engine.material, { emissiveIntensity: 1, duration: 0.5 });
                    gsap.to(globalHovered.userData.light, { intensity: 1500, duration: 0.5 }); 
                    gsap.to(globalHovered.userData.body.rotation, { x: 0.2, duration: 0.5, ease: "power2.out" }); 
                    gsap.to(globalHovered.userData.wireHull.material, { opacity: 0.15, duration: 0.3 });
                    gsap.to(globalHovered.userData.body.position, { x: 0, y: 0, duration: 0.1 }); 
                    gsap.to(globalHovered.userData.text.scale, {x: 0.1, y: 0.1, z: 0.1, duration: 0.4});
                    gsap.to(globalHovered.userData.text.material, {opacity: 0, duration: 0.2});
                }
            }

            globalHovered = currentHit;
            globalHoveredType = currentHitType;

            if (globalHovered) {
                document.body.style.cursor = 'pointer';
                if (globalHoveredType === 'monolith') {
                    gsap.to(globalHovered.userData.cristal.scale, {x: 1.8, y: 4.5, z: 1.8, duration: 0.5, ease: "elastic.out(1, 0.5)"});
                    gsap.to(globalHovered.userData.cristal.material.color, {r: 0.54, g: 0.01, b: 0.01, duration: 0.2}); 
                    gsap.to(globalHovered.userData.wireframe.material, {opacity: 1, duration: 0.2});
                    gsap.to(globalHovered.userData.wireframe.scale, {x: 1.9, y: 4.7, z: 1.9, duration: 0.4});
                    gsap.to(globalHovered.userData.text.scale, {x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.5)"});
                    gsap.to(globalHovered.userData.text.material, {opacity: 1, duration: 0.3});
                } else if (globalHoveredType === 'planet') {
                    gsap.to(globalHovered.userData.planeta.scale, {x: 1.3, y: 1.3, z: 1.3, duration: 0.5, ease: "back.out(2)"});
                    gsap.to(globalHovered.userData.planeta.material.color, {r: 1, g: 0.1, b: 0.1, duration: 0.3}); 
                    gsap.to(globalHovered.userData.wire.scale, {x: 1.4, y: 1.4, z: 1.4, duration: 0.4});
                    gsap.to(globalHovered.userData.wire.material, {opacity: 0.6, duration: 0.2});
                    gsap.to(globalHovered.userData.anillo.scale, {x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "elastic.out(1, 0.4)"});
                    gsap.to(globalHovered.userData.anillo.material, {opacity: 0.9, duration: 0.2});
                    gsap.to(globalHovered.userData.text.scale, {x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.5)"});
                    gsap.to(globalHovered.userData.text.material, {opacity: 1, duration: 0.3});
                } else if (globalHoveredType === 'ship') {
                    gsap.to(globalHovered.userData.engine.scale, { z: 2.5, duration: 0.2 }); 
                    gsap.to(globalHovered.userData.engine.material, { emissiveIntensity: 5, duration: 0.2 });
                    gsap.to(globalHovered.userData.light, { intensity: 8000, duration: 0.2 }); 
                    gsap.to(globalHovered.userData.body.rotation, { x: 0.7, duration: 0.5, ease: "back.out(1.5)" }); 
                    gsap.to(globalHovered.userData.wireHull.material, { opacity: 0.8, duration: 0.3 });
                    gsap.to(globalHovered.userData.text.scale, {x: 1.2, y: 1.2, z: 1.2, duration: 0.6, ease: "elastic.out(1, 0.4)"});
                    gsap.to(globalHovered.userData.text.material, {opacity: 1, duration: 0.3});
                }
            } else {
                document.body.style.cursor = 'default';
            }
        }

        if (globalHovered && !globalHovered.userData.isOpen) {
            if (globalHoveredType === 'monolith') {
                globalHovered.userData.spinGroup.rotation.y += 0.04;
            } else if (globalHoveredType === 'planet') {
                globalHovered.userData.anillo.rotation.z += 0.08; globalHovered.userData.spinGroup.rotation.y += 0.02;
            } else if (globalHoveredType === 'ship') {
                globalHovered.userData.body.position.x = Math.sin(time * 60) * 0.1;
                globalHovered.userData.body.position.y = Math.cos(time * 50) * 0.1;
            }
        }
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();