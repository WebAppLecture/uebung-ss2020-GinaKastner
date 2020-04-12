import {MyMath} from "../01-MyMath/MyMath.js";

export class Calculator {

    constructor(numpad, outputCalculation, outputSolution) {
        this.numpad = numpad;
        this.outputCalculation = outputCalculation;
        this.outputSolution = outputSolution;
        this.setupNumPad();
    }

    setupNumPad() { 
        let numpad = document.querySelector(".numpad");
        let symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "+", "-", "*", "/", "^", "!", "AC"];
        
        //Add operations and AC.
        for(let i = 0; i < symbols.length; i++) {
            let button = document.createElement("button");
            button.innerHTML = symbols[i];
            button.addEventListener("click", event => this.onButtonClick(event));
            numpad.appendChild(button);
        }
    }

    onButtonClick(symbol) {
        var buttonText = symbol.target.innerHTML;
        console.log(buttonText);
        
        switch(buttonText) {
            //Clear.
            case "AC": this.clear(); break;

            //Faculty: Special case, since only operation that has no input paramter.
            case "!": {
                this.currentOperation = this.currentCalculation.faculty.bind(this.currentCalculation);
                let result = this.currentOperation().value;
                this.printSolution(result);
                break;
                };

            //Operations with input paramter.    
            case "+": this.currentOperation = this.currentCalculation.add.bind(this.currentCalculation); break;
            case "-": this.currentOperation = this.currentCalculation.subtract.bind(this.currentCalculation); break;
            case "*": this.currentOperation = this.currentCalculation.multiply.bind(this.currentCalculation); break;
            case "/": this.currentOperation = this.currentCalculation.divide.bind(this.currentCalculation); break;
            case "^": this.currentOperation = this.currentCalculation.pow.bind(this.currentCalculation); break;
            
            //Default: For first number create new MyMath instance, for any other number execute operation.
            default: {
                if(!this.currentCalculation) {
                    this.currentCalculation = new MyMath(buttonText);
                }
                else {
                    let result = this.currentOperation(buttonText).value;
                    this.currentOperation = undefined;
                    this.printSolution(result);
                }
            }
        }
        if(buttonText != "AC") this.print(buttonText);
    }

    print(string) {
        this.outputCalculation.innerHTML += string;
        console.log(this.outputCalculation);
    }

    printSolution(string) {
        this.outputSolution.innerHTML = "=" + string;
        console.log(this.outputSolution);
    }

    clear() {
        this.currentCalculation = undefined;
        this.outputCalculation.innerHTML = "";
        this.outputSolution.innerHTML = "";
    }
}
