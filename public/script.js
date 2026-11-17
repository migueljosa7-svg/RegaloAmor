/* =========================================================
   CONFIGURA AQUÍ (todo opcional)
   ========================================================= */
const CONFIG = {
  ella: "",            // Su nombre o apodo. Ej: "Lucía". Si lo dejas vacío usa "mi amor".
  el: "",              // Tu nombre. Se usa para firmar la carta.
  inicio: "2026-09-19T00:00:00", // Fecha oficial
};

const NOMBRE = CONFIG.ella || "mi amor";
const FIRMA = CONFIG.el ? CONFIG.el : "Tuyo";

const REASONS = [
  "Porque tu sonrisa me arregla cualquier día malo.",
  "Porque contigo hasta lo más tonto es un plan perfecto.",
  "Porque me haces reír como nadie.",
  "Porque me siento yo mismo a tu lado.",
  "Porque en solo dos meses ya eres mi lugar favorito.",
  "Porque eres preciosa por dentro y por fuera.",
  "Porque me haces querer ser mejor cada día.",
  "Porque todo lo que viene, quiero vivirlo contigo.",
];

const LETTER =
`${NOMBRE},

Dos meses. Parece poco, pero a mí me parece que te conozco de toda la vida.

Cuando empezamos, en las fiestas de Vadorrey, entre cabezudos y música, no sabía que ese día iba a cambiármelo todo. Y desde entonces, cada día contigo ha sido mejor que el anterior.

Gracias por tu paciencia, por tus risas, por tus abrazos y por hacerme sentir tan querido. Gracias por elegirme.

No hemos podido celebrarlo el día 19, pero me da igual la fecha: cualquier día a tu lado ya es una celebración.

Te quiero muchísimo. Y esto es solo el principio.

${FIRMA} 💗`;

/* =========================================================
   Utilidades
   ========================================================= */
const $ = (s) => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMOJIS = ["💗", "💖", "💕", "❤️", "💘", "✨", "🌸"];

/* Corazones flotantes de fondo */
function spawnFloater() {
  const el = document.createElement("span");
  el.textContent = EMOJIS[Math.floor(Math.random() * 4)];
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = 14 + Math.random() * 22 + "px";
  el.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
  el.style.setProperty("--rot", (Math.random() * 120 - 60) + "deg");
  el.style.animationDuration = 9 + Math.random() * 8 + "s";
  $("#hearts").appendChild(el);
  setTimeout(() => el.remove(), 18000);
}
if (!reduce) setInterval(spawnFloater, 900);

/* Explosión de corazones desde un punto */
function burst(x, y, n = 36) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = "burst";
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    const a = Math.random() * Math.PI * 2;
    const d = 90 + Math.random() * 240;
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 80;
    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(.3)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.9 + Math.random()}) rotate(${Math.random() * 90 - 45}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 120}px)) scale(.8)`, opacity: 0 },
      ],
      { duration: 1600 + Math.random() * 900, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => el.remove();
  }
}

/* Lluvia de corazones (final) */
function rain(ms = 6000) {
  if (reduce) return;
  const end = Date.now() + ms;
  const t = setInterval(() => {
    if (Date.now() > end) return clearInterval(t);
    burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.6, 6);
  }, 250);
}

/* =========================================================
   Caja
   ========================================================= */
const box = $("#box");
let opened = false;
box.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  box.classList.add("open");
  const r = box.getBoundingClientRect();
  setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.35, 60), 500);
  setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.35, 40), 1100);
  setTimeout(() => {
    $("#intro").classList.add("out");
    $("#story").hidden = false;
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    startStory();
  }, 2400);
  setTimeout(() => $("#intro").remove(), 3800);
});

/* =========================================================
   Historia
   ========================================================= */
function startStory() {
  // revelar al hacer scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // contador
  const start = new Date(CONFIG.inicio).getTime();
  const pad = (n) => String(n);
  const tick = () => {
    let s = Math.max(0, Math.floor((Date.now() - start) / 1000));
    $("#c-d").textContent = pad(Math.floor(s / 86400));
    $("#c-h").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#c-m").textContent = pad(Math.floor((s % 3600) / 60));
    $("#c-s").textContent = pad(s % 60);
  };
  tick(); setInterval(tick, 1000);

  // tarjetas
  const cards = $("#cards");
  REASONS.forEach((t) => {
    const c = document.createElement("div");
    c.className = "card reveal";
    c.innerHTML = `<div class="in"><div class="f">💗</div><div class="b">${t}</div></div>`;
    c.addEventListener("click", () => {
      c.classList.toggle("flip");
      const r = c.getBoundingClientRect();
      if (c.classList.contains("flip")) burst(r.left + r.width / 2, r.top + r.height / 2, 10);
    });
    cards.appendChild(c);
    io.observe(c);
  });

  // carta con efecto máquina de escribir al llegar
  const typed = $("#typed");
  const lio = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    lio.disconnect();
    if (reduce) { typed.textContent = LETTER; typed.classList.add("done"); return; }
    let i = 0;
    const type = () => {
      typed.textContent = LETTER.slice(0, ++i);
      if (i < LETTER.length) {
        const ch = LETTER[i - 1];
        setTimeout(type, ch === "\n" ? 250 : ch === "." || ch === "," ? 140 : 32);
      } else typed.classList.add("done");
    };
    type();
  }, { threshold: 0.4 });
  lio.observe($("#letter"));

  // botón final
  const no = $("#no"), yes = $("#yes");
  const dodge = () => {
    const a = $(".answers").getBoundingClientRect();
    const x = (Math.random() - 0.5) * Math.min(a.width + 120, 300);
    const y = (Math.random() - 0.5) * 140;
    no.style.transform = `translate(${x}px, ${y}px)`;
  };
  no.addEventListener("mouseenter", dodge);
  no.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });
  no.addEventListener("click", dodge);

  yes.addEventListener("click", () => {
    const r = yes.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 80);
    rain();
    $(".answers").style.display = "none";
    $("#finalMsg").hidden = false;
    $("#finalMsg").scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* Mejoras: pausa los corazones si la pestaña no está visible, y zoom de fotos al tocarlas */
document.addEventListener("visibilitychange", () => {
  $("#hearts").style.display = document.hidden ? "none" : "";
});
document.addEventListener("click", (e) => {
  const img = e.target.closest(".photo img");
  if (!img) return;
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<img src="${img.src}" alt="">`;
  lb.onclick = () => lb.remove();
  document.body.appendChild(lb);
});
