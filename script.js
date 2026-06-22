const form = document.querySelector("#lead-form");
const message = document.querySelector("#form-message");
const submitButton = form?.querySelector('button[type="submit"]');
const accessKeyInput = form?.querySelector('input[name="access_key"]');
const privacyLink = document.querySelector("#privacy-link");
const privacyPolicy = document.querySelector("#privacy-policy");

if (privacyLink && privacyPolicy) {
  privacyLink.addEventListener("click", () => {
    privacyPolicy.open = true;
  });
}

if (form && message && submitButton && accessKeyInput) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nome = data.get("nome")?.toString().trim() ?? "";
    const cognome = data.get("cognome")?.toString().trim() ?? "";
    const telefono = data.get("telefono")?.toString().trim() ?? "";
    const email = data.get("email")?.toString().trim() ?? "";
    const interesse = data.get("interesse")?.toString().trim() ?? "";
    const privacyAck = data.get("privacy_ack")?.toString().trim() ?? "";
    const honeypot = data.get("company")?.toString().trim() ?? "";
    const accessKey = accessKeyInput.value.trim();

    message.className = "form-message";

    if (honeypot) {
      message.textContent = "Invio non valido.";
      message.classList.add("is-error");
      return;
    }

    if (!nome || !cognome || !telefono || !email || !interesse) {
      message.textContent = "Compila tutti i campi richiesti prima di inviare.";
      message.classList.add("is-error");
      return;
    }

    if (!/^[+\d\s().-]{7,}$/.test(telefono)) {
      message.textContent = "Inserisci un numero di telefono valido.";
      message.classList.add("is-error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.textContent = "Inserisci un indirizzo email valido.";
      message.classList.add("is-error");
      return;
    }

    if (!privacyAck) {
      message.textContent = "Leggi e conferma la Privacy Policy prima di inviare.";
      message.classList.add("is-error");
      return;
    }

    if (!accessKey || accessKey === "INSERISCI_QUI_LA_TUA_ACCESS_KEY") {
      message.textContent = "Inserisci la tua access key di Web3Forms nel file HTML.";
      message.classList.add("is-error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Invio in corso...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invio non riuscito.");
      }

      form.reset();
      message.textContent = "Richiesta inviata correttamente. Ti ricontatterò al più presto.";
      message.classList.add("is-success");
    } catch (error) {
      message.textContent =
        error instanceof Error
          ? error.message
          : "C'è stato un problema durante l'invio. Riprova tra poco.";
      message.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Invia richiesta";
    }
  });
}
