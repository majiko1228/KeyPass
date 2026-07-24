const STORAGE_KEY = "keypass.demo.v1";
const DEFAULT_MASTER = "keypass-demo";
const AUTO_LOCK_DEFAULT = 5;

const sampleEntries = [
  {
    id: "github",
    title: "GitHub",
    username: "majiko1228",
    password: "G7!vR8p#xQ2mT9@k",
    url: "https://github.com",
    tags: ["work", "dev"],
    notes: "Primary source repo and personal projects.",
    favorite: true,
    updatedAt: "2026-07-21T15:18:00Z",
    createdAt: "2026-07-20T10:30:00Z",
  },
  {
    id: "gmail",
    title: "Google Mail",
    username: "chen@example.com",
    password: "N4v!2xL#91pQ@6",
    url: "https://mail.google.com",
    tags: ["personal"],
    notes: "Recovery phone verified.",
    favorite: false,
    updatedAt: "2026-07-18T08:15:00Z",
    createdAt: "2026-07-15T09:00:00Z",
  },
  {
    id: "bank",
    title: "Internet Banking",
    username: "chenyupeng",
    password: "S8#zT5!qM4rN2",
    url: "https://bank.example.com",
    tags: ["finance", "important"],
    notes: "Use hardware token when available.",
    favorite: false,
    updatedAt: "2026-07-22T11:10:00Z",
    createdAt: "2026-07-14T13:05:00Z",
  },
];

const state = loadState();
let locked = true;
let autoLockTimer = null;

