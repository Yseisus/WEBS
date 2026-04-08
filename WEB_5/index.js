document.addEventListener('DOMContentLoaded', () => {
    console.log('EdvynKaris Engine Iniciado. Levantando Motor 3D y Modales Visuales...');

    // ==========================================
    // MOTOR DE CARTAS DINÁMICAS (MODALES VISUALES)
    // ==========================================
    // Base de datos de productos para la carta (solo muestra)
    const menuData = {
        sides: [
            { name: 'Palitos de Ajo Artesanales', desc: 'Con extra queso parmesano madurado y salsa marinara casera.', price: 5.00 },
            { name: 'Alitas a la Leña (8 un.)', desc: 'Bañadas en salsa BBQ ahumada con el toque de la casa.', price: 8.50 },
            { name: 'Papas Rústicas', desc: 'Papas cortadas a mano con queso fundido, tocino y ciboulette fresco.', price: 6.50 },
            { name: 'Aros de Cebolla', desc: 'Aros crujientes acompañados de nuestra salsa ranch especial.', price: 4.50 },
            { name: 'Pan de Ajo Supremo', desc: 'Masa de fermentación lenta rellena de mozzarella y ajo rostizado.', price: 7.00 }
        ],
        drinks: [
            { name: 'Limonada Natural', desc: 'Menta fresca, jengibre y limón sutil.', price: 3.50 },
            { name: 'Cerveza Artesanal', desc: 'IPA o Amber Ale de barril, 330cc. (Solo para mayores).', price: 5.50 },
            { name: 'Vino Tinto de la Casa', desc: 'Copa de Cabernet Sauvignon, ideal para carnes y quesos.', price: 6.00 },
            { name: 'Bebidas Tradicionales', desc: 'Formato individual o familiar. Coca-Cola, Sprite, Fanta.', price: 2.00 },
            { name: 'Agua Mineral', desc: 'Agua de manantial con o sin gas, 500ml.', price: 1.50 }
        ]
    };

    const modalOverlay = document.getElementById('menu-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalItemsContainer = document.getElementById('modal-items-container');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Escuchador para abrir modales según la categoría clickeada
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            openModal(target);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Cerrar si se clickea fuera del recuadro
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    function openModal(categoryKey) {
        modalItemsContainer.innerHTML = ''; // Limpiamos inyecciones anteriores
        
        const isSides = categoryKey === 'sides';
        modalTitle.textContent = isSides ? 'Especialidades de la Casa' : 'Bebidas y Licores';
        const items = menuData[categoryKey];

        // Solo inyectamos la información (Sin botones de compra)
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.innerHTML = `
                <div class="menu-item-header">
                    <h4>${item.name}</h4>
                    <span class="price">$${item.price.toFixed(2)}</span>
                </div>
                <p class="menu-item-desc">${item.desc}</p>
            `;
            modalItemsContainer.appendChild(card);
        });

        modalOverlay.classList.add('active');
    }


    // ==========================================
    // MOTOR 3D - VITRINA DE INGREDIENTES
    // ==========================================
    const container = document.getElementById('canvas-mesa');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 18, 5); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Iluminación ajustada para resaltar sobre la losa oscura
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 15, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const materials = {
        dough: new THREE.MeshStandardMaterial({ color: 0xddb682, roughness: 0.9 }),
        sauce: new THREE.MeshStandardMaterial({ color: 0x990f02, roughness: 0.4 }),
        cheese: new THREE.MeshStandardMaterial({ color: 0xfada5e, roughness: 0.3 }),
        pepperoni: new THREE.MeshStandardMaterial({ color: 0x8a0303, roughness: 0.6 }),
        mushroom: new THREE.MeshStandardMaterial({ color: 0xa89f91, roughness: 0.8 }),
        olive: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }),
        onion: new THREE.MeshStandardMaterial({ color: 0xe6e6fa, roughness: 0.5 }),
        pepper: new THREE.MeshStandardMaterial({ color: 0x228b22, roughness: 0.5 }),
        ham: new THREE.MeshStandardMaterial({ color: 0xffa07a, roughness: 0.6 }),
        tomato: new THREE.MeshStandardMaterial({ color: 0xff4500, roughness: 0.4 }),
        basil: new THREE.MeshStandardMaterial({ color: 0x006400, roughness: 0.7 })
    };

    const geometries = {
        dough: new THREE.CylinderGeometry(3.8, 3.8, 0.2, 64),
        sauce: new THREE.CylinderGeometry(3.5, 3.5, 0.05, 64),
        cheese: new THREE.CylinderGeometry(3.4, 3.4, 0.06, 64),
        pepperoni: new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32),
        mushroom: new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        olive: new THREE.TorusGeometry(0.15, 0.08, 16, 32),
        onion: new THREE.TorusGeometry(0.3, 0.04, 16, 32),
        pepper: new THREE.BoxGeometry(0.4, 0.1, 0.15),
        ham: new THREE.BoxGeometry(0.5, 0.05, 0.5),
        tomato: new THREE.CylinderGeometry(0.45, 0.45, 0.04, 32),
        basil: new THREE.SphereGeometry(0.2, 16, 8)
    };

    const interactableObjects = [];
    const stationsGroup = new THREE.Group(); 
    const pizzaGroup = new THREE.Group();    
    scene.add(stationsGroup);
    scene.add(pizzaGroup);

    const basePizza = new THREE.Mesh(geometries.dough, materials.dough);
    basePizza.position.set(0, 0, 0);
    basePizza.receiveShadow = true;
    pizzaGroup.add(basePizza);

    const ingredientsConfig = [
        { id: 'salsa', name: 'Salsa', type: 'base', geo: geometries.sauce, mat: materials.sauce, x: -5.2, z: -3.5 },
        { id: 'queso', name: 'Queso', type: 'base', geo: geometries.cheese, mat: materials.cheese, x: -5.2, z: -1.75 },
        { id: 'pepperoni', name: 'Pepperoni', type: 'topping', geo: geometries.pepperoni, mat: materials.pepperoni, x: -5.2, z: 0 },
        { id: 'jamon', name: 'Jamón', type: 'topping', geo: geometries.ham, mat: materials.ham, x: -5.2, z: 1.75 },
        { id: 'tomate', name: 'Tomate', type: 'topping', geo: geometries.tomato, mat: materials.tomato, x: -5.2, z: 3.5 },
        { id: 'champinon', name: 'Champiñón', type: 'topping', geo: geometries.mushroom, mat: materials.mushroom, x: 5.2, z: -3.5 },
        { id: 'aceituna', name: 'Aceituna', type: 'topping', geo: geometries.olive, mat: materials.olive, x: 5.2, z: -1.75 },
        { id: 'cebolla', name: 'Cebolla', type: 'topping', geo: geometries.onion, mat: materials.onion, x: 5.2, z: 0 },
        { id: 'pimiento', name: 'Pimiento', type: 'topping', geo: geometries.pepper, mat: materials.pepper, x: 5.2, z: 1.75 },
        { id: 'albahaca', name: 'Albahaca', type: 'topping', geo: geometries.basil, mat: materials.basil, x: 5.2, z: 3.5 }
    ];

    ingredientsConfig.forEach(ing => {
        const plateMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0x2c1e16 })); // Platos madera oscura
        plateMesh.position.set(ing.x, 0.05, ing.z);
        plateMesh.receiveShadow = true;
        stationsGroup.add(plateMesh);

        const mesh = new THREE.Mesh(ing.geo, ing.mat);
        mesh.position.set(ing.x, 0.3, ing.z);
        if (ing.id === 'aceituna' || ing.id === 'cebolla') mesh.rotation.x = Math.PI / 2;
        
        mesh.castShadow = true;
        mesh.userData = { isButton: true, config: ing, baseScale: 1 };
        
        const scaleUp = ing.type === 'base' ? 0.2 : 1.5;
        mesh.scale.set(scaleUp, scaleUp, scaleUp);
        mesh.userData.baseScale = scaleUp;

        stationsGroup.add(mesh);
        interactableObjects.push(mesh);
    });

    const actionStack = []; 
    let currentYHeight = 0.1; 

    function addIngredientToPizza(config) {
        const actionGroup = new THREE.Group();
        if (config.type === 'base') {
            const mesh = new THREE.Mesh(config.geo, config.mat);
            mesh.position.set(0, currentYHeight, 0);
            mesh.receiveShadow = true;
            actionGroup.add(mesh);
            currentYHeight += 0.06; 
        } else {
            const count = Math.floor(Math.random() * 5) + 6;
            for (let i = 0; i < count; i++) {
                const mesh = new THREE.Mesh(config.geo, config.mat);
                const radius = Math.random() * 3.3;
                const angle = Math.random() * Math.PI * 2;
                mesh.position.set(Math.cos(angle) * radius, currentYHeight + (Math.random() * 0.05), Math.sin(angle) * radius);
                mesh.rotation.y = Math.random() * Math.PI;
                if (config.id === 'aceituna' || config.id === 'cebolla') mesh.rotation.x = Math.PI / 2;
                mesh.castShadow = true;
                actionGroup.add(mesh);
            }
            currentYHeight += 0.02; 
        }
        pizzaGroup.add(actionGroup); 
        actionStack.push({ group: actionGroup, type: config.type });
    }

    const selectPreset = document.getElementById('preset-pizzas');
    const recipes = {
        margarita: ['salsa', 'queso', 'albahaca'],
        pepperoni: ['salsa', 'queso', 'pepperoni'],
        vegetariana: ['salsa', 'queso', 'champinon', 'cebolla', 'pimiento', 'aceituna', 'tomate'],
        napolitana: ['salsa', 'queso', 'tomate', 'aceituna', 'albahaca'],
        carnivora: ['salsa', 'queso', 'pepperoni', 'jamon']
    };

    function clearPizza() {
        while (actionStack.length > 0) {
            const lastAction = actionStack.pop();
            pizzaGroup.remove(lastAction.group);
        }
        currentYHeight = 0.1; 
    }

    selectPreset.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'custom') return;
        clearPizza(); 
        if (recipes[type]) {
            recipes[type].forEach(ingId => {
                const config = ingredientsConfig.find(c => c.id === ingId);
                if (config) addIngredientToPizza(config);
            });
        }
    });

    document.getElementById('btn-undo').addEventListener('click', () => {
        if (actionStack.length > 0) {
            const lastAction = actionStack.pop();
            pizzaGroup.remove(lastAction.group);
            if (lastAction.type === 'base') currentYHeight -= 0.06;
            else currentYHeight -= 0.02;
            selectPreset.value = 'custom'; 
        }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tooltip = document.getElementById('ingredient-tooltip');
    let hoveredObject = null;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        tooltip.style.left = (event.clientX) + 'px';
        tooltip.style.top = (event.clientY) + 'px';
    });

    container.addEventListener('click', () => {
        if (hoveredObject && hoveredObject.userData.isButton) {
            addIngredientToPizza(hoveredObject.userData.config);
            selectPreset.value = 'custom'; 
            const origY = hoveredObject.position.y;
            hoveredObject.position.y -= 0.1;
            setTimeout(() => hoveredObject.position.y = origY, 100);
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        pizzaGroup.rotation.y += 0.002;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects);

        if (hoveredObject) hoveredObject.scale.set(hoveredObject.userData.baseScale, hoveredObject.userData.baseScale, hoveredObject.userData.baseScale);

        if (intersects.length > 0) {
            hoveredObject = intersects[0].object;
            const s = hoveredObject.userData.baseScale * 1.3; 
            hoveredObject.scale.set(s, s, s);
            container.style.cursor = 'pointer';
            tooltip.style.display = 'block';
            tooltip.textContent = hoveredObject.userData.config.name;
        } else {
            hoveredObject = null;
            container.style.cursor = 'default';
            tooltip.style.display = 'none';
        }
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if(!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});