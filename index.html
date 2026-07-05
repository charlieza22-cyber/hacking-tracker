// Inicializar Supabase (config viene de supabase-config.js)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let state = {}; // progreso: { "f1-0": true, "f1-1": false, ... }

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const linkSentMsg = document.getElementById("link-sent-msg");
const emailInput = document.getElementById("email-input");
const sendLinkBtn = document.getElementById("send-link-btn");
const logoutBtn = document.getElementById("logout-btn");
const resetBtn = document.getElementById("reset-btn");
const loginError = document.getElementById("login-error");
const syncStatus = document.getElementById("sync-status");

sendLinkBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  loginError.textContent = "";
  if (!email || !email.includes("@")) {
    loginError.textContent = "Escribí un correo válido.";
    return;
  }
  sendLinkBtn.disabled = true;
  sendLinkBtn.textContent = "Enviando...";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.href }
  });
  sendLinkBtn.disabled = false;
  sendLinkBtn.textContent = "Enviarme link de acceso";
  if (error) {
    loginError.textContent = "No se pudo enviar el link. Intentá de nuevo.";
    console.error(error);
    return;
  }
  loginForm.classList.add("hidden");
  linkSentMsg.classList.remove("hidden");
});

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
});

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session && session.user) {
    currentUser = session.user;
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    await loadProgress();
  } else {
    currentUser = null;
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  }
});

async function loadProgress() {
  syncStatus.textContent = "Cargando...";
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("checklist")
      .eq("user_id", currentUser.id)
      .maybeSingle();
    if (error) throw error;
    state = (data && data.checklist) ? data.checklist : {};
    syncStatus.textContent = "Sincronizado";
  } catch (err) {
    console.error(err);
    syncStatus.textContent = "Error al cargar. Revisá tu conexión.";
    state = {};
  }
  render();
}

async function saveProgress() {
  syncStatus.textContent = "Guardando...";
  try {
    const { error } = await supabase
      .from("progress")
      .upsert({ user_id: currentUser.id, checklist: state, updated_at: new Date().toISOString() });
    if (error) throw error;
    syncStatus.textContent = "Sincronizado";
  } catch (err) {
    console.error(err);
    syncStatus.textContent = "No se pudo guardar. Revisá tu conexión.";
  }
}

function computeStats() {
  let total = 0, done = 0;
  const phaseStats = STUDY_PLAN.map(p => {
    const d = p.items.filter((_, i) => state[p.id + "-" + i]).length;
    total += p.items.length;
    done += d;
    return { id: p.id, done: d, total: p.items.length };
  });
  return { total, done, phaseStats };
}

function render() {
  const { total, done, phaseStats } = computeStats();
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("pct").textContent = pct + "%";
  document.getElementById("bar").style.width = pct + "%";

  const container = document.getElementById("phases");
  container.innerHTML = "";

  STUDY_PLAN.forEach((phase, pIdx) => {
    const stat = phaseStats[pIdx];
    const phasePct = stat.total ? Math.round((stat.done / stat.total) * 100) : 0;

    const card = document.createElement("div");
    card.className = "phase-card";

    const header = document.createElement("div");
    header.className = "phase-header";
    header.innerHTML = `
      <div>
        <div class="phase-title">${phase.title}</div>
        <div class="phase-range">${phase.range}</div>
      </div>
      <div class="phase-badge">${stat.done}/${stat.total}</div>
    `;
    card.appendChild(header);

    const miniBar = document.createElement("div");
    miniBar.className = "mini-bar";
    miniBar.innerHTML = `<div class="mini-fill" style="width:${phasePct}%"></div>`;
    card.appendChild(miniBar);

    phase.items.forEach((item, iIdx) => {
      const key = phase.id + "-" + iIdx;
      const checked = !!state[key];
      const row = document.createElement("label");
      row.className = "item-row";
      row.innerHTML = `
        <input type="checkbox" data-key="${key}" ${checked ? "checked" : ""} />
        <span class="${checked ? "item-done" : ""}">${item}</span>
      `;
      card.appendChild(row);
    });

    container.appendChild(card);
  });

  container.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", async (e) => {
      const key = e.target.getAttribute("data-key");
      state[key] = e.target.checked;
      render();
      await saveProgress();
    });
  });
}

resetBtn.addEventListener("click", async () => {
  if (!confirm("¿Reiniciar todo tu progreso? Esta acción no se puede deshacer.")) return;
  state = {};
  render();
  await saveProgress();
});
