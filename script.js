const $ = selector => document.querySelector(selector);
const themeStorageKey = "eclipse-theme-settings";
const defaultTheme = "forest";
const themes = {
  eclipse: { name: "Éclipse", note: "Rose & violet", primary: "#ff6baf", secondary: "#a78bfa", background: "#11101a" },
  ocean: { name: "Océan calme", note: "Turquoise & bleu", primary: "#65cfc5", secondary: "#779bc9", background: "#0d1c24" },
  sunset: { name: "Coucher de soleil", note: "Corail & pêche", primary: "#e8a27c", secondary: "#d8869b", background: "#21191a" },
  forest: { name: "Forêt douce", note: "Sauge & sable", primary: "#a9d5b2", secondary: "#d1c39a", background: "#101a17" },
  lavender: { name: "Lavande", note: "Lilas & rose", primary: "#c3a1df", secondary: "#dfa9c9", background: "#1a1721" },
  midnight: { name: "Nuit tranquille", note: "Ardoise & brume", primary: "#93a7bd", secondary: "#b3bbc9", background: "#11151b" },
  cherry: { name: "Cerise", note: "Rose & pétale", primary: "#d77c91", secondary: "#e2b4bd", background: "#20171b" },
  amber: { name: "Lueur ambrée", note: "Or & terre", primary: "#d9ad65", secondary: "#ca9278", background: "#201a14" },
  aurora: { name: "Aurore boréale", note: "Menthe & violet", primary: "#72cdb2", secondary: "#a89cdb", background: "#101b20" },
  coral: { name: "Corail tendre", note: "Corail & pêche", primary: "#df9383", secondary: "#dfbd91", background: "#211a18" },
  sakura: { name: "Jardin sakura", note: "Pétale & ivoire", primary: "#dc91b0", secondary: "#ecd0d7", background: "#211a20" },
  glacier: { name: "Glacier", note: "Bleu givré & azur", primary: "#8bc4d5", secondary: "#a3b8df", background: "#111a24" },
  plum: { name: "Prune", note: "Prune & orchidée", primary: "#b58bd1", secondary: "#d392bd", background: "#1c1722" },
  matcha: { name: "Thé matcha", note: "Thé vert & citron", primary: "#a8c681", secondary: "#d2ca91", background: "#171c14" },
  cosmos: { name: "Cosmos", note: "Indigo & comète", primary: "#9a91da", secondary: "#82c4d4", background: "#151628" },
  neon: { name: "Jardin nocturne", note: "Citron & menthe", primary: "#c1d980", secondary: "#79cbb8", background: "#151b17" },
  desert: { name: "Désert", note: "Sable & argile", primary: "#ddbd8e", secondary: "#d29679", background: "#211c17" },
  rosegold: { name: "Or rose", note: "Cuivre & lilas", primary: "#dda393", secondary: "#c8a3d1", background: "#21191a" },
  arctic: { name: "Arctique", note: "Glace & menthe", primary: "#8ecbc3", secondary: "#c2d5dc", background: "#141d24" },
  lagoon: { name: "Lagon", note: "Jade & turquoise", primary: "#62c5ad", secondary: "#72aacd", background: "#0f1e20" },
  noir: { name: "Noir velours", note: "Perle & ardoise", primary: "#c4c2c8", secondary: "#9293a6", background: "#17171c" },
  citrus: { name: "Jardin d’agrumes", note: "Citron & basilic", primary: "#c9d783", secondary: "#83c9a6", background: "#191d14" },
  pastel: { name: "Pastel", note: "Rose poudré & ciel", primary: "#ddb3c7", secondary: "#aebbd8", background: "#1d1a23" },
  volcano: { name: "Braise", note: "Terre & lumière", primary: "#d98270", secondary: "#dfbd82", background: "#211816" }
};
const variantNames = ["Brume", "Aube", "Clairière", "Crépuscule", "Silence", "Rêverie", "Lueur", "Refuge", "Horizon", "Sérénité", "Étoiles", "Velours"];
const themeCatalog = { ...themes };
const themeFamilies = Object.entries(themes);

function hexToHsl(hex) {
  const channels = hex.match(/[\da-f]{2}/gi).map(channel => parseInt(channel, 16) / 255);
  const max = Math.max(...channels);
  const min = Math.min(...channels);
  const delta = max - min;
  let hue = 0;
  const lightness = (max + min) / 2;
  let saturation = 0;

  if (delta) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
    if (max === channels[0]) hue = ((channels[1] - channels[2]) / delta) % 6;
    else if (max === channels[1]) hue = (channels[2] - channels[0]) / delta + 2;
    else hue = (channels[0] - channels[1]) / delta + 4;
    hue *= 60;
  }
  return [((hue + 360) % 360), saturation * 100, lightness * 100];
}

