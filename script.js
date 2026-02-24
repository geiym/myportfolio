// ============================================
// THREE.JS PARTICLES CURSOR EFFECT (PURPLE)
// ============================================
function initThreeJSCursor() {
    if (typeof THREE === 'undefined') { console.error('THREE.js not loaded!'); return; }
    try {
        const container = document.createElement('div');
        container.id = 'threejs-cursor-container';
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(container);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i*3] = positions[i*3+1] = positions[i*3+2] = 0;
            colors[i*3]   = 0.4 + Math.random() * 0.3;
            colors[i*3+1] = 0.0 + Math.random() * 0.1;
            colors[i*3+2] = 0.7 + Math.random() * 0.3;
            sizes[i] = Math.random() * 2 + 1;
            velocities.push({ x:0, y:0, z:0, life:0, age:0 });
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: `attribute float size;attribute vec3 color;varying vec3 vColor;void main(){vColor=color;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*(200.0/-mvPosition.z);gl_Position=projectionMatrix*mvPosition;}`,
            fragmentShader: `varying vec3 vColor;void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>0.4)discard;gl_FragColor=vec4(vColor,(1.0-smoothstep(0.2,0.4,d))*0.7);}`,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        const mouse = { worldX:0, worldY:0, prevWorldX:0, prevWorldY:0 };
        let particleIndex = 0;

        document.addEventListener('mousemove', (e) => {
            mouse.prevWorldX = mouse.worldX; mouse.prevWorldY = mouse.worldY;
            const v = new THREE.Vector3((e.clientX/window.innerWidth)*2-1, -(e.clientY/window.innerHeight)*2+1, 0.5);
            v.unproject(camera);
            const dir = v.sub(camera.position).normalize();
            const pos = camera.position.clone().add(dir.multiplyScalar(-camera.position.z/dir.z));
            mouse.worldX = pos.x; mouse.worldY = pos.y;
            const speed = Math.sqrt((mouse.worldX-mouse.prevWorldX)**2+(mouse.worldY-mouse.prevWorldY)**2);
            const count = Math.min(Math.floor(speed*8000)+5, 20);
            for (let i = 0; i < count; i++) {
                const idx = particleIndex % particleCount, i3 = idx*3;
                const ang = Math.random()*Math.PI*2, vel = 0.005+Math.random()*0.001;
                positions[i3]=mouse.worldX; positions[i3+1]=mouse.worldY; positions[i3+2]=(Math.random()-0.5)*0.0001;
                velocities[idx]={ x:Math.cos(ang)*vel, y:Math.sin(ang)*vel, z:(Math.random()-0.5)*0.005, life:1.0, age:0, initialSize:Math.random()*0.3+0.1, growthRate:Math.random()*0.00009+0.00001 };
                sizes[idx]=velocities[idx].initialSize; particleIndex++;
            }
        });

        function animateCursor() {
            requestAnimationFrame(animateCursor);
            for (let i = 0; i < particleCount; i++) {
                const i3=i*3, vel=velocities[i];
                if (vel && vel.life > 0) {
                    positions[i3]+=vel.x; positions[i3+1]+=vel.y; positions[i3+2]+=vel.z;
                    vel.age+=0.016; vel.life-=0.008;
                    sizes[i]=vel.age<0.2?sizes[i]+vel.growthRate*0.5:sizes[i]*0.985;
                    vel.x*=0.99; vel.y*=0.99; vel.z*=0.99; vel.y+=0.0001;
                    colors[i3]   = 0.4 + vel.life * 0.3;
                    colors[i3+1] = 0.0 + Math.random() * 0.05;
                    colors[i3+2] = 0.7 + vel.life * 0.3;
                } else if (vel) { positions[i3]=positions[i3+1]=positions[i3+2]=0; sizes[i]=0; }
            }
            particles.attributes.position.needsUpdate=true;
            particles.attributes.size.needsUpdate=true;
            particles.attributes.color.needsUpdate=true;
            renderer.render(scene, camera);
        }
        animateCursor();
        window.addEventListener('resize', () => { camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });
    } catch(e) { console.error('Cursor error:', e); }
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================
// INFINITE SCROLLING CAROUSEL
// ============================================
function initInfiniteCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    track.style.animation = 'none';
    Array.from(track.children).forEach(item => track.appendChild(item.cloneNode(true)));
    let position = 0;
    const speed = 0.5, totalWidth = 170 * 8;
    function run() { position -= speed; if (Math.abs(position) >= totalWidth) position = 0; track.style.transform = `translateX(${position}px)`; requestAnimationFrame(run); }
    run();
}

