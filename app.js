const games = [
  {
    title: "Snake",
    path: "games/snake/index.html",
    tags: ["arcade", "classic"],
    description: "Classic snake game. Arrow keys/WASD, space to pause, R to restart."
  },
  {
    title: "Memory Match",
    path: "games/memory/index.html",
    tags: ["puzzle", "memory"],
    description: "Flip cards and match all pairs."
  }
];

const grid = document.getElementById("game-grid");
const search = document.getElementById("search");
const player = document.getElementById("player");
const frame = document.getElementById("game-frame");
const playerTitle = document.getElementById("player-title");
const closeBtn = document.getElementById("close");

function render(filter = "") {
  grid.innerHTML = "";
  const q = filter.trim().toLowerCase();

  const filtered = games.filter((game) => {
    return (
      game.title.toLowerCase().includes(q) ||
      game.description.toLowerCase().includes(q) ||
      game.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  for (const game of filtered) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.innerHTML = `
      <h2>${game.title}</h2>
      <p>${game.description}</p>
      <small>${game.tags.join(" • ")}</small>
    `;
    card.addEventListener("click", () => openGame(game));
    grid.appendChild(card);
  }

  if (!filtered.length) {
    grid.innerHTML = "<p>No games found.</p>";
  }
}

function openGame(game) {
  playerTitle.textContent = game.title;
  frame.src = game.path;
  player.classList.remove("hidden");
}

function closeGame() {
  player.classList.add("hidden");
  frame.src = "about:blank";
}

closeBtn.addEventListener("click", closeGame);

search.addEventListener("input", (event) => {
  render(event.target.value);
});

player.addEventListener("click", (event) => {
  if (event.target === player) closeGame();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeGame();
});

render();