function hslToHex(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(100, saturation)) / 100;
  const l = Math.max(0, Math.min(100, lightness)) / 100;
  const channel = offset => {
    const k = (offset + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return `#${[channel(0), channel(8), channel(4)].map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

function createThemeCatalog() {
  let variantIndex = 0;
  themeFamilies.forEach(([id, base], familyIndex) => {
    const variantsForFamily = familyIndex < 12 ? 12 : 11;
    const primary = hexToHsl(base.primary);
    const secondary = hexToHsl(base.secondary);
    const background = hexToHsl(base.background);

    for (let index = 0; index < variantsForFamily; index += 1) {
      const hueShift = (index * 31 + familyIndex * 13) % 360;
      const tone = (index % 4) - 1.5;
      const variantId = `variant-${id}-${index + 1}`;
      themeCatalog[variantId] = {
        name: `${base.name} · ${variantNames[index]} ${String(index + 1).padStart(2, "0")}`,
        note: `Variation ${String(variantIndex + 1).padStart(3, "0")} · ${base.note}`,
        family: base.name,
        primary: hslToHex(primary[0] + hueShift, primary[1] + tone * 2, Math.max(57, Math.min(76, primary[2] + tone))),
        secondary: hslToHex(secondary[0] + hueShift + 18, secondary[1] + tone * 2, Math.max(62, Math.min(82, secondary[2] + tone))),
        background: hslToHex(background[0] + hueShift * .28, Math.min(38, background[1] + 2), Math.max(7, Math.min(14, background[2] + ((index % 3) - 1))))
      };
      variantIndex += 1;
    }
  });
}

createThemeCatalog();
const themePageSize = 24;
let themePageIndex = 0;

const themeGrid = $("#themeGrid");
const quickThemes = $("#quickThemes");
const themeInputs = {
  primary: $("#customPrimary"),
  secondary: $("#customSecondary"),
  background: $("#customBackground")
};
const liquidGlassToggle = $("#liquidGlassToggle");
const liquidGlassBlur = $("#liquidGlassBlur");
const liquidGlassOpacity = $("#liquidGlassOpacity");
const menuColorInputs = {
  primary: $("#menuPrimary"),
  secondary: $("#menuSecondary")
};
const menuThickness = $("#menuThickness");
const menuSize = $("#menuSize");
const motionToggle = $("#motionToggle");
const performanceToggle = $("#performanceToggle");
const sceneStage = $("#sceneStage");
const slimePlayArea = $("#slimePlayArea");
const slimeBlob = $("#slimeBlob");
const slimeColor = $("#slimeColor");
const slimeViscosity = $("#slimeViscosity");
const slimeSize = $("#slimeSize");
const rootStyle = document.documentElement.style;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let toastTimer;
let timerInterval = 0;
let timerRemaining = 0;
let breathInterval = 0;
let audioContext = null;
let audioMaster = null;
let audioNodes = [];
let motionActive = false;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let motionFrame = 0;
let orientationOrigin = null;
let orientationTimeout = 0;
let slimeOffsetX = 0;
let slimeOffsetY = 0;
let slimeDrag = null;

function renderThemes() {
  const query = $("#themeSearch").value.trim().toLocaleLowerCase("fr");
  const filtered = Object.entries(themeCatalog).filter(([, theme]) =>
    `${theme.name} ${theme.note} ${theme.family || ""}`.toLocaleLowerCase("fr").includes(query)
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / themePageSize));
  themePageIndex = Math.min(themePageIndex, pageCount - 1);
  const pageThemes = filtered.slice(themePageIndex * themePageSize, (themePageIndex + 1) * themePageSize);

  themeGrid.innerHTML = pageThemes.map(([id, theme]) => `
    <button class="theme-choice" type="button" data-theme-choice="${id}" aria-pressed="false">
      <span class="theme-preview" style="--swatch-bg:${theme.background};--swatch-primary:${theme.primary};--swatch-secondary:${theme.secondary}" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="theme-copy"><b>${theme.name}</b><small>${theme.family ? `${theme.family} · ` : ""}${theme.note}</small></span>
      <span class="theme-check" aria-hidden="true">✓</span>
    </button>`).join("");
  quickThemes.innerHTML = ["forest", "ocean", "lavender", "sunset"].map(id => {
    const theme = themes[id];
    return `<button class="quick-theme" type="button" data-theme-choice="${id}" aria-pressed="false"><span class="quick-swatch" style="--swatch:${theme.primary}" aria-hidden="true"></span>${theme.name}</button>`;
  }).join("");
  updateSelection(document.body.dataset.theme || defaultTheme);
  $("#themeCount").textContent = `${Object.keys(themeCatalog).length} ambiances`;
  $("#themeResults").textContent = filtered.length
    ? `${themePageIndex * themePageSize + 1}–${Math.min((themePageIndex + 1) * themePageSize, filtered.length)} sur ${filtered.length}`
    : "Aucune ambiance trouvée";
  $("#themePage").textContent = `Page ${themePageIndex + 1} sur ${pageCount}`;
  $("#previousThemes").disabled = themePageIndex === 0;
  $("#nextThemes").disabled = themePageIndex >= pageCount - 1;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function saveTheme(theme, custom) {
  try {
    localStorage.setItem(themeStorageKey, JSON.stringify({
      theme,
      custom,
      liquidGlass: document.body.classList.contains("liquid-glass"),
      liquidGlassSettings: {
        blur: Number(liquidGlassBlur.value),
        opacity: Number(liquidGlassOpacity.value)
      },
      performanceMode: document.body.classList.contains("performance-mode"),
      scene: $("#scenePreset").value,
      slime: {
        color: slimeColor.value,
        viscosity: Number(slimeViscosity.value),
        size: Number(slimeSize.value)
      },
      menu: {
        primary: menuColorInputs.primary.value,
        secondary: menuColorInputs.secondary.value,
        thickness: Number(menuThickness.value),
        size: menuSize.value,
        custom: document.body.dataset.menuCustom === "true"
      }
    }));
  } catch {
    showToast("L’ambiance est active, mais n’a pas pu être enregistrée sur cet appareil.");
  }
}

function updateLightTheme(background) {
  const rgb = background.match(/[\da-f]{2}/gi).map(channel => parseInt(channel, 16) / 255);
  const luminance = rgb
    .map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
  document.body.classList.toggle("light-theme", luminance > 0.48);
}

function updateSelection(theme) {
  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
  });
}

function applyTheme(theme, custom = themeCatalog[theme], persist = false) {
  const selectedTheme = themeCatalog[theme] || theme === "custom" ? theme : defaultTheme;
  const fallback = themes[defaultTheme];
  const colors = {
    primary: /^#[\da-f]{6}$/i.test(custom?.primary || "") ? custom.primary : fallback.primary,
    secondary: /^#[\da-f]{6}$/i.test(custom?.secondary || "") ? custom.secondary : fallback.secondary,
    background: /^#[\da-f]{6}$/i.test(custom?.background || "") ? custom.background : fallback.background
  };

  document.body.dataset.theme = selectedTheme;
  rootStyle.setProperty("--custom-primary", colors.primary);
  rootStyle.setProperty("--custom-secondary", colors.secondary);
  rootStyle.setProperty("--custom-bg", colors.background);
  updateLightTheme(colors.background);
  themeInputs.primary.value = colors.primary;
  themeInputs.secondary.value = colors.secondary;
  themeInputs.background.value = colors.background;
  $("#customPrimaryValue").textContent = colors.primary.toUpperCase();
  $("#customSecondaryValue").textContent = colors.secondary.toUpperCase();
  $("#customBackgroundValue").textContent = colors.background.toUpperCase();
  $("#sceneThemeName").textContent = themeCatalog[selectedTheme]?.name || "Mon ambiance";
  if (document.body.dataset.menuCustom !== "true") {
    rootStyle.setProperty("--menu-primary", colors.primary);
    rootStyle.setProperty("--menu-secondary", colors.secondary);
    menuColorInputs.primary.value = colors.primary;
    menuColorInputs.secondary.value = colors.secondary;
    $("#menuPrimaryValue").textContent = colors.primary.toUpperCase();
    $("#menuSecondaryValue").textContent = colors.secondary.toUpperCase();
  }
  renderThemes();
  if (persist) saveTheme(selectedTheme, colors);
}

function applyMenuSettings(settings = {}, persist = false) {
  const primary = /^#[\da-f]{6}$/i.test(settings.primary || "") ? settings.primary : themeInputs.primary.value;
  const secondary = /^#[\da-f]{6}$/i.test(settings.secondary || "") ? settings.secondary : themeInputs.secondary.value;
  const savedThickness = settings.thickness ?? settings.depth;
  const thickness = Number.isFinite(Number(savedThickness)) ? Math.max(2, Math.min(8, Math.round(Number(savedThickness)))) : 4;
  const size = ["compact", "standard", "large"].includes(settings.size) ? settings.size : "standard";
  const isCustom = settings.custom === true;

  document.body.dataset.menuCustom = String(isCustom);
  document.body.dataset.menuSize = size;
  menuColorInputs.primary.value = primary;
  menuColorInputs.secondary.value = secondary;
  menuThickness.value = String(thickness);
  menuSize.value = size;
  $("#menuPrimaryValue").textContent = primary.toUpperCase();
  $("#menuSecondaryValue").textContent = secondary.toUpperCase();
  $("#menuThicknessValue").textContent = `${thickness} px`;
  rootStyle.setProperty("--menu-primary", primary);
  rootStyle.setProperty("--menu-secondary", secondary);
  rootStyle.setProperty("--menu-thickness", `${thickness}px`);
  if (!isCustom) {
    rootStyle.setProperty("--menu-primary", themeInputs.primary.value);
    rootStyle.setProperty("--menu-secondary", themeInputs.secondary.value);
  }
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

function updateMenuCustomization() {
  applyMenuSettings({
    primary: menuColorInputs.primary.value,
    secondary: menuColorInputs.secondary.value,
    thickness: Number(menuThickness.value),
    size: menuSize.value,
    custom: true
  }, true);
}

function setLiquidGlass(enabled, persist = false) {
  document.body.classList.toggle("liquid-glass", enabled);
  liquidGlassToggle.checked = enabled;
  $("#liquidControls").classList.toggle("is-inactive", !enabled);
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

function setLiquidGlassSettings(settings = {}, persist = false) {
  const blur = Number.isFinite(settings.blur) ? Math.max(0, Math.min(32, Math.round(settings.blur))) : 18;
  const opacity = Number.isFinite(settings.opacity) ? Math.max(25, Math.min(90, Math.round(settings.opacity))) : 62;
  liquidGlassBlur.value = String(blur);
  liquidGlassOpacity.value = String(opacity);
  $("#liquidGlassBlurValue").textContent = `${blur} px`;
  $("#liquidGlassOpacityValue").textContent = `${opacity} %`;
  rootStyle.setProperty("--liquid-blur", `${blur}px`);
  rootStyle.setProperty("--liquid-opacity", `${opacity}%`);
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

function setPerformanceMode(enabled, persist = false) {
  document.body.classList.toggle("performance-mode", enabled);
  performanceToggle.setAttribute("aria-pressed", String(enabled));
  performanceToggle.querySelector(".performance-label").textContent = enabled
    ? "Désactiver le mode performance"
    : "Mode performance";
  if (enabled) {
    if (motionActive) stopRelief();
    if (audioContext) stopSoundscape();
  }
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

function setSlimeSettings(settings = {}, persist = false) {
  const values = settings && typeof settings === "object" ? settings : {};
  const color = /^#[\da-f]{6}$/i.test(values.color || "") ? values.color : "#70d9b0";
  const viscosity = Number.isFinite(Number(values.viscosity)) ? Math.max(10, Math.min(90, Math.round(Number(values.viscosity)))) : 55;
  const size = Number.isFinite(Number(values.size)) ? Math.max(70, Math.min(130, Math.round(Number(values.size)))) : 100;
  slimeColor.value = color;
  slimeViscosity.value = String(viscosity);
  slimeSize.value = String(size);
  $("#slimeColorValue").textContent = color.toUpperCase();
  $("#slimeViscosityValue").textContent = `${viscosity} %`;
  $("#slimeSizeValue").textContent = `${size} %`;
  rootStyle.setProperty("--slime-color", color);
  rootStyle.setProperty("--slime-return-time", `${(0.12 + viscosity / 100 * 0.75).toFixed(2)}s`);
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

function getCurrentColors() {
  return {
    primary: themeInputs.primary.value,
    secondary: themeInputs.secondary.value,
    background: themeInputs.background.value
  };
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    if (!saved) {
      applyTheme(defaultTheme);
      applyMenuSettings();
      setSlimeSettings();
      return;
    }
    const settings = JSON.parse(saved);
    const theme = themeCatalog[settings.theme] || settings.theme === "custom" ? settings.theme : defaultTheme;
    applyTheme(theme, settings.custom);
    if (themeCatalog[theme]) {
      themePageIndex = Math.floor(Object.keys(themeCatalog).indexOf(theme) / themePageSize);
      renderThemes();
    }
    setLiquidGlassSettings(settings.liquidGlassSettings);
    setLiquidGlass(settings.liquidGlass === true);
    setPerformanceMode(settings.performanceMode === true);
    setScene(settings.scene || "planet", false);
    setSlimeSettings(settings.slime);
    applyMenuSettings(settings.menu || {});
  } catch {
    applyTheme(defaultTheme);
    applyMenuSettings();
    setPerformanceMode(false);
    setSlimeSettings();
    showToast("Les réglages précédents n’ont pas pu être lus. L’ambiance d’origine est affichée.");
  }
}

function resetTheme() {
  try {
    localStorage.removeItem(themeStorageKey);
  } catch {
    showToast("Impossible d’effacer les réglages enregistrés sur cet appareil.");
    return;
  }
  setLiquidGlass(false);
  setLiquidGlassSettings();
  applyTheme(defaultTheme);
  applyMenuSettings();
  setPerformanceMode(false);
  setScene("planet", false);
  setSlimeSettings();
  resetSlimePosition();
  showToast("Ton refuge retrouve son ambiance d’origine.");
}

function updateCustomTheme() {
  const colors = getCurrentColors();
  applyTheme("custom", colors, true);
}

function animateRelief() {
  currentX += (targetX - currentX) * 0.12;
  currentY += (targetY - currentY) * 0.12;
  rootStyle.setProperty("--tilt-x", `${currentX.toFixed(2)}deg`);
  rootStyle.setProperty("--tilt-y", `${currentY.toFixed(2)}deg`);
  rootStyle.setProperty("--move-x", `${(currentX * 1.4).toFixed(2)}px`);
  rootStyle.setProperty("--move-y", `${(currentY * 1.2).toFixed(2)}px`);
  if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
    motionFrame = window.requestAnimationFrame(animateRelief);
  } else {
    motionFrame = 0;
  }
}

function setReliefTarget(x, y) {
  if (!motionActive || reducedMotion.matches) return;
  targetX = Math.max(-9, Math.min(9, x));
  targetY = Math.max(-7, Math.min(7, y));
  if (!motionFrame) motionFrame = window.requestAnimationFrame(animateRelief);
}

function handleOrientation(event) {
  if (event.beta === null || event.gamma === null) return;
  if (orientationTimeout) {
    window.clearTimeout(orientationTimeout);
    orientationTimeout = 0;
  }
  if (!orientationOrigin) orientationOrigin = { beta: event.beta, gamma: event.gamma };
  setReliefTarget((event.gamma - orientationOrigin.gamma) * 0.45, (event.beta - orientationOrigin.beta) * 0.32);
}

function stopRelief() {
  motionActive = false;
  window.removeEventListener("deviceorientation", handleOrientation);
  if (motionFrame) window.cancelAnimationFrame(motionFrame);
  if (orientationTimeout) window.clearTimeout(orientationTimeout);
  motionFrame = 0;
  orientationTimeout = 0;
  targetX = 0;
  targetY = 0;
  currentX = 0;
  currentY = 0;
  rootStyle.setProperty("--tilt-x", "0deg");
  rootStyle.setProperty("--tilt-y", "0deg");
  rootStyle.setProperty("--move-x", "0px");
  rootStyle.setProperty("--move-y", "0px");
  motionToggle.setAttribute("aria-pressed", "false");
  motionToggle.querySelector(".motion-label").textContent = "Explorer en 3D";
  $(".scene-wrap").classList.remove("is-tilting");
}

async function toggleRelief() {
  if (motionActive) {
    stopRelief();
    return;
  }
  if (reducedMotion.matches) {
    showToast("Le mouvement est désactivé dans les réglages de réduction des animations.");
    return;
  }
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (isCoarsePointer && !window.isSecureContext) {
    showToast("Le capteur nécessite une connexion sécurisée (HTTPS).");
    return;
  }
  if (isCoarsePointer && typeof DeviceOrientationEvent === "undefined") {
    showToast("Ce navigateur ne donne pas accès au capteur de mouvement.");
    return;
  }
  if (typeof DeviceOrientationEvent !== "undefined") {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      let permission;
      try {
        permission = await DeviceOrientationEvent.requestPermission();
      } catch {
        showToast("Impossible d’accéder au capteur de mouvement.");
        return;
      }
      if (permission !== "granted") {
        showToast("Autorise le capteur si tu souhaites explorer l’univers en inclinant ton téléphone.");
        return;
      }
    }
    orientationOrigin = null;
    if (isCoarsePointer) {
      orientationTimeout = window.setTimeout(() => {
        orientationTimeout = 0;
        showToast("Aucun mouvement reçu. Vérifie les autorisations du capteur.");
      }, 1800);
    }
    window.addEventListener("deviceorientation", handleOrientation);
  }
  motionActive = true;
  motionToggle.setAttribute("aria-pressed", "true");
  motionToggle.querySelector(".motion-label").textContent = "Désactiver le relief";
  $(".scene-wrap").classList.add("is-tilting");
  showToast(isCoarsePointer ? "Incline doucement ton téléphone pour explorer." : "Déplace la souris pour explorer l’univers en 3D.");
}

function closeMenu() {
  $("#mainNavigation").hidden = true;
  $("#menuToggle").setAttribute("aria-expanded", "false");
  $("#menuToggle").setAttribute("aria-label", "Ouvrir le menu");
}

renderThemes();
loadTheme();

themeGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-theme-choice]");
  if (!button) return;
  const theme = button.dataset.themeChoice;
  applyTheme(theme, themeCatalog[theme], true);
  showToast(`Ambiance « ${themeCatalog[theme].name} » appliquée.`);
});
quickThemes.addEventListener("click", event => {
  const button = event.target.closest("[data-theme-choice]");
  if (!button) return;
  const theme = button.dataset.themeChoice;
  applyTheme(theme, themes[theme], true);
  showToast(`Ambiance « ${themes[theme].name} » appliquée.`);
});
$("#themeSearch").addEventListener("input", () => {
  themePageIndex = 0;
  renderThemes();
});
$("#previousThemes").addEventListener("click", () => {
  themePageIndex -= 1;
  renderThemes();
});
$("#nextThemes").addEventListener("click", () => {
  themePageIndex += 1;
  renderThemes();
});
Object.values(themeInputs).forEach(input => input.addEventListener("input", updateCustomTheme));
Object.values(menuColorInputs).forEach(input => input.addEventListener("input", updateMenuCustomization));
menuThickness.addEventListener("input", updateMenuCustomization);
menuSize.addEventListener("change", updateMenuCustomization);
$("#resetTheme").addEventListener("click", resetTheme);
liquidGlassToggle.addEventListener("change", event => {
  setLiquidGlass(event.target.checked, true);
  showToast(event.target.checked ? "Le verre doux est activé." : "Le verre doux est désactivé.");
});
liquidGlassBlur.addEventListener("input", () => setLiquidGlassSettings({
  blur: Number(liquidGlassBlur.value),
  opacity: Number(liquidGlassOpacity.value)
}, true));
liquidGlassOpacity.addEventListener("input", () => setLiquidGlassSettings({
  blur: Number(liquidGlassBlur.value),
  opacity: Number(liquidGlassOpacity.value)
}, true));
motionToggle.addEventListener("click", toggleRelief);
performanceToggle.addEventListener("click", () => {
  const enabled = performanceToggle.getAttribute("aria-pressed") !== "true";
  setPerformanceMode(enabled, true);
  showToast(enabled
    ? "Mode performance activé : animations, flous et son coupés."
    : "Mode performance désactivé.");
});
$("#menuToggle").addEventListener("click", () => {
  const navigation = $("#mainNavigation");
  const isOpen = $("#menuToggle").getAttribute("aria-expanded") !== "true";
  navigation.hidden = !isOpen;
  $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
  $("#menuToggle").setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
});
$("#mainNavigation").addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !$("#mainNavigation").hidden) closeMenu();
});
window.addEventListener("pointermove", event => {
  if (!motionActive || window.matchMedia("(pointer: coarse)").matches) return;
  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;
  setReliefTarget(x * 6, y * 4.5);
});
reducedMotion.addEventListener("change", event => {
  if (event.matches && motionActive) stopRelief();
});
sceneStage.addEventListener("pointerleave", () => {
  if (motionActive && !window.matchMedia("(pointer: coarse)").matches) setReliefTarget(0, 0);
});

function setScene(scene, persist = true) {
  const validScenes = ["planet", "rings", "crystal", "moon", "bubbles", "garden"];
  const selectedScene = validScenes.includes(scene) ? scene : "planet";
  document.body.dataset.scene = selectedScene;
  $("#scenePreset").value = selectedScene;
  if (persist) saveTheme(document.body.dataset.theme, getCurrentColors());
}

$("#scenePreset").addEventListener("change", event => {
  setScene(event.target.value);
  showToast("Le décor de ton univers a changé.");
});

function setSlimePosition(x, y, scaleX = 1, scaleY = 1) {
  const rect = slimePlayArea.getBoundingClientRect();
  const scale = Number(slimeSize.value) / 100;
  const halfWidth = (slimeBlob.offsetWidth * scale * scaleX) / 2;
  const halfHeight = (slimeBlob.offsetHeight * scale * scaleY) / 2;
  const maxX = Math.max(0, rect.width / 2 - halfWidth - 12);
  const maxY = Math.max(0, rect.height / 2 - halfHeight - 12);
  slimeOffsetX = Math.max(-maxX, Math.min(maxX, x));
  slimeOffsetY = Math.max(-maxY, Math.min(maxY, y));
  slimeBlob.style.setProperty("--slime-x", `${slimeOffsetX.toFixed(1)}px`);
  slimeBlob.style.setProperty("--slime-y", `${slimeOffsetY.toFixed(1)}px`);
  slimeBlob.style.setProperty("--slime-scale-x", scaleX.toFixed(2));
  slimeBlob.style.setProperty("--slime-scale-y", scaleY.toFixed(2));
}

function resetSlimePosition() {
  slimeDrag = null;
  slimeBlob.classList.remove("is-dragging", "is-squishing");
  setSlimePosition(0, 0);
}

slimeBlob.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  event.preventDefault();
  slimeDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    originX: slimeOffsetX,
    originY: slimeOffsetY
  };
  slimeBlob.setPointerCapture(event.pointerId);
  slimeBlob.classList.add("is-dragging", "is-squishing");
  setSlimePosition(slimeOffsetX, slimeOffsetY, 0.94, 1.08);
});

slimeBlob.addEventListener("pointermove", event => {
  if (!slimeDrag || event.pointerId !== slimeDrag.pointerId) return;
  const deltaX = event.clientX - slimeDrag.startX;
  const deltaY = event.clientY - slimeDrag.startY;
  const stretch = Math.min(0.55, Math.hypot(deltaX, deltaY) / 180);
  const stretchX = Math.abs(deltaX) >= Math.abs(deltaY) ? 1 + stretch : 1 - stretch * 0.35;
  const stretchY = Math.abs(deltaY) > Math.abs(deltaX) ? 1 + stretch : 1 - stretch * 0.35;
  setSlimePosition(slimeDrag.originX + deltaX, slimeDrag.originY + deltaY, stretchX, stretchY);
});

function releaseSlime(event) {
  if (!slimeDrag || event.pointerId !== slimeDrag.pointerId) return;
  slimeDrag = null;
  slimeBlob.classList.remove("is-dragging", "is-squishing");
  setSlimePosition(slimeOffsetX, slimeOffsetY);
}

slimeBlob.addEventListener("pointerup", releaseSlime);
slimeBlob.addEventListener("pointercancel", releaseSlime);
slimeBlob.addEventListener("lostpointercapture", () => {
  if (!slimeDrag) return;
  slimeDrag = null;
  slimeBlob.classList.remove("is-dragging", "is-squishing");
  setSlimePosition(slimeOffsetX, slimeOffsetY);
});
slimeBlob.addEventListener("keydown", event => {
  const step = event.shiftKey ? 30 : 12;
  const moves = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step]
  };
  if (moves[event.key]) {
    event.preventDefault();
    setSlimePosition(slimeOffsetX + moves[event.key][0], slimeOffsetY + moves[event.key][1]);
  } else if (event.key === " ") {
    event.preventDefault();
    slimeBlob.classList.add("is-squishing");
    setSlimePosition(slimeOffsetX, slimeOffsetY, 0.94, 1.08);
  }
});
slimeBlob.addEventListener("keyup", event => {
  if (event.key === " ") {
    slimeBlob.classList.remove("is-squishing");
    setSlimePosition(slimeOffsetX, slimeOffsetY);
  }
});
slimeColor.addEventListener("input", () => setSlimeSettings({
  color: slimeColor.value,
  viscosity: Number(slimeViscosity.value),
  size: Number(slimeSize.value)
}, true));
slimeViscosity.addEventListener("input", () => setSlimeSettings({
  color: slimeColor.value,
  viscosity: Number(slimeViscosity.value),
  size: Number(slimeSize.value)
}, true));
slimeSize.addEventListener("input", () => {
  setSlimeSettings({
    color: slimeColor.value,
    viscosity: Number(slimeViscosity.value),
    size: Number(slimeSize.value)
  }, true);
  setSlimePosition(slimeOffsetX, slimeOffsetY);
});
$("#slimeReset").addEventListener("click", resetSlimePosition);
window.addEventListener("resize", () => setSlimePosition(slimeOffsetX, slimeOffsetY));

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function syncTimerDisplay() {
  $("#timerDisplay").textContent = formatTime(timerRemaining);
}

function resetTimer() {
  window.clearInterval(timerInterval);
  timerInterval = 0;
  timerRemaining = Number($("#timerDuration").value) * 60;
  syncTimerDisplay();
  $("#timerToggle").textContent = "Démarrer";
  $("#timerStatus").textContent = "Une pause, sans se presser.";
}

resetTimer();
$("#timerDuration").addEventListener("change", resetTimer);
$("#timerReset").addEventListener("click", resetTimer);
$("#timerToggle").addEventListener("click", () => {
  if (timerInterval) {
    window.clearInterval(timerInterval);
    timerInterval = 0;
    $("#timerToggle").textContent = "Reprendre";
    $("#timerStatus").textContent = "Pause en cours.";
    return;
  }

  if (timerRemaining <= 0) resetTimer();
  $("#timerToggle").textContent = "Pause";
  $("#timerStatus").textContent = "Prends ce moment juste pour toi.";
  timerInterval = window.setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1);
    syncTimerDisplay();
    if (timerRemaining === 0) {
      window.clearInterval(timerInterval);
      timerInterval = 0;
      $("#timerToggle").textContent = "Recommencer";
      $("#timerStatus").textContent = "Ta pause est terminée. Reviens quand tu veux.";
      showToast("Ton temps de pause est écoulé. Merci de t’être accordé ce moment.");
    }
  }, 1000);
});

let breathingIn = true;
function setBreathingPhase() {
  breathingIn = !breathingIn;
  $("#breathPhase").textContent = breathingIn ? "Inspire doucement." : "Expire à ton rythme.";
  $("#breathHint").textContent = breathingIn ? "Laisse l’air entrer, sans te presser." : "Relâche les épaules, tout doucement.";
  $("#breathingGuide").classList.toggle("breathing-in", breathingIn);
}

$("#breathToggle").addEventListener("click", event => {
  if (breathInterval) {
    window.clearInterval(breathInterval);
    breathInterval = 0;
    $("#breathingGuide").classList.remove("is-breathing", "breathing-in");
    event.currentTarget.textContent = "Recommencer";
    event.currentTarget.setAttribute("aria-pressed", "false");
    $("#breathPhase").textContent = "Un instant pour respirer.";
    $("#breathHint").textContent = "Suis le cercle, ou prends ta pause à ta façon.";
    return;
  }

  breathingIn = false;
  setBreathingPhase();
  $("#breathingGuide").classList.add("is-breathing");
  event.currentTarget.textContent = "Terminer";
  event.currentTarget.setAttribute("aria-pressed", "true");
  breathInterval = window.setInterval(setBreathingPhase, 4000);
});

function stopSoundscape() {
  audioNodes.forEach(node => {
    try {
      node.stop();
    } catch (error) {
      if (error.name !== "InvalidStateError") throw error;
    }
    node.disconnect();
  });
  audioNodes = [];
  audioMaster = null;
  if (audioContext) {
    const closingContext = audioContext;
    audioContext = null;
    closingContext.close().catch(() => showToast("Le son s’est arrêté, mais l’audio n’a pas pu être libéré correctement."));
  }
  $("#soundToggle").setAttribute("aria-pressed", "false");
  $("#soundToggle").textContent = "Écouter";
  $("#soundStatus").textContent = "Silence — à toi de choisir";
}

async function startSoundscape() {
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) {
    showToast("Les sons d’ambiance ne sont pas pris en charge par ce navigateur.");
    return;
  }

  try {
    audioContext = new AudioContextType();
    await audioContext.resume();
    const master = audioContext.createGain();
    audioMaster = master;
    master.gain.value = Number($("#soundVolume").value) / 100;
    master.connect(audioContext.destination);

    const filter = audioContext.createBiquadFilter();
    const soundscape = $("#soundscape").value;
    filter.type = soundscape === "ocean" ? "lowpass" : soundscape === "forest" ? "lowpass" : "bandpass";
    filter.frequency.value = soundscape === "ocean" ? 240 : soundscape === "forest" ? 700 : 1250;
    filter.Q.value = soundscape === "rain" ? 0.55 : 0.7;

    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
    const noise = buffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(master);
    source.start();
    audioNodes = [source];

    if (soundscape === "ocean") {
      const tone = audioContext.createOscillator();
      const toneGain = audioContext.createGain();
      tone.type = "sine";
      tone.frequency.value = 72;
      toneGain.gain.value = 0.08;
      tone.connect(toneGain);
      toneGain.connect(master);
      tone.start();
      audioNodes.push(tone);
    }
    $("#soundToggle").setAttribute("aria-pressed", "true");
    $("#soundToggle").textContent = "Arrêter";
    $("#soundStatus").textContent = `${$("#soundscape").selectedOptions[0].textContent} · son généré sur l’appareil`;
  } catch {
    stopSoundscape();
    showToast("Impossible de démarrer le son. Vérifie les réglages audio de ton appareil.");
  }
}

$("#soundToggle").addEventListener("click", () => {
  if (audioContext) {
    stopSoundscape();
    return;
  }
  startSoundscape();
});
$("#soundscape").addEventListener("change", () => {
  if (!audioContext) return;
  stopSoundscape();
  startSoundscape();
});
$("#soundVolume").addEventListener("input", event => {
  if (audioMaster) audioMaster.gain.setTargetAtTime(Number(event.target.value) / 100, audioContext.currentTime, 0.08);
});

const creativeStorageKey = "eclipse-creative-settings";
const animalSpecies = {
  cat: { icon: "🐱", name: "Petit chat rêveur" },
  dog: { icon: "🐶", name: "Chien plein d’énergie" },
  rabbit: { icon: "🐰", name: "Lapin tout doux" },
  fox: { icon: "🦊", name: "Renard malicieux" },
  panda: { icon: "🐼", name: "Panda paisible" },
  bear: { icon: "🐻", name: "Ours câlin" }
};
const animalNameInput = $("#animalName");
const animalSpeciesInput = $("#animalSpecies");
const animalAccessoryInput = $("#animalAccessory");
const animalColorInput = $("#animalColor");
const animalSizeInput = $("#animalSize");
const passwordLengthInput = $("#passwordLength");
const passwordOptionInputs = {
  lowercase: $("#includeLowercase"),
  uppercase: $("#includeUppercase"),
  numbers: $("#includeNumbers"),
  symbols: $("#includeSymbols"),
  excludeAmbiguous: $("#excludeAmbiguous")
};
const passwordOutput = $("#generatedPassword");
const audioTracks = [];
const videoClips = [];
let videoObjectUrl = "";
let activeVideoClip = null;
let nextVideoClipId = 0;
let montageAudioContext = null;
let videoMixSource = null;
let videoMixGain = null;
let montageAudioDestination = null;
let montageCancelRequested = false;
let montageDownloadUrl = "";
let animalAudioContext = null;
let animalSoundTimer = 0;
let aiImageObjectUrl = "";

function saveCreativeSettings() {
  const settings = {
    animal: {
      name: animalNameInput.value,
      species: animalSpeciesInput.value,
      accessory: animalAccessoryInput.value,
      color: animalColorInput.value,
      size: Number(animalSizeInput.value)
    },
    password: {
      length: Number(passwordLengthInput.value),
      lowercase: passwordOptionInputs.lowercase.checked,
      uppercase: passwordOptionInputs.uppercase.checked,
      numbers: passwordOptionInputs.numbers.checked,
      symbols: passwordOptionInputs.symbols.checked,
      excludeAmbiguous: passwordOptionInputs.excludeAmbiguous.checked
    }
  };

  try {
    localStorage.setItem(creativeStorageKey, JSON.stringify(settings));
  } catch {
    showToast("Impossible d’enregistrer tes réglages créatifs sur cet appareil.");
  }
}

function updateAnimalPreview() {
  const species = animalSpecies[animalSpeciesInput.value] || animalSpecies.cat;
  const name = animalNameInput.value.trim().slice(0, 18) || "Sans nom";
  $("#animalCharacter").textContent = species.icon;
  $("#animalNamePreview").textContent = name;
  $("#animalSpeciesPreview").textContent = species.name;
  $("#animalAccessoryPreview").textContent = animalAccessoryInput.value;
  $("#animalAccessoryPreview").hidden = !animalAccessoryInput.value;
  $("#animalSizeValue").textContent = `${animalSizeInput.value} %`;
  $("#animalPreview").style.setProperty("--animal-color", animalColorInput.value);
  $("#animalPreview").style.setProperty("--animal-size", String(Number(animalSizeInput.value) / 100));
  saveCreativeSettings();
}

function loadCreativeSettings() {
  try {
    const saved = localStorage.getItem(creativeStorageKey);
    if (!saved) return;
    const settings = JSON.parse(saved);
    const animal = settings.animal && typeof settings.animal === "object" ? settings.animal : {};
    const password = settings.password && typeof settings.password === "object" ? settings.password : {};
    if (typeof animal.name === "string") animalNameInput.value = animal.name.slice(0, 18);
    if (Object.prototype.hasOwnProperty.call(animalSpecies, animal.species)) animalSpeciesInput.value = animal.species;
    if (["✨", "🎀", "👑", "🕶️", "🌼", ""].includes(animal.accessory)) animalAccessoryInput.value = animal.accessory;
    if (typeof animal.color === "string" && /^#[\da-f]{6}$/i.test(animal.color)) animalColorInput.value = animal.color;
    if (Number.isFinite(animal.size)) animalSizeInput.value = String(Math.max(75, Math.min(125, Math.round(animal.size))));
    if (Number.isFinite(password.length)) passwordLengthInput.value = String(Math.max(8, Math.min(64, Math.round(password.length))));
    for (const key of ["lowercase", "uppercase", "numbers", "symbols", "excludeAmbiguous"]) {
      if (typeof password[key] === "boolean") passwordOptionInputs[key].checked = password[key];
    }
    $("#passwordLengthValue").textContent = `${passwordLengthInput.value} caractères`;
  } catch {
    showToast("Les réglages créatifs enregistrés n’ont pas pu être lus.");
  }
}

function selectWorkshopTab(tab) {
  const tabs = [...document.querySelectorAll(".workshop-tab")];
  tabs.forEach((item, index) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    $(`#${item.getAttribute("aria-controls")}`).hidden = !selected;
  });
}

