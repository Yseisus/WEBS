console.log('[EDVYNKARIS CORE] Motor de Frontend Inicializado. Nivel Extremo.');

// ==========================================
// 4. MOTOR MULTI-IDIOMA (ES/EN)
// ==========================================
const i18n = {
    es: {
        nav_home: "Inicio", nav_catalog: "Catálogo", nav_infra: "Infraestructura", nav_contact: "Contacto",
        hero_desc: "LA REVOLUCIÓN DEL SABOR. Alta gastronomía diseñada para paladares exigentes. Una experiencia de e-commerce fluida, rápida y sin interrupciones directo a tu mesa.",
        hero_stat1: "> CALIDAD: INGREDIENTES PREMIUM", hero_stat2: "> LOGÍSTICA: ENVÍO EXPRESS", hero_stat3: "> SATISFACCIÓN: 100% GARANTIZADA",
        btn_catalog: "VER CATÁLOGO", menu_title: "NUESTROS PLATILLOS", menu_subtitle: "[ 10 PLATILLOS DISPONIBLES ]",
        infra_title: "NUESTRA PROMESA", infra_node1_title: "01 // VELOCIDAD", infra_node1_desc: "Preparación y despacho optimizados.",
        infra_node2_title: "02 // SEGURIDAD", infra_node2_desc: "Pagos cifrados y protegidos.", infra_node3_title: "03 // CALIDAD", infra_node3_desc: "Ingredientes frescos cada día.",
        cart_title: "MÓDULO DE COMPRA", cart_total: "TOTAL A FACTURAR: $", btn_checkout: "PROCEDER AL PAGO SEGURO",
        pay_title: "PASARELA BANCARIA", pay_subtitle: "[ CONEXIÓN ENCRIPTADA AL SERVIDOR FINANCIERO ]",
        pay_card: "NÚMERO DE TARJETA (XXXX-XXXX-XXXX-XXXX)", pay_name: "TITULAR DE LA TARJETA", btn_pay: "AUTORIZAR TRANSACCIÓN", btn_back: "VOLVER AL RESUMEN",
        contact_title: "SOPORTE AL CLIENTE", contact_subtitle: "[ TE RESPONDEREMOS A LA BREVEDAD ]",
        contact_name: "TU NOMBRE / EMPRESA", contact_email: "TU CORREO ELECTRÓNICO", contact_msg: "¿EN QUÉ PODEMOS AYUDARTE?", btn_send: "ENVIAR MENSAJE",
        footer_link1: "/ PREGUNTAS FRECUENTES", footer_link2: "/ POLÍTICAS DE ENVÍO", footer_link3: "/ TÉRMINOS LEGALES", footer_copy: "Todos los derechos reservados. EdvynKaris \u00A9 2026.",
        dynamic_add: "Agregar al Carrito", dynamic_added: "¡AÑADIDO!", dynamic_qty: "Cantidad: "
    },
    en: {
        nav_home: "Home", nav_catalog: "Catalog", nav_infra: "Infrastructure", nav_contact: "Contact",
        hero_desc: "THE FLAVOR REVOLUTION. High gastronomy designed for demanding palates. A fluid, fast, and seamless e-commerce experience straight to your table.",
        hero_stat1: "> QUALITY: PREMIUM INGREDIENTS", hero_stat2: "> LOGISTICS: EXPRESS DELIVERY", hero_stat3: "> SATISFACTION: 100% GUARANTEED",
        btn_catalog: "VIEW CATALOG", menu_title: "OUR DISHES", menu_subtitle: "[ 10 DISHES AVAILABLE ]",
        infra_title: "OUR PROMISE", infra_node1_title: "01 // SPEED", infra_node1_desc: "Optimized preparation and dispatch.",
        infra_node2_title: "02 // SECURITY", infra_node2_desc: "Encrypted and protected payments.", infra_node3_title: "03 // QUALITY", infra_node3_desc: "Fresh ingredients every day.",
        cart_title: "PURCHASE MODULE", cart_total: "TOTAL TO BILL: $", btn_checkout: "PROCEED TO SECURE PAYMENT",
        pay_title: "BANK GATEWAY", pay_subtitle: "[ ENCRYPTED CONNECTION TO FINANCIAL SERVER ]",
        pay_card: "CARD NUMBER (XXXX-XXXX-XXXX-XXXX)", pay_name: "CARDHOLDER NAME", btn_pay: "AUTHORIZE TRANSACTION", btn_back: "RETURN TO SUMMARY",
        contact_title: "CUSTOMER SUPPORT", contact_subtitle: "[ WE WILL RESPOND SHORTLY ]",
        contact_name: "YOUR NAME / COMPANY", contact_email: "YOUR EMAIL", contact_msg: "HOW CAN WE HELP YOU?", btn_send: "SEND MESSAGE",
        footer_link1: "/ FAQ", footer_link2: "/ SHIPPING POLICIES", footer_link3: "/ LEGAL TERMS", footer_copy: "All rights reserved. EdvynKaris \u00A9 2026.",
        dynamic_add: "Add to Cart", dynamic_added: "ADDED!", dynamic_qty: "Quantity: "
    }
};
let currentLang = 'es';

