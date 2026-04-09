document.addEventListener("DOMContentLoaded", () => {
    // --- TRANSLATION CORE ---
    const translations = {
        "es": {
            hero_title_1: "Yseisus",
            hero_sub: "Esculpimos monolitos digitales. Baja para sumergirte.",
            mani_1: "Fricción entre", mani_2: "Luz y Oscuridad", mani_3: "Asimetría Pura", mani_4: "Identidad Interactiva",
            glob_title: "Paradigma Global", glob_desc: "Un colectivo multidisciplinario operando sin fronteras. Elevando marcas a través del diseño inmersivo y tecnología de vanguardia.", glob_coord: "NY / LN / TK / MAD",
            serv_title: "DISCIPLINAS", 
            serv_1: "Branding Visual /", serv_1_desc: "Arquitectura de marca global.",
            serv_2: "Desarrollo Web /", serv_2_desc: "Plataformas nativas hiper-optimizadas.",
            serv_3: "Estrategia UX /", serv_3_desc: "Interacción cognitiva profunda.",
            serv_4: "Motion 3D /", serv_4_desc: "Cinemática en código puro.",
            port_1: "Proyecto Alpha", port_1_sub: "Sector Financiero / NY",
            port_2: "Identidad Noir", port_2_sub: "Moda & Lujo / Milán",
            port_3: "Hyper-Scale Protocol", port_3_sub: "Inteligencia Artificial / Global",
            port_4: "Vanguard Vision", port_4_sub: "Automoción / Tokio",
            proc_title: "Método",
            proc_s1: "Auditoría", proc_d1: "Análisis profundo del ecosistema de la marca.",
            proc_s2: "Arquitectura", proc_d2: "Estructuración técnica y visual a escala.",
            proc_s3: "Despliegue", proc_d3: "Implementación nativa sin fricciones.",
            proc_s4: "Evolución", proc_d4: "Iteración y expansión global continua.",
            cred_1: "Proyectos Escalados", cred_2: "Premios Globales", cred_3: "Presencia Multizona",
            cont_title: "Alianza", cont_sub: "Inicia el despliegue. Hablemos de escala y control.", cont_btn: "Establecer Conexión",
            footer: "© 2026 YSEISUS. DIGITAL MONOLITHS HQ.",
            nav_1: "Filosofía", nav_2: "Disciplinas", nav_3: "Archivos", nav_4: "Método", nav_5: "Alianza"
        },
        "en": {
            hero_title_1: "Yseisus",
            hero_sub: "We sculpt digital monoliths. Scroll to immerse.",
            mani_1: "Friction between", mani_2: "Light and Dark", mani_3: "Pure Asymmetry", mani_4: "Interactive Identity",
            glob_title: "Global Paradigm", glob_desc: "A multidisciplinary collective operating without borders. Elevating brands through immersive design and avant-garde technology.", glob_coord: "NY / LN / TK / MAD",
            serv_title: "DISCIPLINES",
            serv_1: "Visual Branding /", serv_1_desc: "Global brand architecture.",
            serv_2: "Web Development /", serv_2_desc: "Hyper-optimized native platforms.",
            serv_3: "UX Strategy /", serv_3_desc: "Deep cognitive interaction.",
            serv_4: "Motion 3D /", serv_4_desc: "Cinematics in pure code.",
            port_1: "Project Alpha", port_1_sub: "Financial Sector / NY",
            port_2: "Noir Identity", port_2_sub: "Fashion & Luxury / Milan",
            port_3: "Hyper-Scale Protocol", port_3_sub: "Artificial Intelligence / Global",
            port_4: "Vanguard Vision", port_4_sub: "Automotive / Tokyo",
            proc_title: "Method",
            proc_s1: "Audit", proc_d1: "Deep analysis of the brand ecosystem.",
            proc_s2: "Architecture", proc_d2: "Technical and visual structuring at scale.",
            proc_s3: "Deployment", proc_d3: "Frictionless native implementation.",
            proc_s4: "Evolution", proc_d4: "Continuous global expansion and iteration.",
            cred_1: "Scaled Projects", cred_2: "Global Awards", cred_3: "Multi-zone Presence",
            cont_title: "Alliance", cont_sub: "Initiate deployment. Let's talk scale and control.", cont_btn: "Establish Connection",
            footer: "© 2026 YSEISUS. DIGITAL MONOLITHS HQ.",
            nav_1: "Philosophy", nav_2: "Disciplines", nav_3: "Archives", nav_4: "Method", nav_5: "Alliance"
        }
    };
    
    let currentLang = 'es';
    const langBtn = document.getElementById('lang-toggle');
    const inputs = {
        name: document.getElementById('input-name'),
        email: document.getElementById('input-email'),
        brand: document.getElementById('input-brand')
    };

    function setLanguage(lang) {
        currentLang = lang;
        if(lang === 'es') {
            document.body.classList.add('lang-es-active');
            if(inputs.name) inputs.name.placeholder = "Tu esencia (Nombre)";
            if(inputs.email) inputs.email.placeholder = "Señal (Email corporativo)";
            if(inputs.brand) inputs.brand.placeholder = "El Horizonte (Proyecto)";
        } else {
            document.body.classList.remove('lang-es-active');
            if(inputs.name) inputs.name.placeholder = "Your essence (Name)";
            if(inputs.email) inputs.email.placeholder = "Signal (Corporate Email)";
            if(inputs.brand) inputs.brand.placeholder = "The Horizon (Project)";
        }
        
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
    }

    if(langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'es' : 'en');
        });
    }

    setLanguage(currentLang);


    // --- NAV LOGO TOGGLE ENGINE ---
    const logoTrigger = document.getElementById('logo-trigger');
    const headerNav = document.getElementById('header-nav');

    logoTrigger.addEventListener('click', () => {
        headerNav.classList.toggle('hidden');
    });

    // --- GSAP IMMERSIVE TIMELINE ENGINE ---
    gsap.registerPlugin(ScrollTrigger);

    const masterTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#scroll-proxy",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
        }
    });

    // SCENE 1: Intro (0-1.5)
    gsap.set("#layer-intro", { opacity: 1 });
    masterTl.to(".colossal-type", { scale: 5, opacity: 0, filter: "blur(25px)", duration: 2 }, 0)
            .to(".manifesto-intro", { y: 100, opacity: 0, duration: 1 }, 0)
            .to("#layer-intro", { autoAlpha: 0, duration: 0.5 }, 1.5);

    // SCENE 2: Manifesto
    masterTl.to("#layer-manifesto", { autoAlpha: 1, duration: 0.5 }, 1)
            .fromTo(".t1", { z: -500, opacity: 0, x: -200 }, { z: 500, opacity: 1, x: 100, duration: 3 }, 1.5)
            .fromTo(".t2", { z: -800, opacity: 0, y: 300 }, { z: 400, opacity: 1, y: -100, duration: 3.5 }, 1.7)
            .fromTo(".t3", { z: -300, opacity: 0, x: 200 }, { z: 600, opacity: 1, x: -100, duration: 2.5 }, 2)
            .fromTo(".t4", { z: -1000, opacity: 0, y: -200 }, { z: 300, opacity: 1, y: 200, duration: 4 }, 1.2)
            .to("#layer-manifesto", { autoAlpha: 0, duration: 0.5 }, 4.5);

    // SCENE 3: Global Paradigm
    masterTl.to("#layer-global", { autoAlpha: 1, duration: 0.5 }, 4)
            .fromTo(".global-arena", { scale: 0.8, opacity: 0, y: 150 }, { scale: 1, opacity: 1, y: 0, duration: 2 }, 4)
            .fromTo(".coordinates", { opacity: 0, letterSpacing: "50px" }, { opacity: 0.5, letterSpacing: "12px", duration: 2 }, 4.5)
            .to("#layer-global", { autoAlpha: 0, scale: 1.2, filter: "blur(10px)", duration: 1 }, 6);

    // SCENE 4: Expanded Disciplines
    masterTl.to("#layer-services", { autoAlpha: 1, duration: 0.5 }, 6) 
            .fromTo(".bg-layer-text", { x: "10%" }, { x: "-30%", duration: 3.5 }, 6)
            .fromTo(".floating-ring", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, 6.5)
            .to(".floating-ring", { scale: 1.5, opacity: 0, duration: 1.5 }, 8)
            .to("#layer-services", { autoAlpha: 0, duration: 0.5 }, 9.5);

    // SCENE 5: Portafolio
    masterTl.to("#layer-portfolio", { autoAlpha: 1, duration: 0.5 }, 9)
            .fromTo(".gallery-mask", { scale: 0, borderRadius: "500px" }, { scale: 1, borderRadius: "0px", duration: 2 }, 9)
            .to(".gallery-track", { xPercent: -75, duration: 4 }, 10) 
            .to(".gallery-mask", { scale: 1.5, opacity: 0, duration: 1.5 }, 13.5)
            .to("#layer-portfolio", { autoAlpha: 0, duration: 0.5 }, 14.5);

    // SCENE 6: Method
    masterTl.to("#layer-process", { autoAlpha: 1, duration: 0.5 }, 14)
            .fromTo(".blur-reveal", { filter: "blur(40px)", opacity: 0, scale: 2 }, { filter: "blur(0px)", opacity: 1, scale: 1, duration: 1.5 }, 14)
            .fromTo(".p-1", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 14.5)
            .fromTo(".p-2", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 14.8)
            .fromTo(".p-3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 15.1)
            .fromTo(".p-4", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 }, 15.4)
            .to("#layer-process", { autoAlpha: 0, y: -100, duration: 1.5 }, 16.5);

    // SCENE 7: Scale & Credibility
    masterTl.to("#layer-credibility", { autoAlpha: 1, duration: 0.5 }, 16.5)
            .fromTo(".cred-stats", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5 }, 16.5)
            .fromTo(".client-grid span", { opacity: 0, x: -50 }, { opacity: 0.4, x: 0, duration: 1, stagger: 0.2 }, 17)
            .to("#layer-credibility", { autoAlpha: 0, duration: 1 }, 19);

    // SCENE 8: Alliance Action
    masterTl.to("#layer-contact", { autoAlpha: 1, duration: 0.5 }, 18.5)
            .fromTo(".contact-arena", { scale: 0.9, y: 150, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 2 }, 18.5);


    // --- NAVIGATION LINK EXACT SCROLL ENGINE ---
    document.querySelectorAll('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', () => {
            const timeIndex = parseFloat(btn.getAttribute('data-scroll'));
            
            // GSAP handles scroll precisely via the ScrollTrigger instance itself!
            // We get the exact pixel start and end of the #scroll-proxy mapping.
            const st = masterTl.scrollTrigger;
            const progress = timeIndex / masterTl.duration(); 
            const targetPixel = st.start + (st.end - st.start) * progress;
            
            window.scrollTo({
                top: targetPixel,
                behavior: 'smooth'
            });
            
            headerNav.classList.add('hidden');
        });
    });

});
