import { KeyBoard, Note } from "./src/js/Keyboard.js";

window.keyBoard = new KeyBoard(document.querySelector(".keys"), document.querySelector("#volume"), document.querySelector("#decay"), document.querySelector("#osci1"), document.querySelector("#osci2"), document.querySelector("#detune"));

window.Note = Note;