// ============================================
// ACTIVE NAV LINK
// ============================================
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(s => { if (window.pageYOffset >= s.offsetTop - s.clientHeight/3) current = s.getAttribute('id'); });
    document.querySelectorAll('.nav-link').forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === `#${current}`) l.classList.add('active'); });
});

// ============================================
// MOBILE MENU
// ============================================
const createMobileMenu = () => {
    document.querySelector('.menu-toggle')?.remove();
    if (window.innerWidth <= 768) {
        const btn = document.createElement('button');
        btn.classList.add('menu-toggle');
        btn.innerHTML = '☰';
        btn.style.cssText = 'display:block;background:none;border:none;color:white;font-size:2rem;cursor:pointer;';
        document.querySelector('.nav-container').prepend(btn);
        btn.addEventListener('click', () => document.querySelector('.nav-menu').classList.toggle('active'));
    }
};
window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// ============================================
// TYPING ANIMATION
// ============================================
const roles = [
    "web developer",
    "desktop app developer", 
    "UI/UX designer",
    "full-stack developer"
];
let roleIndex=0, charIndex=0, isDeleting=false, typingSpeed=80;
function typeEffect() {
    const el = document.querySelector('.typing-text'); if (!el) return;
    const current = roles[roleIndex];
    el.textContent = isDeleting ? current.substring(0, charIndex-1) : current.substring(0, charIndex+1);
    isDeleting ? charIndex-- : charIndex++;
    typingSpeed = isDeleting ? 50 : 80;
    if (!isDeleting && charIndex === current.length) { typingSpeed=1500; isDeleting=true; }
    else if (isDeleting && charIndex === 0) { isDeleting=false; roleIndex=(roleIndex+1)%roles.length; typingSpeed=300; }
    setTimeout(typeEffect, typingSpeed);
}

// ============================================
// SCROLL REVEAL
// ============================================
function revealSections() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); else e.target.classList.remove('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -200px 0px' });
    ['#home','#about','#skills','#tools','#contact'].forEach(sel => { const el=document.querySelector(sel); if(el) obs.observe(el); });
    document.querySelectorAll('#home .profile-image,#home .hero-text,#about .about-title,#about .about-text,#about .stats-container,#about .expertise-card').forEach(el => obs.observe(el));
    const st = document.querySelector('#skills .skills-title'); if(st) obs.observe(st);
    document.querySelectorAll('#skills .skill-card').forEach(c => obs.observe(c));
}
function revealProjects() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); else e.target.classList.remove('visible'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -200px 0px' });
    document.querySelectorAll('.project-showcase').forEach(p => obs.observe(p));
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const form=document.getElementById('contactForm'), submitBtn=document.getElementById('submitBtn'), statusMessage=document.getElementById('statusMessage'), emailInput=document.getElementById('email');
    if (!form) return;
    function isValidEmail(email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
        const domain=email.split('@')[1]?.toLowerCase();
        if (['test.com','example.com','fake.com','temp.com','tempmail.com','throwaway.com','mailinator.com'].includes(domain)) return false;
        const tld=domain?.split('.').pop(); return tld && tld.length >= 2;
    }
    emailInput.addEventListener('blur', function() {
        const v=this.value.trim();
        if (v && !isValidEmail(v)) { this.style.borderColor='#ff0000'; statusMessage.className='status-message error'; statusMessage.textContent='⚠ Please enter a valid email address'; statusMessage.style.display='block'; }
        else if (v) { this.style.borderColor=''; statusMessage.style.display='none'; }
    });
    emailInput.addEventListener('input', function() { this.style.borderColor=''; if (statusMessage.classList.contains('error')) statusMessage.style.display='none'; });
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email=emailInput.value.trim();
        if (!isValidEmail(email)) { statusMessage.className='status-message error'; statusMessage.textContent='✗ Please enter a valid email address'; statusMessage.style.display='block'; emailInput.style.borderColor='#ff0000'; emailInput.focus(); return; }
        submitBtn.disabled=true; submitBtn.textContent='Sending...'; statusMessage.style.display='none'; emailInput.style.borderColor='';
        try {
            const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:new FormData(form)}), result=await res.json();
            if (result.success) { statusMessage.className='status-message success'; statusMessage.textContent="✓ Message sent successfully! I'll get back to you soon."; statusMessage.style.display='block'; form.reset(); setTimeout(()=>{statusMessage.style.display='none';},5000); }
            else throw new Error(result.message);
        } catch { statusMessage.className='status-message error'; statusMessage.textContent='✗ Failed to send. Please try again.'; statusMessage.style.display='block'; }
        finally { submitBtn.disabled=false; submitBtn.textContent='Send Message'; }
    });
}

