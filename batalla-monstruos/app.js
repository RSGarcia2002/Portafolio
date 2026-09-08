const monsterForm = document.querySelector("#monsterForm");
const battleForm = document.querySelector("#battleForm");
const monsterGrid = document.querySelector("#monsterGrid");
const battleHistory = document.querySelector("#battleHistory");
const monsterCount = document.querySelector("#monsterCount");
const monsterA = document.querySelector("#monsterA");
const monsterB = document.querySelector("#monsterB");
const currentResult = document.querySelector("#currentResult");
const battleStatus = document.querySelector("#battleStatus");
const formTitle = document.querySelector("#formTitle");
const saveMonsterButton = document.querySelector("#saveMonsterButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const resetButton = document.querySelector("#resetButton");
const clearBattlesButton = document.querySelector("#clearBattlesButton");
const template = document.querySelector("#monsterCardTemplate");
const battleButton = battleForm.querySelector("button");

const STORAGE_KEYS = {
  monsters: "monster-battle.monsters",
  battles: "monster-battle.battles",
};

const defaultMonsters = [
  {
    id: crypto.randomUUID(),
    name: "Aurum",
    health: 120,
    attack: 28,
    defense: 12,
    speed: 18,
    image: monsterAvatar("#d79a20", "#172033"),
  },
  {
    id: crypto.randomUUID(),
    name: "Nébula",
    health: 95,
    attack: 34,
    defense: 9,
    speed: 24,
    image: monsterAvatar("#1d5f99", "#f4f1ea"),
  },
  {
    id: crypto.randomUUID(),
    name: "Brakka",
    health: 145,
    attack: 22,
    defense: 18,
    speed: 12,
    image: monsterAvatar("#c84630", "#ffffff"),
  },
];

let monsters = readStorage(STORAGE_KEYS.monsters, defaultMonsters);
let battles = readStorage(STORAGE_KEYS.battles, []);
let isBattleRunning = false;

function monsterAvatar(primary, secondary) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
      <rect width="180" height="180" rx="22" fill="${secondary}"/>
      <path d="M36 90c0-35 22-61 54-61s54 26 54 61v32c0 20-18 36-54 36s-54-16-54-36V90z" fill="${primary}"/>
      <path d="M55 46 40 22l31 13M125 46l15-24-31 13" fill="${primary}"/>
      <circle cx="69" cy="88" r="10" fill="#fff"/>
      <circle cx="111" cy="88" r="10" fill="#fff"/>
      <circle cx="72" cy="90" r="4" fill="#172033"/>
      <circle cx="108" cy="90" r="4" fill="#172033"/>
      <path d="M70 123c12 9 28 9 40 0" fill="none" stroke="#172033" stroke-width="8" stroke-linecap="round"/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function readStorage(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return fallback;

    const value = JSON.parse(storedValue);
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(monsters));
  localStorage.setItem(STORAGE_KEYS.battles, JSON.stringify(battles));
}

