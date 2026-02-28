const waitlistForm = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const formStatus = document.getElementById("form-status");
const yearEl = document.getElementById("year");
const toast = document.getElementById("copy-toast");
const scrollLinks = document.querySelectorAll("[data-scroll-target]");
const copyButtons = document.querySelectorAll(".copy-btn");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
let toastTimer = null;

function isValidEmail(value) {
  return EMAIL_REGEX.test(value.trim());
}

function setEmailError(message) {
  emailError.textContent = message;
  emailInput.setAttribute("aria-invalid", message ? "true" : "false");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1300);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

yearEl.textContent = new Date().getFullYear();

scrollLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("data-scroll-target");
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

emailInput.addEventListener("input", () => {
  formStatus.textContent = "";

  if (!emailInput.value.trim()) {
    setEmailError("");
    return;
  }

  if (!isValidEmail(emailInput.value)) {
    setEmailError("Enter a valid email address (example: name@shop.com).");
    return;
  }

  setEmailError("");
});

emailInput.addEventListener("blur", () => {
  if (!emailInput.value.trim()) {
    setEmailError("Email is required.");
    return;
  }

  if (!isValidEmail(emailInput.value)) {
    setEmailError("Enter a valid email address (example: name@shop.com).");
    return;
  }

  setEmailError("");
});

waitlistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const value = emailInput.value.trim();
  if (!value) {
    setEmailError("Email is required.");
    return;
  }

  if (!isValidEmail(value)) {
    setEmailError("Enter a valid email address (example: name@shop.com).");
    return;
  }

  setEmailError("");
  formStatus.textContent = `Thanks. ${value} has been added to the waitlist.`;
  waitlistForm.reset();
  emailInput.setAttribute("aria-invalid", "false");
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy");
    if (!text) {
      return;
    }

    try {
      await copyToClipboard(text);
      showToast("Copied!");
    } catch (error) {
      showToast("Copy failed");
    }
  });
});
