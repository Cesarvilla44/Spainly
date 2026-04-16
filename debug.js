// Script de depuración simple para verificar que JavaScript funciona
console.log('Script de depuración cargado');

// Verificar que el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    
    // Verificar que los botones existen
    const buttons = ['searchBtn', 'favoritesBtn', 'ratingsBtn', 'profileBtn', 'registerBtn', 'loginBtn', 'reportsBtn', 'aboutBtn'];
    
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            console.log(`Botón ${btnId} encontrado:`, btn);
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Botón ${btnId} clickeado!`);
                alert(`Botón ${btnId} funciona!`);
            });
        } else {
            console.warn(`Botón ${btnId} NO encontrado`);
        }
    });
    
    // Verificar si el container principal existe
    const app = document.getElementById('app');
    if (app) {
        console.log('Container #app encontrado');
    } else {
        console.warn('Container #app NO encontrado');
    }
});

console.log('Script de depuración inicializado');