document.querySelectorAll(".workshop-tab").forEach(tab => {
  tab.addEventListener("click", () => selectWorkshopTab(tab));
  tab.addEventListener("keydown", event => {
    const tabs = [...document.querySelectorAll(".workshop-tab")];
    const index = tabs.indexOf(tab);
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[nextIndex].focus();
    selectWorkshopTab(tabs[nextIndex]);
  });
});

[animalNameInput, animalSpeciesInput, animalAccessoryInput, animalColorInput, animalSizeInput].forEach(input => {
  input.addEventListener("input", updateAnimalPreview);
  input.addEventListener("change", updateAnimalPreview);
});

function updateTrackCount() {
  const count = audioTracks.length;
  $("#trackCount").textContent = count === 0 ? "Aucune piste ajoutée" : `${count} piste${count > 1 ? "s" : ""} audio`;
}

function setTrackVolume(track) {
  const gain = Number(track.volume.value) / 100 * Number($("#musicMaster").value) / 100;
  if (track.mixGain) {
    track.mixGain.gain.setTargetAtTime(gain, montageAudioContext.currentTime, 0.04);
    track.audio.volume = 1;
  } else {
    track.audio.volume = gain;
  }
}

function showVideoClip(clip) {
  if (!clip || clip.kind !== "video") return;
  activeVideoClip = clip;
  const video = $("#studioVideo");
  videoObjectUrl = clip.url;
  video.src = clip.url;
  video.playbackRate = Number($("#montageSpeed").value) / 100;
  video.style.filter = $("#montageFilter").value;
  video.onloadedmetadata = () => {
    video.currentTime = clip.start;
  };
  video.load();
  $("#studioImage").hidden = true;
  video.hidden = false;
  $("#videoPlaceholder").hidden = true;
  $("#montageTitleOverlay").hidden = !$("#montageOverlayText").value.trim();
}

