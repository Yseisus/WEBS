document.addEventListener("DOMContentLoaded", () => {
    // === BASE DE DATOS DE DEMOSTRACIÓN ===
    const baseDatosLentes = [
        // Sol
        { id: 's1', tipo: 'sol', nombre: 'OBSIDIAN V1', spec: 'POLARIZADO UV400', precio: '$120.000', img: 'img/lentes-sol.png' },
        { id: 's2', tipo: 'sol', nombre: 'NOVA RAY', spec: 'ESPEJADO TÁCTICO', precio: '$135.000', img: 'img/lentes-sol.png' },
        { id: 's3', tipo: 'sol', nombre: 'SOLARIS X', spec: 'FOTOCROMÁTICO', precio: '$150.000', img: 'img/lentes-sol.png' },
        { id: 's4', tipo: 'sol', nombre: 'ECLIPSE', spec: 'FILTRO ALTO CONTRASTE', precio: '$110.000', img: 'img/lentes-sol.png' },
        { id: 's5', tipo: 'sol', nombre: 'ZENITH PRO', spec: 'POLARIZADO HD', precio: '$145.000', img: 'img/lentes-sol.png' },
        
        // Lectura
        { id: 'l1', tipo: 'lectura', nombre: 'CODEX ZERO', spec: 'ANTI-REFLEJO BÁSICO', precio: '$65.000', img: 'img/lentes-lectura.png' },
        { id: 'l2', tipo: 'lectura', nombre: 'SCRIBE V2', spec: 'MONOFOCAL DIGITAL', precio: '$85.000', img: 'img/lentes-lectura.png' },
        { id: 'l3', tipo: 'lectura', nombre: 'FOCUS PRIME', spec: 'MULTIFOCAL', precio: '$190.000', img: 'img/lentes-lectura.png' },
        { id: 'l4', tipo: 'lectura', nombre: 'LEXICON', spec: 'CRISTAL ULTRADELGADO', precio: '$120.000', img: 'img/lentes-lectura.png' },
        { id: 'l5', tipo: 'lectura', nombre: 'SCHOLAR X', spec: 'MONOFOCAL HD', precio: '$95.000', img: 'img/lentes-lectura.png' },

        // Descanso (Bloqueo Azul)
        { id: 'd1', tipo: 'descanso', nombre: 'AURA SHIELD', spec: 'BLUE BLOCK 410', precio: '$75.000', img: 'img/lentes-descanso.png' },
        { id: 'd2', tipo: 'descanso', nombre: 'ZEN OPTIC', spec: 'FILTRO LUZ AZUL HD', precio: '$85.000', img: 'img/lentes-descanso.png' },
        { id: 'd3', tipo: 'descanso', nombre: 'NITE SHIFT', spec: 'ANTI-FATIGA VISUAL', precio: '$90.000', img: 'img/lentes-descanso.png' },
        { id: 'd4', tipo: 'descanso', nombre: 'RELAX V5', spec: 'BLUE BLOCK PREMIUM', precio: '$110.000', img: 'img/lentes-descanso.png' },
        { id: 'd5', tipo: 'descanso', nombre: 'SERENE PRO', spec: 'CRISTAL RELAJANTE', precio: '$105.000', img: 'img/lentes-descanso.png' },

        // Deportivos
        { id: 'p1', tipo: 'deportivos', nombre: 'VELOCITY X', spec: 'AERODINÁMICO / ANTI-VAHO', precio: '$160.000', img: 'img/lentes-deportivo.png' },
        { id: 'p2', tipo: 'deportivos', nombre: 'AERO SHIELD', spec: 'POLICARBONATO IMPACTO', precio: '$140.000', img: 'img/lentes-deportivo.png' },
        { id: 'p3', tipo: 'deportivos', nombre: 'SPRINT V2', spec: 'LENTE ENVOLVENTE', precio: '$130.000', img: 'img/lentes-deportivo.png' },
        { id: 'p4', tipo: 'deportivos', nombre: 'TITAN FLEX', spec: 'MONTURA ULTRA-LIGERA', precio: '$175.000', img: 'img/lentes-deportivo.png' },
        { id: 'p5', tipo: 'deportivos', nombre: 'RAPTOR VISION', spec: 'CONTRASTE DINÁMICO', precio: '$155.000', img: 'img/lentes-deportivo.png' },

        // Infantiles
        { id: 'i1', tipo: 'infantiles', nombre: 'SPARK MINI', spec: 'MONTURA FLEXIBLE', precio: '$55.000', img: 'img/lentes-infantiles.png' },
        { id: 'i2', tipo: 'infantiles', nombre: 'JOY RIDE', spec: 'ANTI-IMPACTO', precio: '$60.000', img: 'img/lentes-infantiles.png' },
        { id: 'i3', tipo: 'infantiles', nombre: 'COMET LITE', spec: 'BLUE BLOCK KIDS', precio: '$70.000', img: 'img/lentes-infantiles.png' },
        { id: 'i4', tipo: 'infantiles', nombre: 'BUBBLE SHIELD', spec: 'RESISTENCIA EXTREMA', precio: '$65.000', img: 'img/lentes-infantiles.png' },
        { id: 'i5', tipo: 'infantiles', nombre: 'MINI RAY', spec: 'POLARIZADO INFANTIL', precio: '$80.000', img: 'img/lentes-infantiles.png' }
    ];

    // === LÓGICA DE INTERFAZ ===
    const ruleta = document.getElementById("ruleta");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const itemsLente = document.querySelectorAll(".item-lente");
    
    const seccionRuleta = document.getElementById("seccion-ruleta");
    const seccionCatalogo = document.getElementById("seccion-catalogo");
    const btnVolver = document.getElementById("btn-volver");
    const tituloCatalogo = document.getElementById("titulo-catalogo");
    const grillaCatalogo = document.getElementById("grilla-catalogo");

    let anguloActual = 0;
    const anguloPorItem = 72; 

    // Controles Ruleta
    btnNext.addEventListener("click", () => {
        anguloActual -= anguloPorItem;
        ruleta.style.transform = `rotateY(${anguloActual}deg)`;
    });

    btnPrev.addEventListener("click", () => {
        anguloActual += anguloPorItem;
        ruleta.style.transform = `rotateY(${anguloActual}deg)`;
    });

    // Clic en un lente para abrir su catálogo
    itemsLente.forEach(item => {
        item.addEventListener("click", () => {
            const tipoLente = item.getAttribute("data-tipo");
            
            // 1. Filtrar base de datos
            const productosFiltrados = baseDatosLentes.filter(prod => prod.tipo === tipoLente);
            
            // 2. Limpiar e inyectar productos al HTML
            grillaCatalogo.innerHTML = "";
            productosFiltrados.forEach(prod => {
                const htmlProducto = `
                    <div class="visor-producto">
                        <img src="${prod.img}" alt="${prod.nombre}">
                        <div class="info-tecnica">
                            <h4>${prod.nombre}</h4>
                            <span class="spec">${prod.spec}</span>
                            <span class="precio">${prod.precio}</span>
                        </div>
                    </div>
                `;
                grillaCatalogo.innerHTML += htmlProducto;
            });

            // 3. Cambiar vistas
            seccionRuleta.classList.add("oculto");
            seccionCatalogo.classList.remove("oculto");
            
            const titulo = tipoLente.charAt(0).toUpperCase() + tipoLente.slice(1);
            tituloCatalogo.textContent = `CATÁLOGO: ${titulo.toUpperCase()}`;
        });
    });

    // Botón volver
    if(btnVolver) {
        btnVolver.addEventListener("click", () => {
            seccionCatalogo.classList.add("oculto");
            seccionRuleta.classList.remove("oculto");
            // Limpiamos grilla por rendimiento
            setTimeout(() => { grillaCatalogo.innerHTML = ""; }, 500); 
        });
    }
});