const els = {
  lockScreen: document.getElementById("lockScreen"),
  shell: document.getElementById("shell"),
  unlockForm: document.getElementById("unlockForm"),
  masterPassword: document.getElementById("masterPassword"),
  unlockHint: document.getElementById("unlockHint"),
  nav: document.getElementById("nav"),
  clearTagFilter: document.getElementById("clearTagFilter"),
  tagList: document.getElementById("tagList"),
  entryCount: document.getElementById("entryCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  trashCount: document.getElementById("trashCount"),
  viewLabel: document.getElementById("viewLabel"),
  viewTitle: document.getElementById("viewTitle"),
  searchInput: document.getElementById("searchInput"),
  newEntryButton: document.getElementById("newEntryButton"),
  lockButton: document.getElementById("lockButton"),
  vaultView: document.getElementById("vaultView"),
  trashView: document.getElementById("trashView"),
  settingsView: document.getElementById("settingsView"),
  entryList: document.getElementById("entryList"),
  filteredCount: document.getElementById("filteredCount"),
  detailEmpty: document.getElementById("detailEmpty"),
  detailCard: document.getElementById("detailCard"),
  detailTitle: document.getElementById("detailTitle"),
  detailUrl: document.getElementById("detailUrl"),
  detailUsername: document.getElementById("detailUsername"),
  detailPassword: document.getElementById("detailPassword"),
  detailTags: document.getElementById("detailTags"),
  detailNotes: document.getElementById("detailNotes"),
  detailPanel: document.getElementById("detailPanel"),
  favoriteButton: document.getElementById("favoriteButton"),
  copyUsernameButton: document.getElementById("copyUsernameButton"),
  copyPasswordButton: document.getElementById("copyPasswordButton"),
  editEntryButton: document.getElementById("editEntryButton"),
  deleteEntryButton: document.getElementById("deleteEntryButton"),
  generatePasswordButton: document.getElementById("generatePasswordButton"),
  trashShownCount: document.getElementById("trashShownCount"),
  trashList: document.getElementById("trashList"),
  settingsMasterPassword: document.getElementById("masterPasswordSetting"),
  autoLockSetting: document.getElementById("autoLockSetting"),
  saveSecurityButton: document.getElementById("saveSecurityButton"),
  exportButton: document.getElementById("exportButton"),
  importInput: document.getElementById("importInput"),
  entryModal: document.getElementById("entryModal"),
  generatorModal: document.getElementById("generatorModal"),
  entryForm: document.getElementById("entryForm"),
  entryId: document.getElementById("entryId"),
  entryTitle: document.getElementById("entryTitle"),
  entryUsername: document.getElementById("entryUsername"),
  entryPassword: document.getElementById("entryPassword"),
  entryUrl: document.getElementById("entryUrl"),
  entryTags: document.getElementById("entryTags"),
  entryNotes: document.getElementById("entryNotes"),
  entryModalEyebrow: document.getElementById("entryModalEyebrow"),
  entryModalTitle: document.getElementById("entryModalTitle"),
  openGeneratorFromForm: document.getElementById("openGeneratorFromForm"),
  genLength: document.getElementById("genLength"),
  generatedPassword: document.getElementById("generatedPassword"),
  genUpper: document.getElementById("genUpper"),
  genLower: document.getElementById("genLower"),
  genNumber: document.getElementById("genNumber"),
  genSymbol: document.getElementById("genSymbol"),
  generateButton: document.getElementById("generateButton"),
  copyGeneratedButton: document.getElementById("copyGeneratedButton"),
  fillPasswordButton: document.getElementById("fillPasswordButton"),
  toast: document.getElementById("toast"),
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      masterPassword: DEFAULT_MASTER,
      autoLockMinutes: AUTO_LOCK_DEFAULT,
      activeView: "vault",
      activeTag: null,
      search: "",
      selectedEntryId: sampleEntries[0].id,
      entries: sampleEntries,
      trash: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      masterPassword: parsed.masterPassword || DEFAULT_MASTER,
      autoLockMinutes: parsed.autoLockMinutes || AUTO_LOCK_DEFAULT,
      activeView: parsed.activeView || "vault",
      activeTag: parsed.activeTag || null,
      search: parsed.search || "",
      selectedEntryId: parsed.selectedEntryId || sampleEntries[0].id,
      entries: Array.isArray(parsed.entries) && parsed.entries.length ? parsed.entries : sampleEntries,
      trash: Array.isArray(parsed.trash) ? parsed.trash : [],
    };
  } catch (error) {
    return {
      masterPassword: DEFAULT_MASTER,
      autoLockMinutes: AUTO_LOCK_DEFAULT,
      activeView: "vault",
      activeTag: null,
      search: "",
      selectedEntryId: sampleEntries[0].id,
      entries: sampleEntries,
      trash: [],
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setView(view) {
  state.activeView = view;
  saveState();
  render();
}

function setSelectedEntry(id) {
  state.selectedEntryId = id;
  saveState();
  renderEntries();
  renderDetail();
}

function lockVault() {
  locked = true;
  clearTimeout(autoLockTimer);
  els.shell.classList.add("hidden");
  els.lockScreen.classList.remove("hidden");
  els.masterPassword.value = "";
  showToast("Vault locked");
}

function unlockVault() {
  locked = false;
  els.lockScreen.classList.add("hidden");
  els.shell.classList.remove("hidden");
  els.searchInput.value = state.search || "";
  els.settingsMasterPassword.value = state.masterPassword;
  els.autoLockSetting.value = String(state.autoLockMinutes);
  els.unlockHint.textContent = "Demo password: keypass-demo";
  els.unlockHint.style.color = "";
  scheduleAutoLock();
  render();
  showToast("Vault unlocked");
}

function scheduleAutoLock() {
  clearTimeout(autoLockTimer);
  autoLockTimer = setTimeout(() => {
    if (!locked) {
      lockVault();
      showToast("Auto-locked after inactivity");
    }
  }, state.autoLockMinutes * 60 * 1000);
}

function touchActivity() {
  if (!locked) {
    scheduleAutoLock();
  }
}

function render() {
  if (locked) {
    return;
  }

  renderNav();
  renderTags();
  renderCounts();
  renderView();
  renderEntries();
  renderDetail();
  renderTrash();
  renderSettings();
}

function renderNav() {
  els.nav.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView);
  });
}

function renderTags() {
  const tags = Array.from(new Set(state.entries.flatMap((entry) => entry.tags)));
  els.tagList.innerHTML = "";

  if (!tags.length) {
    els.tagList.innerHTML = '<span class="muted">No tags yet</span>';
    return;
  }

  tags.forEach((tag) => {
    const button = document.createElement("button");
    button.className = `tag-chip${state.activeTag === tag ? " active" : ""}`;
    button.type = "button";
    button.textContent = tag;
    button.addEventListener("click", () => {
      state.activeTag = state.activeTag === tag ? null : tag;
      saveState();
      render();
    });
    els.tagList.appendChild(button);
  });
}