// ============================================
// PROGRESS BARS
// ============================================
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.style.setProperty('--progress', entry.target.getAttribute('data-progress')+'%'); entry.target.classList.add('animate'); progressObserver.unobserve(entry.target); }
    });
}, { threshold: 0.5 });

// ============================================
// LANGUAGES CAROUSEL NAV
// ============================================
function initLanguagesNavigation() {
    const track=document.querySelector('.languages-section .carousel-track'), prev=document.querySelector('.lang-nav.prev'), next=document.querySelector('.lang-nav.next');
    if (!track||!prev||!next) return;
    let cur=0; const max=7*170;
    prev.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();cur=(cur-170+max)%max;track.style.transform=`translateX(-${cur}px)`;});
    next.addEventListener('click',(e)=>{e.preventDefault();e.stopPropagation();cur=(cur+170)%max;track.style.transform=`translateX(-${cur}px)`;});
}

// ============================================
// PROJECT NAVIGATION & LIGHTBOX
// ============================================
const projectImages = {
    0:['images/brent1.png','images/brent2.png','images/brent3.png','images/brent4.png','images/brent5.png'],
    1:['images/File1.png','images/File2.png','images/File3.png','images/File4.png','images/File5.png'],
    2:['images/primo1.png','images/primo2.png','images/primo3.png','images/primo4.png','images/primo5.png']
};
let currentImageIndex=[0,0,0], lightboxState={isOpen:false,projectIndex:0,imageIndex:0};

function createLightbox() {
    const lb=document.createElement('div'); lb.id='lightbox-modal';
    lb.innerHTML=`<div class="lightbox-overlay"></div><div class="lightbox-content"><button class="lightbox-close">×</button><button class="lightbox-prev">‹</button><img class="lightbox-image" src="" alt="Project Image"><button class="lightbox-next">›</button></div>`;
    document.body.appendChild(lb);
    const s=document.createElement('style');
    s.textContent=`#lightbox-modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000}#lightbox-modal.active{display:block}.lightbox-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95)}.lightbox-content{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:60px}.lightbox-image{max-width:90%;max-height:90%;object-fit:contain;box-shadow:0 10px 50px rgba(0,0,0,.8)}.lightbox-close{position:absolute;top:20px;right:30px;font-size:50px;color:white;background:none;border:none;cursor:pointer;z-index:10001;line-height:1}.lightbox-prev,.lightbox-next{position:absolute;top:50%;transform:translateY(-50%);font-size:60px;color:white;background:rgba(255,255,255,.1);border:none;cursor:pointer;padding:20px 25px;z-index:10001;border-radius:5px}.lightbox-prev{left:30px}.lightbox-next{right:30px}`;
    document.head.appendChild(s);
}
function openLightbox(pi,ii){const lb=document.getElementById('lightbox-modal');lightboxState={isOpen:true,projectIndex:pi,imageIndex:ii};lb.querySelector('.lightbox-image').src=projectImages[pi][ii];lb.classList.add('active');document.body.style.overflow='hidden';}
function closeLightbox(){document.getElementById('lightbox-modal').classList.remove('active');lightboxState.isOpen=false;document.body.style.overflow='';}
function navigateLightbox(dir){const total=projectImages[lightboxState.projectIndex].length;lightboxState.imageIndex=dir==='next'?(lightboxState.imageIndex+1)%total:(lightboxState.imageIndex-1+total)%total;document.querySelector('.lightbox-image').src=projectImages[lightboxState.projectIndex][lightboxState.imageIndex];}
function updateProjectImage(pi,ii){const s=document.querySelectorAll('.project-showcase')[pi];if(!s)return;s.querySelector('.project-frame img').src=projectImages[pi][ii];s.querySelectorAll('.nav-dot').forEach((d,i)=>d.classList.toggle('active',i===ii));currentImageIndex[pi]=ii;}
function initProjectNavigation(){
    createLightbox();
    document.querySelectorAll('.project-showcase').forEach((showcase,pi)=>{
        const arrows=showcase.querySelectorAll('.nav-arrow'),total=projectImages[pi].length;
        showcase.querySelector('.project-frame')?.addEventListener('click',(e)=>{if(!e.target.closest('.nav-arrow')&&!e.target.closest('.nav-dot'))openLightbox(pi,currentImageIndex[pi]);});
        arrows[0]?.addEventListener('click',(e)=>{e.stopPropagation();updateProjectImage(pi,(currentImageIndex[pi]-1+total)%total);});
        arrows[1]?.addEventListener('click',(e)=>{e.stopPropagation();updateProjectImage(pi,(currentImageIndex[pi]+1)%total);});
        showcase.querySelectorAll('.nav-dot').forEach((dot,di)=>dot.addEventListener('click',(e)=>{e.stopPropagation();updateProjectImage(pi,di);}));
    });
    const lb=document.getElementById('lightbox-modal');
    lb.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
    lb.querySelector('.lightbox-overlay').addEventListener('click',closeLightbox);
    lb.querySelector('.lightbox-prev').addEventListener('click',()=>navigateLightbox('prev'));
    lb.querySelector('.lightbox-next').addEventListener('click',()=>navigateLightbox('next'));
    document.addEventListener('keydown',(e)=>{if(!lightboxState.isOpen)return;if(e.key==='Escape')closeLightbox();else if(e.key==='ArrowLeft')navigateLightbox('prev');else if(e.key==='ArrowRight')navigateLightbox('next');});
}

