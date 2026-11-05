const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 20;
const COLS = 20;
const ROWS = 20;

let snake;
let dir;
let nextDir;
let food;
let score;
let timer;
let running;
let paused;

function reset() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  food = randomFood();
  score = 0;
  running = true;
  paused = false;

  clearInterval(timer);
  timer = setInterval(step, 120);
  draw();
}

function randomFood() {
  let p;
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function step() {
  if (!running || paused) return;

  dir = nextDir;

  const head = {
    x: snake[0].x + dir.x,
    y: snake[0].y + dir.y
  };

  const hitWall =
    head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
  const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);

  if (hitWall || hitSelf) {
    running = false;
    clearInterval(timer);
    draw();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f43f5e";
  ctx.fillRect(food.x * TILE + 2, food.y * TILE + 2, TILE - 4, TILE - 4);

  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#16a34a";
    ctx.fillRect(s.x * TILE + 1, s.y * TILE + 1, TILE - 2, TILE - 2);
  });

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 22);

  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("Game Over", 200, 180);
    ctx.font = "18px sans-serif";
    ctx.fillText("Press R to restart", 200, 220);
    ctx.textAlign = "left";
  }

  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("Paused", 200, 200);
    ctx.textAlign = "left";
  }
}

document.addEventListener("keydown", (event) => {
  const k = event.key.toLowerCase();

  if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(k)) {
    event.preventDefault();
  }

  if (k === "r") {
    reset();
    return;
  }

  if (k === " ") {
    if (running) paused = !paused;
    draw();
    return;
  }

  if (!running || paused) return;

  if ((k === "arrowup" || k === "w") && dir.y !== 1) nextDir = { x: 0, y: -1 };
  if ((k === "arrowdown" || k === "s") && dir.y !== -1) nextDir = { x: 0, y: 1 };
  if ((k === "arrowleft" || k === "a") && dir.x !== 1) nextDir = { x: -1, y: 0 };
  if ((k === "arrowright" || k === "d") && dir.x !== -1) nextDir = { x: 1, y: 0 };
});

reset();