function renderCounts() {
  els.entryCount.textContent = String(state.entries.length);
  els.favoriteCount.textContent = String(state.entries.filter((entry) => entry.favorite).length);
  els.trashCount.textContent = String(state.trash.length);
}

function renderView() {
  const vaultVisible = state.activeView === "vault" || state.activeView === "favorites";
  els.vaultView.classList.toggle("hidden", !vaultVisible);
  els.trashView.classList.toggle("hidden", state.activeView !== "trash");
  els.settingsView.classList.toggle("hidden", state.activeView !== "settings");

  const labels = {
    vault: ["All entries", "Account vault"],
    favorites: ["Favorites", "Favorite accounts"],
    trash: ["Trash", "Removed items"],
    settings: ["Settings", "Vault preferences"],
  };

  const [eyebrow, title] = labels[state.activeView] || labels.vault;
  els.viewLabel.textContent = eyebrow;
  els.viewTitle.textContent = title;
}

function getVisibleEntries() {
  const search = state.search.trim().toLowerCase();
  return state.entries.filter((entry) => {
    const matchesView =
      state.activeView === "vault" ||
      (state.activeView === "favorites" && entry.favorite);

    const matchesTag = !state.activeTag || entry.tags.includes(state.activeTag);
    const matchesSearch = !search || [
      entry.title,
      entry.username,
      entry.url,
      entry.notes,
      entry.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);

    return matchesView && matchesTag && matchesSearch;
  });
}

function renderEntries() {
  const visible = getVisibleEntries();
  els.filteredCount.textContent = `${visible.length} shown`;
  els.entryList.innerHTML = "";

  if (!visible.length) {
    els.entryList.innerHTML = '<div class="detail-empty"><p>No entries match this filter.</p></div>';
    return;
  }

  visible
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .forEach((entry) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = `entry-item${entry.id === state.selectedEntryId ? " active" : ""}`;
      item.addEventListener("click", () => setSelectedEntry(entry.id));

      item.innerHTML = `
        <div class="entry-top">
          <span class="entry-title">${escapeHtml(entry.title)}</span>
          ${entry.favorite ? '<span class="badge">Favorite</span>' : ""}
        </div>
        <div class="entry-meta">
          <span>${escapeHtml(entry.username)}</span>
          <span>${escapeHtml(entry.tags.join(", ") || "No tags")}</span>
        </div>
        <div class="entry-actions">
          <span>${escapeHtml(normalizeUrl(entry.url))}</span>
          <span>${formatDate(entry.updatedAt)}</span>
        </div>
      `;

      els.entryList.appendChild(item);
    });
}

function getSelectedEntry() {
  return state.entries.find((entry) => entry.id === state.selectedEntryId) || state.entries[0] || null;
}

function renderDetail() {
  const entry = getSelectedEntry();
  if (!entry) {
    els.detailEmpty.classList.remove("hidden");
    els.detailCard.classList.add("hidden");
    return;
  }

  els.detailEmpty.classList.add("hidden");
  els.detailCard.classList.remove("hidden");
  els.detailTitle.textContent = entry.title;
  els.detailUrl.textContent = normalizeUrl(entry.url);
  els.detailUsername.textContent = entry.username;
  els.detailPassword.textContent = "••••••••••••";
  els.detailTags.textContent = entry.tags.join(", ") || "No tags";
  els.detailNotes.textContent = entry.notes || "No notes";
  els.favoriteButton.textContent = entry.favorite ? "★" : "☆";
  els.favoriteButton.title = entry.favorite ? "Remove from favorites" : "Mark as favorite";
}

