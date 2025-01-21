import { db } from './firebase-config.js';
import { ref, set, push } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

// Test connection outside DOMContentLoaded
const testRef = ref(db, 'connection-test');
set(testRef, {
    lastAccess: new Date().toISOString(),
    status: 'connected'
});

import { db } from './firebase-config.js';
import { ref, set, push } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js';

// Test connection outside DOMContentLoaded
const testRef = ref(db, 'connection-test');
set(testRef, {
    lastAccess: new Date().toISOString(),
    status: 'connected'
});

document.addEventListener('DOMContentLoaded', () => {
    const magnifier = document.querySelector('.magnifying-glass');
    const artwork = document.getElementById('myimage');
    const revealBtn = document.querySelector('.reveal-btn');
    const input = document.querySelector('.magic-input');
    const answersContainer = document.querySelector('.answers-container');

    function updateMagnifier(e) {
        const bounds = artwork.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        
        magnifier.style.backgroundImage = `url(${artwork.src})`;
        magnifier.style.backgroundSize = `${artwork.width * 2}px`;
        
        const magnifierSize = magnifier.offsetWidth;
        const xPos = Math.min(Math.max(0, x - magnifierSize/2), bounds.width - magnifierSize);
        const yPos = Math.min(Math.max(0, y - magnifierSize/2), bounds.height - magnifierSize);
        
        magnifier.style.left = xPos + 'px';
        magnifier.style.top = yPos + 'px';
        
        const bgX = -x * 2 + magnifierSize;
        const bgY = -y * 2 + magnifierSize;
        magnifier.style.backgroundPosition = `${bgX}px ${bgY}px`;
        
        if (x >= 0 && x <= bounds.width && y >= 0 && y <= bounds.height) {
            magnifier.style.display = 'block';
        } else {
            magnifier.style.display = 'none';
        }
    }

    artwork.addEventListener('mousemove', updateMagnifier);
    artwork.addEventListener('mouseleave', () => {
        magnifier.style.display = 'none';
    });

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

    async function handleReveal() {
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
                
                answersContainer.appendChild(newAnswer);
                createSparkles(newAnswer);
                input.value = '';
            } catch (error) {
                console.log('Detailed error:', error.message, error.code);
                throw error;
            }
        }
    }

    revealBtn.addEventListener('click', handleReveal);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReveal();
        }
    });
});

