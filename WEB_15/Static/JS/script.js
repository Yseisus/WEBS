/**
 * script.js
 * Handle Translations and QR code generation.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Language System
    const translations = {
        es: {
            page_title: "Nombre del Negocio",
            logo_text: "Empresa",
            hero_title: "Soluciones profesionales para ti",
            hero_subtitle: "Ofrecemos el mejor servicio adaptado a tus necesidades con calidad y confianza.",
            btn_contact: "Contactar",
            about_title: "Sobre Nosotros",
            about_desc_1: "Somos un negocio dedicado a ofrecer soluciones de alta calidad. Nuestro compromiso es brindar resultados excepcionales enfocados en la satisfacción de nuestros clientes.",
            about_desc_2: "Nuestra misión es ayudar a nuestros clientes a alcanzar sus objetivos de manera eficiente, profesional y segura, cuidando cada detalle de nuestro servicio.",
            services_title: "Nuestros Servicios",
            service_1_title: "Servicio Principal",
            service_1_desc: "Descripción detallada del servicio principal o producto que se ofrece al cliente final.",
            service_2_title: "Servicio Secundario",
            service_2_desc: "Descripción del segundo servicio, explicando los beneficios y el valor aportado.",
            service_3_title: "Mantenimiento",
            service_3_desc: "Detalles sobre servicios continuos o soporte post-venta que aporta tranquilidad.",
            contact_title: "Contacto",
            contact_phone_label: "Teléfono:",
            contact_email_label: "Email:",
            contact_address_label: "Dirección:",
            btn_whatsapp: "Mensaje por WhatsApp",
            map_placeholder: "Espacio para Google Maps",
            qr_title: "Escanea nuestro código QR",
            qr_desc: "Guarda nuestra página web en tu teléfono o comparte con un amigo.",
            btn_download_qr: "Descargar QR",
            footer_rights: "Todos los derechos reservados. Empresa."
        },
        en: {
            page_title: "Business Name",
            logo_text: "Company",
            hero_title: "Professional solutions for you",
            hero_subtitle: "We offer the best service tailored to your needs with quality and trust.",
            btn_contact: "Contact Us",
            about_title: "About Us",
            about_desc_1: "We are a business dedicated to offering high-quality solutions. Our commitment is to provide exceptional results focused on customer satisfaction.",
            about_desc_2: "Our mission is to help clients achieve their goals efficiently, professionally, and safely, taking care of every detail of our service.",
            services_title: "Our Services",
            service_1_title: "Main Service",
            service_1_desc: "Detailed description of the main service or product offered to the end customer.",
            service_2_title: "Secondary Service",
            service_2_desc: "Description of the second service, explaining the benefits and added value.",
            service_3_title: "Maintenance",
            service_3_desc: "Details about continuous services or after-sales support providing peace of mind.",
            contact_title: "Contact",
            contact_phone_label: "Phone:",
            contact_email_label: "Email:",
            contact_address_label: "Address:",
            btn_whatsapp: "WhatsApp Message",
            map_placeholder: "Google Maps Placeholder",
            qr_title: "Scan our QR Code",
            qr_desc: "Save our website on your phone or share it with a friend.",
            btn_download_qr: "Download QR",
            footer_rights: "All rights reserved. Company."
        }
    };

    let currentLang = 'es';
    const langSwitcher = document.getElementById('langSwitcher');

    function updateLanguage() {
        const texts = document.querySelectorAll('[data-i18n]');
        texts.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                // If it's the title tag, update document title instead of textContent
                if (el.tagName === 'TITLE') {
                    document.title = translations[currentLang][key];
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        document.documentElement.lang = currentLang;
    }

    langSwitcher.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        updateLanguage();
        langSwitcher.textContent = currentLang === 'es' ? 'ES / EN' : 'EN / ES';
    });


    // 2. Automated QR Code Generation
    const qrCanvas = document.getElementById('qrcode-canvas');
    const btnDownloadQR = document.getElementById('downloadQR');
    
    // Get the current domain URL without hash or search params
    const currentUrl = window.location.origin + window.location.pathname;

    function generateQR() {
        if (typeof QRCode !== 'undefined') {
            QRCode.toCanvas(qrCanvas, currentUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#1E293B', // Primary color from CSS
                    light: '#ffffff'
                }
            }, function (error) {
                if (error) console.error(error);
                console.log('QR Code generated successfully for: ', currentUrl);
            });
        } else {
            console.warn("QR Code library not loaded yet.");
            setTimeout(generateQR, 500); // Retry mechanism 
        }
    }

    // Call generation
    generateQR();

    // 3. QR Download Logic
    btnDownloadQR.addEventListener('click', () => {
        // Convert canvas down to a data URL (PNG)
        const dataUrl = qrCanvas.toDataURL("image/png");
        
        // Create an invisible anchor tag to trigger download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'business-qr-code.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // 4. Utilities
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});
