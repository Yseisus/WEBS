document.addEventListener("DOMContentLoaded", () => {

    // --- ANIMACIÓN AL HACER SCROLL ---
    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) reveal.classList.add("active");
        });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // --- EFECTO PARALLAX HERO ---
    const orbs = document.querySelectorAll(".orb");
    const heroImg = document.querySelector(".hero-img-only");
    if (window.innerWidth > 900) {
        document.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 60;
            const y = (window.innerHeight / 2 - e.pageY) / 60;
            orbs.forEach(orb => orb.style.transform = `translate(${x}px, ${y}px)`);
            if (heroImg) heroImg.style.transform = `translate(${-x}px, ${-y}px)`;
        });
    }

    // --- LÓGICA DE MODALES ---
    const modalReserva = document.getElementById("modal-contacto");
    const modalCarta = document.getElementById("modal-carta");
    const modalHistoria = document.getElementById("modal-historia");

    const btnsOpen = {
        "btn-contacto": modalReserva,
        "btn-carta": modalCarta,
        "btn-historia": modalHistoria
    };

    // Abrir Modales
    Object.keys(btnsOpen).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                btnsOpen[id].classList.add("active");
                document.body.style.overflow = "hidden";
            });
        }
    });

    // Cerrar Modales (con el botón X)
    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            document.body.style.overflow = "auto";
        });
    });

    // Cerrar al clickear fuera del contenido
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            e.target.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
});