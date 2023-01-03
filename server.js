const readline = require('readline');
const { createServer } = require('http');
const { parse } = require('url');
const { createReadStream } = require('fs');
const { join } = require('path');

const PORT = 3000;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server = createServer((req, res) => {
  const { pathname } = parse(req.url);
  const file = pathname === '/' ? '/index.html' : pathname;
  const filepath = join(__dirname, 'public', file);

  createReadStream(filepath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const players = {};
let currentPlayer = 'X';
let gameOver = false;
const board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

rl.on('line', (input) => {
  if (gameOver) {
    console.log('The game is over. Please start a new game.');
    return;
  }

  const [row, col] = input.split(',').map(Number);
  if (!players[currentPlayer]) {
    console.log('Waiting for player to join...');
    return;
  }
  if (board[row][col] !== '') {
    console.log('That spot has already been taken. Please choose another spot.');
    return;
  }

  board[row][col] = currentPlayer;
  if (checkWin(currentPlayer)) {
    console.log(`${currentPlayer} has won the game!`);
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
});

function checkWin(player) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
    return true;
  }
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
    return true;
  }

  return false;
}