function updateMontageSummary() {
  const totalSeconds = videoClips.reduce((total, clip) => total + Math.max(0, clip.end - clip.start), 0);
  const count = videoClips.length;
  $("#montageDuration").textContent = `${count} clip${count === 1 ? "" : "s"} · ${Math.floor(totalSeconds / 60)}:${String(Math.floor(totalSeconds % 60)).padStart(2, "0")}`;
  $("#exportMontage").disabled = count === 0;
  $("#clearMontage").disabled = count === 0;
  if (count === 0) {
    $("#videoTimeline").innerHTML = '<li class="empty-timeline">Ajoute plusieurs clips pour commencer ton montage.</li>';
    $("#videoFileName").textContent = "Vidéos et images · MP4, WebM, PNG…";
    $("#studioVideo").removeAttribute("src");
    $("#studioVideo").load();
    $("#studioVideo").hidden = true;
    $("#studioImage").hidden = true;
    $("#videoPlaceholder").hidden = false;
    $("#montageTitleOverlay").hidden = true;
    activeVideoClip = null;
    if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
    videoObjectUrl = "";
  }
}

function renderVideoTimeline() {
  const timeline = $("#videoTimeline");
  timeline.replaceChildren();
  videoClips.forEach((clip, index) => {
    const item = document.createElement("li");
    item.className = "video-clip";
    item.dataset.clipId = String(clip.id);
    if (clip === activeVideoClip) item.classList.add("is-active");
    const heading = document.createElement("div");
    heading.className = "video-clip-heading";
    const preview = document.createElement("button");
    preview.className = "video-clip-preview";
    preview.type = "button";
    preview.textContent = `${clip.kind === "image" ? "▧" : "▶"} ${index + 1}. ${clip.file.name}`;
    preview.title = "Prévisualiser ce clip";
    preview.addEventListener("click", () => {
      activeVideoClip = clip;
      renderVideoTimeline();
      if (clip.kind === "video") showVideoClip(clip);
      else {
        const image = $("#studioImage");
        image.src = clip.url;
        image.alt = `Aperçu de ${clip.file.name}`;
        image.style.filter = $("#montageFilter").value;
        image.hidden = false;
        $("#studioVideo").hidden = true;
        $("#videoPlaceholder").hidden = true;
        $("#montageTitleOverlay").hidden = !$("#montageOverlayText").value.trim();
      }
    });
    const actions = document.createElement("div");
    actions.className = "video-clip-actions";
    [["↑", "Monter"], ["↓", "Descendre"], ["×", "Supprimer"]].forEach(([symbol, label], actionIndex) => {
      const button = document.createElement("button");
      button.className = "track-remove";
      button.type = "button";
      button.textContent = symbol;
      button.setAttribute("aria-label", `${label} ${clip.file.name}`);
      button.disabled = (actionIndex === 0 && index === 0) || (actionIndex === 1 && index === videoClips.length - 1);
      button.addEventListener("click", () => {
        if (actionIndex === 2) {
          if (clip === activeVideoClip) {
            activeVideoClip = null;
            $("#studioVideo").pause();
            $("#studioVideo").removeAttribute("src");
            $("#studioImage").removeAttribute("src");
          }
          URL.revokeObjectURL(clip.url);
          videoClips.splice(index, 1);
        } else {
          const target = index + (actionIndex === 0 ? -1 : 1);
          [videoClips[index], videoClips[target]] = [videoClips[target], videoClips[index]];
        }
        if (!activeVideoClip && videoClips.length) {
          activeVideoClip = videoClips[0];
          if (activeVideoClip.kind === "video") showVideoClip(activeVideoClip);
          else {
            $("#studioImage").src = activeVideoClip.url;
            $("#studioImage").alt = `Aperçu de ${activeVideoClip.file.name}`;
            $("#studioImage").hidden = false;
            $("#studioVideo").hidden = true;
            $("#videoPlaceholder").hidden = true;
          }
        }
        renderVideoTimeline();
        updateMontageSummary();
      });
      actions.append(button);
    });
    heading.append(preview, actions);
    const trim = document.createElement("div");
    trim.className = "clip-trim";
    const rangeInputs = [
      { key: "start", label: "Début", value: clip.start },
      { key: "end", label: "Fin", value: clip.end }
    ];
    rangeInputs.forEach(range => {
      const label = document.createElement("label");
      label.className = "clip-trim-control";
      const text = document.createElement("span");
      text.textContent = range.label;
      const output = document.createElement("output");
      output.textContent = `${range.value.toFixed(1)} s`;
      const input = document.createElement("input");
      input.type = "range";
      input.min = "0";
      input.max = String(Math.max(0.1, clip.duration));
      input.step = "0.1";
      input.value = String(range.value);
      input.disabled = clip.duration <= 0;
      input.setAttribute("aria-label", `${range.label} du clip ${clip.file.name}`);
      input.addEventListener("input", () => {
        const value = Number(input.value);
        if (range.key === "start") clip.start = Math.min(value, clip.end - 0.1);
        else clip.end = Math.max(value, clip.start + 0.1);
        output.textContent = `${clip[range.key].toFixed(1)} s`;
        input.value = String(clip[range.key]);
        updateMontageSummary();
      });
      label.append(text, input, output);
      trim.append(label);
    });
    item.append(heading, trim);
    timeline.append(item);
  });
  updateMontageSummary();
}

$("#videoFile").addEventListener("change", event => {
  const files = [...event.currentTarget.files];
  event.currentTarget.value = "";
  const supported = files.filter(file => file.type.startsWith("video/") || file.type.startsWith("image/"));
  if (supported.length !== files.length) showToast("Certains fichiers ont été ignorés : seules les vidéos et les images sont acceptées.");
  supported.forEach(file => {
    const kind = file.type.startsWith("image/") ? "image" : "video";
    const clip = {
      id: nextVideoClipId++,
      file,
      kind,
      url: URL.createObjectURL(file),
      duration: kind === "image" ? 5 : 0,
      start: 0,
      end: kind === "image" ? 5 : 0
    };
    videoClips.push(clip);
    if (kind === "video") {
      const metadata = document.createElement("video");
      metadata.preload = "metadata";
      metadata.src = clip.url;
      metadata.addEventListener("loadedmetadata", () => {
        clip.duration = Number.isFinite(metadata.duration) ? metadata.duration : 0;
        clip.end = clip.duration;
        renderVideoTimeline();
        if (!activeVideoClip) {
          activeVideoClip = clip;
          showVideoClip(clip);
        }
      }, { once: true });
      metadata.addEventListener("error", () => {
        showToast(`Impossible de lire le clip « ${file.name} ».`);
        if (activeVideoClip === clip) activeVideoClip = null;
        videoClips.splice(videoClips.indexOf(clip), 1);
        URL.revokeObjectURL(clip.url);
        renderVideoTimeline();
        updateMontageSummary();
      }, { once: true });
      metadata.load();
    } else if (!activeVideoClip) {
      activeVideoClip = clip;
      const image = $("#studioImage");
      image.src = clip.url;
      image.alt = `Aperçu de ${clip.file.name}`;
      image.style.filter = $("#montageFilter").value;
      image.hidden = false;
      $("#studioVideo").hidden = true;
      $("#videoPlaceholder").hidden = true;
      $("#montageTitleOverlay").hidden = !$("#montageOverlayText").value.trim();
    }
  });
  $("#videoFileName").textContent = `${supported.length} fichier${supported.length === 1 ? "" : "s"} ajouté${supported.length === 1 ? "" : "s"}`;
  renderVideoTimeline();
});