function toNumber(value) {
  return Number.parseInt(value, 10);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMonsterFormData() {
  const formData = new FormData(monsterForm);
  return {
    id: document.querySelector("#monsterId").value || crypto.randomUUID(),
    name: formData.get("name").trim(),
    health: toNumber(formData.get("health")),
    attack: toNumber(formData.get("attack")),
    defense: toNumber(formData.get("defense")),
    speed: toNumber(formData.get("speed")),
    image: formData.get("image").trim() || monsterAvatar("#0f766e", "#172033"),
  };
}

function validateMonster(monster) {
  return (
    monster.name &&
    monster.health > 0 &&
    monster.attack > 0 &&
    monster.defense >= 0 &&
    monster.speed > 0
  );
}

function render() {
  renderMonsters();
  renderSelects();
  renderBattles();
  monsterCount.textContent = monsters.length;
  saveStorage();
}

function renderMonsters() {
  monsterGrid.innerHTML = "";

  if (!monsters.length) {
    monsterGrid.innerHTML = `<div class="empty-state">No hay monstruos registrados. Agrega al menos dos para iniciar una batalla.</div>`;
    return;
  }

  monsters.forEach((monster) => {
    const card = template.content.cloneNode(true);
    card.querySelector("img").src = monster.image;
    card.querySelector("img").alt = `Imagen de ${monster.name}`;
    card.querySelector("img").addEventListener("error", (event) => {
      event.currentTarget.src = monsterAvatar("#0f766e", "#172033");
    });
    card.querySelector("h3").textContent = monster.name;
    card.querySelector(".monster-top span").textContent = `VEL ${monster.speed}`;
    card.querySelector(".stat-list").innerHTML = [
      ["Vida", monster.health],
      ["Ataque", monster.attack],
      ["Defensa", monster.defense],
      ["Velocidad", monster.speed],
    ]
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
      .join("");
    card.querySelector(".edit").addEventListener("click", () => startEdit(monster.id));
    card.querySelector(".danger").addEventListener("click", () => deleteMonster(monster.id));
    monsterGrid.appendChild(card);
  });
}

function renderSelects() {
  const options = monsters
    .map((monster) => `<option value="${escapeHTML(monster.id)}">${escapeHTML(monster.name)}</option>`)
    .join("");

  monsterA.innerHTML = `<option value="">Seleccionar</option>${options}`;
  monsterB.innerHTML = `<option value="">Seleccionar</option>${options}`;
  battleButton.disabled = monsters.length < 2 || isBattleRunning;
}

function renderBattles() {
  if (!battles.length) {
    battleHistory.innerHTML = `<div class="empty-state">Aun no hay batallas registradas.</div>`;
    return;
  }

  battleHistory.innerHTML = battles
    .map(
      (battle) => `
      <article class="history-item">
        <div class="history-top">
          <div>
            <strong>${escapeHTML(battle.winner)} venció a ${escapeHTML(battle.loser)}</strong>
            <small>${escapeHTML(battle.createdAt)} · ${battle.turns.length} turnos</small>
          </div>
          <button class="button small danger" data-battle-id="${escapeHTML(battle.id)}" type="button">Eliminar</button>
        </div>
        <small>Inicio: ${escapeHTML(battle.firstAttacker)}</small>
      </article>
    `
    )
    .join("");

  battleHistory.querySelectorAll("[data-battle-id]").forEach((button) => {
    button.addEventListener("click", () => deleteBattle(button.dataset.battleId));
  });
}

function startEdit(id) {
  const monster = monsters.find((item) => item.id === id);
  if (!monster) return;

  document.querySelector("#monsterId").value = monster.id;
  document.querySelector("#name").value = monster.name;
  document.querySelector("#health").value = monster.health;
  document.querySelector("#attack").value = monster.attack;
  document.querySelector("#defense").value = monster.defense;
  document.querySelector("#speed").value = monster.speed;
  document.querySelector("#image").value = monster.image.startsWith("data:") ? "" : monster.image;
  formTitle.textContent = "Editar monstruo";
  saveMonsterButton.textContent = "Actualizar monstruo";
  cancelEditButton.classList.remove("hidden");
  monsterForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
  monsterForm.reset();
  document.querySelector("#monsterId").value = "";
  document.querySelector("#health").value = 100;
  document.querySelector("#attack").value = 25;
  document.querySelector("#defense").value = 10;
  document.querySelector("#speed").value = 15;
  formTitle.textContent = "Agregar monstruo";
  saveMonsterButton.textContent = "Guardar monstruo";
  cancelEditButton.classList.add("hidden");
}

function deleteMonster(id) {
  const monster = monsters.find((item) => item.id === id);
  if (!monster) return;

  const isUsedInBattle = battles.some((battle) => battle.monsterIds.includes(id));
  if (isUsedInBattle) {
    battles = battles.filter((battle) => !battle.monsterIds.includes(id));
  }

  monsters = monsters.filter((item) => item.id !== id);
  resetForm();
  currentResult.innerHTML = `<p>${escapeHTML(monster.name)} fue eliminado. Las batallas asociadas también fueron eliminadas.</p>`;
  render();
}

function determineFirstAttacker(first, second) {
  if (first.speed > second.speed) return [first, second];
  if (second.speed > first.speed) return [second, first];
  if (first.attack >= second.attack) return [first, second];
  return [second, first];
}

function calculateDamage(attacker, defender) {
  const rawDamage = attacker.attack - defender.defense;
  return rawDamage > 0 ? rawDamage : 1;
}

function simulateBattle(firstMonster, secondMonster) {
  const fighters = {
    [firstMonster.id]: { ...firstMonster, currentHealth: firstMonster.health },
    [secondMonster.id]: { ...secondMonster, currentHealth: secondMonster.health },
  };
  let [attacker, defender] = determineFirstAttacker(fighters[firstMonster.id], fighters[secondMonster.id]);
  const firstAttacker = attacker.name;
  const turns = [];

  while (fighters[firstMonster.id].currentHealth > 0 && fighters[secondMonster.id].currentHealth > 0) {
    const damage = calculateDamage(attacker, defender);
    defender.currentHealth = Math.max(0, defender.currentHealth - damage);
    turns.push(
      `${attacker.name} ataca a ${defender.name} y causa ${damage} de daño. Vida restante de ${defender.name}: ${defender.currentHealth}.`
    );

    if (defender.currentHealth <= 0) break;
    [attacker, defender] = [defender, attacker];
  }

  return {
    id: crypto.randomUUID(),
    monsterIds: [firstMonster.id, secondMonster.id],
    winner: attacker.name,
    loser: defender.name,
    firstAttacker,
    turns,
    createdAt: new Intl.DateTimeFormat("es-GT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date()),
  };
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function setBattleControlsDisabled(isDisabled) {
  isBattleRunning = isDisabled;
  monsterA.disabled = isDisabled;
  monsterB.disabled = isDisabled;
  battleButton.disabled = isDisabled || monsters.length < 2;
  battleButton.textContent = isDisabled ? "Batalla en curso..." : "Iniciar batalla";
}

function createTurnItem(text) {
  const item = document.createElement("li");
  item.textContent = text;
  return item;
}

async function showBattleResult(battle) {
  battleStatus.textContent = "En combate";
  currentResult.innerHTML = `
    <h3>⚔️ Batalla en curso</h3>
    <p>${escapeHTML(battle.firstAttacker)} ataca primero según las reglas de velocidad y ataque.</p>
    <ol class="turn-log" id="liveTurnLog"></ol>
  `;

  const liveTurnLog = document.querySelector("#liveTurnLog");
  for (const turn of battle.turns) {
    await wait(650);
    liveTurnLog.appendChild(createTurnItem(turn));
    liveTurnLog.scrollTop = liveTurnLog.scrollHeight;
  }

  await wait(500);
  battleStatus.textContent = "Completada";
  currentResult.querySelector("h3").textContent = "Resultado final";
  currentResult.querySelector("p").textContent = `${battle.winner} derrotó a ${battle.loser}. ${battle.firstAttacker} atacó primero según las reglas de velocidad y ataque.`;
  currentResult.insertAdjacentHTML(
    "afterbegin",
    `<div class="winner-banner">🏆 Ganador: ${escapeHTML(battle.winner)}</div>`
  );
}

function deleteBattle(id) {
  battles = battles.filter((battle) => battle.id !== id);
  render();
}

monsterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const monster = getMonsterFormData();

  if (!validateMonster(monster)) {
    currentResult.innerHTML = `<p>Revisa los datos del monstruo. Vida, ataque y velocidad deben ser mayores a 0.</p>`;
    return;
  }

  const index = monsters.findIndex((item) => item.id === monster.id);
  if (index >= 0) {
    monsters[index] = monster;
  } else {
    monsters.push(monster);
  }

  resetForm();
  render();
});

battleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isBattleRunning) return;

  const firstId = monsterA.value;
  const secondId = monsterB.value;

  if (!firstId || !secondId || firstId === secondId) {
    currentResult.innerHTML = `<p>Selecciona dos monstruos distintos para crear una batalla.</p>`;
    return;
  }

  const firstMonster = monsters.find((monster) => monster.id === firstId);
  const secondMonster = monsters.find((monster) => monster.id === secondId);
  const battle = simulateBattle(firstMonster, secondMonster);
  setBattleControlsDisabled(true);
  await showBattleResult(battle);
  battles.unshift(battle);
  setBattleControlsDisabled(false);
  renderBattles();
  saveStorage();
});

cancelEditButton.addEventListener("click", resetForm);

resetButton.addEventListener("click", () => {
  monsters = defaultMonsters.map((monster) => ({ ...monster, id: crypto.randomUUID() }));
  battles = [];
  resetForm();
  currentResult.innerHTML = `<p>Datos iniciales restaurados.</p>`;
  render();
});

clearBattlesButton.addEventListener("click", () => {
  battles = [];
  currentResult.innerHTML = `<p>Historial de batallas eliminado.</p>`;
  render();
});

render();
