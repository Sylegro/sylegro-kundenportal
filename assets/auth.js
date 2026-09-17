// Sylegro Kundenportal – einfache Demo-Anmeldung (Prototyp)
// ACHTUNG: Dies ist KEIN sicheres Login-System. Es dient nur dazu, im
// Prototyp zu zeigen und zu testen, wie sich das Portal je nach Kundentyp
// (Unterhaltsreinigung / Spezialreinigung / Hauswartung) unterscheiden soll.
// Für echte Kundendaten braucht es zwingend ein richtiges Backend mit
// Datenbank, gehashten Passwörtern und Verschlüsselung.

function sylegroLogin(username, password) {
  const match = SYLEGRO_DEMO_CUSTOMERS.find(
    c => c.username === username && c.password === password
  );
  if (match) {
    sessionStorage.setItem("sylegro_kunde", JSON.stringify(match));
    return match;
  }
  return null;
}

function sylegroLogout() {
  sessionStorage.removeItem("sylegro_kunde");
  window.location.href = "../login.html";
}

function sylegroCurrentCustomer() {
  const raw = sessionStorage.getItem("sylegro_kunde");
  return raw ? JSON.parse(raw) : null;
}

// Auf jeder geschützten Kundenseite (in /kunde) ganz oben aufrufen.
// Leitet auf login.html um, falls niemand angemeldet ist.
function sylegroRequireLogin() {
  const kunde = sylegroCurrentCustomer();
  if (!kunde) {
    window.location.href = "../login.html";
    return null;
  }
  return kunde;
}

// Blendet Elemente aus, die der aktuelle Kunde nicht gebucht hat.
// data-service="uhr" | "spezial" | "bau" | "hauswartung" auf Links ODER
// ganzen Karten (.card) setzen. Trägt ausserdem den Firmennamen in alle
// Elemente mit data-kundenname ein.
function sylegroApplyNavVisibility(kunde) {
  document.querySelectorAll("[data-service]").forEach(el => {
    const needed = el.getAttribute("data-service");
    if (!kunde.services.includes(needed)) {
      el.style.display = "none";
    }
  });
  document.querySelectorAll("[data-kundenname]").forEach(el => {
    el.textContent = kunde.firma;
  });
}
