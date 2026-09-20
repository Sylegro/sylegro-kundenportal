// Sylegro Kundenportal – Verbindung zu Supabase
//
// Der Schlüssel hier ("publishable"/"anon") ist ABSICHTLICH öffentlich im
// Code sichtbar – das ist so vorgesehen und normal für Supabase-Projekte.
// Der eigentliche Schutz kommt nicht davon, diesen Schlüssel geheim zu
// halten, sondern von den Row-Level-Security-Regeln in der Datenbank
// (jede Tabelle prüft serverseitig, wer welche Zeile sehen darf).
//
// NIEMALS den "service_role"/"secret"-Schlüssel hier oder sonst irgendwo
// in diesem öffentlichen Repo verwenden – der hebelt alle Sicherheitsregeln
// aus und darf nur auf einem echten, geschützten Server verwendet werden.

const SUPABASE_URL = "https://amnaydttfuenhgevqptp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_VgOqMO4vGENsYHC7Py70DQ_KxdE_cuI";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
