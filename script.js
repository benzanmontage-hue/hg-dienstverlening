// Project Gallery Data
const projectGalleries = {
    amsterdam: {
        title: "Kantoorgebouw Amsterdam",
        images: [
            "assets/images/amsterdam-1.jpeg",
            "assets/images/amsterdam-2.jpeg",
            "assets/images/amsterdam-3.jpeg"
        ]
    },
    arnhem: {
        title: "Aanbouw Arnhem",
        images: [
            "assets/images/Arnhem-1.jpeg",
            "assets/images/Arnhem-2.jpeg",
            "assets/images/Arnhem-3.jpeg",
            "assets/images/Arnhem-4.jpeg"
        ]
    },
    renkum: {
        title: "Garagebouw Renkum",
        images: [
            "assets/images/projects/renkum/renkum-1.jpeg",
            "assets/images/projects/renkum/renkum-2.jpeg",
            "assets/images/projects/renkum/renkum-3.jpeg",
            "assets/images/projects/renkum/renkum-4.jpeg"
        ]
    },
    zevenaar: {
        title: "Kantoorverbouwing Zevenaar",
        images: [
            "assets/images/projects/zevenaar/zevenaar-1.jpeg",
            "assets/images/projects/zevenaar/zevenaar-2.jpeg",
            "assets/images/projects/zevenaar/zevenaar-3.jpeg",
            "assets/images/projects/zevenaar/zevenaar-4.jpeg"
        ]
    },
    wijchen: {
        title: "Uitbouw Wijchen",
        images: [
            "assets/images/projects/wijchen/wijchen-1.jpeg",
            "assets/images/projects/wijchen/wijchen-2.jpeg",
            "assets/images/projects/wijchen/wijchen-3.jpeg",
            "assets/images/projects/wijchen/wijchen-4.jpeg",
            "assets/images/projects/wijchen/wijchen-5.jpeg",
            "assets/images/projects/wijchen/wijchen-6.jpeg",
            "assets/images/projects/wijchen/wijchen-7.jpeg"
        ]
    }
};

// Service/Product data for cards
const cardData = [
    {
        title: "Complete Verbouwing",
        description: "Of het nu je huis is of kantoor, wij pakken het hele project aan. Van de eerste schets tot de laatste schroef - we regelen het allemaal. Geen gedoe, gewoon goed werk.",
        icon: "🏗️"
    },
    {
        title: "Renovatie Projecten",
        description: "Oude gebouwen nieuw leven inblazen? Dat doen we graag. We houden rekening met het karakter, maar maken het wel modern en functioneel. Het beste van beide werelden.",
        icon: "🔧"
    },
    {
        title: "Systeem Plafond Installatie",
        description: "Een mooi plafond maakt echt het verschil. We installeren moderne systeem plafonds met slimme LED verlichting - zowel praktisch als mooi om naar te kijken. Perfect voor kantoren, winkels en andere ruimtes.",
        icon: "🏠"
    },
    {
        title: "Bouwadvies & Ontwerp",
        description: "Niet zeker wat je nodig hebt? Geen probleem. We denken graag met je mee en geven vrijblijvend advies. Samen komen we tot de beste oplossing voor jouw situatie.",
        icon: "📐"
    },
    {
        title: "Onderhoud & Reparatie",
        description: "Kleine reparaties of groot onderhoud? We komen langs wanneer je ons nodig hebt. Voorkomen is beter dan genezen, zeggen we altijd. En als er iets kapot gaat, lossen we het snel op.",
        icon: "🛠️"
    },
    {
        title: "Akoestische Oplossingen",
        description: "Last van galm of te veel lawaai? We hebben ervaring met akoestische plafonds en geluidsisolatie. Het resultaat? Een veel rustigere en prettigere ruimte om in te werken of wonen.",
        icon: "🔊"
    }
];

// Helper function to get element by ID
function _(id) {
    return document.getElementById(id);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins if available
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }
    
    initializeCards();
    initInlineProjectCarousels();
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        initializeAnimations();
        initializeScrollAnimations();
    }, 100);
});

