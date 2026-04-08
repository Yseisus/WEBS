function crearPatita() {
    const patita = document.createElement('div');
    patita.classList.add('patita');

    // Inyectamos tu imagen de la patita
    patita.innerHTML = `<img src="img/descarga.png" style="width: 100%; height: 100%; object-fit: contain;">`;

    // Posición random en la pantalla
    patita.style.left = Math.random() * 100 + 'vw';
    patita.style.top = Math.random() * 100 + 'vh';

    // Rotación guardada en variable CSS
    const rotacion = Math.random() * 360;
    patita.style.setProperty('--rotacion', `${rotacion}deg`);

    // Lo tiramos al body
    document.body.appendChild(patita);

    // Lo matamos a los 4 segundos
    setTimeout(() => {
        patita.remove();
    }, 4000);
}

// Crea una patita nueva cada 500 milisegundos
setInterval(crearPatita, 500);