// ==========================================
// 1. LÓGICA POO
// ==========================================
class Platillo {
    constructor(id, nombre, precio, descripcion, categoria, imagen) {
        this.id = id; this.nombre = nombre; this.precio = precio;
        this.descripcion = descripcion; this.categoria = categoria; this.imagen = imagen; 
    }
}

class CarritoCore {
    constructor() { this.items = []; }
    agregarNodo(platillo) {
        const itemExistente = this.items.find(item => item.id === platillo.id);
        if (itemExistente) { itemExistente.cantidad++; } 
        else { this.items.push({ ...platillo, cantidad: 1 }); }
        InterfazGrafica.actualizarTerminalCarrito();
    }
    calcularTotal() { return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0); }
    contarNodos() { return this.items.reduce((total, item) => total + item.cantidad, 0); }
    purgar() { this.items = []; InterfazGrafica.actualizarTerminalCarrito(); }
}

const generarPoligonoUnico = (id) => {
    const p1x = (id * 7) % 25; const p1y = (id * 3) % 20;
    const p2x = 75 + ((id * 11) % 25); const p2y = (id * 13) % 20;
    const p3x = 100; const p3y = 40 + ((id * 5) % 20);
    const p4x = 75 + ((id * 17) % 25); const p4y = 80 + ((id * 19) % 20);
    const p5x = (id * 23) % 25; const p5y = 80 + ((id * 29) % 20);
    const p6x = 0; const p6y = 40 + ((id * 31) % 20);
    return `polygon(${p1x}% ${p1y}%, ${p2x}% ${p2y}%, ${p3x}% ${p3y}%, ${p4x}% ${p4y}%, ${p5x}% ${p5y}%, ${p6x}% ${p6y}%)`;
};

class InterfazGrafica {
    static renderizarCategorias(categorias) {
        const contenedor = document.getElementById('categorias-contenedor');
        contenedor.innerHTML = '';
        const animaciones = ['anim-dir-1', 'anim-dir-2', 'anim-dir-3', 'anim-dir-4', 'anim-dir-5'];

        categorias.forEach((catObj, index) => {
            const panel = document.createElement('div');
            panel.className = `lienzo-panel ${animaciones[index]}`;
            panel.style.backgroundImage = `url('${catObj.img}')`;
            panel.innerHTML = `<span class="lienzo-text">${catObj.nombre}</span>`;
            panel.addEventListener('click', () => { InterfazGrafica.abrirTerminalProductos(catObj.nombre, catObj.color); });
            contenedor.appendChild(panel);
        });
    }