// Inline project carousels (no modal)
function initInlineProjectCarousels() {
    const cards = document.querySelectorAll('.project-card[data-project]');
    cards.forEach(card => {
        const projectId = card.getAttribute('data-project');
        const gallery = projectGalleries[projectId];
        if (!gallery || !gallery.images || gallery.images.length === 0) return;

        const container = card.querySelector('.project-image-container');
        if (!container) return;

        container.classList.add('inline-carousel');
        const track = document.createElement('div');
        track.className = 'carousel-track';

        gallery.images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.loading = 'lazy';
            img.alt = `${gallery.title} - Afbeelding ${idx + 1}`;
            img.className = 'carousel-img';
            track.appendChild(img);
        });

        const prev = document.createElement('button');
        prev.className = 'carousel-arrow carousel-arrow-left';
        prev.setAttribute('aria-label', 'Vorige afbeelding');
        prev.innerHTML = '&#10094;';

        const next = document.createElement('button');
        next.className = 'carousel-arrow carousel-arrow-right';
        next.setAttribute('aria-label', 'Volgende afbeelding');
        next.innerHTML = '&#10095;';

        container.innerHTML = '';
        container.appendChild(track);
        container.appendChild(prev);
        container.appendChild(next);

        let currentIndex = 0;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let dragging = false;

        const setIndex = (idx) => {
            currentIndex = (idx + gallery.images.length) % gallery.images.length;
            track.style.transition = 'transform 0.35s ease';
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const startDrag = (clientX) => {
            dragging = true;
            startX = clientX;
            prevTranslate = -currentIndex * container.clientWidth;
            track.style.transition = 'none';
        };

        const moveDrag = (clientX) => {
            if (!dragging) return;
            const delta = clientX - startX;
            currentTranslate = prevTranslate + delta;
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        const endDrag = () => {
            if (!dragging) return;
            dragging = false;
            const moved = currentTranslate - prevTranslate;
            const threshold = container.clientWidth * 0.2;
            if (moved < -threshold) {
                setIndex(currentIndex + 1);
            } else if (moved > threshold) {
                setIndex(currentIndex - 1);
            } else {
                setIndex(currentIndex);
            }
        };

        // Pointer/mouse drag
        track.addEventListener('pointerdown', (e) => {
            track.setPointerCapture(e.pointerId);
            startDrag(e.clientX);
        });
        track.addEventListener('pointermove', (e) => moveDrag(e.clientX));
        track.addEventListener('pointerup', endDrag);
        track.addEventListener('pointercancel', endDrag);
        track.addEventListener('pointerleave', endDrag);

        // Touch (fallback)
        track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', endDrag);

        // Arrows
        prev.addEventListener('click', () => setIndex(currentIndex - 1));
        next.addEventListener('click', () => setIndex(currentIndex + 1));

        // Init
        setIndex(0);
    });
}