$("#studioVideo").addEventListener("error", () => {
  if (activeVideoClip) showToast(`Cette vidéo ne peut pas être lue : ${activeVideoClip.file.name}.`);
});
$("#studioVideo").addEventListener("timeupdate", () => {
  if (!activeVideoClip || activeVideoClip.kind !== "video" || $("#cancelMontageExport").hidden) return;
  if ($("#studioVideo").currentTime >= activeVideoClip.end) {
    $("#studioVideo").pause();
    $("#studioVideo").currentTime = activeVideoClip.start;
  }
});
$("#videoVolume").addEventListener("input", event => {
  if (videoMixGain && montageAudioContext) {
    videoMixGain.gain.setTargetAtTime(Number(event.currentTarget.value) / 100, montageAudioContext.currentTime, 0.04);
    $("#studioVideo").volume = 1;
  } else {
    $("#studioVideo").volume = Number(event.currentTarget.value) / 100;
  }
});

$("#montageOverlayText").addEventListener("input", event => {
  const overlay = $("#montageTitleOverlay");
  overlay.textContent = event.currentTarget.value;
  overlay.hidden = !event.currentTarget.value.trim() || (!activeVideoClip);
});
$("#montageFilter").addEventListener("change", event => {
  $("#studioVideo").style.filter = event.currentTarget.value;
  $("#studioImage").style.filter = event.currentTarget.value;
});
$("#montageSpeed").addEventListener("input", event => {
  const speed = Number(event.currentTarget.value) / 100;
  $("#montageSpeedValue").textContent = `${speed.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}×`;
  $("#studioVideo").playbackRate = speed;
});

function ensureMontageAudioContext() {
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) throw new Error("Le mixage audio n’est pas pris en charge par ce navigateur.");
  if (!montageAudioContext) montageAudioContext = new AudioContextType();
  return montageAudioContext;
}

function attachAudioToMontage(track, destination) {
  const context = ensureMontageAudioContext();
  if (!track.mixSource) {
    track.mixSource = context.createMediaElementSource(track.audio);
    track.mixGain = context.createGain();
    track.mixSource.connect(track.mixGain);
    track.mixGain.connect(context.destination);
  }
  track.audio.volume = 1;
  track.mixGain.gain.value = Number(track.volume.value) / 100 * Number($("#musicMaster").value) / 100;
  track.mixGain.connect(destination);
}

function waitForMediaEvent(media, eventName) {
  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Un clip vidéo ne peut pas être décodé par ce navigateur."));
    };
    const cleanup = () => {
      media.removeEventListener(eventName, onReady);
      media.removeEventListener("error", onError);
    };
    media.addEventListener(eventName, onReady, { once: true });
    media.addEventListener("error", onError, { once: true });
  });
}

function drawMontageFrame(context, canvas, media, clip, elapsed, clipDuration, aspect) {
  context.fillStyle = "#090b0a";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const mediaReady = media && (media.tagName === "IMG" ? media.complete : media.readyState >= 2);
  if (mediaReady) {
    const videoWidth = media.videoWidth || media.naturalWidth;
    const videoHeight = media.videoHeight || media.naturalHeight;
    if (videoWidth && videoHeight) {
      const scale = Math.min(canvas.width / videoWidth, canvas.height / videoHeight);
      const width = videoWidth * scale;
      const height = videoHeight * scale;
      context.save();
      context.filter = $("#montageFilter").value;
      const fade = $("#montageFade").checked
        ? Math.min(1, elapsed / 0.45, Math.max(0, clipDuration - elapsed) / 0.45)
        : 1;
      context.globalAlpha = Math.max(0, fade);
      context.drawImage(media, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      context.restore();
    }
  }
  const title = $("#montageOverlayText").value.trim();
  if (title) {
    const fontSize = Math.round(canvas.width * 0.045);
    context.save();
    context.font = `600 ${fontSize}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.lineWidth = Math.max(3, fontSize * 0.12);
    context.strokeStyle = "rgba(0,0,0,.72)";
    context.fillStyle = "#fff";
    context.strokeText(title, canvas.width / 2, canvas.height * 0.91, canvas.width * 0.86);
    context.fillText(title, canvas.width / 2, canvas.height * 0.91, canvas.width * 0.86);
    context.restore();
  }
}

async function exportVideoMontage() {
  const exportButton = $("#exportMontage");
  if (!videoClips.length || !window.MediaRecorder) {
    showToast("L’export vidéo n’est pas disponible dans ce navigateur.");
    return;
  }
  const canvas = document.createElement("canvas");
  const aspect = $("#montageAspect").value;
  const dimensions = aspect === "portrait" ? [720, 1280] : aspect === "square" ? [900, 900] : [1280, 720];
  [canvas.width, canvas.height] = dimensions;
  if (typeof canvas.captureStream !== "function") {
    showToast("La capture vidéo du navigateur n’est pas disponible.");
    return;
  }
  const context = canvas.getContext("2d");
  if (!context) {
    showToast("Impossible de créer la scène vidéo pour l’export.");
    return;
  }
  const stream = canvas.captureStream(30);
  let recorder;
  let mimeType;
  const lockedControls = [...document.querySelectorAll("#videoTimeline button, #videoTimeline input, #audioTrackList button")]
    .map(control => ({ control, wasDisabled: control.disabled }));
  try {
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (AudioContextType && ($("#videoVolume").value !== "0" || audioTracks.length)) {
      const audioContext = ensureMontageAudioContext();
      await audioContext.resume();
      montageAudioDestination = audioContext.createMediaStreamDestination();
      if (!videoMixSource) {
        videoMixSource = audioContext.createMediaElementSource($("#studioVideo"));
        videoMixGain = audioContext.createGain();
        videoMixSource.connect(videoMixGain);
        videoMixGain.connect(audioContext.destination);
      }
      videoMixGain.gain.value = Number($("#videoVolume").value) / 100;
      videoMixGain.connect(montageAudioDestination);
      audioTracks.forEach(track => attachAudioToMontage(track, montageAudioDestination));
      montageAudioDestination.stream.getAudioTracks().forEach(track => stream.addTrack(track));
    }
    const preferredTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
    mimeType = preferredTypes.find(type => MediaRecorder.isTypeSupported(type));
    if (!mimeType) throw new Error("Aucun encodeur WebM compatible n’a été trouvé pour l’export.");
    recorder = new MediaRecorder(stream, { mimeType });
  } catch (error) {
    stream.getTracks().forEach(track => track.stop());
    if (montageAudioDestination) {
      videoMixGain?.disconnect(montageAudioDestination);
      audioTracks.forEach(track => track.mixGain?.disconnect(montageAudioDestination));
      montageAudioDestination = null;
    }
    showToast(error.message || "Impossible de préparer l’export de ce montage.");
    return;
  }

  montageCancelRequested = false;
  exportButton.disabled = true;
  $("#cancelMontageExport").hidden = false;
  $("#montageDownload").hidden = true;
  $("#montageProgress").value = 0;
  $("#montageStatus").textContent = "Préparation de l’export…";
  const chunks = [];
  const recording = new Promise((resolve, reject) => {
    recorder.addEventListener("dataavailable", event => {
      if (event.data.size) chunks.push(event.data);
    });
    recorder.addEventListener("stop", () => resolve(new Blob(chunks, { type: mimeType })), { once: true });
    recorder.addEventListener("error", () => reject(new Error("Le navigateur a interrompu l’enregistrement du montage.")), { once: true });
  });
  const speed = Number($("#montageSpeed").value) / 100;
  const totalDuration = videoClips.reduce((total, clip) => total + Math.max(0.1, clip.end - clip.start) / speed, 0);
  $("#montageProgress").max = String(totalDuration);
  let complete = 0;
  let activeClip = null;
  let frameStartedAt = 0;
  let currentClipDuration = 0;
  let painterActive = true;
  const paint = () => {
    if (!painterActive) return;
    let media = null;
    let elapsed = 0;
    if (activeClip) {
      elapsed = activeClip.kind === "image"
        ? (performance.now() - frameStartedAt) / 1000
        : Math.max(0, ($("#studioVideo").currentTime - activeClip.start) / (Number($("#montageSpeed").value) / 100));
      media = activeClip.kind === "image" ? $("#studioImage") : $("#studioVideo");
      $("#montageProgress").value = Math.min(totalDuration, complete + elapsed);
    }
    drawMontageFrame(context, canvas, media, activeClip, elapsed, currentClipDuration, aspect);
    requestAnimationFrame(paint);
  };
  requestAnimationFrame(paint);
  $("#videoFile").disabled = true;
  $("#audioFiles").disabled = true;
  $("#clearMontage").disabled = true;
  lockedControls.forEach(({ control }) => { control.disabled = true; });
  $("#videoTimeline").setAttribute("aria-busy", "true");
  recorder.start(250);

  try {
    for (const track of audioTracks) {
      track.previousTime = track.audio.currentTime;
      track.previousLoop = track.audio.loop;
      track.audio.loop = true;
      track.audio.currentTime = 0;
      await track.audio.play();
    }
    for (const clip of [...videoClips]) {
      if (montageCancelRequested) break;
      activeClip = clip;
      currentClipDuration = Math.max(0.1, clip.end - clip.start) / (Number($("#montageSpeed").value) / 100);
      $("#montageStatus").textContent = `Export du clip ${videoClips.indexOf(clip) + 1} sur ${videoClips.length}…`;
      if (clip.kind === "image") {
        const image = $("#studioImage");
        image.src = clip.url;
        if (!image.complete || !image.naturalWidth) await waitForMediaEvent(image, "load");
        frameStartedAt = performance.now();
        await new Promise(resolve => {
          const check = () => {
            if (montageCancelRequested || (performance.now() - frameStartedAt) / 1000 >= currentClipDuration) resolve();
            else requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        });
      } else {
        const video = $("#studioVideo");
        video.pause();
        video.onloadedmetadata = null;
        video.playbackRate = Number($("#montageSpeed").value) / 100;
        const loadedMetadata = waitForMediaEvent(video, "loadedmetadata");
        video.src = clip.url;
        video.load();
        await loadedMetadata;
        const seekTime = Math.min(clip.start, Math.max(0, video.duration - 0.1));
        if (seekTime > 0) {
          const seekCompleted = waitForMediaEvent(video, "seeked");
          video.currentTime = seekTime;
          await seekCompleted;
        } else {
          video.currentTime = 0;
        }
        await video.play();
        await new Promise(resolve => {
          const check = () => {
            if (montageCancelRequested || video.currentTime >= clip.end - 0.04 || video.ended) resolve();
            else requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        });
        video.pause();
      }
      complete += currentClipDuration;
      $("#montageProgress").value = Math.min(totalDuration, complete);
    }
    painterActive = false;
    recorder.stop();
    const blob = await recording;
    if (blob.size === 0) throw new Error("L’export est vide. Vérifie que les fichiers vidéo sont lisibles.");
    if (montageDownloadUrl) URL.revokeObjectURL(montageDownloadUrl);
    montageDownloadUrl = URL.createObjectURL(blob);
    const link = $("#montageDownload");
    link.href = montageDownloadUrl;
    link.hidden = false;
    link.download = `${($("#montageOverlayText").value.trim() || "mon-montage").replace(/[^\p{L}\p{N} _-]/gu, "").trim() || "mon-montage"}.webm`;
    $("#montageStatus").textContent = montageCancelRequested ? "Export arrêté — la partie déjà montée est prête." : "Montage exporté avec succès.";
    $("#montageProgress").value = montageCancelRequested ? Math.min(totalDuration, complete) : totalDuration;
  } catch (error) {
    painterActive = false;
    if (recorder.state !== "inactive") recorder.stop();
    const recordingError = await recording.catch(failure => failure);
    const message = recordingError instanceof Error && recordingError.message !== error.message
      ? `${error.message} ${recordingError.message}`
      : error.message;
    $("#montageStatus").textContent = message;
    showToast(message);
  } finally {
    $("#studioVideo").pause();
    $("#studioVideo").playbackRate = 1;
    audioTracks.forEach(track => {
      track.audio.pause();
      track.audio.loop = track.previousLoop || false;
      if (Number.isFinite(track.previousTime) && track.audio.duration) track.audio.currentTime = Math.min(track.previousTime, track.audio.duration);
      if (track.mixSource) track.audio.volume = 1;
      if (track.mixGain && montageAudioDestination) track.mixGain.disconnect(montageAudioDestination);
    });
    if (videoMixGain && montageAudioDestination) videoMixGain.disconnect(montageAudioDestination);
    montageAudioDestination?.stream.getTracks().forEach(track => track.stop());
    montageAudioDestination = null;
    stream.getTracks().forEach(track => track.stop());
    $("#cancelMontageExport").hidden = true;
    exportButton.disabled = videoClips.length === 0;
    $("#videoFile").disabled = false;
    $("#audioFiles").disabled = false;
    lockedControls.forEach(({ control, wasDisabled }) => { control.disabled = wasDisabled; });
    $("#videoTimeline").removeAttribute("aria-busy");
    updateMontageSummary();
    if (activeVideoClip?.kind === "video") showVideoClip(activeVideoClip);
    else if (activeVideoClip?.kind === "image") {
      $("#studioImage").src = activeVideoClip.url;
      $("#studioImage").alt = `Aperçu de ${activeVideoClip.file.name}`;
      $("#studioImage").hidden = false;
      $("#studioVideo").hidden = true;
      $("#videoPlaceholder").hidden = true;
    }
    $("#studioVideo").volume = Number($("#videoVolume").value) / 100;
    audioTracks.forEach(setTrackVolume);
  }
}

$("#exportMontage").addEventListener("click", exportVideoMontage);
$("#cancelMontageExport").addEventListener("click", () => {
  montageCancelRequested = true;
  $("#montageStatus").textContent = "Arrêt du montage en cours…";
});
$("#clearMontage").addEventListener("click", () => {
  videoClips.forEach(clip => URL.revokeObjectURL(clip.url));
  videoClips.length = 0;
  renderVideoTimeline();
});

$("#audioFiles").addEventListener("change", event => {
  const files = [...event.currentTarget.files];
  event.currentTarget.value = "";
  files.forEach(file => {
    if (file.type && !file.type.startsWith("audio/")) {
      showToast("Un fichier sélectionné n’est pas un fichier audio.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const row = document.createElement("div");
    row.className = "audio-track";
    const name = document.createElement("strong");
    name.className = "audio-track-name";
    name.textContent = file.name;
    name.title = file.name;
    const volumeLabel = document.createElement("label");
    volumeLabel.className = "audio-track-volume";
    volumeLabel.textContent = "Piste";
    const volume = document.createElement("input");
    volume.type = "range";
    volume.min = "0";
    volume.max = "100";
    volume.value = "80";
    volume.setAttribute("aria-label", `Volume de ${file.name}`);
    volumeLabel.append(volume);
    const removeButton = document.createElement("button");
    removeButton.className = "track-remove";
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Retirer ${file.name}`);
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = objectUrl;
    audio.addEventListener("error", () => showToast(`La piste « ${file.name} » ne peut pas être lue.`));
    const track = { audio, volume, row, objectUrl };
    volume.addEventListener("input", () => setTrackVolume(track));
    removeButton.addEventListener("click", () => {
      audio.pause();
      URL.revokeObjectURL(objectUrl);
      row.remove();
      audioTracks.splice(audioTracks.indexOf(track), 1);
      updateTrackCount();
      if (audioTracks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-tracks";
        emptyMessage.textContent = "Ajoute un fichier audio pour commencer ton mix.";
        $("#audioTrackList").append(emptyMessage);
      }
    });
    row.append(name, volumeLabel, removeButton, audio);
    if (audioTracks.length === 0) $("#audioTrackList").replaceChildren();
    audioTracks.push(track);
    $("#audioTrackList").append(row);
    setTrackVolume(track);
  });
  updateTrackCount();
});

