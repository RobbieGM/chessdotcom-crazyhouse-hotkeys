// ==UserScript==
// @name         Chess.com Crazyhouse Hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use the keyboard to highlight crazyhouse/bughouse piece drops.
// @author       Robbie Moore
// @match        https://www.chess.com/live
// @grant        none
// ==/UserScript==

const KEY_TO_PIECE_MAP = {
  a: "p",
  s: "n",
  d: "b",
  f: "r",
  g: "q",
};

/**
 * Selects a piece by its element and highlights it in the chess.com interface.
 * @param {HTMLElement} piece
 */
function selectPieceByElement(piece) {
  piece.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  setTimeout(
    () => piece.dispatchEvent(new MouseEvent("mouseup", { bubbles: true })),
    1
  );
}

function getUserColor() {
  const isWhite =
    document.querySelector(
      "#board-layout-player-bottom .board-player-default-white"
    ) != null;
  return isWhite ? "white" : "black";
}

function selectPieceByType(type) {
  const datasetColor = getUserColor() == "white" ? "1" : "2";
  const element = document.querySelector(
    `img.crazyhouse-piece[data-type='${type}'][data-color='${datasetColor}']`
  );
  if (element == null) {
    return; // That piece doesn't show up because it's not in hand
  }
  selectPieceByElement(element);
}

document.body.addEventListener("keydown", (event) => {
  const isFocusedOnInput = document.activeElement instanceof HTMLInputElement;
  if (!isFocusedOnInput && event.key in KEY_TO_PIECE_MAP) {
    const piece = KEY_TO_PIECE_MAP[event.key];
    selectPieceByType(piece);
  }
});
