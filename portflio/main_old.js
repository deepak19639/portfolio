// ============================================================
// DEEPAK KUMAR PORTFOLIO — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Canvas particle background ----
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    function initParticles() {
      particles = [];
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          o: Math.random() * 0.5 + 0.15,
        });
      }
    }
    initParticles();

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);
      // grid lines
      ctx.strokeStyle = 'rgba(199,208,220,0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 64) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 64) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // particles + connection lines
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.o})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(34,211,238,${0.08 * (1 - dist/120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawFrame);
    }
    drawFrame();
  }

  // ---- Custom cursor (dot + trailing ring) ----
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursorDot && cursorRing && supportsHover && !reduceMotion) {
    document.body.classList.add('has-custom-cursor');
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    const hoverTargets = 'a, button, input, textarea, .stack-card, .proj-block, .cert-card, .proj-coming';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add('is-active');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove('is-active');
    });
    document.addEventListener('mouseleave', () => { cursorDot.style.opacity='0'; cursorRing.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursorDot.style.opacity='1'; cursorRing.style.opacity='0.6'; });
  }

  // ---- Typed hero tagline ----
  const typedEl = document.getElementById('typedText');
  if (typedEl) {
    const lines = [
      "I'm a Data Pipeline Engineer.",
      "builds pipelines that don't fall over at 2\u00a0a.m.",
      "turns raw chaos into decisions people trust.",
      "ships ETL/ELT workflows that run while you sleep.",
      "makes BigQuery fast and Power BI actually useful.",
      "processes 30GB daily across 6 source systems.",
    ];
    let lineIdx = 0, charIdx = 0, deleting = false;

    function tick() {
      const current = lines[lineIdx];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) { deleting = true; setTimeout(tick, 2200); return; }
        setTimeout(tick, 42);
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          lineIdx = (lineIdx + 1) % lines.length;
          setTimeout(tick, 400); return;
        }
        setTimeout(tick, 22);
      }
    }
    setTimeout(tick, 900);
  }

  // ---- Footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile nav toggle ----
  const burger    = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  // ---- Scroll progress rail ----
  const railFill = document.getElementById('railFill');
  function updateRail() {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (railFill) railFill.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', updateRail, { passive: true });
  updateRail();

  // ---- Back to top ----
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (toTop) toTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Nav background on scroll ----
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    if (nav) nav.style.background = window.scrollY > 30
      ? 'rgba(11,18,32,0.96)' : 'rgba(11,18,32,0.72)';
  }, { passive: true });

  // ---- Resume: native download via data URI (no JS needed) ----
  // All resume links use data:application/pdf with download attribute

  // ---- Contact form → mailto ----
  const sendBtn  = document.getElementById('sendBtn');
  const formNote = document.getElementById('formNote');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name    = document.getElementById('cName').value.trim();
      const email   = document.getElementById('cEmail').value.trim();
      const subject = document.getElementById('cSubject').value.trim();
      const message = document.getElementById('cMessage').value.trim();
      if (!name || !email || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (formNote) { formNote.textContent = 'Please fill in all fields with a valid email.'; formNote.style.color = '#f06464'; }
        return;
      }
      window.location.href = `mailto:deepak19639@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      if (formNote) { formNote.textContent = 'Opening your email client…'; formNote.style.color = ''; }
    });
  }

  // ---- Scroll-reveal transitions ----
  const revealEls = document.querySelectorAll('.proj-block, .cert-card, .stack-card, .asb-stat, .timeline-item, .hero-stat');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => { el.classList.add('will-reveal'); io.observe(el); });
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

});
