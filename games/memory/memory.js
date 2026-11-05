const icons = ["🍎", "🍌", "🍇", "🍓", "🍒", "🥝", "🍍", "🥑"];
let deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
let first = null;
let lock = false;
let matches = 0;

const board = document.getElementById("board");
const status = document.getElementById("status");

function render() {
  board.innerHTML = "";

  deck.forEach((icon, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.textContent = "?";
    btn.addEventListener("click", () => flip(index, btn));
    board.appendChild(btn);
  });
}

function flip(index, btn) {
  if (lock || btn.classList.contains("open") || btn.classList.contains("matched")) return;

  btn.classList.add("open");
  btn.textContent = deck[index];

  if (!first) {
    first = { index, btn };
    return;
  }

  if (first.index === index) return;

  if (deck[first.index] === deck[index]) {
    first.btn.classList.add("matched");
    btn.classList.add("matched");
    matches++;
    status.textContent = `Matches: ${matches}`;
    first = null;

    if (matches === icons.length) {
      setTimeout(() => alert("You win!"), 100);
    }
  } else {
    lock = true;
    setTimeout(() => {
      first.btn.classList.remove("open");
      first.btn.textContent = "?";
      btn.classList.remove("open");
      btn.textContent = "?";
      first = null;
      lock = false;
    }, 700);
  }
}

document.getElementById("restart").addEventListener("click", () => location.reload());

render();
