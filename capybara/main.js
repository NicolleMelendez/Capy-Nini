// Funcionalidad de navegación
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Animación de capibaras flotantes
function createFloatingLeaves() {
    const container = document.getElementById('floatingLeaves');
    if (!container) return; 
    const capyEmojis = ['🐹', '🧡', '💧'];
    
    function addCapy() {
        const capy = document.createElement('div');
        capy.className = 'leaf';
        capy.textContent = capyEmojis[Math.floor(Math.random() * capyEmojis.length)];
        capy.style.left = Math.random() * 100 + '%';
        capy.style.animationDuration = (Math.random() * 10 + 10) + 's';
        capy.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(capy);
        
        setTimeout(() => {
            if (capy.parentNode) {
                capy.parentNode.removeChild(capy);
            }
        }, 20000);
    }
    
    setInterval(addCapy, 3000);
}

// Funcionalidad del Modal
function openModal(title, description, imageSrc) {
    document.getElementById('modalImage').src = imageSrc; 
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('imageModal').style.display = 'block';
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.getElementById('modalImage').src = ""; 
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('imageModal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Efectos interactivos para las cards
function addCardInteractivity() {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(212, 185, 150, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Animación de contador para estadísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                if (!isNaN(target)) {
                    animateNumber(entry.target, target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50; 
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 40); 
}

// Efecto parallax suave para elementos
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.profile-pic');
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Función para smooth scroll en navegación
function addSmoothScrolling() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            setTimeout(() => {
                const activeSection = document.querySelector('.section.active');
                if (activeSection) {
                    activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 50);
        });
    });
}

// Añadir efectos de typing para textos importantes
function addTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 70);
        }
    };
    setTimeout(typeWriter, 500);
}

//empieza la lógica del juego
function setupMiniGame() {
    const gameBoard = document.getElementById('gameBoard');
    const scanLine = document.getElementById('scanLine');
    const bug = document.getElementById('bug');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('timeLeft');
    const startBtn = document.getElementById('startGameBtn');
    const gameMessage = document.getElementById('gameMessage');

    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let timerInterval;
    let isGameRunning = false;
    let scanAnimation;

    function placeBug() {
        bug.style.opacity = '0'; 
        setTimeout(() => {
            const boardHeight = gameBoard.offsetHeight;
            const bugHeight = bug.offsetHeight;
            const randomLine = Math.floor(Math.random() * 10);
            const bugY = (boardHeight / 10 * randomLine) + (bugHeight / 2);
            bug.style.top = `${bugY}px`;
            bug.style.opacity = '1';
        }, 300);
    }

    function startGame() {
        if (isGameRunning) return;
        isGameRunning = true;

        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        startBtn.disabled = true;
        gameMessage.textContent = '';

        placeBug();

        // Animar la línea de escaneo
        scanAnimation = scanLine.animate([
            { top: '0%' },
            { top: '100%' }
        ], {
            duration: 2000, 
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });

        // Iniciar temporizador del juego
        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function checkHit() {
        if (!isGameRunning) return;

        const lineRect = scanLine.getBoundingClientRect();
        const bugRect = bug.getBoundingClientRect();

        // Verificar si la línea de escaneo está sobre el bug
        if (lineRect.top < bugRect.bottom && lineRect.bottom > bugRect.top) {
            score++;
            scoreDisplay.textContent = score;
            gameMessage.textContent = 'Bug Fixed!';
            placeBug(); // Colocar un nuevo bug
        } else {
            gameMessage.textContent = 'Missed!';
        }

        // Limpiar el mensaje después de un momento
        setTimeout(() => gameMessage.textContent = '', 800);
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(timerInterval);
        if (scanAnimation) scanAnimation.cancel(); // Detener animación
        alert(`Game Over! You fixed ${score} bugs!`);
        startBtn.disabled = false;
        bug.style.opacity = '0';
        scanLine.style.top = '0';
    }

    startBtn.addEventListener('click', startGame);
    gameBoard.addEventListener('click', checkHit);
}
//fin de la lógica del juego

// Seguir el cursor con una imagen
function setupCursorFollower() {
    const follower = document.getElementById('cursorFollower');
    if (!follower) return;
    
    // Centrar la imagen en el cursor
    const halfSize = follower.offsetWidth / 2;

    window.addEventListener('mousemove', e => {
        const x = e.clientX - halfSize;
        const y = e.clientY - halfSize;
        follower.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Función para detectar dispositivo móvil
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Función de inicialización
function init() {
    createFloatingLeaves();
    addCardInteractivity();
    animateStats();
    addSmoothScrolling();
    addTypingEffect();
    setupMiniGame();
    
    if (!isMobileDevice()) {
        setupCursorFollower();
        addParallaxEffect();
    }
    
    console.log('🌿 Capybara Profile loaded! 🐹');
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);