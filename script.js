// ==== CONFIG ====
const WHATSAPP_NUMBER = "5531900000000"; // <-- ALTERE AQUI: número com DDI+DDD, só números

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
  ["nomeCompleto", "servicoDesejado", "diaSemana"].forEach((id) => {
    const isEmpty = !data[id] || data[id].trim() === "";
    setFieldError(id, isEmpty);
    if (isEmpty) valid = false;
  });
  return valid;
}

function buildWhatsappMessage({ nomeCompleto, servicoDesejado, diaSemana }) {
  return [
    "Olá! Gostaria de agendar um horário. 💛",
    "",
    `*Nome:* ${nomeCompleto}`,
    `*Serviço:* ${servicoDesejado}`,
    `*Dia preferido:* ${diaSemana}`,
    "",
    "Quais são os horários disponíveis?",
  ].join("\n");
}

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nomeCompleto: document.getElementById("nomeCompleto").value,
    servicoDesejado: document.getElementById("servicoDesejado").value,
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

// remove alerta de erro ao digitar/selecionar
["nomeCompleto", "servicoDesejado", "diaSemana"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", () => setFieldError(id, false));
  document
    .getElementById(id)
    .addEventListener("change", () => setFieldError(id, false));
});
