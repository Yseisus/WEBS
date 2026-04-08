document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('world-canvas');
    const scene = new THREE.Scene();
    
    scene.fog = new THREE.FogExp2(0x050507, 0.00015); 

    const cameraRig = new THREE.Group();
    scene.add(cameraRig);
    
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 20000);
    cameraRig.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping; 
    renderer.toneMappingExposure = 1.0;

    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.95; 
    bloomPass.strength = 0.25; 
    bloomPass.radius = 0.5;

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6)); 
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(200, 300, 200);
    scene.add(dirLight);
    
    const fillLight = new THREE.DirectionalLight(0x7B61FF, 0.5); 
    fillLight.position.set(-200, -100, -200);
    scene.add(fillLight);

    let interactables = []; 
    let animables = [];     
    let appState = 'MAIN'; 

    // ==========================================
    //  ENTORNO ESPACIAL MULTIDIRECCIONAL
    // ==========================================

    // 1. Campo Estelar Base
    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 15000; 
    const starsPos = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    const colorSt = new THREE.Color();
    
    for(let i=0; i < starsCount * 3; i+=3) {
        starsPos[i] = (Math.random() - 0.5) * 25000; 
        starsPos[i+1] = (Math.random() - 0.5) * 20000; 
        starsPos[i+2] = (Math.random() - 0.5) * 20000; 
        
        const randColor = Math.random();
        if(randColor > 0.85) colorSt.setHex(0x7B61FF); 
        else if(randColor > 0.6) colorSt.setHex(0x88bbff); 
        else colorSt.setHex(0xffffff); 
        
        starsColors[i] = colorSt.r;
        starsColors[i+1] = colorSt.g;
        starsColors[i+2] = colorSt.b;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    const starsMat = new THREE.PointsMaterial({ size: 1.2, vertexColors: true, transparent: true, opacity: 0.8 });
    const starsMesh = new THREE.Points(starsGeo, starsMat);
    scene.add(starsMesh);

    // 2. Galaxia Espiral (LADO DERECHO: Fondo de Colección X = 5000)
    const galaxiaGroup = new THREE.Group();
    galaxiaGroup.position.set(6000, 1500, -5000); 
    galaxiaGroup.rotation.x = Math.PI / 2.5;
    scene.add(galaxiaGroup);
    galaxiaGroup.userData = { isGalaxy: true };
    animables.push(galaxiaGroup);

    const galaxiaGeo = new THREE.BufferGeometry();
    const galaxiaCount = 20000;
    const galaxiaPos = new Float32Array(galaxiaCount * 3);
    const galaxiaCol = new Float32Array(galaxiaCount * 3);
    const colorCentro = new THREE.Color(0xffaa55); 
    const colorBorde = new THREE.Color(0x7B61FF);  
    const branches = 4; 

    for(let i=0; i<galaxiaCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 3000; 
        const spinAngle = radius * 0.001;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 300;

        galaxiaPos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        galaxiaPos[i3+1] = randomY;
        galaxiaPos[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = colorCentro.clone().lerp(colorBorde, radius / 3000);
        galaxiaCol[i3] = mixedColor.r;
        galaxiaCol[i3+1] = mixedColor.g;
        galaxiaCol[i3+2] = mixedColor.b;
    }
    galaxiaGeo.setAttribute('position', new THREE.BufferAttribute(galaxiaPos, 3));
    galaxiaGeo.setAttribute('color', new THREE.BufferAttribute(galaxiaCol, 3));
    const galaxiaMat = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const galaxiaMesh = new THREE.Points(galaxiaGeo, galaxiaMat);
    galaxiaGroup.add(galaxiaMesh);

    // 3. Planeta Lejano con Anillos (LADO DERECHO LEJANO: Fondo de Nosotros X = 10000)
    const planetGroup = new THREE.Group();
    planetGroup.position.set(12000, -1000, -7000);
    scene.add(planetGroup);
    planetGroup.userData = { isPlanet: true };
    animables.push(planetGroup);

    const planetGeo = new THREE.SphereGeometry(600, 64, 64);
    const planetMat = new THREE.MeshStandardMaterial({ color: 0x11111a, roughness: 0.9, metalness: 0.1, emissive: 0x050510 });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planetGroup.add(planet);

    const ringGeo = new THREE.RingGeometry(800, 1400, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x7B61FF, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
    const planetRing = new THREE.Mesh(ringGeo, ringMat);
    planetRing.rotation.x = Math.PI / 2.2;
    planetGroup.add(planetRing);

    // 4. NUEVO: Nebulosa Estelar (LADO IZQUIERDO: Fondo de Servicios X = -5000)
    const nebulaGroup = new THREE.Group();
    nebulaGroup.position.set(-6000, -800, -5000);
    scene.add(nebulaGroup);
    nebulaGroup.userData = { isNebula: true };
    animables.push(nebulaGroup);

    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaParticles = 8000;
    const nebulaPos = new Float32Array(nebulaParticles * 3);
    const nebulaColors = new Float32Array(nebulaParticles * 3);
    for(let i=0; i<nebulaParticles*3; i+=3) {
        const r = 1800 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        nebulaPos[i] = r * Math.sin(phi) * Math.cos(theta);
        nebulaPos[i+1] = r * Math.sin(phi) * Math.sin(theta) * 0.4; 
        nebulaPos[i+2] = r * Math.cos(phi);

        const randC = Math.random();
        nebulaColors[i] = randC > 0.5 ? 0.1 : 0.0;     // R
        nebulaColors[i+1] = randC > 0.5 ? 0.8 : 0.4;   // G (Cian)
        nebulaColors[i+2] = 1.0;                       // B
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    const nebulaMat = new THREE.PointsMaterial({ size: 4.5, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 });
    const nebulaMesh = new THREE.Points(nebulaGeo, nebulaMat);
    nebulaGroup.add(nebulaMesh);

    // 5. NUEVO: Agujero Negro / Singularidad (LADO IZQUIERDO LEJANO: Fondo de Contacto X = -10000)
    const voidGroup = new THREE.Group();
    voidGroup.position.set(-11000, 1200, -6000);
    scene.add(voidGroup);
    voidGroup.userData = { isVoid: true };
    animables.push(voidGroup);

    const voidSphere = new THREE.Mesh(
        new THREE.SphereGeometry(350, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000 }) 
    );
    voidGroup.add(voidSphere);

    const accretionGeo = new THREE.RingGeometry(400, 1000, 64);
    const accretionMat = new THREE.MeshBasicMaterial({ 
        color: 0xff4422, side: THREE.DoubleSide, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending 
    });
    const accretionMesh = new THREE.Mesh(accretionGeo, accretionMat);
    accretionMesh.rotation.x = Math.PI / 1.7;
    voidGroup.add(accretionMesh);


    // ==========================================
    // LOGICA PRINCIPAL E INSTANCIAS
    // ==========================================

    let fontGlobal = null;
    const loader = new THREE.FontLoader();
    const textureLoader = new THREE.TextureLoader();
    
    let currentScrollZ = 150; 
    let targetZ = 150;
    cameraRig.position.z = 150; 
    const maxScroll = -4800; 

    let carrito = [];
    let totalPrecio = 0;
    const checkoutGroup = new THREE.Group();
    scene.add(checkoutGroup);

    const distanciaFija = 80;

    const cartCountDOM = document.getElementById('cart-count');
    const uiCartBtn = document.getElementById('ui-cart-btn');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const btnCancelar = document.getElementById('btn-cancelar');
    const checkoutForm = document.getElementById('real-checkout-form');

    loader.load('https://unpkg.com/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        fontGlobal = font;

        //  DIMENSIÓN 0: PASILLO PRINCIPAL 
        crearTexto('EDVYNKARIS', 14, 0.4, 0xffffff, 0, 10, 0, scene, false, 0);

        // PORTALES CON NUEVAS COORDENADAS (IZQUIERDA Y DERECHA)
        const shapeCatalogo = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 1.5, 128, 32), materialPremium(0xffffff));
        shapeCatalogo.position.set(0, 10, -800);
        shapeCatalogo.userData = { isPortal: true, targetX: 5000, targetY: 0, targetZ: distanciaFija }; // Derecha
        scene.add(shapeCatalogo);
        interactables.push(shapeCatalogo); animables.push(shapeCatalogo);
        crearTexto('COLECCION', 2, 0.1, 0xaaaaaa, 0, -12, -800, scene, false, 0);

        const shapeServicios = new THREE.Mesh(new THREE.TorusGeometry(12, 1.5, 32, 100), materialPremium(0x7B61FF));
        shapeServicios.position.set(0, 10, -1600);
        shapeServicios.userData = { isPortal: true, targetX: -5000, targetY: 0, targetZ: distanciaFija }; // Izquierda
        scene.add(shapeServicios);
        interactables.push(shapeServicios); animables.push(shapeServicios);
        crearTexto('SERVICIOS', 2, 0.1, 0xaaaaaa, 0, -12, -1600, scene, false, 0);

        const shapeInfo = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 0), materialPremium(0x333333));
        shapeInfo.position.set(0, 10, -2400);
        shapeInfo.userData = { isPortal: true, targetX: 10000, targetY: 0, targetZ: 140 }; // Derecha Lejos
        scene.add(shapeInfo);
        interactables.push(shapeInfo); animables.push(shapeInfo);
        crearTexto('NOSOTROS', 2, 0.1, 0xaaaaaa, 0, -12, -2400, scene, false, 0);

        const shapeContacto = new THREE.Mesh(new THREE.TetrahedronGeometry(10, 0), materialPremium(0xffffff));
        shapeContacto.position.set(0, 10, -3200);
        shapeContacto.userData = { isPortal: true, targetX: -10000, targetY: 0, targetZ: distanciaFija }; // Izquierda Lejos
        scene.add(shapeContacto);
        interactables.push(shapeContacto); animables.push(shapeContacto);
        crearTexto('CONTACTO', 2, 0.1, 0xaaaaaa, 0, -12, -3200, scene, false, 0);

        //  DIMENSIÓN 5 & 6: FOOTER
        const redes = [
            { id: 'IG', url: 'https://instagram.com/EdvynKaris' }, 
            { id: 'X', url: 'https://x.com/EdvynKaris' },  
            { id: 'TK', url: 'https://tiktok.com/@EdvynKaris' }, 
            { id: 'LI', url: 'https://linkedin.com/company/edvynkaris' }, 
            { id: 'FB', url: 'https://facebook.com/EdvynKaris' }  
        ];

        redes.forEach((red, i) => {
            const pX = (i - 2) * 15; 
            const btnRed = crearTexto(red.id, 2, 0.1, 0xffffff, pX, 4, -4000, scene, true, 0);
            btnRed.userData = { isSocial: true, originalZ: -4000, url: red.url };
        });

        for(let i=0; i<2; i++){
            const ring = new THREE.Mesh(new THREE.TorusGeometry(35, 0.2, 32, 100), materialPremium(0x7B61FF));
            ring.position.set(0, 10, -4800);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            scene.add(ring);
            ring.userData = { isRing: true, speedX: 0.005, speedY: 0.005 };
            animables.push(ring);
        }

        crearTexto('EDVYNKARIS', 5, 0.2, 0xffffff, 0, 10, -4800, scene, false, 0);
        const btnArriba = crearTexto('VOLVER AL INICIO', 1.5, 0.1, 0x888888, 0, -5, -4800, scene, true, 0);
        btnArriba.userData = { isUpBtn: true };

        // =====================================
        // CONSTRUCCIÓN DE LAS HABITACIONES
        // =====================================

        //  INSTANCIA 1: COLECCIÓN (DERECHA X=5000)
        crearBotonVolver(5000, 30, 0);
        crearTexto('COLECCION', 4, 0.1, 0xffffff, 5000, 20, 0, scene, false, 0);
        
        const dataProductos = [
            { nombre: 'ZAPATILLA URBAN', precio: 120, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400' },
            { nombre: 'CHAQUETA NEO', precio: 85, img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400' },
            { nombre: 'RELOJ QUANTUM', precio: 250, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400' },
            { nombre: 'GAFAS VOID', precio: 45, img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400' },
            { nombre: 'BOLSO TECH', precio: 90, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400' }
        ];

        dataProductos.forEach((prod, i) => {
            const gap = 32; 
            const pX = 5000 + (i - 2) * gap;
            const pZ = -Math.abs(i - 2) * 8; 
            const rotY = (i - 2) * -0.1; 
            crearTarjeta(prod.img, pX, 3, pZ, rotY);
            crearTexto(prod.nombre, 1.2, 0.05, 0xffffff, pX, -14, pZ, scene, false, rotY);
            crearTexto(`$${prod.precio}.00`, 1, 0.05, 0xaaaaaa, pX, -17, pZ, scene, false, rotY);
            const btnAdd = crearTexto('AGREGAR AL CARRO', 1, 0.1, 0x7B61FF, pX, -22, pZ, scene, true, rotY);
            btnAdd.userData = { isAddBtn: true, item: prod, oZ: pZ }; 
        });

        //  INSTANCIA 2: SERVICIOS (IZQUIERDA X=-5000)
        crearBotonVolver(-5000, 30, 0);
        crearTexto('SERVICIOS', 4, 0.1, 0xffffff, -5000, 20, 0, scene, false, 0);
        
        const dataServicios = [
            { nombre: 'CORTE CLASICO', precio: 15, img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400' },
            { nombre: 'PERFILADO BARBA', precio: 10, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=400' },
            { nombre: 'CORTE PREMIUM', precio: 25, img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400' },
            { nombre: 'TINTE FANTASIA', precio: 40, img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400' },
            { nombre: 'SPA FACIAL', precio: 30, img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400' } 
        ];

        dataServicios.forEach((serv, i) => {
            const gap = 32;
            const pX = -5000 + (i - 2) * gap;
            const pZ = -Math.abs(i - 2) * 8;
            const rotY = (i - 2) * -0.1;
            crearTarjeta(serv.img, pX, 3, pZ, rotY);
            crearTexto(serv.nombre, 1.2, 0.05, 0xffffff, pX, -14, pZ, scene, false, rotY);
            crearTexto(`$${serv.precio}.00`, 1, 0.05, 0xaaaaaa, pX, -17, pZ, scene, false, rotY);
            const btnAdd = crearTexto('AGREGAR AL CARRO', 1, 0.1, 0x7B61FF, pX, -22, pZ, scene, true, rotY);
            btnAdd.userData = { isAddBtn: true, item: serv, oZ: pZ };
        });

        //  INSTANCIA 3: INFO (DERECHA LEJOS X=10000)
        crearBotonVolver(10000, 30, 0);
        const gapInfo = 90;
        crearTexto('VISION', 4, 0.1, 0xaaaaaa, 10000 - gapInfo, 10, 0, scene, false, 0);
        crearTexto('Revolucionar el SaaS', 1.5, 0.05, 0xffffff, 10000 - gapInfo, 0, 0, scene, false, 0);
        crearTexto('TECNOLOGIA', 5, 0.2, 0xffffff, 10000, 0, 0, scene, false, 0);
        crearTexto('EdvynKaris Engine', 2, 0.1, 0xaaaaaa, 10000, -8, 0, scene, false, 0);
        crearTexto('SOPORTE', 4, 0.1, 0xaaaaaa, 10000 + gapInfo, -10, 0, scene, false, 0);
        crearTexto('24/7 B2B', 1.5, 0.05, 0xffffff, 10000 + gapInfo, -20, 0, scene, false, 0);

        //  INSTANCIA 4: CONTACTO (IZQUIERDA LEJOS X=-10000)
        crearBotonVolver(-10000, 30, 0);
        crearTexto('SOPORTE Y CONTACTO', 4, 0.1, 0xffffff, -10000, 20, 0, scene, false, 0);
        crearTexto('Email: soporte@edvynkaris.com', 2, 0.05, 0xaaaaaa, -10000, 5, 0, scene, false, 0);
        crearTexto('Sede Central: Valparaiso, Chile', 2, 0.05, 0xaaaaaa, -10000, -5, 0, scene, false, 0);
        crearTexto('Telefono: +56 9 8765 4321', 2, 0.05, 0xaaaaaa, -10000, -15, 0, scene, false, 0);


        //  ZONA DE CHECKOUT (Mantenemos en X=20000 para no perdernos)
        const btnVolverPasillo = crearTexto('VOLVER', 1.5, 0.1, 0x888888, 20000, 30, 0, scene, true, 0);
        btnVolverPasillo.userData = { isBackBtn: true };
        crearTexto('RESUMEN DE ORDEN', 4, 0.1, 0xffffff, 20000, 20, 0, scene, false, 0);
        const btnPagar = crearTexto('CONTINUAR COMPRA', 2, 0.1, 0x7B61FF, 20000, -25, 0, scene, true, 0);
        btnPagar.userData = { isPayButton: true };
        actualizarRenderCheckout();

        //  ZONA PAGO EXITOSO (X=30000)
        crearTexto('ORDEN CONFIRMADA', 5, 0.2, 0xffffff, 30000, 10, 0, scene, false, 0);
        crearTexto('Recibirás los detalles en tu correo.', 1.5, 0.05, 0xaaaaaa, 30000, 0, 0, scene, false, 0);
        const btnSeguir = crearTexto('SEGUIR EXPLORANDO', 1.5, 0.1, 0x7B61FF, 30000, -15, 0, scene, true, 0);
        btnSeguir.userData = { isUpBtn: true }; 

        // ====== LÓGICA DEL PRELOADER ======
        setTimeout(() => {
            const loaderOverlay = document.getElementById('loader-overlay');
            if(loaderOverlay) loaderOverlay.classList.add('fade-out'); 
            
            gsap.fromTo(cameraRig.position, 
                { z: 600 }, 
                { z: 150, duration: 3, ease: "power3.out" } 
            );
        }, 2500); 

    });

    // --- FUNCIONES CORE ---
    function materialPremium(colorHex) {
        return new THREE.MeshPhysicalMaterial({
            color: colorHex, metalness: 0.3, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1, emissive: colorHex, emissiveIntensity: 0.2 
        });
    }

    function crearTexto(texto, size, depth, color, x, y, z, padre, esBoton, rotY = 0) {
        if (!fontGlobal) return;
        const geom = new THREE.TextGeometry(texto, {
            font: fontGlobal, size: size, height: depth, curveSegments: 16, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.01
        });
        geom.computeBoundingBox();
        const offset = -0.5 * (geom.boundingBox.max.x - geom.boundingBox.min.x);
        geom.translate(offset, 0, 0);

        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.2, metalness: 0.5 });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotY;
        padre.add(mesh);
        
        if (esBoton) interactables.push(mesh);
        return mesh;
    }

    function crearBotonVolver(x, y, z) {
        const btn = crearTexto('VOLVER', 1.5, 0.1, 0x888888, x, y, z, scene, true, 0);
        btn.userData = { isBackBtn: true };
        return btn;
    }

    function crearTarjeta(imgUrl, x, y, z, rotY) {
        const geo = new THREE.PlaneGeometry(22, 30); 
        textureLoader.load(imgUrl, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            const mat = new THREE.MeshStandardMaterial({ map: texture, color: 0xffffff, roughness: 0.5, metalness: 0.1 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.rotation.y = rotY;
            scene.add(mesh);
            
            const edges = new THREE.EdgesGeometry(geo);
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }));
            mesh.add(line);
        });
    }

    function actualizarIconoCarrito() {
        cartCountDOM.innerText = carrito.length;
        gsap.fromTo(uiCartBtn, { scale: 1.1 }, { scale: 1, duration: 0.3 });
    }

    function actualizarRenderCheckout() {
        while(checkoutGroup.children.length > 0){ checkoutGroup.remove(checkoutGroup.children[0]); }
        checkoutGroup.position.set(20000, 0, 0);

        if (carrito.length === 0) {
            crearTexto('El carrito esta vacio', 1.5, 0.05, 0x555555, 0, 8, 0, checkoutGroup, false, 0);
            return;
        }

        let startY = 8;
        carrito.forEach((item, i) => {
            crearTexto(`${item.nombre}  -  $${item.precio}.00`, 1.2, 0.05, 0xcccccc, 0, startY - (i*4), 0, checkoutGroup, false, 0);
        });

        crearTexto(`TOTAL: $${totalPrecio}.00`, 2, 0.1, 0xffffff, 0, startY - (carrito.length*4) - 6, 0, checkoutGroup, false, 0);
    }

    // --- INTERACCIONES DOM Y 3D ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDraggingInstance = false;
    let prevMouseX = 0; let prevMouseY = 0;

    uiCartBtn.addEventListener('click', () => {
        appState = 'INSTANCE';
        gsap.to(cameraRig.position, { x: 20000, y: 0, z: 80, duration: 1.5, ease: "power3.inOut" });
        gsap.to(camera.rotation, { x: 0, y: 0, duration: 1.5 });
    });

    btnCancelar.addEventListener('click', () => {
        checkoutOverlay.classList.add('hidden');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutOverlay.classList.add('hidden');
        carrito = []; totalPrecio = 0;
        actualizarIconoCarrito();
        actualizarRenderCheckout();
        gsap.to(cameraRig.position, { x: 30000, y: 0, z: 80, duration: 1.5, ease: "power3.inOut" });
    });

    window.addEventListener('mousedown', (e) => {
        if (appState === 'INSTANCE' && e.target.tagName === 'CANVAS') {
            isDraggingInstance = true;
            prevMouseX = e.clientX; prevMouseY = e.clientY;
            document.body.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mouseup', (e) => {
        isDraggingInstance = false;
        if(e.target.tagName === 'CANVAS') document.body.style.cursor = 'default';
    });

    window.addEventListener('click', (e) => {
        if (isDraggingInstance || e.target.tagName !== 'CANVAS') return; 

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactables);

        if (intersects.length > 0) {
            const obj = intersects[0].object;

            if (obj.userData.isPortal) {
                if (appState === 'MAIN') currentScrollZ = cameraRig.position.z;
                appState = 'INSTANCE';
                gsap.to(cameraRig.position, { x: obj.userData.targetX, y: obj.userData.targetY, z: obj.userData.targetZ, duration: 1.5, ease: "power3.inOut" });
                gsap.to(camera.rotation, { x: 0, y: 0, duration: 1.5 });
            }

            if (obj.userData.isBackBtn) {
                appState = 'MAIN';
                gsap.to(cameraRig.position, { x: 0, y: 0, z: currentScrollZ, duration: 1.5, ease: "power3.inOut" });
            }

            if (obj.userData.isAddBtn) {
                const item = obj.userData.item;
                carrito.push(item);
                totalPrecio += item.precio;
                actualizarIconoCarrito();
                actualizarRenderCheckout();
                gsap.to(obj.position, { z: obj.userData.oZ + 3, duration: 0.1, yoyo: true, repeat: 1 });
            }
            
            if (obj.userData.isPayButton) {
                if(carrito.length === 0) return; 
                checkoutOverlay.classList.remove('hidden');
            }

            if (obj.userData.isSocial) {
                gsap.to(obj.position, { z: obj.userData.originalZ + 5, duration: 0.1, yoyo: true, repeat: 1 });
                setTimeout(() => { window.open(obj.userData.url, '_blank'); }, 150);
            }

            if (obj.userData.isUpBtn) {
                targetZ = 150; appState = 'MAIN';
                gsap.to(cameraRig.position, { x: 0, y: 0, z: 150, duration: 2.5, ease: "power3.inOut" });
            }
        }
    });

    window.addEventListener('wheel', (e) => {
        if (appState === 'MAIN' && checkoutOverlay.classList.contains('hidden')) {
            gsap.killTweensOf(cameraRig.position);
            targetZ -= e.deltaY * 1.2; 
            if (targetZ > 150) targetZ = 150; 
            if (targetZ < maxScroll) targetZ = maxScroll; 
        }
    });

    let targetRotationX = 0, targetRotationY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (appState === 'INSTANCE' && isDraggingInstance) {
            cameraRig.rotation.y -= (e.clientX - prevMouseX) * 0.005;
            cameraRig.rotation.x -= (e.clientY - prevMouseY) * 0.005;
            prevMouseX = e.clientX; prevMouseY = e.clientY;
        } else if (appState === 'MAIN') {
            targetRotationY = (mouse.x * -0.10);
            targetRotationX = (mouse.y * 0.10);
        }
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (appState === 'MAIN') {
            if (!gsap.isTweening(cameraRig.position)) {
                cameraRig.position.z += (targetZ - cameraRig.position.z) * 0.08;
            }
            camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
            camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;
        }

        // Animaciones individuales según el tipo de cuerpo celeste
        animables.forEach((item, i) => {
            if (item.userData && item.userData.isRing) {
                item.rotation.x += item.userData.speedX;
                item.rotation.y += item.userData.speedY;
            } else if (item.userData && item.userData.isGalaxy) {
                item.rotation.y -= 0.0005; 
            } else if (item.userData && item.userData.isPlanet) {
                item.rotation.y += 0.001;
            } else if (item.userData && item.userData.isNebula) {
                item.rotation.y += 0.0008; // Rotación suave de la nube de gas
            } else if (item.userData && item.userData.isVoid) {
                item.rotation.y -= 0.003; // El disco de acreción gira rápido
                item.rotation.z += 0.0005;
            } else if (item.rotation) {
                item.rotation.x = time * (0.3 + i * 0.05);
                item.rotation.y = time * 0.5;
                item.position.y = 10 + Math.sin(time * 1.5 + i) * 2;
            }
        });

        raycaster.setFromCamera(mouse, camera);
        const hovers = raycaster.intersectObjects(interactables);
        if (hovers.length > 0 && !isDraggingInstance) {
            document.body.style.cursor = 'pointer';
        } else if (!isDraggingInstance) {
            document.body.style.cursor = 'default';
        }

        composer.render();
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});