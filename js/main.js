/* =========================================================
   RAÍCES DEL PERÚ — Academia de Danzas Folklóricas
   Interacciones: header, menú móvil, reveal, contadores,
   acordeón, formulario → WhatsApp, volver arriba
   ========================================================= */

// CONFIGURACIÓN — cambia estos valores por los reales
const CONFIG = {
  whatsapp: "51999999999",           // número sin + ni espacios
  email: "hola@raicesdelperu.com",
  marca: "Raíces del Perú",
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const toTop = document.getElementById("toTop");

  /* ---------- Header al hacer scroll ---------- */
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 70);
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Volver arriba ---------- */
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Contadores animados ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count);
        const dur = 1600;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString("es-PE") + (p === 1 && target >= 1000 ? "" : "");
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString("es-PE") + (target >= 1000 ? "+" : "");
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => countObserver.observe(el));

  /* ---------- Acordeón FAQ ---------- */
  document.querySelectorAll(".accordion-head").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const body = item.querySelector(".accordion-body");
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Cierra los demás
      document.querySelectorAll(".accordion-item").forEach((other) => {
        other.querySelector(".accordion-head").setAttribute("aria-expanded", "false");
        other.querySelector(".accordion-body").style.maxHeight = null;
      });

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = document.getElementById("form");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const edad = form.edad.value.trim();
    const danza = form.danza.value;
    const mensaje = form.mensaje.value.trim();

    if (!nombre || !telefono) {
      note.textContent = "Por favor completa tu nombre y tu WhatsApp.";
      note.className = "form-note error";
      return;
    }

    const texto =
      `¡Hola ${CONFIG.marca}! Quiero reservar mi clase de prueba gratuita.\n\n` +
      `• Nombre: ${nombre}\n` +
      `• WhatsApp: ${telefono}\n` +
      (edad ? `• Edad del alumno: ${edad}\n` : "") +
      (danza ? `• Danza de interés: ${danza}\n` : "") +
      (mensaje ? `• Mensaje: ${mensaje}\n` : "");

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");

    note.textContent = "¡Listo! Abrimos WhatsApp con tu mensaje. Te responderemos muy pronto. 💃";
    note.className = "form-note ok";
    form.reset();
  });

  /* ---------- Enlaces WhatsApp flotante y footer ---------- */
  const waText = encodeURIComponent(`¡Hola ${CONFIG.marca}! Quisiera información sobre las clases de danza.`);
  document.getElementById("whatsappFloat").href = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;

  /* ---------- Año dinámico en footer ---------- */
  const yearEl = document.querySelector(".footer-bottom span");
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()} ${CONFIG.marca}. Todos los derechos reservados.`;
});
