// ==== CONFIG ====
const WHATSAPP_NUMBER = "5531988378504"; // <-- ALTERE AQUI: número com DDI+DDD, só números

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
  return `Olá! Meu nome é ${nomeCompleto}. Tenho interesse no serviço de ${servicoDesejado} para ${diaSemana}. Quais são os horários disponíveis?`;
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