function renderTrash() {
  els.trashShownCount.textContent = `${state.trash.length} items`;
  els.trashList.innerHTML = "";

  if (!state.trash.length) {
    els.trashList.innerHTML = '<div class="detail-empty"><p>No removed items.</p></div>';
    return;
  }

  state.trash
    .slice()
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    .forEach((entry) => {
      const row = document.createElement("div");
      row.className = "trash-row";
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(entry.title)}</strong>
          <div class="muted">${escapeHtml(entry.username)} • deleted ${formatDate(entry.deletedAt)}</div>
        </div>
        <div class="button-row">
          <button class="ghost tiny" type="button" data-restore="${entry.id}">Restore</button>
          <button class="ghost tiny" type="button" data-remove="${entry.id}">Delete permanently</button>
        </div>
      `;
      els.trashList.appendChild(row);
    });
}

function renderSettings() {
  els.settingsMasterPassword.value = state.masterPassword;
  els.autoLockSetting.value = String(state.autoLockMinutes);
}

function openEntryModal(entry = null) {
  const isEdit = Boolean(entry);
  els.entryModalEyebrow.textContent = isEdit ? "Edit account" : "New account";
  els.entryModalTitle.textContent = isEdit ? "Update entry" : "Add entry";
  els.entryId.value = entry ? entry.id : "";
  els.entryTitle.value = entry ? entry.title : "";
  els.entryUsername.value = entry ? entry.username : "";
  els.entryPassword.value = entry ? entry.password : "";
  els.entryUrl.value = entry ? entry.url : "";
  els.entryTags.value = entry ? entry.tags.join(", ") : "";
  els.entryNotes.value = entry ? entry.notes : "";
  els.entryModal.classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function openGenerator() {
  els.generatorModal.classList.remove("hidden");
  generatePassword();
}

function generatePassword() {
  const length = Number(els.genLength.value);
  const sets = [];

  if (els.genUpper.checked) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (els.genLower.checked) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (els.genNumber.checked) sets.push("0123456789");
  if (els.genSymbol.checked) sets.push("!@#$%^&*()-_=+[]{};:,.?/");

  if (!sets.length) {
    sets.push("abcdefghijklmnopqrstuvwxyz");
  }

  const chars = sets.join("");
  const password = Array.from({ length }, () => randomChar(chars)).join("");
  els.generatedPassword.value = password;
  return password;
}

function randomChar(chars) {
  if (window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return chars[array[0] % chars.length];
  }
  return chars[Math.floor(Math.random() * chars.length)];
}

function copyText(value, label) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(
      () => showToast(`${label} copied`),
      () => fallbackCopy(value, label)
    );
    return;
  }

  fallbackCopy(value, label);
}

function fallbackCopy(value, label) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    showToast(`${label} copied`);
  } catch (error) {
    showToast("Copy failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add("hidden"), 1800);
}

function deleteEntry(id) {
  const index = state.entries.findIndex((entry) => entry.id === id);
  if (index < 0) return;

  const [entry] = state.entries.splice(index, 1);
  state.trash.unshift({ ...entry, deletedAt: new Date().toISOString() });
  state.selectedEntryId = state.entries[0]?.id || null;
  saveState();
  render();
  showToast("Moved to trash");
}

function restoreEntry(id) {
  const index = state.trash.findIndex((entry) => entry.id === id);
  if (index < 0) return;

  const [entry] = state.trash.splice(index, 1);
  delete entry.deletedAt;
  state.entries.unshift(entry);
  state.selectedEntryId = entry.id;
  saveState();
  render();
  showToast("Entry restored");
}

function deletePermanently(id) {
  state.trash = state.trash.filter((entry) => entry.id !== id);
  saveState();
  render();
  showToast("Entry deleted");
}

function toggleFavorite() {
  const entry = getSelectedEntry();
  if (!entry) return;

  entry.favorite = !entry.favorite;
  entry.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function createOrUpdateEntry(formData) {
  const id = formData.get("id") || slugify(formData.get("title"));
  const record = {
    id,
    title: String(formData.get("title") || "").trim(),
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || ""),
    url: String(formData.get("url") || "").trim(),
    tags: String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    notes: String(formData.get("notes") || "").trim(),
    favorite: state.entries.find((entry) => entry.id === id)?.favorite || false,
    updatedAt: new Date().toISOString(),
    createdAt: state.entries.find((entry) => entry.id === id)?.createdAt || new Date().toISOString(),
  };

  const existingIndex = state.entries.findIndex((entry) => entry.id === id);
  if (existingIndex >= 0) {
    state.entries[existingIndex] = { ...state.entries[existingIndex], ...record };
  } else {
    state.entries.unshift(record);
  }

  state.selectedEntryId = id;
  saveState();
  render();
  showToast(existingIndex >= 0 ? "Entry updated" : "Entry created");
}

function slugify(value) {
  return String(value || "entry")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `entry-${Date.now()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeUrl(value) {
  if (!value) return "No URL";
  return value.replace(/^https?:\/\//, "");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

els.unlockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (els.masterPassword.value === state.masterPassword) {
    unlockVault();
  } else {
    els.unlockHint.textContent = "Wrong password. Try the demo password again.";
    els.unlockHint.style.color = "#c2410c";
  }
});

els.nav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  state.activeTag = null;
  state.search = "";
  els.searchInput.value = "";
  setView(button.dataset.view);
});

els.clearTagFilter.addEventListener("click", () => {
  state.activeTag = null;
  saveState();
  render();
});

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  saveState();
  renderEntries();
});

