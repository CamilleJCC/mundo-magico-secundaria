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
    const magnifier = document.querySelector('.magnifying-glass');
    const artwork = document.querySelector('.artwork');
    const revealBtn = document.querySelector('.reveal-btn');
    const inputs = document.querySelectorAll('.magic-input');

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

    function createSparkles(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
            
            element.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }

    function getRandomColor() {
        const colors = [
            '#b5f0de',
            '#fab8a1',
            '#faf7ba',
            '#c2b2ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    document.addEventListener('DOMContentLoaded', () => {
    const bioBtn = document.getElementById('bioBtn');
    const bioPopup = document.getElementById('bioPopup');
    const transportPopup = document.getElementById('transportPopup');
    const dreamPopup = document.getElementById('dreamPopup');
    const closeButtons = document.querySelectorAll('.close-btn');
    
    // Biography popup
    bioBtn.addEventListener('click', () => {
        bioPopup.style.display = 'block';
    });
    
    // Handle answer reveals
    function showAnswerPopup(answer, type) {
        const popup = type === 'transport' ? transportPopup : dreamPopup;
        popup.querySelector('.answer-text').textContent = answer;
        popup.style.display = 'block';
    }
    
    // Close button functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.style.display = 'none';
        });
    });
    
    // Close popup when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('popup')) {
            e.target.style.display = 'none';
        }
    });
    
    // Modify your existing handleReveal function
    async function handleReveal() {
        inputs.forEach((input, index) => {
            if (input.value.trim()) {
                const type = index === 0 ? 'transport' : 'dream';
                showAnswerPopup(input.value, type);
            }
        });
    }
});


    async function handleReveal() {
        inputs.forEach(async (input) => {
            if (input.value.trim()) {
                try {
                    console.log('Starting save process');
                    const answersRef = ref(db, 'mundo-answers');
                    console.log('Reference created');
                    
                    const newAnswerRef = push(answersRef);
                    console.log('Push reference created');
                    
                    const dataToSave = {
                        answer: input.value,
                        timestamp: new Date().toISOString()
                    };
                    console.log('Data prepared:', dataToSave);
                    
                    await set(newAnswerRef, dataToSave);
                    console.log('Data saved successfully');

                    const newAnswer = document.createElement('div');
                    newAnswer.className = 'revealed-answer reveal-animation';
                    newAnswer.textContent = input.value;
                    newAnswer.style.position = 'relative';
                    newAnswer.style.background = getRandomColor();
                    
                    input.parentElement.appendChild(newAnswer);
                    createSparkles(newAnswer);
                    input.value = '';
                } catch (error) {
                    console.log('Detailed error:', error.message, error.code);
                    throw error;
                }
            }
        });
    }

    artwork.addEventListener('mousemove', updateZoom);
    artwork.addEventListener('mouseleave', () => {
        magnifier.style.display = 'none';
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
