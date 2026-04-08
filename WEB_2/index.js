// Función para mostrar la ventana (Ahora desencadena la animación de desenrollar)
function abrirVentana(idVentana) {
  document.getElementById(idVentana).classList.add('activa');
}

// Función para ocultar la ventana (Desencadena enrollar)
function cerrarVentana(idVentana) {
  document.getElementById(idVentana).classList.remove('activa');
}

// --- LÓGICA MULTI-LIENZO CON SCROLL ---

document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById("titulo-principal");
    const lienzos = document.querySelectorAll(".contenedor-lienzo"); 
    
    // 1. Animación de entrada del título
    setTimeout(() => {
        titulo.classList.add("visible");
    }, 800); 

    // 2. Evento al hacer scroll
    window.addEventListener("scroll", () => {
        
        // --- ANIMACIÓN DEL TÍTULO ---
        if (window.scrollY > 150) {
            titulo.classList.remove("visible");
            titulo.classList.add("oculto");
        } else {
            titulo.classList.remove("oculto");
            titulo.classList.add("visible");
        }

        // --- ANIMACIÓN DE TODOS LOS LIENZOS ---
        lienzos.forEach(lienzo => {
            const posicionLienzo = lienzo.getBoundingClientRect();
            const alturaPantalla = window.innerHeight;

            // Verificamos de forma individual cada lienzo
            if (posicionLienzo.top < alturaPantalla - 150 && posicionLienzo.bottom > 150) {
                lienzo.classList.add("visible");
                lienzo.classList.remove("oculto-abajo");
            } 
            else if (posicionLienzo.bottom <= 150) {
                lienzo.classList.remove("visible");
                lienzo.classList.add("oculto-abajo");
            } 
            else {
                lienzo.classList.remove("visible");
                lienzo.classList.remove("oculto-abajo");
            }
        });
    });
});