// Create and display cards
function initializeCards() {
    const cardsContainer = _('demo');
    const slideNumbersContainer = _('slide-numbers');
    
    if (!cardsContainer || !slideNumbersContainer) return;
    
    // Generate card HTML
    const cards = cardData.map((item, index) => {
        return `
            <div class="item card-item" id="slide-item-${index}" data-index="${index}">
                <div class="card-image">${item.icon}</div>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-description">${item.description}</p>
            </div>
        `;
    }).join('');
    
    // Generate slide numbers HTML
    const slideNumbers = cardData.map((_, index) => {
        return `<div class="slide-number" data-slide="${index}">${index + 1}</div>`;
    }).join('');
    
    cardsContainer.innerHTML = cards;
    slideNumbersContainer.innerHTML = slideNumbers;
    
    // Add click handlers to slide numbers
    const slideNumberElements = document.querySelectorAll('.slide-number');
    slideNumberElements.forEach((el, index) => {
        el.addEventListener('click', () => {
            highlightCard(index);
        });
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'S1',location:'script.js:initializeCards',message:'cards initialized',data:{cardCount:cardData.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
}

// Animate cards opening sequentially
function initializeAnimations() {
    const cards = document.querySelectorAll('.card-item');
    const slideNumbers = document.querySelectorAll('.slide-number');
    
    if (cards.length === 0) return;
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'S2',location:'script.js:initializeAnimations',message:'anim init',data:{cards:cards.length,slides:slideNumbers.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    
    // Set initial state
    gsap.set(cards, {
        opacity: 0,
        y: 50,
        scale: 0.9
    });
    
    gsap.set(slideNumbers, {
        opacity: 0,
        scale: 0
    });
    
    // Animate cards in sequence
    cards.forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "back.out(1.7)"
        });
    });
    
    // Animate slide numbers
    slideNumbers.forEach((number, index) => {
        gsap.to(number, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.15 + 0.5,
            ease: "elastic.out(1, 0.5)"
        });
    });
    
    // Add hover animations
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Highlight a specific card
function highlightCard(index) {
    const cards = document.querySelectorAll('.card-item');
    const slideNumbers = document.querySelectorAll('.slide-number');
    
    // Remove active class from all
    cards.forEach(card => card.classList.remove('active'));
    slideNumbers.forEach(num => num.classList.remove('active'));
    
    // Add active class to selected
    if (cards[index]) {
        cards[index].classList.add('active');
        gsap.to(cards[index], {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
    
    if (slideNumbers[index]) {
        slideNumbers[index].classList.add('active');
    }
    
    // Scroll to card
    if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'S3',location:'script.js:highlightCard',message:'highlight card',data:{index,cardCount:cards.length,slideCount:slideNumbers.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
}

// Scroll-triggered animations for sections
function initializeScrollAnimations() {
    // Check if ScrollTrigger is available
    if (typeof ScrollTrigger === 'undefined') {
        // Fallback: simple fade-in animations without scroll trigger
        const sections = document.querySelectorAll('.services-section, .projects-section, .about-section, .contact-section');
        sections.forEach((section, index) => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: index * 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        return;
    }
    
    const sections = document.querySelectorAll('.services-section, .projects-section, .about-section, .contact-section');
    
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out"
        });
    });
    
    // Animate service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });
    
    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.7)"
        });
    });
}

// Smooth scroll for navigation links and active menu highlighting
document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active menu item
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active menu item on scroll
function updateActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveMenu);
updateActiveMenu(); // Set initial active item

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const menu = document.querySelector('.menu');

if (mobileMenuToggle && menu) {
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !menu.contains(e.target) && 
            !mobileMenuToggle.contains(e.target) &&
            menu.classList.contains('active')) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;
        
        // Close all other FAQs
        document.querySelectorAll('.faq-question').forEach(q => {
            if (q !== this) {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = '0';
                q.nextElementSibling.style.padding = '0 1.5rem';
            }
        });
        
        // Toggle current FAQ
        this.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.padding = '0 1.5rem 1.5rem';
        } else {
            answer.style.maxHeight = '0';
            answer.style.padding = '0 1.5rem';
        }
    });
});

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        messageInput.classList.remove('error');
    }

    nameInput.addEventListener('blur', function() {
        if (this.value.trim().length < 2) {
            nameError.textContent = 'Naam moet minimaal 2 tekens bevatten';
            this.classList.add('error');
        } else {
            nameError.textContent = '';
            this.classList.remove('error');
        }
    });

    emailInput.addEventListener('blur', function() {
        if (!validateEmail(this.value)) {
            emailError.textContent = 'Voer een geldig email adres in';
            this.classList.add('error');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    messageInput.addEventListener('blur', function() {
        if (this.value.trim().length < 10) {
            messageError.textContent = 'Bericht moet minimaal 10 tekens bevatten';
            this.classList.add('error');
        } else {
            messageError.textContent = '';
            this.classList.remove('error');
        }
    });

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        let isValid = true;
        
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Naam moet minimaal 2 tekens bevatten';
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Voer een geldig email adres in';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Bericht moet minimaal 10 tekens bevatten';
            messageInput.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            formSuccess.style.display = 'block';
            contactForm.reset();
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

// Trust Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counter animation when section is visible
const trustSection = document.querySelector('.trust-section');
if (trustSection) {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    if (!stat.dataset.animated) {
                        stat.dataset.animated = 'true';
                        animateCounter(stat, target);
                    }
                });
            }
        });
    }, observerOptions);
    
    observer.observe(trustSection);
}