$("#musicMaster").addEventListener("input", () => audioTracks.forEach(setTrackVolume));

const animalSoundProfiles = {
  cat: { start: 880, peak: 1050, finish: 580, type: "sawtooth", duration: 0.46, label: "Miaulement" },
  dog: { start: 205, peak: 410, finish: 125, type: "square", duration: 0.31, label: "Aboiement" },
  rabbit: { start: 1180, peak: 1540, finish: 920, type: "sine", duration: 0.19, label: "Petit couinement" },
  fox: { start: 640, peak: 970, finish: 420, type: "triangle", duration: 0.34, label: "Petit jappement" },
  panda: { start: 370, peak: 540, finish: 220, type: "sawtooth", duration: 0.42, label: "Petit souffle" },
  bear: { start: 115, peak: 175, finish: 75, type: "triangle", duration: 0.55, label: "Petit grognement" }
};

function stopAnimalSound() {
  window.clearTimeout(animalSoundTimer);
  animalAudioContext?.close().catch(error => {
    showToast(`Le son est arrêté, mais son contexte audio n’a pas pu être libéré : ${error.message}`);
  });
  animalAudioContext = null;
  $("#animalSoundToggle").setAttribute("aria-pressed", "false");
  $("#animalSoundToggle").textContent = "♪ Écouter son d’animal";
}

async function playAnimalSound() {
  if (animalAudioContext) {
    stopAnimalSound();
    $("#animalSoundStatus").textContent = "Son arrêté.";
    return;
  }
  const AudioContextType = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextType) {
    showToast("La lecture audio n’est pas prise en charge par ce navigateur.");
    return;
  }
  try {
    const profile = animalSoundProfiles[animalSpeciesInput.value] || animalSoundProfiles.cat;
    animalAudioContext = new AudioContextType();
    await animalAudioContext.resume();
    const now = animalAudioContext.currentTime;
    const oscillator = animalAudioContext.createOscillator();
    const volume = animalAudioContext.createGain();
    const filter = animalAudioContext.createBiquadFilter();
    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(profile.peak, now + profile.duration * 0.28);
    oscillator.frequency.exponentialRampToValueAtTime(profile.finish, now + profile.duration);
    filter.type = profile.type === "sawtooth" ? "lowpass" : "bandpass";
    filter.frequency.value = profile.type === "sawtooth" ? 1450 : 2400;
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.12, now + 0.035);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);
    oscillator.connect(filter);
    filter.connect(volume);
    volume.connect(animalAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + profile.duration + 0.02);
    $("#animalSoundToggle").setAttribute("aria-pressed", "true");
    $("#animalSoundToggle").textContent = "■ Arrêter le son";
    $("#animalSoundStatus").textContent = `${profile.label} synthétisé localement · ${animalSpeciesInput.selectedOptions[0].textContent}`;
    animalSoundTimer = window.setTimeout(stopAnimalSound, (profile.duration + 0.15) * 1000);
  } catch (error) {
    stopAnimalSound();
    showToast(`Impossible de générer ce son : ${error.message}`);
  }
}

$("#animalSoundToggle").addEventListener("click", playAnimalSound);
animalSpeciesInput.addEventListener("change", () => {
  if (animalAudioContext) stopAnimalSound();
  $("#animalSoundStatus").textContent = `Son synthétisé localement · ${animalSpeciesInput.selectedOptions[0].textContent}`;
});

function getAiRequestConfig() {
  const endpoint = $("#aiEndpoint").value.trim().replace(/\/+$/, "");
  const model = $("#aiModel").value.trim();
  const apiKey = $("#aiApiKey").value.trim();
  if (!endpoint || !model || !apiKey || !$("#aiPrompt").value.trim()) {
    throw new Error("Renseigne l’URL, le nom du modèle, ta clé API et ton idée.");
  }
  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    throw new Error("L’URL du fournisseur n’est pas valide.");
  }
  const localAddress = ["localhost", "127.0.0.1", "[::1]"].includes(endpointUrl.hostname);
  if (endpointUrl.protocol !== "https:" && !(localAddress && endpointUrl.protocol === "http:")) {
    throw new Error("Utilise une URL HTTPS pour protéger ta clé API.");
  }
  if (endpointUrl.username || endpointUrl.password || endpointUrl.hash) {
    throw new Error("Ne place pas de clé ou d’identifiant dans l’URL du fournisseur.");
  }
  return { endpoint, model, apiKey, prompt: $("#aiPrompt").value.trim() };
}

