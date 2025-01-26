/*import { db } from './firebase-config.js';
import { ref, set, push } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

// Test connection outside DOMContentLoaded
const testRef = ref(db, 'connection-test');
set(testRef, {
    lastAccess: new Date().toISOString(),
    status: 'connected'
});
*/
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const magnifier = document.querySelector('.magnifying-glass');
    const artwork = document.querySelector('.artwork');
    const revealBtn = document.querySelector('.reveal-btn');
    const inputs = document.querySelectorAll('.magic-input');
    const plusIcon = document.querySelector('.plus-icon');
    const overlay = document.getElementById('overlay');
    const popups = document.querySelectorAll('.popup');
    const closeButtons = document.querySelectorAll('.close-btn');
    const transportPopup = document.getElementById('transportPopup');
    const dreamPopup = document.getElementById('dreamPopup');

    function updateZoom(e) {
        const rect = artwork.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const maxX = rect.width - magnifier.offsetWidth;
        const maxY = rect.height - magnifier.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(maxX, x - magnifier.offsetWidth / 2));
        const boundedY = Math.max(0, Math.min(maxY, y - magnifier.offsetHeight / 2));
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            magnifier.style.display = 'block';
            magnifier.style.left = `${boundedX}px`;
            magnifier.style.top = `${boundedY}px`;
            magnifier.style.backgroundImage = `url(${artwork.src})`;
            magnifier.style.backgroundPosition = `${-x * 2 + magnifier.offsetWidth/2}px ${-y * 2 + magnifier.offsetHeight/2}px`;
            magnifier.style.backgroundSize = `${artwork.width * 2}px`;
        } else {
            magnifier.style.display = 'none';
        }
    }

    function showAnswerPopup(answer, type) {
        overlay.style.display = 'block';
        const popup = type === 'transport' ? transportPopup : dreamPopup;
        popup.querySelector('.answer-text').textContent = answer;
        popup.style.display = 'block';
    }

    function handleReveal() {
        inputs.forEach((input, index) => {
            if (input.value.trim()) {
                const type = index === 0 ? 'transport' : 'dream';
                showAnswerPopup(input.value, type);
            }
        });
    }

    // Event Listeners
    artwork.addEventListener('mousemove', updateZoom);
    artwork.addEventListener('mouseleave', () => {
        magnifier.style.display = 'none';
    });

    plusIcon.addEventListener('click', () => {
        overlay.style.display = 'block';
        popups.forEach(popup => {
            popup.style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            overlay.style.display = 'none';
            button.parentElement.style.display = 'none';
        });
    });

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        popups.forEach(popup => {
            popup.style.display = 'none';
        });
    });

    revealBtn.addEventListener('click', handleReveal);
    
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleReveal();
            }
        });
    });
});


