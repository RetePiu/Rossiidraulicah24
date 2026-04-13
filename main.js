document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SCROLL NAVBAR EFFECT
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu simple toggle (optional visual)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Note: Needs CSS display toggle logic if fully implemented, 
            // for now we'll do a simple alert or console to verify.
            if(navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '1rem 0';
                navLinks.style.boxShadow = 'var(--shadow-md)';
            }
        });
    }


    // ----------------------------------------------------
    // 2. "CHI SIAMO" SLIDER LOGIC
    // ----------------------------------------------------
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const images = document.querySelectorAll('.slider-img');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const progressBar = document.getElementById('progress-bar');
    
    const totalSlides = slides.length; // usually 3

    function updateSlider(index) {
        // Rimuove active class da tutti
        slides.forEach(slide => slide.classList.remove('active'));
        images.forEach(img => img.classList.remove('active'));
        
        // Aggiunge active all'indice corrente
        slides[index].classList.add('active');
        images[index].classList.add('active');
        
        // Aggiorna la progress bar (ad es. 1/3, 2/3, 3/3)
        const progressPercentage = ((index + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    prevBtn.addEventListener('click', () => {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = totalSlides - 1; // loop back
        }
        updateSlider(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide++;
        if (currentSlide >= totalSlides) {
            currentSlide = 0; // loop forward
        }
        updateSlider(currentSlide);
    });

    // Assicura l'inizializzazione al caricamento
    updateSlider(currentSlide);


    // ----------------------------------------------------
    // 3. STATS NUMBER COUNTER (Intersection Observer)
    // ----------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Valore arbitrario per la velocità di incremento, abbassare per renderlo più rapido

    const runCounterAnimation = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const format = counter.getAttribute('data-format') === 'true'; 
            
            // Per gestire numeri puri senza virgole se non richiesto, 
            // per "1300" l'HTML dice "1300" in target e lo forma.
            
            // Attuale valore
            let countStr = counter.innerText.replace('.', '');
            const count = +countStr;

            // Incremento (più il target è grande, più sale in fretta se dividiamo sempre per speed diviso qualcosa)
            const inc = target / speed;

            if (count < target) {
                // arrotonda l'incremento verso l'alto
                let newCount = Math.ceil(count + inc);
                if (newCount > target) newCount = target;
                
                if (format) {
                    // Formatta con puntino delle migliaia
                    counter.innerText = newCount.toLocaleString('it-IT');
                } else {
                    counter.innerText = newCount;
                }
                setTimeout(updateCount, 15);
            } else {
                if (format) {
                    counter.innerText = target.toLocaleString('it-IT');
                } else {
                    counter.innerText = target;
                }
            }
        };

        updateCount();
    };

    // Usiamo Intersection Observer per avviare l'animazione quando la sezione è visibile
    const statsSection = document.getElementById('i-nostri-lavori');
    
    // Flag per evitare di ripetere l'animazione più volte
    let animationDone = false; 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // avvia l'animazione quando il 40% della sezione è visibile
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationDone) {
                animationDone = true;
                counters.forEach(counter => {
                    // Resetta in caso
                    counter.innerText = '0';
                    runCounterAnimation(counter);
                });
                // Non abbiamo più bisogno di osservare
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ----------------------------------------------------
    // 4. COPY TO CLIPBOARD LOGIC
    // ----------------------------------------------------
    const copyBtn = document.getElementById('copy-address-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const addressText = "Via San Mamante nr. 92, Ravenna, Emilia Romagna 48120 - 44°21'17.4\"N 12°04'07.3\"E";
            navigator.clipboard.writeText(addressText).then(() => {
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiato!';
                copyBtn.classList.add('success');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                    copyBtn.classList.remove('success');
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
});
