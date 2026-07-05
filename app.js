// Inicializar Firebase (config viene de firebase-config.js)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let state = {}; // progreso: { "f1-0": true, "f1-1": false, ... }

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginBtn = document.getElementById("google-login-btn");
const logoutBtn = document.getElementById("logout-btn");
const resetBtn = document.getElementById("reset-btn");
const loginError = document.getElementById("login-error");
const syncStatus = document.getElementById("sync-status");

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  loginError.textContent = "";
  auth.signInWithPopup(provider).catch(err => {
    loginError.textContent = "No se pudo iniciar sesión. Intentá de nuevo.";
    console.error(err);
  });
});

logoutBtn.addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
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
    const doc = await db.collection("progress").doc(currentUser.uid).get();
    state = doc.exists ? (doc.data().checklist || {}) : {};
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
    await db.collection("progress").doc(currentUser.uid).set({
      checklist: state,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
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
