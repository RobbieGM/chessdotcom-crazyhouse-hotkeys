// ==UserScript==
// @name         Chess.com Crazyhouse Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use the keyboard to highlight crazyhouse/bughouse piece drops.
// @author       Robbie Moore
// @match        https://www.chess.com/game/live/*
// @match        https://www.chess.com/play/online
// @grant        none
// ==/UserScript==

const KEY_TO_PIECE_MAP = { // 5 6 7 8 9 free
  a: "p",
  s: "n",
  d: "b",
  f: "r",
  g: "q",
};

let currentlySelectedPieceType = null;

/**
 * Selects a piece by its element and highlights it in the chess.com interface.
 * @param {HTMLElement} piece
 */
function clickPieceElement(piece) {
  piece.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
  setTimeout(
    () => piece.dispatchEvent(new MouseEvent("pointerup", { bubbles: true })),
    1
  );
}

function getUserColor() {
  const isWhite = !document.querySelector('wc-chess-board').classList.contains("flipped");
  return isWhite ? "white" : "black";
}

function deselect() {
  currentlySelectedPieceType = null;
  document.body.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
}

async function selectPieceByType(type) {
  if (currentlySelectedPieceType == type) {
    deselect();
    return;
  }
  const colorLetter = getUserColor() == "white" ? "w" : "b";
  const pieceClass = colorLetter + type;
  const element = document.querySelector(`div.hand-piece.${pieceClass}`);
  if (element == null) {
    return; // That piece doesn't show up because it's not in hand
  }
  if (currentlySelectedPieceType != null) {
    // Deselect before selecting new piece to avoid glitches
    deselect();
    // await new Promise((res) => setTimeout(res, 100));
  }
  clickPieceElement(element);
  currentlySelectedPieceType = type;
}

document.body.addEventListener("keydown", (event) => {
  const isFocusedOnInput = document.activeElement instanceof HTMLInputElement;
  if (!isFocusedOnInput && event.key in KEY_TO_PIECE_MAP) {
    const piece = KEY_TO_PIECE_MAP[event.key];
    selectPieceByType(piece);
    event.stopImmediatePropagation(); // Prevent board emoji from showing up
  }
});