    static abrirTerminalProductos(categoria, colorCategoria) {
        const modalProductos = document.getElementById('modal-productos');
        const tituloCategoria = document.getElementById('titulo-categoria');
        const contenedor = document.getElementById('productos-contenedor');
        
        tituloCategoria.textContent = categoria;
        tituloCategoria.style.textShadow = `2px 0 ${colorCategoria}`;
        contenedor.innerHTML = ''; 
        
        const filtrados = baseDeDatosMenu.filter(p => p.categoria === categoria);
        
        filtrados.forEach((producto) => {
            const delay = -(Math.random() * 4).toFixed(2);
            const item = document.createElement('div');
            item.className = 'shard-item';
            item.style.setProperty('--text-color', colorCategoria);
            item.innerHTML = `
                <div class="shard-crystal" style="
                    background-image: url('${producto.imagen}'); 
                    clip-path: ${generarPoligonoUnico(producto.id)};
                    animation-delay: ${delay}s;
                "></div>
                <div class="shard-data">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <span class="precio-neon">$${producto.precio.toFixed(2)}</span>
                    <button class="btn-shard" data-id="${producto.id}">${i18n[currentLang].dynamic_add}</button>
                </div>
            `;
            contenedor.appendChild(item);
        });

        document.querySelectorAll('.btn-shard').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const id = parseInt(e.target.getAttribute('data-id'));
                const platillo = baseDeDatosMenu.find(p => p.id === id);
                nucleoCarrito.agregarNodo(platillo);
                
                const originalText = e.target.textContent;
                e.target.textContent = i18n[currentLang].dynamic_added;
                e.target.style.background = "var(--text-main)";
                e.target.style.color = "var(--bg-main)";
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--text-main)";
                }, 800);
            });
        });

        modalProductos.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    static actualizarTerminalCarrito() {
        document.getElementById('cart-count').textContent = nucleoCarrito.contarNodos();
        const contenedorItems = document.getElementById('carrito-items');
        contenedorItems.innerHTML = '';

        nucleoCarrito.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong style="color: var(--text-main); font-size: 0.9rem; text-transform: uppercase; font-family: 'Inter', sans-serif;">${item.nombre}</strong>
                    <div style="color: var(--text-muted); font-size: 0.8rem; font-family: 'Inter', sans-serif;">${i18n[currentLang].dynamic_qty}${item.cantidad}</div>
                </div>
                <div style="color: var(--accent-red); font-weight: bold; font-size: 1.1rem;">
                    $${(item.precio * item.cantidad).toFixed(2)}
                </div>
            `;
            contenedorItems.appendChild(div);
        });

        document.getElementById('carrito-total').textContent = nucleoCarrito.calcularTotal().toFixed(2);
    }
}

// ==========================================
// 2. BASE DE DATOS INTACTA
// ==========================================
const baseDeDatosMenu = [
    new Platillo(101, "Pizza Fractal", 21.00, "Masa geométrica, pepperoni curado.", "PIZZAS", "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80"),
    new Platillo(102, "Margherita Bin", 18.00, "Mozzarella líquida, albahaca fresca.", "PIZZAS", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80"),
    new Platillo(103, "Carbonara Core", 22.50, "Panceta ahumada al vacío, yema curada.", "PIZZAS", "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=400&q=80"),
    new Platillo(104, "4 Quesos Sync", 24.00, "Blend madurado, trufa blanca, nueces.", "PIZZAS", "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80"),
    new Platillo(105, "Protocolo Veggie", 19.50, "Vegetales al carbón, queso almendras.", "PIZZAS", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80"),
    new Platillo(106, "BBQ Cifrada", 20.00, "Pollo barbacoa, cebolla morada.", "PIZZAS", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80"),
    new Platillo(107, "Hawaiana Null", 18.50, "Piña asada, jamón ahumado.", "PIZZAS", "https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=400&q=80"),
    new Platillo(108, "Pepperoni Loop", 19.00, "Doble capa de pepperoni picante.", "PIZZAS", "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80"),
    new Platillo(109, "Fugazzetta Beta", 17.50, "Cebolla caramelizada, extra queso.", "PIZZAS", "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=400&q=80"),
    new Platillo(110, "Pesto Dinámico", 21.50, "Salsa pesto, tomates cherry asados.", "PIZZAS", "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=400&q=80"),

    new Platillo(201, "Burger Black-Box", 16.50, "Corte Angus sellado, pan carbón.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"),
    new Platillo(202, "Doble Núcleo", 18.00, "Doble carne crujiente, mermelada.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400&q=80"),
    new Platillo(203, "Pollo Encriptado", 15.00, "Pechuga frita, repollo, sriracha.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=400&q=80"),
    new Platillo(204, "Overclock Vegana", 17.00, "Medallón plantas, aguacate texturas.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80"),
    new Platillo(205, "Sistema Trufa", 20.00, "Carne Wagyu, mayonesa trufa negra.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80"),
    new Platillo(206, "Smash Terminal", 14.50, "Carne aplastada, queso fundido.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1594212204737-51c0469b2d86?auto=format&fit=crop&w=400&q=80"),
    new Platillo(207, "Bacon Overflow", 19.00, "Avalancha de tocino crocante.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc5?auto=format&fit=crop&w=400&q=80"),
    new Platillo(208, "Cheddar Script", 16.00, "Piscina de cheddar sobre Angus.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=400&q=80"),
    new Platillo(209, "Crispy Byte", 17.50, "Pollo ultra crujiente, lechuga iceberg.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80"),
    new Platillo(210, "Blue Cheese RAM", 18.50, "Queso azul intenso, cebolla crispy.", "HAMBURGUESAS", "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&q=80"),

    new Platillo(301, "Sushi Array", 14.00, "8 cortes salmón exportación, aguacate.", "SUSHI", "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=400&q=80"),
    new Platillo(302, "Roll Dinámico", 16.00, "Atún picante, tempura, anguila.", "SUSHI", "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80"),
    new Platillo(303, "Matriz Sashimi", 22.00, "12 cortes premium vía algoritmo.", "SUSHI", "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80"),
    new Platillo(304, "Nigiri Render", 12.00, "4 piezas arroz con cortes a soplete.", "SUSHI", "https://images.unsplash.com/photo-1563612116625-3012372fccce?auto=format&fit=crop&w=400&q=80"),
    new Platillo(305, "Ebi Tempura Loop", 15.50, "Camarones crujientes envueltos palta.", "SUSHI", "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80"),
    new Platillo(306, "Maki Glitch", 13.50, "Maki tradicional con pepino y atún.", "SUSHI", "https://images.unsplash.com/photo-1558742569-ceb7596a7516?auto=format&fit=crop&w=400&q=80"),
    new Platillo(307, "Spicy Tuna Hash", 16.50, "Atún macerado extra picante.", "SUSHI", "https://images.unsplash.com/photo-1558985250-27a406d64cb3?auto=format&fit=crop&w=400&q=80"),
    new Platillo(308, "Dragon Roll API", 19.00, "Roll envuelto en aguacate y anguila.", "SUSHI", "https://images.unsplash.com/photo-1617196034738-26c5f7c977ce?auto=format&fit=crop&w=400&q=80"),
    new Platillo(309, "Salmon Proxy", 15.00, "Salmón fresco, queso crema, sésamo.", "SUSHI", "https://images.unsplash.com/photo-1617196034738-26c5f7c977ce?auto=format&fit=crop&w=400&q=80"),
    new Platillo(310, "Geisha Root", 20.00, "Cortes de pulpo y pez blanco sellado.", "SUSHI", "https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&w=400&q=80"),

    new Platillo(401, "Suero Rojo", 6.00, "Limonada frutos, nitrógeno líquido.", "BEBIDA", "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80"),
    new Platillo(402, "Cerveza IP-A", 7.50, "Artesanal lúpulo intenso, baja latencia.", "BEBIDA", "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80"),
    new Platillo(403, "Extracto Neón", 5.00, "Jugo mango, maracuyá y jengibre.", "BEBIDA", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80"),
    new Platillo(404, "Agua Estructurada", 3.00, "Ósmosis inversa con electrolitos.", "BEBIDA", "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80"),
    new Platillo(405, "Cold Brew Terminal", 6.50, "Café macerado 24h, alta cafeína.", "BEBIDA", "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80"),
    new Platillo(406, "Mojito Synthetix", 8.00, "Menta fresca, ron blanco, soda.", "BEBIDA", "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80"),
    new Platillo(407, "Matcha Kernel", 6.00, "Té verde ceremonial molido.", "BEBIDA", "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=400&q=80"),
    new Platillo(408, "Gin Tonic SSL", 9.50, "Ginebra botánica, tónica premium.", "BEBIDA", "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&w=400&q=80"),
    new Platillo(409, "Kombucha Node", 5.50, "Té fermentado con frutos rojos.", "BEBIDA", "https://images.unsplash.com/photo-1598614187854-26a60e982dc4?auto=format&fit=crop&w=400&q=80"),
    new Platillo(410, "Smoothie Cache", 7.00, "Batido de arándanos y proteína.", "BEBIDA", "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=400&q=80"),

    new Platillo(501, "Cubo Chocolate", 9.00, "Mousse cacao 70%, centro frambuesa.", "POSTRES", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80"),
    new Platillo(502, "Cheesecake Glitch", 8.50, "Deconstrucción tarta con almendra.", "POSTRES", "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80"),
    new Platillo(503, "Tiramisú Caché", 9.50, "Mascarpone batido, bizcocho espresso.", "POSTRES", "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80"),
    new Platillo(504, "Helado Cuántico", 7.00, "Dos bolas vainilla, humo de fresa.", "POSTRES", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80"),
    new Platillo(505, "Macarons Sintéticos", 8.00, "Caja 4 macarons rellenos exóticos.", "POSTRES", "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=400&q=80"),
    new Platillo(506, "Brownie Vector", 6.50, "Chocolate denso con nueces pecán.", "POSTRES", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80"),
    new Platillo(507, "Panna Cotta UI", 7.50, "Nata cocida con coulis de maracuyá.", "POSTRES", "https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&w=400&q=80"),
    new Platillo(508, "Donut Cifrada", 4.50, "Masa brioche, glaseado galáctico.", "POSTRES", "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80"),
    new Platillo(509, "Waffle Server", 8.50, "Gofres belgas, sirope de arce real.", "POSTRES", "https://images.unsplash.com/photo-1504382262782-5b4cdccefa0d?auto=format&fit=crop&w=400&q=80"),
    new Platillo(510, "Crepe Firewall", 9.00, "Masa fina, nutella, fresas frescas.", "POSTRES", "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=400&q=80")
];

const categoriasData = [
    { nombre: "PIZZAS", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", color: "#FF003C" },
    { nombre: "HAMBURGUESAS", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", color: "#FF9900" },
    { nombre: "SUSHI", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80", color: "#00E5FF" },
    { nombre: "BEBIDA", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80", color: "#7C3AED" },
    { nombre: "POSTRES", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80", color: "#FF00FF" }
];

const nucleoCarrito = new CarritoCore();

// ==========================================
// 5. EVENTOS PRINCIPALES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Splash Screen Fade Out
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.classList.add('hidden');
        setTimeout(() => splash.style.display = 'none', 800);
    }, 2500);

    // Render Inicial
    InterfazGrafica.renderizarCategorias(categoriasData);

    // Scroll Animaciones
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach(reveal => {
            if (reveal.getBoundingClientRect().top < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Modales Cuchilla
    const toggleModal = (modal, forceClose = false) => {
        if(forceClose || modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    const modalProductos = document.getElementById('modal-productos');
    const closeProductos = document.getElementById('close-productos');
    if(closeProductos) closeProductos.addEventListener('click', () => toggleModal(modalProductos, true));

    // Carrito y Checkout
    const btnCarrito = document.getElementById('btn-carrito');
    const modalCarrito = document.getElementById('modal-carrito');
    const closeCarrito = document.getElementById('close-carrito');
    
    const viewCart = document.getElementById('cart-view');
    const viewCheckout = document.getElementById('checkout-view');
    const btnGoCheckout = document.getElementById('btn-go-checkout');
    const btnBackCart = document.getElementById('btn-back-cart');
    const formPayment = document.getElementById('payment-form');
    const paymentTerminal = document.getElementById('payment-terminal');
    const btnProcesarPago = document.getElementById('btn-procesar-pago');

    if(btnCarrito && modalCarrito) {
        btnCarrito.addEventListener('click', () => toggleModal(modalCarrito));
        closeCarrito.addEventListener('click', () => {
            toggleModal(modalCarrito, true);
            setTimeout(() => { viewCart.style.display = 'block'; viewCheckout.style.display = 'none'; paymentTerminal.style.display = 'none'; }, 600);
        });
        
        btnGoCheckout.addEventListener('click', () => {
            if(nucleoCarrito.items.length === 0) {
                alert("Operación denegada: Carrito vacío.");
                return;
            }
            viewCart.style.display = 'none';
            viewCheckout.style.display = 'block';
        });

        btnBackCart.addEventListener('click', (e) => {
            e.preventDefault();
            viewCheckout.style.display = 'none';
            viewCart.style.display = 'block';
        });

        formPayment.addEventListener('submit', (e) => {
            e.preventDefault();
            btnProcesarPago.style.display = 'none';
            btnBackCart.style.display = 'none';
            paymentTerminal.style.display = 'flex';
            
            const txtInit = currentLang === 'es' ? '_ Iniciando protocolo de cifrado bancario...' : '_ Initiating bank encryption protocol...';
            const txtSec = currentLang === 'es' ? '_ Estableciendo túnel seguro con el banco...' : '_ Establishing secure tunnel with bank...';
            const txtVal = currentLang === 'es' ? '_ Validando tarjeta y CVV...' : '_ Validating card and CVV...';
            const txtAuth = currentLang === 'es' ? '_ Autorizando pago de fondos...' : '_ Authorizing payment...';
            const txtSucc = currentLang === 'es' ? '_ [ ÉXITO ] PAGO APROBADO. PEDIDO ENVIADO A COCINA.' : '_ [ SUCCESS ] PAYMENT APPROVED. ORDER SENT TO KITCHEN.';

            paymentTerminal.innerHTML = `<p>${txtInit}</p>`;
            setTimeout(() => {
                paymentTerminal.innerHTML += `<p>${txtSec}</p>`;
                setTimeout(() => {
                    paymentTerminal.innerHTML += `<p>${txtVal}</p>`;
                    setTimeout(() => {
                        paymentTerminal.innerHTML += `<p style="color: var(--accent-red);">${txtAuth}</p>`;
                        setTimeout(() => {
                            paymentTerminal.innerHTML += `<p style="color: #0f0;">${txtSucc}</p>`;
                            setTimeout(() => {
                                nucleoCarrito.purgar();
                                toggleModal(modalCarrito, true);
                                setTimeout(() => {
                                    formPayment.reset();
                                    viewCart.style.display = 'block';
                                    viewCheckout.style.display = 'none';
                                    paymentTerminal.style.display = 'none';
                                    btnProcesarPago.style.display = 'block';
                                    btnBackCart.style.display = 'block';
                                }, 600);
                            }, 3000);
                        }, 1200);
                    }, 1200);
                }, 1200);
            }, 800);
        });
    }

    // Modal Contacto
    const btnContacto = document.getElementById('btn-contacto');
    const modalContacto = document.getElementById('modal-contacto');
    const closeContacto = document.getElementById('close-contacto');
    if(btnContacto && modalContacto) {
        btnContacto.addEventListener('click', (e) => { e.preventDefault(); toggleModal(modalContacto); });
        closeContacto.addEventListener('click', () => toggleModal(modalContacto, true));
    }
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay') && e.target.id !== 'modal-productos') { toggleModal(e.target, true); }
        if (e.target.classList.contains('blade-overlay')) { toggleModal(e.target, true); }
    });

    // 2. SOCIAL FAB (Botón Flotante)
    const btnSocial = document.getElementById('btn-social-fab');
    const menuSocial = document.getElementById('social-menu');
    btnSocial.addEventListener('click', () => {
        menuSocial.classList.toggle('active');
    });

    // 3. MODO OSCURO / CLARO
    const btnTheme = document.getElementById('btn-theme');
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        btnTheme.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀';
    });

    // 4. MULTI-IDIOMA (ES/EN) CON TRANSICIÓN SUAVE
    const btnLang = document.getElementById('btn-lang');
    btnLang.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        btnLang.textContent = currentLang === 'es' ? 'EN' : 'ES';
        
        const elementsToTranslate = document.querySelectorAll('[data-i18n], [data-i18n-ph]');
        
        // Fase 1: Ocultar (Fade out)
        elementsToTranslate.forEach(el => el.classList.add('lang-transitioning'));
        
        // Fase 2: Cambiar texto y Mostrar (Fade in) después de 300ms
        setTimeout(() => {
            elementsToTranslate.forEach(el => {
                const keyI18n = el.getAttribute('data-i18n');
                const keyPh = el.getAttribute('data-i18n-ph');
                
                if (keyI18n && i18n[currentLang][keyI18n]) {
                    if(el.id !== 'carrito-total') {
                        el.innerHTML = i18n[currentLang][keyI18n];
                    }
                }
                
                if (keyPh && i18n[currentLang][keyPh]) {
                    el.setAttribute('placeholder', i18n[currentLang][keyPh]);
                }
                
                // Caso especial carrito total (preservar el span interior)
                if (keyI18n === 'cart_total') {
                    el.innerHTML = `${i18n[currentLang].cart_total}<span id="carrito-total" style="color: var(--accent-red);">${nucleoCarrito.calcularTotal().toFixed(2)}</span>`;
                }

                el.classList.remove('lang-transitioning');
            });

            // Re-renderizar productos si el modal está abierto para actualizar el botón "Agregar"
            const modalProductos = document.getElementById('modal-productos');
            if (modalProductos.classList.contains('active')) {
                const catActual = document.getElementById('titulo-categoria').textContent;
                const catData = categoriasData.find(c => c.nombre === catActual);
                if(catData) InterfazGrafica.abrirTerminalProductos(catData.nombre, catData.color);
            }
            
            InterfazGrafica.actualizarTerminalCarrito();
        }, 300);
    });
});