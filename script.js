// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
window.addEventListener('pageshow', () => {
    window.scrollTo(0, 0);
});

// Hero — layered scroll parallax (background vs typography, staggered depths)
const heroParallax = {
    trigger: '.section-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.15
};

gsap.to('.hero-bg', {
    y: '42vh',
    ease: 'none',
    scrollTrigger: heroParallax
});

gsap.to('.hero-bg-media', {
    '--hero-media-blur': '0px',
    ease: 'none',
    scrollTrigger: {
        trigger: '.section-hero',
        start: 'top top',
        end: '+=95vh',
        scrub: 1.05
    }
});

gsap.to('.hero-label', {
    y: -90,
    z: -80,
    rotationX: 8,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: heroParallax
});

gsap.to('.hero-title', {
    y: -165,
    z: 40,
    scale: 1.14,
    rotationX: -6,
    ease: 'none',
    scrollTrigger: heroParallax
});

gsap.to('.hero-subtitle', {
    y: -255,
    z: 120,
    scale: 1.06,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: heroParallax
});

gsap.to('.hero-scroll-hint', {
    y: -340,
    opacity: 0,
    ease: 'none',
    scrollTrigger: heroParallax
});

function initHeroIntro() {
    const heroTitle = document.querySelector('.hero-title');
    const titleText = heroTitle.textContent;
    heroTitle.textContent = '';
    titleText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.opacity = '0';
        span.style.transform = 'translateY(-50px)';
        heroTitle.appendChild(span);
    });

    gsap.set('.hero-content', { opacity: 1 });
    gsap.set('.hero-label, .hero-subtitle, .hero-scroll-hint', { opacity: 0 });

    const tlHero = gsap.timeline();
    tlHero.to('.hero-entry-line', {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 0.2
    })
    .to('.hero-entry-line', {
        scaleY: 400,
        opacity: 0,
        duration: 0.4,
        ease: 'power1.in'
    })
    .to('.hero-title span', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'back.out(1.7)'
    }, '-=0.2')
    .to('.hero-label', { opacity: 1, duration: 0.6 }, '-=0.4')
    .to('.hero-subtitle', { opacity: 1, duration: 0.6 }, '-=0.6')
    .to('.hero-scroll-hint', { opacity: 1, duration: 1 }, '+=0.2');
}

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.scroll-progress-bar').style.width = scrollPercent + '%';
});


// Universal Text Highlight Effect
const highlightTexts = document.querySelectorAll('.scroll-highlight');

highlightTexts.forEach(textEl => {
    // Split text robustly by whitespaces
    const words = textEl.innerText.trim().split(/\s+/);
    textEl.innerHTML = '';
    words.forEach(word => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        textEl.appendChild(span);
    });

    // If it's NOT a pinned text, handle animation naturally over scroll entry
    if (!textEl.classList.contains('discovery-text') && !textEl.classList.contains('artefact-body') && !textEl.classList.contains('parade-title') && !textEl.classList.contains('parade-watermark')) {
        gsap.to(textEl.querySelectorAll('span'), {
            color: '#f0ede6',
            scrollTrigger: {
                trigger: textEl,
                start: "top 85%", // Start highlighting when paragraph scrolls fully into lower view
                end: "center 40%", // Finish before text hits top half
                scrub: 1
            },
            stagger: 0.1
        });
    }
});

// Section 2: Discovery Pinned Timeline
const tlDiscovery = gsap.timeline({
    scrollTrigger: {
        trigger: '.section-discovery',
        pin: true,
        start: "center center",
        end: "+=200%", // Pin for 200% scroll distance (very slow)
        scrub: 2       // Slower, smoother scrub
    }
});

tlDiscovery.to('.discovery-text span', {
    color: '#f0ede6',
    stagger: 0.1
})
.to('.discovery-label', {
    opacity: 1,
    y: -20,
    duration: 1
}, "+=0.3");


// Section 3: Artefact Pinned Reveal & Parallax
const tlArtefact = gsap.timeline({
    scrollTrigger: {
        trigger: '.section-artefact',
        pin: true,
        start: "center center",
        end: "+=250%", // Very slow, dramatic reading pace
        scrub: 2,
        onEnter: () => document.querySelector('.ancient-tablet').classList.add('glow'),
        onLeaveBack: () => document.querySelector('.ancient-tablet').classList.remove('glow')
    }
});

tlArtefact.to('.slide-text > *', {
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
}, 0)
.to('.tablet-visual', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
}, 0)
.to('.artefact-body span', {
    color: '#f0ede6',
    stagger: 0.05,
    duration: 2
}, 0.5) // Starts highlighting right after slide-in
.to('.ancient-tablet', {
    y: -80,
    rotation: 5, // Slow creeping rotation
    scale: 1.05,
    duration: 3,
    ease: "none"
}, 0); // Continuous parallax scaling and floating while pinned

// Section 4: Sticky Sequence
// Only run on desktop (>= 768px)
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
    const panels = gsap.utils.toArray('.panel');
    const bgColors = ['#080910', '#8b1a1a', '#0d1226', '#080910'];

    const tlSequence = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-unleashing',
            start: "top top",
            end: "bottom bottom",
            scrub: 2
        }
    });

    // Panel A fades in fast automatically because it's first
    tlSequence.to('.panel-a', { opacity: 1, duration: 1 })
              .to('.panel-a', { opacity: 0, duration: 1, delay: 1 });

    // Panel B
    tlSequence.to('.section-unleashing', { backgroundColor: bgColors[1], duration: 1 }, "<")
              .to('.panel-b', { opacity: 1, duration: 1 }, "<")
              .to('.panel-b', { opacity: 0, duration: 1, delay: 1 });

    // Panel C
    tlSequence.to('.section-unleashing', { backgroundColor: bgColors[2], duration: 1 }, "<")
              .to('.panel-c', { opacity: 1, duration: 1 }, "<")
              .to('.panel-c', { opacity: 0, duration: 1, delay: 1 });

    // Panel D
    tlSequence.to('.section-unleashing', { backgroundColor: bgColors[3], duration: 1 }, "<")
              .to('.panel-d', { opacity: 1, duration: 1 }, "<");
});