// Back to Top Button
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add parallax effect to header
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header-background');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
        header.style.opacity = 1 - (scrolled / 500);
    }
});

// Re-initialize animations on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate animations if needed
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});

// Lightbox Gallery Functionality
let currentGallery = null;
let currentImageIndex = 0;

function openLightbox(projectId) {
    const gallery = projectGalleries[projectId];
    if (!gallery) return;
    
    currentGallery = gallery;
    currentImageIndex = 0;
    
    const modal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const thumbnailsContainer = document.getElementById('lightboxThumbnails');
    
    if (!modal || !lightboxImage || !lightboxTitle || !lightboxCounter || !thumbnailsContainer) return;
    
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set title
    lightboxTitle.textContent = gallery.title;
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H1',location:'script.js:openLightbox',message:'openLightbox start',data:{projectId,images:gallery.images},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    // Load first image
    loadLightboxImage(0);
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    gallery.images.forEach((img, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = img.replace('w=1200', 'w=200');
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.className = 'lightbox-thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.addEventListener('click', () => loadLightboxImage(index));
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H2',location:'script.js:openLightbox',message:'thumbnails created',data:{projectId,thumbCount:gallery.images.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    updateLightboxCounter();
}

function loadLightboxImage(index) {
    if (!currentGallery) return;
    
    const lightboxImage = document.getElementById('lightboxImage');
    const loader = document.querySelector('.lightbox-loader');
    const thumbnails = document.querySelectorAll('.lightbox-thumbnail');
    
    if (!lightboxImage || !loader) return;
    
    currentImageIndex = index;
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H3',location:'script.js:loadLightboxImage',message:'load start',data:{index,img:currentGallery.images[index]},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    // Show loader
    loader.style.display = 'block';
    lightboxImage.style.opacity = '0';
    
    // Load image
    const img = new Image();
    img.onload = function() {
        lightboxImage.src = this.src;
        lightboxImage.alt = `${currentGallery.title} - Afbeelding ${index + 1}`;
        loader.style.display = 'none';
        lightboxImage.style.opacity = '1';
        
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H4',location:'script.js:loadLightboxImage',message:'load success',data:{index,src:this.src},timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        // Update thumbnails
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
        
        updateLightboxCounter();
    };
    img.onerror = function() {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/98426076-8e0c-4a0a-a739-dfd8a918c6e9',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'run1',hypothesisId:'H5',location:'script.js:loadLightboxImage',message:'load error',data:{index,src:currentGallery.images[index]},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
    };
    img.src = currentGallery.images[index];
}

function updateLightboxCounter() {
    const counter = document.querySelector('.lightbox-counter');
    if (currentGallery && counter) {
        counter.textContent = `${currentImageIndex + 1} / ${currentGallery.images.length}`;
    }
}

function nextImage() {
    if (!currentGallery) return;
    const nextIndex = (currentImageIndex + 1) % currentGallery.images.length;
    loadLightboxImage(nextIndex);
}

function prevImage() {
    if (!currentGallery) return;
    const prevIndex = (currentImageIndex - 1 + currentGallery.images.length) % currentGallery.images.length;
    loadLightboxImage(prevIndex);
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentGallery = null;
        currentImageIndex = 0;
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // View gallery buttons
    document.querySelectorAll('.view-gallery-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-project');
            openLightbox(projectId);
        });
    });
    
    // Close button
    const closeBtn = document.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Next/Prev buttons
    const nextBtn = document.querySelector('.lightbox-next');
    const prevBtn = document.querySelector('.lightbox-prev');
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    
    // Close on background click
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('lightboxModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const lightboxImageContainer = document.querySelector('.lightbox-image-container');
    if (lightboxImageContainer) {
        lightboxImageContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        lightboxImageContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextImage();
        }
        if (touchEndX > touchStartX + 50) {
            prevImage();
        }
    }
});

