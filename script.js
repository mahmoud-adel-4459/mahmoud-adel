// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2500); // 2500ms delay to give the user time to see the animation
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                if (hamburger) hamburger.classList.remove('toggle');
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Reset navigation state on window resize (e.g. device orientation change)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            if (navLinks) navLinks.classList.remove('nav-active');
            if (hamburger) hamburger.classList.remove('toggle');
            document.body.classList.remove('nav-open');
        }
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.05
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // Immediately reveal elements in viewport or when target hash matches
    const revealVisible = () => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    };

    revealVisible();
    window.addEventListener('scroll', revealVisible, { passive: true });

    // Safety fallback: reveal all fade-in elements after 800ms to guarantee no blank content on mobile
    setTimeout(() => {
        fadeElements.forEach(el => el.classList.add('visible'));
    }, 800);

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Move dot instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Move outline with a slight delay using requestAnimationFrame
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect to interactive elements
        const interactives = document.querySelectorAll('a, button, .work-card, .service-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });
    } else if (cursorDot && cursorOutline) {
        // Hide custom cursor on touch devices
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
    }

    // Portfolio Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    if (filterBtns.length > 0 && workCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                workCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('is-hidden');
                        card.classList.add('visible');
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    } else {
                        card.classList.add('is-hidden');
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // WhatsApp Floating Widget Handler
    const waFloatBtn = document.getElementById('waFloatBtn');
    const waChatBox = document.getElementById('waChatBox');
    const waCloseBtn = document.getElementById('waCloseBtn');

    if (waFloatBtn && waChatBox) {
        waFloatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            waChatBox.classList.toggle('open');
            const badge = waFloatBtn.querySelector('.wa-badge-dot');
            if (badge) badge.style.display = 'none';
        });

        if (waCloseBtn) {
            waCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                waChatBox.classList.remove('open');
            });
        }

        document.addEventListener('click', (e) => {
            if (!waChatBox.contains(e.target) && !waFloatBtn.contains(e.target)) {
                waChatBox.classList.remove('open');
            }
        });
    }

    // Hero IDE Window Tab Switching
    const ideTabs = document.querySelectorAll('.ide-tab');
    const idePanes = document.querySelectorAll('.ide-pane');

    if (ideTabs.length > 0) {
        ideTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                ideTabs.forEach(t => t.classList.remove('active'));
                idePanes.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const targetPane = document.getElementById(`pane-${tab.getAttribute('data-tab')}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // Dynamic Typing Text Effect in Hero
    const typingTextEl = document.getElementById('typingText');
    if (typingTextEl) {
        const phrases = [
            "WordPress Custom Plugins",
            "WooCommerce Platforms",
            "REST APIs for Flutter Apps",
            "Web Team Leadership",
            "cPanel & Performance Tuning"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 1800; // Pause at end of phrase
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400; // Pause before typing next phrase
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    // Vanilla Tilt Initialization (Desktops / fine pointer only)
    if (typeof VanillaTilt !== 'undefined' && window.matchMedia("(pointer: fine)").matches) {
        VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
            max: 12,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.03
        });
    }
});