async function requestAi(path, body) {
  const config = getAiRequestConfig();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch(`${config.endpoint}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({ ...body, model: config.model }),
      signal: controller.signal
    });
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(`Le fournisseur a renvoyé une réponse non JSON (HTTP ${response.status}).`);
    }
    if (!response.ok) {
      const providerError = typeof data.error === "string" ? data.error : data.error?.message;
      throw new Error(providerError || `Erreur du fournisseur IA (HTTP ${response.status}).`);
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Le fournisseur IA a dépassé le délai de 90 secondes.");
    if (error instanceof TypeError) throw new Error("Connexion refusée. Vérifie l’URL, le réseau et l’autorisation CORS du fournisseur.");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function generateAiStoryboard() {
  const button = $("#aiGenerateStory");
  button.disabled = true;
  $("#aiGenerateImage").disabled = true;
  $("#aiStatus").textContent = "Création du scénario et du storyboard…";
  try {
    const data = await requestAi("chat/completions", {
      messages: [
        { role: "system", content: "Tu es un assistant créatif francophone. À partir de l’idée de l’utilisateur, propose un titre, un script concis, un storyboard en 4 à 6 plans avec durées suggérées, des indications de montage et un prompt d’image. Réponds clairement en français." },
        { role: "user", content: $("#aiPrompt").value.trim() }
      ],
      temperature: 0.8,
      max_tokens: 1200
    });
    const message = data.choices?.[0]?.message?.content;
    const text = Array.isArray(message) ? message.map(part => part.text || "").join("\n") : message;
    if (typeof text !== "string" || !text.trim()) throw new Error("Le modèle n’a pas renvoyé de texte exploitable.");
    $("#aiStory").textContent = text.trim();
    $("#aiResult").hidden = false;
    $("#aiStatus").textContent = "Storyboard reçu du fournisseur IA.";
  } catch (error) {
    $("#aiStatus").textContent = error.message;
    showToast(error.message);
  } finally {
    button.disabled = false;
    $("#aiGenerateImage").disabled = false;
  }
}

async function generateAiImage() {
  const button = $("#aiGenerateImage");
  button.disabled = true;
  $("#aiGenerateStory").disabled = true;
  $("#aiStatus").textContent = "Génération de l’image…";
  try {
    const data = await requestAi("images/generations", {
      prompt: $("#aiPrompt").value.trim(),
      n: 1,
      size: "1024x1024",
      response_format: "b64_json"
    });
    const image = data.data?.[0];
    let imageUrl;
    let filename = "image-generee.png";
    if (typeof image?.b64_json === "string") {
      const binary = atob(image.b64_json);
      const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
      if (aiImageObjectUrl) URL.revokeObjectURL(aiImageObjectUrl);
      aiImageObjectUrl = URL.createObjectURL(new Blob([bytes], { type: "image/png" }));
      imageUrl = aiImageObjectUrl;
    } else if (typeof image?.url === "string") {
      const parsed = new URL(image.url);
      if (parsed.protocol !== "https:") throw new Error("Le fournisseur a renvoyé une URL d’image non sécurisée.");
      if (aiImageObjectUrl) URL.revokeObjectURL(aiImageObjectUrl);
      aiImageObjectUrl = "";
      imageUrl = parsed.href;
      filename = "image-generee";
    } else {
      throw new Error("Le modèle d’image n’a renvoyé ni fichier ni URL.");
    }
    $("#aiGeneratedImage").src = imageUrl;
    $("#aiImageDownload").href = imageUrl;
    $("#aiImageDownload").download = filename;
    $("#aiImageResult").hidden = false;
    $("#aiStatus").textContent = "Image générée. Télécharge-la puis importe-la dans la timeline.";
  } catch (error) {
    $("#aiStatus").textContent = error.message;
    showToast(error.message);
  } finally {
    button.disabled = false;
    $("#aiGenerateStory").disabled = false;
  }
}

$("#aiGenerateStory").addEventListener("click", generateAiStoryboard);
$("#aiGenerateImage").addEventListener("click", generateAiImage);

function randomSecureIndex(maximum) {
  const cryptoApi = window.crypto;
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== "function") {
    throw new Error("La génération sécurisée n’est pas disponible dans ce navigateur.");
  }
  const limit = Math.floor(0x100000000 / maximum) * maximum;
  const value = new Uint32Array(1);
  do {
    cryptoApi.getRandomValues(value);
  } while (value[0] >= limit);
  return value[0] % maximum;
}

function makePassword() {
  const omitAmbiguous = passwordOptionInputs.excludeAmbiguous.checked;
  const filterCharacters = value => omitAmbiguous ? [...value].filter(character => !"O0Il1|".includes(character)).join("") : value;
  const groups = [
    passwordOptionInputs.lowercase.checked && filterCharacters("abcdefghijklmnopqrstuvwxyz"),
    passwordOptionInputs.uppercase.checked && filterCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
    passwordOptionInputs.numbers.checked && filterCharacters("0123456789"),
    passwordOptionInputs.symbols.checked && filterCharacters("!@#$%^&*()-_=+[]{};:,.?~")
  ].filter(Boolean);
  if (groups.length === 0) {
    showToast("Choisis au moins une catégorie de caractères.");
    return;
  }

  try {
    const pool = groups.join("");
    const length = Number(passwordLengthInput.value);
    const password = groups.map(group => group[randomSecureIndex(group.length)]);
    while (password.length < length) password.push(pool[randomSecureIndex(pool.length)]);
    for (let index = password.length - 1; index > 0; index -= 1) {
      const swapIndex = randomSecureIndex(index + 1);
      [password[index], password[swapIndex]] = [password[swapIndex], password[index]];
    }
    passwordOutput.value = password.join("");
    $("#copyPassword").disabled = false;
    const entropy = Math.round(length * Math.log2(pool.length));
    const strength = entropy >= 100 ? "Très robuste" : entropy >= 70 ? "Robuste" : "À renforcer";
    $("#passwordStrength").textContent = `${strength} · ${length} caractères · environ ${entropy} bits d’entropie`;
  } catch (error) {
    $("#passwordStrength").textContent = "Génération impossible dans ce navigateur.";
    showToast(error.message);
  }
}

$("#passwordLength").addEventListener("input", event => {
  $("#passwordLengthValue").textContent = `${event.currentTarget.value} caractères`;
  saveCreativeSettings();
});
Object.values(passwordOptionInputs).forEach(input => input.addEventListener("change", saveCreativeSettings));
$("#generatePassword").addEventListener("click", makePassword);

$("#copyPassword").addEventListener("click", async () => {
  if (!passwordOutput.value) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(passwordOutput.value);
    } else {
      passwordOutput.focus();
      passwordOutput.select();
      if (!document.execCommand("copy")) throw new Error("Le navigateur a refusé l’accès au presse-papiers.");
    }
    showToast("Mot de passe copié.");
  } catch {
    showToast("Impossible de copier le mot de passe. Sélectionne-le puis copie-le manuellement.");
  }
});

loadCreativeSettings();
updateAnimalPreview();
$("#studioVideo").volume = Number($("#videoVolume").value) / 100;
renderVideoTimeline();
window.addEventListener("beforeunload", () => {
  audioTracks.forEach(track => URL.revokeObjectURL(track.objectUrl));
  videoClips.forEach(clip => URL.revokeObjectURL(clip.url));
  if (montageDownloadUrl) URL.revokeObjectURL(montageDownloadUrl);
  if (aiImageObjectUrl) URL.revokeObjectURL(aiImageObjectUrl);
  if (animalAudioContext) stopAnimalSound();
});

const editorStorageKey = "eclipse-visual-editor";
const editorZones = [
  { id: "header", label: "En-tête", selector: ".topbar" },
  { id: "hero", label: "Accueil", selector: "#univers" },
  { id: "hero-copy", label: "Texte d’accueil", selector: ".hero-copy" },
  { id: "scene", label: "Scène 3D", selector: "#sceneStage" },
  { id: "scene-themes", label: "Boutons d’ambiance", selector: "#quickThemes" },
  { id: "ai-generator", label: "Assistant IA générative", selector: "#aiPanel" },
  { id: "customizer", label: "Personnalisation", selector: "#personnalisation" },
  { id: "theme-picker", label: "Galerie des ambiances", selector: '[aria-labelledby="themesTitle"]' },
  { id: "color-palette", label: "Palette de couleurs", selector: '[aria-labelledby="customColorsTitle"]' },
  { id: "glass-settings", label: "Réglages du verre", selector: '[aria-labelledby="glassTitle"]' },
  { id: "extras", label: "Options supplémentaires", selector: '[aria-labelledby="extrasTitle"]' },
  { id: "menu-settings", label: "Personnalisation du menu", selector: '[aria-labelledby="menuCustomizerTitle"]' },
  { id: "slime", label: "Jeu de slime", selector: "#slime" },
  { id: "workshop-heading", label: "Titre de l’atelier", selector: ".creative-workshop > .section-heading" },
  { id: "workshop-tabs", label: "Onglets de l’atelier", selector: ".workshop-tabs" },
  { id: "animal", label: "Compagnon animal", selector: "#animalPanel" },
  { id: "media", label: "Studio audio et vidéo", selector: "#mediaPanel" },
  { id: "password", label: "Générateur de mots de passe", selector: "#passwordPanel" },
  { id: "breathing", label: "Respiration guidée", selector: "#breathingGuide" },
  { id: "footer", label: "Pied de page", selector: "footer" }
];
const editorParameters = [
  { key: "move-x", label: "Déplacement horizontal", min: -100, max: 100, unit: "px", initial: 0, group: "position" },
  { key: "move-y", label: "Déplacement vertical", min: -100, max: 100, unit: "px", initial: 0, group: "position" },
  { key: "rotation", label: "Rotation", min: -180, max: 180, unit: "deg", initial: 0, group: "position" },
  { key: "scale-x", label: "Échelle horizontale", min: 50, max: 150, unit: "%", initial: 100, group: "scale" },
  { key: "scale-y", label: "Échelle verticale", min: 50, max: 150, unit: "%", initial: 100, group: "scale" },
  { key: "opacity", label: "Opacité", min: 0, max: 100, unit: "%", initial: 100, group: "opacity" },
  { key: "brightness", label: "Luminosité", min: 50, max: 150, unit: "%", initial: 100, group: "filter" },
  { key: "saturation", label: "Saturation", min: 0, max: 200, unit: "%", initial: 100, group: "filter" },
  { key: "hue", label: "Teinte", min: -180, max: 180, unit: "deg", initial: 0, group: "filter" },
  { key: "blur", label: "Flou", min: 0, max: 20, unit: "px", initial: 0, group: "filter" },
  { key: "radius", label: "Arrondi des angles", min: 0, max: 60, unit: "px", initial: 0, group: "radius" },
  { key: "padding", label: "Espacement intérieur", min: 0, max: 80, unit: "px", initial: 0, group: "padding" },
  { key: "margin", label: "Espacement extérieur", min: 0, max: 60, unit: "px", initial: 0, group: "margin" },
  { key: "font-size", label: "Taille du texte", min: 60, max: 160, unit: "%", initial: 100, group: "font-size" },
  { key: "letter-spacing", label: "Espacement des lettres", min: -2, max: 10, unit: "px", initial: 0, group: "letter-spacing" },
  { key: "line-height", label: "Hauteur des lignes", min: 80, max: 200, unit: "%", initial: 100, group: "line-height" },
  { key: "border-width", label: "Épaisseur des bordures", min: 0, max: 10, unit: "px", initial: 0, group: "border" },
  { key: "text-tint", label: "Teinte du texte", min: 0, max: 100, unit: "%", initial: 0, group: "text-tint" },
  { key: "shadow", label: "Ombre lumineuse", min: 0, max: 60, unit: "px", initial: 0, group: "shadow" },
  { key: "layer", label: "Ordre de superposition", min: 0, max: 20, unit: "", initial: 0, group: "layer" }
];

function editorElementPath(element) {
  if (element.id) return `#${element.id}`;
  const parts = [];
  let current = element;
  while (current && current !== document.body) {
    const typeIndex = [...current.parentElement.children]
      .filter(sibling => sibling.tagName === current.tagName)
      .indexOf(current) + 1;
    parts.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${typeIndex})`);
    current = current.parentElement;
  }
  return parts.join(">");
}

function createEditorInterface() {
  const toolbar = document.createElement("div");
  toolbar.id = "editorToolbar";
  toolbar.innerHTML = `
    <button id="editorToggle" type="button" aria-pressed="false">✎ Modifier la page</button>
    <button id="editorOpenControls" type="button" aria-controls="editorControls" aria-expanded="false" disabled>400 réglages</button>
    <span id="editorStatus" role="status" aria-live="polite">Modifications enregistrées sur cet appareil</span>
  `;
  document.body.append(toolbar);

  const panel = document.createElement("aside");
  panel.id = "editorControls";
  panel.setAttribute("aria-label", "400 paramètres visuels");
  panel.hidden = true;
  panel.innerHTML = `
    <div class="editor-panel-heading">
      <div><p>PERSONNALISATION AVANCÉE</p><h2>400 réglages visuels</h2><span>20 zones · 20 paramètres par zone</span></div>
      <button id="editorCloseControls" type="button" aria-label="Fermer les réglages">×</button>
    </div>
    <label class="editor-search" for="editorSearch"><span aria-hidden="true">⌕</span><input id="editorSearch" type="search" placeholder="Filtrer une zone ou un réglage…" autocomplete="off"></label>
    <div id="editorZoneList"></div>
    <div class="editor-panel-actions"><button id="editorReset" type="button">Réinitialiser l’éditeur</button></div>
  `;
  document.body.append(panel);

  editorZones.forEach(zone => {
    const details = document.createElement("details");
    details.className = "editor-zone";
    details.dataset.zone = zone.id;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${zone.label}</span><small>20 réglages</small>`;
    const controls = document.createElement("div");
    controls.className = "editor-zone-controls";
    editorParameters.forEach(parameter => {
      const id = `editor-${zone.id}-${parameter.key}`;
      const label = document.createElement("label");
      label.className = "editor-control";
      label.htmlFor = id;
      const heading = document.createElement("span");
      heading.className = "editor-control-heading";
      const name = document.createElement("span");
      name.textContent = parameter.label;
      const output = document.createElement("output");
      output.id = `${id}-value`;
      output.textContent = `${parameter.initial}${parameter.unit}`;
      const input = document.createElement("input");
      input.type = "range";
      input.id = id;
      input.min = String(parameter.min);
      input.max = String(parameter.max);
      input.step = "1";
      input.value = String(parameter.initial);
      input.dataset.editorSetting = `${zone.id}.${parameter.key}`;
      input.setAttribute("aria-label", `${zone.label} : ${parameter.label}`);
      heading.append(name, output);
      label.append(heading, input);
      controls.append(label);
    });
    details.append(summary, controls);
    $("#editorZoneList").append(details);
  });
}

let editorSettings = { zones: {}, positions: {}, texts: {} };
let editorEnabled = false;
let editorDrag = null;
let editorSaveTimer = 0;

function saveEditorSettings() {
  window.clearTimeout(editorSaveTimer);
  editorSaveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(editorStorageKey, JSON.stringify(editorSettings));
      $("#editorStatus").textContent = "Modifications enregistrées sur cet appareil";
    } catch {
      $("#editorStatus").textContent = "Enregistrement impossible — espace de stockage insuffisant";
      showToast("Impossible d’enregistrer les modifications de l’éditeur.");
    }
  }, 120);
}

