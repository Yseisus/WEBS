// ==========================================
// 1. MOTOR AUDIO REACTIVO
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, dataArray, fuenteAudio;
const elementoAudio = document.getElementById('pista-audio');
let audioActivo = false;
const btnAudio = document.getElementById('btn-audio');

async function inicializarAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128; 
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        fuenteAudio = audioCtx.createMediaElementSource(elementoAudio);
        fuenteAudio.connect(analyser);
        analyser.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
}

btnAudio.addEventListener('click', async () => {
    await inicializarAudio();
    
    if (elementoAudio.paused) {
        try {
            await elementoAudio.play();
            audioActivo = true;
            btnAudio.innerText = "AUDIO: ON";
        } catch (err) {
            console.error("Error reproduciendo audio:", err);
            audioActivo = false;
            btnAudio.innerText = "ERROR AUDIO";
        }
    } else {
        elementoAudio.pause();
        audioActivo = false;
        btnAudio.innerText = "AUDIO: OFF";
    }
});

function playHaptic(frecuencia, tipo, duracion) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = tipo; osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duracion);
}

// ==========================================
// 2. SISTEMAS DE INTERFAZ Y TOUR
// ==========================================
let agujeroNegro = false;
const cursorTour = document.getElementById('cursor-tour');
let tourActivo = false;
let tourX = window.innerWidth/2, tourY = window.innerHeight/2;

function animarTour() {
    if(!tourActivo) return;
    raton.x = tourX; raton.y = tourY; 
    cursorTour.style.left = tourX + 'px'; cursorTour.style.top = tourY + 'px';
    requestAnimationFrame(animarTour);
}

function moverA(tx, ty, duracion) {
    return new Promise(resolve => {
        let startX = tourX; let startY = tourY; let startTime = null;
        function paso(timestamp) {
            if(!startTime) startTime = timestamp;
            let progreso = (timestamp - startTime) / duracion;
            if(progreso > 1) progreso = 1;
            let ease = progreso < 0.5 ? 2 * progreso * progreso : 1 - Math.pow(-2 * progreso + 2, 2) / 2;
            tourX = startX + (tx - startX) * ease; tourY = startY + (ty - startY) * ease;
            if(progreso < 1) requestAnimationFrame(paso); else resolve();
        }
        requestAnimationFrame(paso);
    });
}
function esperar(ms) { return new Promise(r => setTimeout(r, ms)); }

document.getElementById('btn-tour').addEventListener('click', async () => {
    if(tourActivo) return;
    tourActivo = true; cursorTour.style.display = 'block'; animarTour();
    window.scrollTo({top: 0, behavior: 'smooth'}); await esperar(1000);

    agujeroNegro = true;
    cursorTour.style.transform = "translate3d(-50%, -50%, 0) scale(1.5)";
    cursorTour.style.background = "#ff3333";
    await esperar(2000);
    agujeroNegro = false;
    cursorTour.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    cursorTour.style.background = "var(--texto-puro)";

    const btnRect = document.getElementById('btn-menu').getBoundingClientRect();
    await moverA(btnRect.left + 25, btnRect.top + 25, 1500);
    if(!document.getElementById('nav-vanguardia').classList.contains('abierto')){
        document.getElementById('btn-menu').click(); 
    }
    await esperar(1000);
    
    canvas.classList.add('modo-icono');
    
    const nNav = document.querySelector('[data-target="nosotros"]').getBoundingClientRect();
    await moverA(nNav.left + 50, nNav.top + 30, 1000); await esperar(1500); 
    
    const sNav = document.querySelector('[data-target="servicios"]').getBoundingClientRect();
    await moverA(sNav.left + 50, sNav.top + 30, 1000); await esperar(1500);
    
    canvas.classList.remove('modo-icono');
    
    await moverA(window.innerWidth / 2, window.innerHeight / 2, 1000);
    document.getElementById('btn-menu').click(); await esperar(500);
    
    window.scrollBy({top: window.innerHeight, behavior: 'smooth'});
    await esperar(2000);
    
    tourActivo = false; cursorTour.style.display = 'none'; raton.x = null; raton.y = null;
});