// ============================================
// NAVBAR GLASS ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 80);
});

// ============================================
// PROJECT CARDS + TOOL GLOW
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const cardObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.project-card').forEach(c => cardObs.observe(c));
    const toolsGrid = document.querySelector('.tools-grid');
    if (toolsGrid) {
        toolsGrid.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.tool-card-wrapper').forEach(wrapper => {
                const rect = wrapper.getBoundingClientRect();
                wrapper.style.setProperty('--mouse-x', `${e.clientX-rect.left}px`);
                wrapper.style.setProperty('--mouse-y', `${e.clientY-rect.top}px`);
            });
        });
    }
});

// ============================================
// HERO CANVAS — SHOOTING STARS FROM TOP-LEFT
// ============================================
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    const COUNT      = 18;
    const ANGLE_DEG  = 42;
    const ANGLE_RAD  = (ANGLE_DEG * Math.PI) / 180;
    const SPEED_MIN  = 5;
    const SPEED_MAX  = 11;
    const TRAIL_MIN  = 80;
    const TRAIL_MAX  = 220;
    const ALPHA_MIN  = 0.06;
    const ALPHA_MAX  = 0.22;
    const WIDTH_MIN  = 0.5;
    const WIDTH_MAX  = 1.2;

    const cos = Math.cos(ANGLE_RAD);
    const sin = Math.sin(ANGLE_RAD);
    let stars = [];

    function spawnStar(preplace) {
        const speed       = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
        const trailLength = TRAIL_MIN + Math.random() * (TRAIL_MAX - TRAIL_MIN);
        const alpha       = ALPHA_MIN + Math.random() * (ALPHA_MAX - ALPHA_MIN);
        const width       = WIDTH_MIN + Math.random() * (WIDTH_MAX - WIDTH_MIN);
        let x, y;
        if (Math.random() < 0.6) { x = Math.random() * canvas.width * 0.75; y = -trailLength; }
        else { x = -trailLength; y = Math.random() * canvas.height * 0.6; }
        if (preplace) { const t = Math.random() * (canvas.width + canvas.height) * 0.8; x += cos * t; y += sin * t; }
        return { x, y, speed, trailLength, alpha, width };
    }

    function init() { stars = []; for (let i = 0; i < COUNT; i++) stars.push(spawnStar(true)); }
    init();

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            const tailX = s.x - cos * s.trailLength;
            const tailY = s.y - sin * s.trailLength;
            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0,   `rgba(255, 255, 255, 0)`);
            grad.addColorStop(0.6, `rgba(220, 235, 255, ${s.alpha * 0.3})`);
            grad.addColorStop(1,   `rgba(255, 255, 255, ${s.alpha})`);
            ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad; ctx.lineWidth = s.width; ctx.lineCap = 'round'; ctx.stroke();
            ctx.beginPath(); ctx.arc(s.x, s.y, s.width * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 1.5})`; ctx.fill();
            s.x += cos * s.speed; s.y += sin * s.speed;
            if (s.x > canvas.width + s.trailLength || s.y > canvas.height + s.trailLength) {
                stars[i] = spawnStar(false);
                stars[i].x -= cos * Math.random() * canvas.width * 0.5;
                stars[i].y -= sin * Math.random() * canvas.height * 0.5;
            }
        }
    }
    requestAnimationFrame(animate);
}

// ============================================
// NAME BANNER — ROYGBIV RADIAL BY CURSOR X
// ============================================
function initNameBanner() {
    const svg = document.getElementById('nameBannerSVG');
    const gradientRect = document.getElementById('gradientRect');
    const gradient = document.getElementById('cursorGradient');
    if (!svg || !gradientRect || !gradient) return;

    svg.addEventListener('mousemove', (e) => {
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 1400;
        const y = ((e.clientY - rect.top) / rect.height) * 400;
        const ratio = x / 1400;

        const roygbiv = [
            [255, 0,   0],
            [255, 140, 0],
            [255, 220, 0],
            [0,   200, 0],
            [0,   180, 255],
            [0,   0,   200],
            [160, 0,   255],
        ];

        const idx   = ratio * (roygbiv.length - 1);
        const lower = Math.floor(idx);
        const upper = Math.min(lower + 1, roygbiv.length - 1);
        const t     = idx - lower;
        const r     = Math.round(roygbiv[lower][0] + t * (roygbiv[upper][0] - roygbiv[lower][0]));
        const g     = Math.round(roygbiv[lower][1] + t * (roygbiv[upper][1] - roygbiv[lower][1]));
        const b     = Math.round(roygbiv[lower][2] + t * (roygbiv[upper][2] - roygbiv[lower][2]));

        const stops = gradient.querySelectorAll('stop');
        stops[0].setAttribute('stop-color', `rgba(${r},${g},${b},0.95)`);
        stops[1].setAttribute('stop-color', `rgba(${r},${g},${b},0.4)`);
        stops[2].setAttribute('stop-color', `rgba(0,0,0,0)`);

        gradient.setAttribute('cx', x);
        gradient.setAttribute('cy', y);
        gradient.setAttribute('r', 250);
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        gradientRect.setAttribute('opacity', '1');
    });

    svg.addEventListener('mouseleave', () => {
        gradientRect.setAttribute('opacity', '0');
    });
}

// ============================================
// CLICK BURST — CANVAS SHOOTING STARS (identical to hero canvas)
// ============================================
function initClickBurst() {
    // Create a full-page canvas overlay for drawing
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        pointer-events: none;
        z-index: 99999;
    `;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Active streaks pool
    const streaks = [];

    document.addEventListener('click', (e) => {
        const count = 12;
        for (let i = 0; i < count; i++) {
            const angle     = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
            const speed     = 2 + Math.random() * 1.0; // SLOW — 1.2–2.2px per frame
            const maxDist   = 50 + Math.random() * 50;     // 70–120px total travel
            const trailLen  = 40 + Math.random() * 30;     // 40–70px long trail
            const width     = 1.2 + Math.random() * 1.5;   // 1.2–2.7px
            const alpha     = 0.55 + Math.random() * 0.35; // bright & visible

            // Pick cool tones matching hero canvas
            const palettes = [
                [255, 255, 255],  // white
                [220, 235, 255],  // white-blue
                [180, 140, 255],  // purple
                [140, 180, 255],  // blue
                [200, 160, 255],  // lavender
                [100, 200, 255],  // cyan
            ];
            const [r, g, b] = palettes[i % palettes.length];

            streaks.push({
                x: e.clientX,
                y: e.clientY,
                angle,
                speed,
                maxDist,
                trailLen,
                width,
                alpha,
                r, g, b,
                dist: 0,      // how far it has travelled
                done: false
            });
        }
    });

    function drawFrame() {
        // Clear with full transparency each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = streaks.length - 1; i >= 0; i--) {
            const s = streaks[i];
            if (s.done) { streaks.splice(i, 1); continue; }

            // Head position
            const hx = s.x + Math.cos(s.angle) * s.dist;
            const hy = s.y + Math.sin(s.angle) * s.dist;

            // Tail position (behind head by trailLen, clamped to origin)
            const tailDist = Math.max(0, s.dist - s.trailLen);
            const tx = s.x + Math.cos(s.angle) * tailDist;
            const ty = s.y + Math.sin(s.angle) * tailDist;

            // Fade out when nearing end (last 30% of travel)
            const progress  = s.dist / s.maxDist;
            const fadeAlpha = progress > 0.70 ? s.alpha * (1 - (progress - 0.70) / 0.30) : s.alpha;

            // Draw gradient trail — exactly like initHeroCanvas
            const grad = ctx.createLinearGradient(tx, ty, hx, hy);
            grad.addColorStop(0,   `rgba(${s.r},${s.g},${s.b},0)`);
            grad.addColorStop(0.5, `rgba(${s.r},${s.g},${s.b},${(fadeAlpha * 0.4).toFixed(3)})`);
            grad.addColorStop(1,   `rgba(255,255,255,${fadeAlpha.toFixed(3)})`);

            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(hx, hy);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = s.width;
            ctx.lineCap     = 'round';
            ctx.stroke();

            // Bright white dot at head tip — same as hero canvas
            ctx.beginPath();
            ctx.arc(hx, hy, s.width * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${(fadeAlpha * 1.8).toFixed(3)})`;
            ctx.fill();

            // Advance
            s.dist += s.speed;
            if (s.dist >= s.maxDist) s.done = true;
        }

        requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
}

// ============================================
// INIT ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initClickBurst();

    setTimeout(typeEffect, 1000);
    revealSections();
    revealProjects();
    initProjectNavigation();
    initLanguagesNavigation();
    initContactForm();
    initInfiniteCarousel();
    initHeroCanvas();
    initNameBanner();
    document.querySelectorAll('.skill-item').forEach(item => progressObserver.observe(item));
});

// ============================================
// SKILL BARS
// ============================================
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('animate'); skillBarObserver.unobserve(entry.target); }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.skill-bar').forEach(bar => skillBarObserver.observe(bar));

// ============================================
// TIMELINE — SCROLL LINE + DOT + MORE/LESS TOGGLE + SPINNING BORDER
// ============================================
function initTimeline() {
    const section = document.querySelector('.timeline-section');
    const fill    = document.getElementById('timelineFill');
    const track   = document.querySelector('.timeline-line-bg');
    const dots    = document.querySelectorAll('.timeline-dot');
    const cards   = document.querySelectorAll('.timeline-card');
    if (!section || !fill || !track) return;

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), 80);
                revealObs.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.12 });

    const borderObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'  
    });

    cards.forEach(c => {
        revealObs.observe(c);
        borderObs.observe(c);
    });

    function updateTimeline() {
        const trackRect = track.getBoundingClientRect();
        const trackTop  = trackRect.top + window.scrollY;
        const trackH    = track.offsetHeight;

        const scrolled  = window.scrollY + window.innerHeight * 0.75 - trackTop;
        const progress  = Math.min(Math.max(scrolled / trackH, 0), 1);
        fill.style.height = (progress * 100) + '%';

        dots.forEach(dot => {
            const dotRect  = dot.getBoundingClientRect();
            const dotTop   = dotRect.top + window.scrollY;
            const dotRatio = (dotTop - trackTop) / trackH;
            dot.classList.toggle('active', progress >= dotRatio - 0.01);
        });
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();

    document.querySelectorAll('.tc-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const card    = btn.closest('.timeline-card');
            const content = card.querySelector('.tc-more-content');
            const isOpen  = content.classList.contains('open');

            content.classList.toggle('open', !isOpen);
            btn.classList.toggle('open', !isOpen);
            btn.childNodes[0].textContent = isOpen ? 'MORE ' : 'LESS ';
        });
    });
}

document.addEventListener('DOMContentLoaded', initTimeline);
function initSpotlightEffect(containerSelector, cardSelector, isWrapper, radius = 180) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = document.querySelectorAll(cardSelector);

    // Reset all to default
    cards.forEach(card => {
        if (isWrapper) card.style.background = 'rgba(255, 255, 255, 0.06)';
        else { card.style.setProperty('--mouse-x', '-999px'); card.style.setProperty('--mouse-y', '-999px'); }
    });

    // Listen on DOCUMENT — covers everything including gaps and edges
    document.addEventListener('mousemove', (e) => {
        const containerRect = container.getBoundingClientRect();
        const insideContainer = (
            e.clientX >= containerRect.left &&
            e.clientX <= containerRect.right &&
            e.clientY >= containerRect.top &&
            e.clientY <= containerRect.bottom
        );

        cards.forEach(card => {
            if (!insideContainer) {
                // Reset when outside
                if (isWrapper) card.style.background = 'rgba(255, 255, 255, 0.06)';
                else { card.style.setProperty('--mouse-x', '-999px'); card.style.setProperty('--mouse-y', '-999px'); }
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (isWrapper) {
                card.style.background = `radial-gradient(
                    ${radius}px circle at ${x}px ${y}px,
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(255, 220, 80, 0.9) 10%,
                    rgba(255, 100, 255, 0.7) 25%,
                    rgba(80, 180, 255, 0.4) 45%,
                    transparent 60%
                )`;
            } else {
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });
}

initSpotlightEffect('.tools-grid', '.tool-card-wrapper', true, 180);
initSpotlightEffect('.about-right', '.expertise-card-wrapper', true, 500);

// ── HIRE ME MODAL ──
function openHireModal() {
  document.getElementById('hireModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeHireModal() {
  document.getElementById('hireModal').style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('hireForm').reset();
  document.getElementById('hireStatus').textContent = '';
  ['hire-name','hire-email','hire-type','hire-desc'].forEach(id => {
    document.getElementById('err-' + id).textContent = '';
  });
}

// Close on overlay click
document.getElementById('hireModal').addEventListener('click', function(e) {
  if (e.target === this) closeHireModal();
});

// Hire form validation + simulated submission
document.getElementById('hireForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  let valid = true;

  const name  = document.getElementById('hire-name');
  const email = document.getElementById('hire-email');
  const type  = document.getElementById('hire-type');
  const desc  = document.getElementById('hire-desc');

  // Reset errors
  ['hire-name','hire-email','hire-type','hire-desc'].forEach(id =>
    document.getElementById('err-' + id).textContent = '');

  // Validate
  if (!name.value.trim() || name.value.trim().length < 2) {
    document.getElementById('err-hire-name').textContent = 'Please enter your name (min 2 characters).';
    valid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value.trim())) {
    document.getElementById('err-hire-email').textContent = 'Please enter a valid email address.';
    valid = false;
  }
  if (!type.value) {
    document.getElementById('err-hire-type').textContent = 'Please select a project type.';
    valid = false;
  }
  if (!desc.value.trim() || desc.value.trim().length < 10) {
    document.getElementById('err-hire-desc').textContent = 'Please describe your project (min 10 characters).';
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('hireSubmitBtn');
  const status = document.getElementById('hireStatus');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  const inquiryId = 'INQ-' + Date.now();
  const inquiry = {
    name: name.value.trim(),
    email: email.value.trim(),
    projectType: type.value,
    budget: document.getElementById('hire-budget').value,
    description: desc.value.trim(),
timestamp: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
    id: inquiryId
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '02dc54a2-a22c-4cdf-949b-c083aa8f837f',
        name: inquiry.name,
        email: inquiry.email,
        subject: `🚀 Project Inquiry [${inquiryId}] — ${inquiry.projectType}`,
        message: `Inquiry ID: ${inquiryId}
Project Type: ${inquiry.projectType}
Budget: ${inquiry.budget || 'Not specified'}
Submitted: ${inquiry.timestamp}

--- Project Description ---
${inquiry.description}`
      })
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    status.style.color = '#4ade80';
    status.textContent = `✅ Inquiry ${inquiryId} received! I'll contact you at ${inquiry.email} within 24 hours.`;
    btn.textContent = 'Sent!';
    setTimeout(() => closeHireModal(), 3000);

  } catch (err) {
    status.style.color = '#ff6b6b';
    status.textContent = '✗ Failed to send. Please try again or email me directly.';
    btn.disabled = false;
    btn.textContent = 'Send Inquiry';
    }  
});