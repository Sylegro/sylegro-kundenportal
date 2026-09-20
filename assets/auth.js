// Sylegro Kundenportal – echte Anmeldung & Zugriffsprüfung über Supabase
//
// Diese Datei ersetzt die frühere Demo-Logik (die nur im Browser lief).
// Jede Prüfung hier fragt echte, serverseitig durch Row-Level-Security
// abgesicherte Daten aus Supabase ab.

// Auf jeder geschützten Kundenseite (in /kunde) ganz oben aufrufen:
//   const kunde = await sylegroRequireLogin();
//   if (!kunde) return;
// Leitet auf login.html um, falls niemand angemeldet ist oder die Person
// keine Kundenrolle hat.
async function sylegroRequireLogin() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "../login.html";
    return null;
  }

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('role, customer_id, display_name')
    .eq('id', session.user.id)
    .single();

  if (error || !profile || profile.role !== 'kunde' || !profile.customer_id) {
    window.location.href = "../login.html";
    return null;
  }

  const { data: customer } = await supabaseClient
    .from('customers')
    .select('id, firma, objekt')
    .eq('id', profile.customer_id)
    .single();

  const { data: services } = await supabaseClient
    .from('customer_services')
    .select('service')
    .eq('customer_id', profile.customer_id);

  return {
    customerId: profile.customer_id,
    firma: customer ? customer.firma : (profile.display_name || 'Kunde'),
    objekt: customer ? customer.objekt : '',
    services: services ? services.map(s => s.service) : []
  };
}

async function sylegroLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = "../login.html";
}

// Auf einer leistungsspezifischen Seite (z. B. hauswartung.html) nach
// sylegroRequireLogin() aufrufen. Hat der Kunde diese Leistung nicht
// gebucht, wird er zurück zum Dashboard geschickt – ohne Hinweis, er sieht
// die Seite einfach gar nicht.
function sylegroRequireService(kunde, service) {
  if (!kunde.services.includes(service)) {
    window.location.href = "dashboard.html";
    return false;
  }
  return true;
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