function assignEditorElementIds(root = document.body) {
  const elements = [
    ...(root instanceof HTMLElement ? [root] : []),
    ...root.querySelectorAll("*:not(#editorToolbar):not(#editorToolbar *):not(#editorControls):not(#editorControls *)")
  ];
  elements.forEach(element => {
    if (element.closest("#editorToolbar, #editorControls") || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
    if (!element.dataset.editorElement) element.dataset.editorElement = editorElementPath(element);
    element.dataset.editorDraggable = "true";
  });
}

function prepareEditableText(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.textContent.trim() || parent.closest("#editorToolbar, #editorControls")) return NodeFilter.FILTER_REJECT;
      if (parent.closest("script, style, noscript, option, textarea, svg, canvas")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (parent.closest("[data-editor-text]")) continue;
    const childIndex = [...parent.childNodes].indexOf(node);
    const elementPath = editorElementPath(parent);
    textNodes.push({
      node,
      textId: `${elementPath}:text-${childIndex}`,
      original: node.textContent,
      value: editorSettings.texts[`${elementPath}:text-${childIndex}`]
    });
  }
  textNodes.forEach(({ node, textId, original, value }) => {
    if (value !== undefined) node.textContent = value;
    const nodeParent = node.parentElement;
    if (nodeParent.children.length === 0 && nodeParent.childNodes.length === 1) {
      nodeParent.dataset.editorText = textId;
      nodeParent.dataset.editorOriginal = original;
    } else {
      const span = document.createElement("span");
      span.dataset.editorText = textId;
      span.dataset.editorOriginal = original;
      node.replaceWith(span);
      span.append(node);
    }
  });
}

function applySavedEditorText(root = document.body) {
  const elements = [
    ...(root instanceof HTMLElement && root.matches("[data-editor-text]") ? [root] : []),
    ...root.querySelectorAll("[data-editor-text]")
  ];
  elements.forEach(element => {
    const textId = element.dataset.editorText;
    if (editorSettings.texts[textId] !== undefined) element.textContent = editorSettings.texts[textId];
    element.contentEditable = String(editorEnabled);
    element.spellcheck = editorEnabled;
    element.classList.toggle("editor-editable-text", editorEnabled);
  });
}

function applySavedEditorPositions() {
  document.querySelectorAll("[data-editor-draggable]").forEach(element => {
    const position = editorSettings.positions[element.dataset.editorElement];
    if (position && Number.isFinite(position.x) && Number.isFinite(position.y)) {
      element.style.setProperty("--edit-drag-x", `${position.x}px`);
      element.style.setProperty("--edit-drag-y", `${position.y}px`);
      element.dataset.editorDragged = "true";
    }
  });
}

function formatEditorValue(parameter, value) {
  return `${value}${parameter.unit}`;
}

function applyZoneSettings(zone, settings) {
  const target = document.querySelector(zone.selector);
  if (!target) return;
  target.dataset.editorZone = zone.id;
  const zoneSettings = settings[zone.id] || {};
  const activeGroups = new Set();
  editorParameters.forEach(parameter => {
    const raw = zoneSettings[parameter.key];
    const value = Number.isFinite(raw) ? Math.max(parameter.min, Math.min(parameter.max, raw)) : parameter.initial;
    const input = $(`#editor-${zone.id}-${parameter.key}`);
    const output = $(`#editor-${zone.id}-${parameter.key}-value`);
    if (input) input.value = String(value);
    if (output) output.textContent = formatEditorValue(parameter, value);
    if (value !== parameter.initial) activeGroups.add(parameter.group);
    const variable = {
      "move-x": "--customizer-move-x",
      "move-y": "--customizer-move-y",
      rotation: "--customizer-rotation",
      "scale-x": "--customizer-scale-x",
      "scale-y": "--customizer-scale-y",
      opacity: "--customizer-opacity",
      brightness: "--customizer-brightness",
      saturation: "--customizer-saturation",
      hue: "--customizer-hue",
      blur: "--customizer-blur",
      radius: "--customizer-radius",
      padding: "--customizer-padding",
      margin: "--customizer-margin",
      "font-size": "--customizer-font-size",
      "letter-spacing": "--customizer-letter-spacing",
      "line-height": "--customizer-line-height",
      "border-width": "--customizer-border-width",
      "text-tint": "--customizer-text-tint",
      shadow: "--customizer-shadow",
      layer: "--customizer-layer"
    }[parameter.key];
    const cssValue = parameter.key === "scale-x" || parameter.key === "scale-y" ||
      parameter.key === "opacity" || parameter.key === "brightness" ||
      parameter.key === "saturation" || parameter.key === "font-size" ||
      parameter.key === "line-height"
      ? String(value / 100)
      : `${value}${parameter.unit}`;
    target.style.setProperty(variable, cssValue);
  });
  if (activeGroups.size) target.dataset.editorGroups = [...activeGroups].join(" ");
  else delete target.dataset.editorGroups;
}

function renderEditorSettings(filter = "") {
  const query = filter.trim().toLocaleLowerCase("fr");
  editorZones.forEach(zone => {
    const details = $(`.editor-zone[data-zone="${zone.id}"]`);
    const groupMatches = zone.label.toLocaleLowerCase("fr").includes(query);
    let visibleCount = 0;
    details.querySelectorAll(".editor-control").forEach((label, index) => {
      const matches = !query || groupMatches || editorParameters[index].label.toLocaleLowerCase("fr").includes(query);
      label.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    details.hidden = visibleCount === 0;
  });
}

function enableEditor(enabled) {
  editorEnabled = enabled;
  const toggle = $("#editorToggle");
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.textContent = enabled ? "✓ Terminer l’édition" : "✎ Modifier la page";
  $("#editorOpenControls").disabled = !enabled;
  document.body.classList.toggle("visual-editor-active", enabled);
  if (enabled) {
    assignEditorElementIds();
    prepareEditableText();
    applySavedEditorText();
    applySavedEditorPositions();
    $("#editorStatus").textContent = "Clique pour modifier un texte · glisse un élément pour le déplacer";
  } else {
    document.querySelectorAll("[data-editor-text]").forEach(element => {
      element.contentEditable = "false";
      element.classList.remove("editor-editable-text");
    });
    editorDrag = null;
    $("#editorStatus").textContent = "Modifications enregistrées sur cet appareil";
  }
}

const editorMutationObserver = new MutationObserver(records => {
  if (!editorEnabled) return;
  const changedElements = records
    .flatMap(record => [...record.addedNodes])
    .filter(node => node instanceof HTMLElement && !node.closest("#editorToolbar, #editorControls"));
  changedElements.forEach(element => {
    assignEditorElementIds(element);
    prepareEditableText(element);
    applySavedEditorText(element);
  });
});

function updateEditorSetting(input) {
  const [zoneId, key] = input.dataset.editorSetting.split(".");
  if (!editorSettings.zones[zoneId]) editorSettings.zones[zoneId] = {};
  const parameter = editorParameters.find(item => item.key === key);
  const value = Number(input.value);
  if (value === parameter.initial) delete editorSettings.zones[zoneId][key];
  else editorSettings.zones[zoneId][key] = value;
  applyZoneSettings(editorZones.find(item => item.id === zoneId), editorSettings.zones);
  saveEditorSettings();
}

function loadEditorSettings() {
  try {
    const saved = localStorage.getItem(editorStorageKey);
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings && typeof settings === "object") {
        editorSettings = {
          zones: settings.zones && typeof settings.zones === "object" ? settings.zones : {},
          positions: settings.positions && typeof settings.positions === "object" ? settings.positions : {},
          texts: settings.texts && typeof settings.texts === "object" ? settings.texts : {}
        };
      }
    }
  } catch {
    showToast("Les réglages de l’éditeur n’ont pas pu être lus. Les valeurs par défaut sont chargées.");
    editorSettings = { zones: {}, positions: {}, texts: {} };
  }
  editorZones.forEach(zone => applyZoneSettings(zone, editorSettings.zones));
  assignEditorElementIds();
  prepareEditableText();
  applySavedEditorText();
  applySavedEditorPositions();
}

createEditorInterface();
loadEditorSettings();
$("#editorToggle").addEventListener("click", () => enableEditor(!editorEnabled));
$("#editorOpenControls").addEventListener("click", () => {
  if (!editorEnabled) return;
  const panel = $("#editorControls");
  panel.hidden = !panel.hidden;
  $("#editorOpenControls").setAttribute("aria-expanded", String(!panel.hidden));
});
$("#editorCloseControls").addEventListener("click", () => {
  $("#editorControls").hidden = true;
  $("#editorOpenControls").setAttribute("aria-expanded", "false");
});
$("#editorSearch").addEventListener("input", event => renderEditorSettings(event.currentTarget.value));
$("#editorZoneList").addEventListener("input", event => {
  if (event.target.matches("[data-editor-setting]")) updateEditorSetting(event.target);
});
$("#editorReset").addEventListener("click", () => {
  if (!window.confirm("Réinitialiser les 400 réglages, les textes et les déplacements personnalisés ?")) return;
  window.clearTimeout(editorSaveTimer);
  try {
    localStorage.removeItem(editorStorageKey);
  } catch {
    $("#editorStatus").textContent = "Impossible d’effacer les personnalisations enregistrées";
    showToast("L’éditeur n’a pas pu effacer ses personnalisations sur cet appareil.");
    return;
  }
  editorSettings = { zones: {}, positions: {}, texts: {} };
  document.querySelectorAll("[data-editor-groups]").forEach(element => delete element.dataset.editorGroups);
  document.querySelectorAll("[data-editor-dragged]").forEach(element => {
    delete element.dataset.editorDragged;
    element.style.removeProperty("--edit-drag-x");
    element.style.removeProperty("--edit-drag-y");
  });
  document.querySelectorAll("[data-editor-text]").forEach(element => {
    element.textContent = element.dataset.editorOriginal;
  });
  editorZones.forEach(zone => applyZoneSettings(zone, editorSettings.zones));
  $("#editorZoneList").querySelectorAll("[data-editor-setting]").forEach(input => {
    const parameter = editorParameters.find(item => item.key === input.dataset.editorSetting.split(".")[1]);
    input.value = String(parameter.initial);
    $(`#${input.id}-value`).textContent = formatEditorValue(parameter, parameter.initial);
  });
  $("#editorStatus").textContent = "Les personnalisations de l’éditeur ont été réinitialisées";
});

document.addEventListener("input", event => {
  if (!editorEnabled) return;
  const element = event.target.closest("[data-editor-text]");
  if (!element) return;
  const value = element.textContent;
  editorSettings.texts[element.dataset.editorText] = value;
  saveEditorSettings();
}, true);

document.addEventListener("pointerdown", event => {
  if (!editorEnabled || event.button !== 0 || event.target.closest("#editorToolbar, #editorControls")) return;
  const element = event.target.closest("[data-editor-draggable]");
  if (!element || element.hidden) return;
  editorDrag = {
    element,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    offsetX: editorSettings.positions[element.dataset.editorElement]?.x || 0,
    offsetY: editorSettings.positions[element.dataset.editorElement]?.y || 0,
    moved: false
  };
}, true);

document.addEventListener("pointermove", event => {
  if (!editorDrag || event.pointerId !== editorDrag.pointerId) return;
  const deltaX = event.clientX - editorDrag.startX;
  const deltaY = event.clientY - editorDrag.startY;
  if (!editorDrag.moved && Math.hypot(deltaX, deltaY) < 6) return;
  editorDrag.moved = true;
  event.preventDefault();
  const x = Math.round(editorDrag.offsetX + deltaX);
  const y = Math.round(editorDrag.offsetY + deltaY);
  editorDrag.element.style.setProperty("--edit-drag-x", `${x}px`);
  editorDrag.element.style.setProperty("--edit-drag-y", `${y}px`);
  editorDrag.element.dataset.editorDragged = "true";
}, { capture: true, passive: false });

function finishEditorDrag(event) {
  if (!editorDrag || event.pointerId !== editorDrag.pointerId) return;
  if (editorDrag.moved) {
    const { element } = editorDrag;
    const x = parseInt(element.style.getPropertyValue("--edit-drag-x"), 10) || 0;
    const y = parseInt(element.style.getPropertyValue("--edit-drag-y"), 10) || 0;
    editorSettings.positions[element.dataset.editorElement] = { x, y };
    saveEditorSettings();
  }
  editorDrag = null;
}
document.addEventListener("pointerup", finishEditorDrag, true);
document.addEventListener("pointercancel", finishEditorDrag, true);
editorMutationObserver.observe(document.body, { childList: true, subtree: true });

document.addEventListener("click", event => {
  if (!editorEnabled || event.target.closest("#editorToolbar, #editorControls")) return;
  const link = event.target.closest("a");
  if (link) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);