// Section 5: Character Parade Pinned Reveal
const tlParade = gsap.timeline({
    scrollTrigger: {
        trigger: '.section-parade',
        pin: true,
        start: "center center",
        end: "+=150%",
        scrub: 2
    }
});

tlParade.to('.parade-title', {
    opacity: 1,
    y: -30,
    duration: 0.5,
    ease: "power2.out"
}, 0)
.to('.parade-title span', {
    color: '#f0ede6',
    stagger: 0.1,
    duration: 1
}, 0.5)
.to('.parade-watermark span', {
    color: 'rgba(255,255,255,0.2)',
    stagger: 0.1,
    duration: 1
}, 0.5);

// Section 6: CTA Reveal
gsap.to('.cta-line', {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.5)",
    scrollTrigger: {
        trigger: '.section-cta',
        start: "top 50%"
    }
});

// Landing gate — immersive entry (hero intro runs only after dismiss)
(function setupLandingGate() {
    const gate = document.getElementById('landing-gate');
    const btn = document.getElementById('landing-enter');
    if (!gate || !btn) {
        initHeroIntro();
        return;
    }

    gsap.set('.landing-gate__runes', { opacity: 0 });
    gsap.set('.landing-gate__cta', { opacity: 0, y: 24 });

    const tlIn = gsap.timeline({ delay: 0.12 });
    tlIn.to('.landing-gate__img', { scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
        .fromTo('.landing-gate__video', { opacity: 0 }, { opacity: 0.2, duration: 2.2, ease: 'power1.out' }, 0.2)
        .to('.landing-gate__runes', { opacity: 0.95, duration: 1.4, ease: 'power2.out' }, 0.55)
        .to('.landing-gate__cta', { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' }, 1.1);

    gsap.to('.landing-gate__img', {
        scale: 1.05,
        duration: 14,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.8
    });

    const landingRunes = gate.querySelector('.landing-gate__runes');
    const landingCtaInner = gate.querySelector('.landing-gate__cta-inner');
    const greekGreeting = 'Χαίρετε, μαθηταὶ τοῦ Βισόπτων καὶ Ῥεδμαρσάλου';
    const englishGreeting = 'Welcome, students of Bishopton Redmarshall';

    function dissolveGate() {
        gsap.timeline({
            defaults: { ease: 'power3.in' },
            onComplete: () => {
                gate.remove();
                document.body.classList.remove('landing-active');
                ScrollTrigger.refresh();
                initHeroIntro();
            }
        })
        .to('.landing-gate__content', { opacity: 0, y: -36, duration: 0.5 })
        .to('.landing-gate__pillars', { opacity: 0, duration: 0.35 }, '-=0.35')
        .to('.landing-gate__layers', {
            opacity: 0,
            scale: 1.14,
            filter: 'blur(18px) brightness(1.5)',
            duration: 1.05
        }, '-=0.25');
    }

    function enterSite() {
        btn.disabled = true;
        tlIn.kill();
        gsap.killTweensOf('.landing-gate__img');

        landingRunes.textContent = greekGreeting;
        landingCtaInner.textContent = 'Translation in progress';

        const textState = { p: 0 };
        const maxLen = Math.max(greekGreeting.length, englishGreeting.length);
        const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const charWeights = Array.from({ length: maxLen }, (_, i) => {
            const ch = englishGreeting.charAt(i);
            if (ch === ' ') return 4.2;
            if (ch === ',' || ch === '.' || ch === ';' || ch === ':') return 3.2;
            return 1;
        });
        const totalWeight = charWeights.reduce((sum, w) => sum + w, 0);

        gsap.timeline({
            onComplete: dissolveGate
        })
        .to(textState, {
            p: 1,
            duration: 30,
            ease: 'none',
            onUpdate: () => {
                const targetWeight = textState.p * totalWeight;
                let reveal = 0;
                let running = 0;
                while (reveal < maxLen && running + charWeights[reveal] <= targetWeight) {
                    running += charWeights[reveal];
                    reveal += 1;
                }
                const englishPart = englishGreeting.slice(0, reveal);
                const greekPart = greekGreeting.slice(reveal);
                const transitioningChar = englishGreeting.charAt(reveal);
                const leading = esc(`${englishPart}`);
                const trailing = esc(`${greekPart}`);
                if (transitioningChar) {
                    landingRunes.innerHTML = `${leading}<span class="morph-char">${esc(transitioningChar)}</span>${trailing}`;
                } else {
                    landingRunes.textContent = `${englishPart}${greekPart}`;
                }
            }
        }, 0.1)
        .to('.landing-gate__runes', { color: '#faf6ee', duration: 0.8, ease: 'power1.out' }, '>-0.3')
        .to({}, { duration: 0.6 });
    }

    let dismissed = false;
    const enterSiteWrapped = () => {
        if (dismissed) return;
        dismissed = true;
        enterSite();
    };

    btn.addEventListener('click', enterSiteWrapped);
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enterSiteWrapped();
        }
    });

    document.addEventListener('keydown', function landingEscape(e) {
        if (e.key === 'Escape' && !dismissed) {
            enterSiteWrapped();
            document.removeEventListener('keydown', landingEscape);
        }
    });
})();