els.newEntryButton.addEventListener("click", () => openEntryModal());
els.lockButton.addEventListener("click", lockVault);
els.favoriteButton.addEventListener("click", toggleFavorite);
els.copyUsernameButton.addEventListener("click", () => {
  const entry = getSelectedEntry();
  if (entry) copyText(entry.username, "Username");
});
els.copyPasswordButton.addEventListener("click", () => {
  const entry = getSelectedEntry();
  if (entry) copyText(entry.password, "Password");
});
els.editEntryButton.addEventListener("click", () => openEntryModal(getSelectedEntry()));
els.deleteEntryButton.addEventListener("click", () => {
  const entry = getSelectedEntry();
  if (entry) deleteEntry(entry.id);
});
els.generatePasswordButton.addEventListener("click", openGenerator);
els.openGeneratorFromForm.addEventListener("click", openGenerator);

els.entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(els.entryForm);
  createOrUpdateEntry(formData);
  closeModal("entryModal");
});

els.saveSecurityButton.addEventListener("click", () => {
  state.masterPassword = els.settingsMasterPassword.value.trim() || DEFAULT_MASTER;
  state.autoLockMinutes = Number(els.autoLockSetting.value) || AUTO_LOCK_DEFAULT;
  saveState();
  scheduleAutoLock();
  showToast("Security settings saved");
});

els.exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "keypass-vault.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Export started");
});

els.importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    state.masterPassword = parsed.masterPassword || DEFAULT_MASTER;
    state.autoLockMinutes = parsed.autoLockMinutes || AUTO_LOCK_DEFAULT;
    state.activeView = parsed.activeView || "vault";
    state.activeTag = parsed.activeTag || null;
    state.search = parsed.search || "";
    state.selectedEntryId = parsed.selectedEntryId || parsed.entries?.[0]?.id || null;
    state.entries = Array.isArray(parsed.entries) ? parsed.entries : sampleEntries;
    state.trash = Array.isArray(parsed.trash) ? parsed.trash : [];
    saveState();
    els.searchInput.value = state.search;
    showToast("Vault imported");
    render();
  } catch (error) {
    showToast("Invalid JSON file");
  } finally {
    event.target.value = "";
  }
});

els.entryModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close='entryModal']") || event.target === els.entryModal) {
    closeModal("entryModal");
  }
});

els.generatorModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close='generatorModal']") || event.target === els.generatorModal) {
    closeModal("generatorModal");
  }
});

els.generateButton.addEventListener("click", generatePassword);
els.copyGeneratedButton.addEventListener("click", () => copyText(els.generatedPassword.value, "Generated password"));
els.fillPasswordButton.addEventListener("click", () => {
  els.entryPassword.value = els.generatedPassword.value;
  closeModal("generatorModal");
  showToast("Password filled");
});
els.genLength.addEventListener("input", generatePassword);
els.genUpper.addEventListener("change", generatePassword);
els.genLower.addEventListener("change", generatePassword);
els.genNumber.addEventListener("change", generatePassword);
els.genSymbol.addEventListener("change", generatePassword);

document.addEventListener("click", (event) => {
  const restoreButton = event.target.closest("[data-restore]");
  if (restoreButton) {
    restoreEntry(restoreButton.dataset.restore);
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    deletePermanently(removeButton.dataset.remove);
    return;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal("entryModal");
    closeModal("generatorModal");
  }
  touchActivity();
});

document.addEventListener("mousemove", touchActivity, { passive: true });
document.addEventListener("click", touchActivity);
document.addEventListener("input", touchActivity);

if (state.search) {
  els.searchInput.value = state.search;
}

render();
lockVault();
