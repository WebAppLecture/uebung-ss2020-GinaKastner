import {Calculator} from "./Calculator.js";

window.Calculator = Calculator;
window.calc  = new Calculator(
    document.querySelector(".numpad"),
    document.querySelector("#calculation"),  
    document.querySelector("#solution")
);