const contBtn = document.getElementById('contenedor-btn');
const btnMenu = document.getElementById('btn-menu');
const navVanguardia = document.getElementById('nav-vanguardia');
let arrastrando = false; let offsetX, offsetY;

contBtn.addEventListener('mousedown', (e) => { arrastrando = true; offsetX = e.clientX - contBtn.getBoundingClientRect().left; offsetY = e.clientY - contBtn.getBoundingClientRect().top; contBtn.style.transition = 'none'; });
window.addEventListener('mousemove', (e) => {
    if(tourActivo) return; 
    if (arrastrando) { contBtn.style.left = `${e.clientX - offsetX}px`; contBtn.style.top = `${e.clientY - offsetY}px`; } 
    else {
        const rect = contBtn.getBoundingClientRect(); const x = rect.left + rect.width / 2; const y = rect.top + rect.height / 2;
        const dx = e.clientX - x; const dy = e.clientY - y;
        const distSq = dx*dx + dy*dy; // Optimizado: Evitar raíz cuadrada si no es necesario
        if(distSq < 6400) { btnMenu.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(1.05)`; } 
        else { btnMenu.style.transform = `translate(0px, 0px) scale(1)`; }
    }
}, {passive: true});
window.addEventListener('mouseup', () => { arrastrando = false; });
btnMenu.addEventListener('click', async (e) => {
    if (!audioCtx || audioCtx.state !== 'running') audioCtx = new AudioContext();
    playHaptic(150, 'triangle', 0.1); 
    if(!arrastrando) { btnMenu.classList.toggle('activo'); navVanguardia.classList.toggle('abierto'); }
});

window.addEventListener('mousedown', (e) => { if(e.button === 0 && !tourActivo && !e.target.closest('.btn-menu') && !e.target.closest('.nav-vanguardia')) agujeroNegro = true; });
window.addEventListener('mouseup', () => agujeroNegro = false);

const btnContraste = document.getElementById('btn-contraste');
let esAltoContraste = false;
btnContraste.addEventListener('click', () => {
    if (audioCtx) playHaptic(800, 'square', 0.1); 
    esAltoContraste = !esAltoContraste;
    document.body.classList.toggle('alto-contraste');
});

// --- TRADUCCIÓN ORGÁNICA (AQUÍ ESTÁ LA MAGIA CORREGIDA) ---
const diccionario = {
    es: { 
        nav1: 'INICIO', nav2: 'NOSOTROS', nav3: 'SERVICIOS', nav4: 'CONTACTO', btn_inv: 'Inverso', 
        t1a: 'Mundo De', t1b: 'Partículas.', p1: ' | Web con temática "partículas"', 
        t2a: 'Sobre', t2b: 'Nosotros.', p2: '| Somos más que una empresa de desarrollo, somos una familia.', 
        t3a: 'Soluciones', t3b: 'A Medida.', srv1_t: 'Plataformas UI', srv1_p: 'Interfaces inmersivas que retienen al usuario, equipadas con texturas fractales creadas por código CSS.', 
        srv2_t: 'Comercio Dinámico', srv2_p: 'Sistemas optimizados para la conversión. Arquitectura sólida, reactiva e instantánea.', 
        t4a: 'Hablemos del', t4b: 'Futuro.', btn_ctc: 'Iniciar Proyecto', 
        ftr: '© 2026 - EdvynKaris. Todos los derechos reservados.' 
    },
    en: { 
        nav1: 'HOME', nav2: 'ABOUT', nav3: 'SERVICES', nav4: 'CONTACT', btn_inv: 'Inverse', 
        t1a: 'World Of', t1b: 'Particles.', p1: ' | Web with "particles" theme', 
        t2a: 'About', t2b: 'Us.', p2: '| We are more than a development company, we are a family.', 
        t3a: 'Tailored', t3b: 'Solutions.', srv1_t: 'UI Platforms', srv1_p: 'Immersive interfaces that retain users, equipped with fractal textures coded in CSS.', 
        srv2_t: 'Dynamic Commerce', srv2_p: 'Systems optimized for conversion. Solid, reactive, and instant architecture.', 
        t4a: 'Lets talk', t4b: 'Future.', btn_ctc: 'Start Project', 
        ftr: '© 2026 - EdvynKaris. All rights reserved.' 
    }
};
let idiomaActual = 'es';
const btnIdioma = document.getElementById('btn-idioma');

function efectoDesencriptar(elemento, textoFinal) {
    let caracteres = '!<>-_\\\\/[]{}—=+*^?#________'; let iteraciones = 0;
    let finalArray = textoFinal.split(''); let maxLen = Math.max(elemento.innerText.length, finalArray.length);
    if(elemento.dataset.intervaloId) clearInterval(elemento.dataset.intervaloId);
    let intervalo = setInterval(() => {
        let txt = '';
        for(let i=0; i<maxLen; i++) {
            if(i < iteraciones / 2) { txt += finalArray[i] || ''; } else { txt += caracteres[Math.floor(Math.random() * caracteres.length)]; }
        }
        elemento.innerText = txt;
        if(iteraciones >= maxLen * 2) { clearInterval(intervalo); elemento.innerText = textoFinal; }
        iteraciones++;
    }, 25); 
    elemento.dataset.intervaloId = intervalo;
}

btnIdioma.addEventListener('click', () => {
    if (audioCtx) playHaptic(300, 'sawtooth', 0.1); 
    idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
    document.querySelectorAll('.traducible').forEach(el => { let key = el.getAttribute('data-i18n'); if(diccionario[idiomaActual][key]) efectoDesencriptar(el, diccionario[idiomaActual][key]); });
});

// --- MENÚ CONTEXTUAL ---
const menuContextual = document.getElementById('menu-contextual');
window.addEventListener('contextmenu', (e) => {
    e.preventDefault(); menuContextual.style.left = `${e.clientX}px`; menuContextual.style.top = `${e.clientY}px`;
    menuContextual.classList.add('visible'); 
    if (audioCtx) playHaptic(900, 'square', 0.05);
});
window.addEventListener('click', (e) => { if(!e.target.closest('#menu-contextual')) menuContextual.classList.remove('visible'); });
document.getElementById('ctx-copiar').addEventListener('click', () => { navigator.clipboard.writeText(window.location.href); document.getElementById('ctx-copiar').innerText = "¡Copiado!"; setTimeout(() => { document.getElementById('ctx-copiar').innerText = "Copiar URL local"; }, 2000); });
document.getElementById('ctx-oscuro').addEventListener('click', () => { btnContraste.click(); });
document.getElementById('ctx-alerta').addEventListener('click', () => { if (audioCtx) playHaptic(200, 'triangle', 0.5); });

// ==========================================
// 3. MOTOR GRÁFICO (PARTÍCULAS Y VISUAL MASTER)
// ==========================================
// OPTIMIZACIÓN: Se retira willReadFrequently del canvas principal para forzar aceleración por hardware
const canvas = document.getElementById('lienzo'); const ctx = canvas.getContext('2d', { alpha: true });
const h1 = document.getElementById('datos-titulo'); const textoPrincipal = h1.innerText;

let particulas = []; const resolucion = 2; 
let raton = { x: null, y: null };
let estadoActual = 'titulo'; let estadoConexion = 'online'; 

let tiltX = 0, tiltY = 0; 
window.addEventListener('deviceorientation', (e) => { tiltX = e.gamma ? e.gamma * 2 : 0; tiltY = e.beta ? e.beta * 2 : 0; }, {passive: true});
let pixelesIconos = { 'inicio': [], 'nosotros': [], 'servicios': [], 'contacto': [], 'boss': [] };

class Particula {
    constructor(x, y) {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.destinoX = x; this.destinoY = y;
        this.fondoX = Math.random() * canvas.width; this.fondoY = Math.random() * canvas.height;
        this.enIcono = false; this.iconoX = 0; this.iconoY = 0;
        this.friccion = Math.random() * 0.04 + 0.02; 
        this.vyCaida = 0; this.vyMatrix = Math.random() * 4 + 2; 
    }
    actualizar() {
        if (estadoConexion === 'offline') {
            this.vyCaida += 0.5; this.y += this.vyCaida;
            if (this.y > canvas.height) { this.y = canvas.height; this.vyCaida *= -0.3; } return; 
        }
        this.vyCaida = 0; 

        if (agujeroNegro && raton.x) {
            let dxMouse = raton.x - this.x; let dyMouse = raton.y - this.y;
            this.x += dxMouse * 0.15; this.y += dyMouse * 0.15;
            return; 
        }

        if(estadoActual === 'matrix') {
            this.y += this.vyMatrix;
            if(this.y > canvas.height) { this.y = -10; this.x = this.fondoX; } return;
        }
        if (estadoActual === 'boss') {
            this.x += (this.iconoX - this.x) * (this.friccion * 1.5); this.y += (this.iconoY - this.y) * (this.friccion * 1.5);
        }
        else if (estadoActual === 'titulo') {
            let dxMouse = raton.x - this.x; let dyMouse = raton.y - this.y;
            let distSq = dxMouse*dxMouse + dyMouse*dyMouse;
            if (distSq < 6400 && raton.x !== null) { // Opt: Solo calcular Sqrt si está dentro del radio
                let distMouse = Math.sqrt(distSq);
                let fuerza = (80 - distMouse) / 80;
                this.x -= (dxMouse / distMouse) * fuerza * 15; this.y -= (dyMouse / distMouse) * fuerza * 15;
            } else {
                this.x += (this.destinoX - this.x) * this.friccion; this.y += (this.destinoY - this.y) * this.friccion;
            }
        } else { 
            if (this.enIcono) {
                this.x += (this.iconoX - this.x) * 0.4; this.y += (this.iconoY - this.y) * 0.4;
            } else {
                let dxMouse = raton.x - this.x; let dyMouse = raton.y - this.y;
                let distSq = dxMouse*dxMouse + dyMouse*dyMouse;
                let targetX = this.fondoX + tiltX; let targetY = this.fondoY + tiltY;
                if (distSq < 22500 && raton.x !== null) { // 150*150
                    let distMouse = Math.sqrt(distSq);
                    let atraccion = (150 - distMouse) / 150;
                    targetX += (dxMouse * atraccion * 0.5); targetY += (dyMouse * atraccion * 0.5);
                }
                this.x += (targetX - this.x) * (this.friccion * 1.5); this.y += (targetY - this.y) * (this.friccion * 1.5);
            }
        }
    }
}

function generarPixelesIcono(tipo) {
    let tCanvas = document.createElement('canvas'); const size = tipo === 'boss' ? 200 : 60; 
    tCanvas.width = size; tCanvas.height = size; 
    let tCtx = tCanvas.getContext('2d', { willReadFrequently: true }); // Solo temporal
    tCtx.strokeStyle = 'white'; tCtx.fillStyle = 'white'; tCtx.lineWidth = 2; tCtx.lineCap = 'round'; tCtx.lineJoin = 'round';
    const c = size / 2;
    if (tipo === 'inicio') { tCtx.beginPath(); tCtx.moveTo(c, 10); tCtx.lineTo(10, 30); tCtx.lineTo(20, 30); tCtx.lineTo(20, 50); tCtx.lineTo(40, 50); tCtx.lineTo(40, 30); tCtx.lineTo(50, 30); tCtx.closePath(); tCtx.stroke(); tCtx.strokeRect(25, 35, 10, 15); tCtx.fillRect(32, 42, 2, 2); } 
    else if (tipo === 'nosotros') { tCtx.beginPath(); tCtx.arc(c, 22, 8, 0, Math.PI * 2); tCtx.stroke(); tCtx.beginPath(); tCtx.arc(c, 50, 16, Math.PI, Math.PI * 2); tCtx.stroke(); tCtx.setLineDash([2, 4]); tCtx.beginPath(); tCtx.arc(c, c, 26, 0, Math.PI * 2); tCtx.stroke(); tCtx.setLineDash([]); } 
    else if (tipo === 'servicios') { tCtx.beginPath(); for (let i = 0; i < 6; i++) { let angle = (Math.PI / 3) * i - (Math.PI / 6); if (i === 0) tCtx.moveTo(c + 22 * Math.cos(angle), c + 22 * Math.sin(angle)); else tCtx.lineTo(c + 22 * Math.cos(angle), c + 22 * Math.sin(angle)); } tCtx.closePath(); tCtx.stroke(); tCtx.beginPath(); tCtx.moveTo(c, c); tCtx.lineTo(c + 22 * Math.cos(-Math.PI/6), c + 22 * Math.sin(-Math.PI/6)); tCtx.moveTo(c, c); tCtx.lineTo(c + 22 * Math.cos(Math.PI/2), c + 22 * Math.sin(Math.PI/2)); tCtx.moveTo(c, c); tCtx.lineTo(c + 22 * Math.cos(7*Math.PI/6), c + 22 * Math.sin(7*Math.PI/6)); tCtx.stroke(); }
    else if (tipo === 'contacto') { tCtx.beginPath(); tCtx.rect(12, 18, 36, 24); tCtx.stroke(); tCtx.beginPath(); tCtx.moveTo(12, 18); tCtx.lineTo(c, 32); tCtx.lineTo(48, 18); tCtx.stroke(); }
    else if (tipo === 'boss') { tCtx.lineWidth = 4; tCtx.strokeRect(60, 40, 80, 80); tCtx.fillStyle = 'red'; tCtx.fillRect(75, 60, 20, 20); tCtx.fillRect(105, 60, 20, 20); tCtx.strokeRect(70, 100, 60, 10); tCtx.beginPath(); tCtx.moveTo(100, 120); tCtx.lineTo(100, 150); tCtx.stroke(); }

    let imgData = tCtx.getImageData(0, 0, size, size); let puntos = [];
    for (let y = 0; y < size; y++) { for (let x = 0; x < size; x++) { if (imgData.data[(y * size + x) * 4 + 3] > 50) puntos.push({x: x - c, y: y - c}); } }
    return puntos;
}

function iniciar() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    pixelesIconos['inicio'] = generarPixelesIcono('inicio'); pixelesIconos['nosotros'] = generarPixelesIcono('nosotros');
    pixelesIconos['servicios'] = generarPixelesIcono('servicios'); pixelesIconos['contacto'] = generarPixelesIcono('contacto'); pixelesIconos['boss'] = generarPixelesIcono('boss');
    particulas = []; 
    
    // Canvas temporal para calcular posiciones del texto (Mejora HW)
    let tempCanvas = document.createElement('canvas'); tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
    let tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    
    tempCtx.fillStyle = 'white'; tempCtx.font = '700 130px "Space Grotesk", sans-serif'; 
    tempCtx.textAlign = 'center'; tempCtx.textBaseline = 'middle'; tempCtx.fillText(textoPrincipal, tempCanvas.width / 2, tempCanvas.height / 2);
    
    const datosTexto = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height); 
    for (let y = 0; y < datosTexto.height; y += resolucion) { for (let x = 0; x < datosTexto.width; x += resolucion) { if (datosTexto.data[(y * 4 * datosTexto.width) + (x * 4) + 3] > 128) particulas.push(new Particula(x, y)); } }
}

let velocidadScrollSmoothed = 0;
let globalBassScale = 0; 

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let isGlitch = Math.random() < 0.01;
    if(isGlitch) { ctx.save(); ctx.translate(Math.random()*15 - 7.5, Math.random()*15 - 7.5); }

    if(audioActivo && analyser && dataArray && !elementoAudio.paused) {
        analyser.getByteFrequencyData(dataArray);
        let bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
        let normalizedBass = bass / 255;
        globalBassScale = Math.pow(normalizedBass, 3) * 15; 
    } else { globalBassScale = 0; }

    // 1. UPDATE LÓGICA (Separado del render)
    for (let i = 0; i < particulas.length; i++) { particulas[i].actualizar(); }

    // 2. RENDER LÍNEAS (Optimizado: Algoritmo de Ventana O(N) pseudo, batching BeginPath)
    if (estadoActual === 'fondo' && estadoConexion === 'online' && !raton.x && !esAltoContraste) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 0.5;
        ctx.beginPath(); 
        for (let i = 0; i < particulas.length; i += 4) {
            let p1 = particulas[i];
            if (p1.enIcono) continue;
            let maxJ = Math.min(particulas.length, i + 60); // Limitar búsqueda hacia adelante
            for (let j = i + 4; j < maxJ; j += 4) {
                let p2 = particulas[j];
                if(!p2.enIcono) {
                    let dx = p1.x - p2.x; let dy = p1.y - p2.y;
                    if (dx*dx + dy*dy < 1600) { ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); }
                }
            }
        }
        ctx.stroke(); 
    }
    
    // 3. RENDER PARTICULAS (Optimizado: Batching por Estado de Color)
    let colorRGB = estadoConexion === 'offline' ? '255, 51, 51' : (esAltoContraste ? '0, 0, 0' : '255, 255, 255');
    let tamBase = resolucion + globalBassScale;
    
    // Pasada 1: Partículas tenues (Ahorra miles de cambios de fillStyle)
    ctx.fillStyle = `rgba(${colorRGB}, 0.5)`;
    for (let i = 0; i < particulas.length; i++) {
        let p = particulas[i];
        if (!(p.enIcono || estadoActual === 'titulo' || estadoActual === 'boss')) {
            if(estadoActual === 'matrix') ctx.fillRect(p.x, p.y, tamBase, tamBase + 4); 
            else ctx.fillRect(p.x, p.y, tamBase, tamBase);
        }
    }

    // Pasada 2: Partículas sólidas (Iconos / Titulo / Boss)
    ctx.fillStyle = `rgba(${colorRGB}, 1.0)`;
    for (let i = 0; i < particulas.length; i++) {
        let p = particulas[i];
        if (p.enIcono || estadoActual === 'titulo' || estadoActual === 'boss') {
            if(p.enIcono || estadoActual === 'boss') ctx.fillRect(p.x, p.y, tamBase - 0.5, tamBase - 0.5);
            else ctx.fillRect(p.x, p.y, tamBase, tamBase);
        }
    }
    
    if(isGlitch) { ctx.restore(); }

    velocidadScrollSmoothed *= 0.92; 
    let pesoFuente = Math.min(700, 300 + (velocidadScrollSmoothed * 5));
    document.querySelectorAll('.anim-peso').forEach(el => { el.style.fontVariationSettings = `"wght" ${pesoFuente}`; });

    requestAnimationFrame(animar);
}

let temporizadorMatrix;
function resetearInactividad() {
    if(estadoActual === 'matrix') { estadoActual = window.scrollY > 50 ? 'fondo' : 'titulo'; }
    clearTimeout(temporizadorMatrix);
    temporizadorMatrix = setTimeout(() => { if(estadoActual !== 'boss' && !tourActivo) { estadoActual = 'matrix'; } }, 15000); 
}

const barraProgreso = document.getElementById('barra-progreso'); let ultimoScroll = window.scrollY;
window.addEventListener('scroll', () => {
    resetearInactividad(); if (estadoActual === 'boss') return; 
    let scrollActual = window.scrollY; let deltaScroll = Math.abs(scrollActual - ultimoScroll);
    velocidadScrollSmoothed += deltaScroll; ultimoScroll = scrollActual;
    
    let alturaTotal = document.body.scrollHeight - window.innerHeight;
    barraProgreso.style.width = `${(scrollActual / alturaTotal) * 100}%`;

    if (scrollActual > 50) { if(estadoActual !== 'matrix') estadoActual = 'fondo';  } 
    else { if(estadoActual !== 'matrix') estadoActual = 'titulo'; particulas.forEach(p => p.enIcono = false); }
}, {passive: true}); // Optimización de listener de scroll

const contRutas = document.getElementById('contenedor-rutas');
const enlaces = document.querySelectorAll('.enlace-nav');
enlaces.forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault(); let objetivo = e.currentTarget.getAttribute('href'); contRutas.classList.add('oculto');
        setTimeout(() => { document.querySelector(objetivo).scrollIntoView(); contRutas.classList.remove('oculto'); if(window.innerWidth < 800) { btnMenu.click(); } }, 400);
    });
    enlace.addEventListener('mouseenter', (e) => {
        if(audioCtx) playHaptic(600, 'sine', 0.05); 
        if (window.scrollY > 50 && estadoActual !== 'boss' && estadoActual !== 'matrix') {
            canvas.classList.add('modo-icono');
            let obj = e.currentTarget.getAttribute('data-target'); let pts = pixelesIconos[obj];
            if(!pts) return;
            let rect = e.currentTarget.getBoundingClientRect(); let cx = rect.left + (rect.width / 2) - 40; let cy = rect.top + (rect.height / 2); 
            for (let i = 0; i < particulas.length; i++) { if (i < pts.length) { particulas[i].enIcono = true; particulas[i].iconoX = cx + pts[i].x; particulas[i].iconoY = cy + pts[i].y; } else { particulas[i].enIcono = false; } }
        }
    });
    enlace.addEventListener('mouseleave', () => { 
        canvas.classList.remove('modo-icono');
        if(estadoActual !== 'boss') particulas.forEach(p => p.enIcono = false); 
    });
});

window.addEventListener('mousemove', (e) => { if(!tourActivo) { resetearInactividad(); raton.x = e.x; raton.y = e.y; } }, {passive: true});
window.addEventListener('mouseout', () => { if(!tourActivo) { raton.x = null; raton.y = null; } });
window.addEventListener('resize', () => { iniciar(); }, {passive: true});
window.addEventListener('keydown', resetearInactividad);

const contenedorEq = document.getElementById('eq-contenedor');
for(let i=0; i<15; i++) { let barra = document.createElement('div'); barra.className = 'barra-eq'; contenedorEq.appendChild(barra); }
const footerOb = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            document.querySelectorAll('.barra-eq').forEach((b, i) => { setTimeout(() => { b.style.height = `${Math.random() * 80 + 20}px`; }, i * 50); });
        } else { entry.target.classList.remove('visible'); document.querySelectorAll('.barra-eq').forEach(b => b.style.height = '0px'); }
    });
}, { threshold: 0.5 });
footerOb.observe(document.getElementById('footer-dinamico'));

const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; let konamiIndex = 0;
window.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            estadoActual = 'boss'; let pts = pixelesIconos['boss'];
            for (let i = 0; i < particulas.length; i++) { if (i < pts.length) { particulas[i].enIcono = false; particulas[i].iconoX = (canvas.width / 2) + pts[i].x; particulas[i].iconoY = (canvas.height / 2) + pts[i].y; } else { particulas[i].iconoX = -500; particulas[i].iconoY = -500; } }
            konamiIndex = 0; setTimeout(() => { estadoActual = window.scrollY > 50 ? 'fondo' : 'titulo'; }, 5000);
        }
    } else { konamiIndex = 0; }
});

document.fonts.ready.then(() => {
    iniciar(); animar(); resetearInactividad();
});