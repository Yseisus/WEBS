document.addEventListener('DOMContentLoaded', () => {
    console.log('Vidriería Claro Frontend Inicializado Correctamente.');

    // 1. ANIMACIÓN REVEAL AL HACER SCROLL
    const reveals = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 2. EFECTO PARALLAX SUTIL EN EL HERO (Solo en Desktop)
    const orbs = document.querySelectorAll('.orb');
    
    if (window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 35;
            const y = (window.innerHeight / 2 - e.pageY) / 35;
            
            orbs.forEach(orb => {
                orb.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // 3. LÓGICA DEL MODAL DE CONTACTO
    const btnContacto = document.getElementById('btn-contacto');
    const modalContacto = document.getElementById('modal-contacto');
    const closeBtn = document.querySelector('.close-btn');

    if(btnContacto && modalContacto && closeBtn) {
        btnContacto.addEventListener('click', () => {
            modalContacto.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
        
        closeBtn.addEventListener('click', () => {
            modalContacto.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modalContacto) {
                modalContacto.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        const form = document.querySelector('.contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnSubmit = form.querySelector('button');
            btnSubmit.textContent = '¡Solicitud Enviada!';
            btnSubmit.style.background = '#10b981'; 
            setTimeout(() => {
                modalContacto.classList.remove('active');
                document.body.style.overflow = 'auto';
                btnSubmit.textContent = 'Enviar Solicitud';
                btnSubmit.style.background = ''; 
                form.reset();
            }, 2000);
        });
    }

    // 4. LÓGICA DE ENLACES DEL FOOTER
    const footerLinks = document.querySelectorAll('.footer-link');
    const modalInfo = document.getElementById('modal-info');
    const infoTitle = document.getElementById('info-title');
    const infoDesc = document.getElementById('info-desc');
    const closeBtnInfo = document.querySelector('.close-btn-info');
    const btnInfoClose = document.getElementById('btn-info-close');

    // Textos actualizados para la vidriería
    const infoData = {
        'soporte': {
            title: 'Atención al Cliente',
            desc: 'Nuestro equipo está disponible de Lunes a Sábado para cotizaciones y urgencias. Puedes escribirnos en nuestro formulario de contacto.'
        },
        'garantia': {
            title: 'Garantía de Calidad',
            desc: 'Todos nuestros trabajos en cristal templado y ventanas termopanel cuentan con 5 años de garantía estructural por defectos de fábrica o instalación.'
        },
        'legal': {
            title: 'Términos Legales',
            desc: 'Los presupuestos entregados tienen una validez de 15 días. Toda instalación definitiva está sujeta a una evaluación técnica y rectificación de medidas en terreno.'
        }
    };

    if(footerLinks && modalInfo) {
        const closeInfoModal = () => {
            modalInfo.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.getAttribute('data-type');
                infoTitle.textContent = infoData[type].title;
                infoDesc.textContent = infoData[type].desc;
                
                modalInfo.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if(closeBtnInfo) closeBtnInfo.addEventListener('click', closeInfoModal);
        if(btnInfoClose) btnInfoClose.addEventListener('click', closeInfoModal);
        
        window.addEventListener('click', (e) => {
            if (e.target === modalInfo) closeInfoModal();
        });
    }

    // 5. MODO CLARO / OSCURO (THEME TOGGLE)
    const btnTheme = document.getElementById('btn-theme');
    
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btnTheme.textContent = '🌙';
    }

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                btnTheme.textContent = '☀️';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                btnTheme.textContent = '🌙';
            }
        });
    }
});