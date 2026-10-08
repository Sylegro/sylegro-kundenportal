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

// Auf jeder Admin-Seite (in /admin) ganz oben aufrufen:
//   const admin = await sylegroRequireAdmin();
//   if (!admin) return;
// Leitet auf login.html um, falls niemand angemeldet ist oder die Person
// keine Admin-Rolle hat. Die eigentliche Absicherung passiert zusätzlich
// serverseitig über Row-Level-Security – diese Prüfung hier blendet nur
// die Oberfläche korrekt ein/aus.
//
// Jeder Admin-Login hat jetzt einen Mitarbeiter-Typ (profiles.mitarbeiter_typ):
//   'vollzugriff'    -> sieht alles (normalerweise nur du)
//   'kundenbetreuer' -> sieht nur seine zugewiesenen Kunden
//   'produktiv'      -> sieht nur seine zugewiesene(n) Liegenschaft(en)
// Das zurückgegebene admin-Objekt trägt diesen Typ sowie die Zusatz-
// Freigabe "kannRechnungenSehen", damit einzelne Seiten z.B. den
// Rechnungen/Finanzen-Tab ein- oder ausblenden können. Die eigentliche
// Einschränkung, WELCHE Kunden/Liegenschaften überhaupt zurückkommen,
// passiert serverseitig über die Datenbank-Regeln – hier geht es nur noch
// um die Beschriftung/Oberfläche.
async function sylegroRequireAdmin() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "../login.html";
    return null;
  }

  const { data: profile, error } = await supabaseClient
    .from('profiles')
    .select('role, display_name, mitarbeiter_typ, kann_rechnungen_sehen')
    .eq('id', session.user.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    window.location.href = "../login.html";
    return null;
  }

  const typ = profile.mitarbeiter_typ || 'produktiv';
  const istVollzugriff = typ === 'vollzugriff';

  // In der Seitenleiste steht standardmässig der Name der eingeloggten Person
  // statt pauschal "Admin" -- damit sofort erkennbar ist, welcher Mitarbeiter
  // gerade eingeloggt ist. Nur bei Vollzugriff (dir) bleibt "Admin" stehen.
  const seitenleistenName = istVollzugriff ? 'Admin' : (profile.display_name || 'Mitarbeiter');
  const brandSubtitle = document.querySelector('.sidebar .brand small');
  if (brandSubtitle) {
    brandSubtitle.textContent = seitenleistenName;
  }

  return {
    name: profile.display_name || 'Admin',
    typ: typ,
    istVollzugriff: istVollzugriff,
    istKundenbetreuer: typ === 'kundenbetreuer',
    istProduktiv: typ === 'produktiv',
    kannRechnungenSehen: istVollzugriff || !!profile.kann_rechnungen_sehen
  };
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

// Blendet auf Admin-Seiten Elemente aus, die der aktuelle Mitarbeiter-Typ
// nicht sehen/bedienen darf. Auf einem Element data-benoetigt-recht setzen:
//   data-benoetigt-recht="rechnungen"  -> nur sichtbar wenn
//                                          admin.kannRechnungenSehen
//   data-benoetigt-recht="vollzugriff" -> nur sichtbar wenn admin.istVollzugriff
// Noch nirgends im Markup verwendet – kann nach und nach auf Tabs/Links
// gesetzt werden, die eingeschränkt werden sollen (z.B. der Rechnungen-Tab
// im Kundenprofil).
function sylegroApplyAdminNavVisibility(admin) {
  document.querySelectorAll("[data-benoetigt-recht]").forEach(el => {
    const benoetigt = el.getAttribute("data-benoetigt-recht");
    let erlaubt = true;
    if (benoetigt === 'rechnungen') erlaubt = admin.kannRechnungenSehen;
    if (benoetigt === 'vollzugriff') erlaubt = admin.istVollzugriff;
    if (!erlaubt) {
      el.style.display = "none";
    }
  });
}
