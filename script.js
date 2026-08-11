// ==== CONFIG ====
const WHATSAPP_NUMBER = "55319883785904"; // <-- ALTERE AQUI: número com DDI+DDD, só números

// ==== MENU MOBILE ====
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// ==== GALERIA: LIGHTBOX ====
const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "Foto do resultado ampliada";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

if (galleryGrid) {
  galleryGrid.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const fullSrc =
        item.getAttribute("data-full") || item.querySelector("img").src;
      const alt = item.querySelector("img").alt;
      openLightbox(fullSrc, alt);
    });
  });
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ==== FORMULÁRIO DE AGENDAMENTO ====
const bookingForm = document.getElementById("bookingForm");
const submitBtn = document.getElementById("submitBooking");

function setFieldError(fieldId, hasError) {
  const group = document.getElementById(fieldId).closest(".form-group");
  group.classList.toggle("field-error", hasError);
}

function validateBooking(data) {
  let valid = true;

  const nomeEmpty = !data.nomeCompleto || data.nomeCompleto.trim() === "";
  setFieldError("nomeCompleto", nomeEmpty);
  if (nomeEmpty) valid = false;

  const servicosEmpty =
    !data.servicosDesejados || data.servicosDesejados.trim() === "";
  setFieldError("servicosDesejados", servicosEmpty);
  if (servicosEmpty) valid = false;

  const diaEmpty = !data.diaSemana || data.diaSemana.trim() === "";
  setFieldError("diaSemana", diaEmpty);
  if (diaEmpty) valid = false;

  return valid;
}

function buildWhatsappMessage({ nomeCompleto, servicosDesejados, diaSemana }) {
  return [
    "Olá! Gostaria de agendar um horário. 💛",
    "",
    `*Nome:* ${nomeCompleto}`,
    `*Serviços:* ${servicosDesejados}`,
    `*Dia preferido:* ${diaSemana}`,
    "",
    "Quais são os horários disponíveis?",
  ].join("\n");
}

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nomeCompleto: document.getElementById("nomeCompleto").value,
    servicosDesejados: document.getElementById("servicosDesejados").value,
    diaSemana: document.getElementById("diaSemana").value,
  };

  if (!validateBooking(data)) return;

  submitBtn.classList.add("loading");
  submitBtn.querySelector(".btn-text").textContent = "Redirecionando...";

  const message = buildWhatsappMessage(data);
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    window.location.href = url;
  }, 350);
});

// remove alerta de erro ao digitar
document
  .getElementById("nomeCompleto")
  .addEventListener("input", () => setFieldError("nomeCompleto", false));

// ==== ANIMAÇÃO: REVEAL AO ROLAR ====
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// ==== SELEÇÃO DE SERVIÇOS (MÚLTIPLA) ====
const serviceCards = document.querySelectorAll(".service-card");
const serviceChips = document.querySelectorAll(".chip");
const servicosHidden = document.getElementById("servicosDesejados");
const selectedServices = new Set();

function syncServiceUI() {
  serviceCards.forEach((card) => {
    const name = card.querySelector("h3").textContent.trim();
    card.classList.toggle("selected", selectedServices.has(name));
  });
  serviceChips.forEach((chip) => {
    chip.classList.toggle(
      "selected",
      selectedServices.has(chip.dataset.service),
    );
  });
  servicosHidden.value = Array.from(selectedServices).join(", ");
  if (selectedServices.size > 0) setFieldError("servicosDesejados", false);
}

function toggleService(name, { scrollToForm = false } = {}) {
  const wasEmpty = selectedServices.size === 0;
  if (selectedServices.has(name)) {
    selectedServices.delete(name);
  } else {
    selectedServices.add(name);
  }
  syncServiceUI();

  if (scrollToForm && wasEmpty && selectedServices.size > 0) {
    const bookingSection = document.getElementById("contato");
    if (bookingSection) {
      setTimeout(() => {
        bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
  }
}

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.querySelector("h3").textContent.trim();
    toggleService(name, { scrollToForm: true });
  });
});

serviceChips.forEach((chip) => {
  chip.addEventListener("click", () => toggleService(chip.dataset.service));
});

// ==== SELEÇÃO DE DIA (CARROSSEL) ====
const dayChips = document.querySelectorAll(".day-chip");
const diaSemanaHidden = document.getElementById("diaSemana");

dayChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    dayChips.forEach((c) => c.classList.remove("selected"));
    chip.classList.add("selected");
    diaSemanaHidden.value = chip.dataset.day;
    setFieldError("diaSemana", false);
  });
});
