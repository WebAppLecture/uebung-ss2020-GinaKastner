# Übung 2 - HTML und Interaktion #

Starter Code:
 * **[calculator.html](calculator.html)**
 * **[Calculator.js](Calculator.js)**
 * **[index.js](index.js)**


Diese Dateien müssen nicht verändert werden:
 * **[calculator.css](calculator.css)**
 * **[main.css](main.css)**

## 00 Vorbereitung ##

* Wechselt zum `master` Branch und erstellt einen neuen Branch für die heutige Übung. z.B. `Ü2-bearbeitung`

## 01 Ziffernblock: Tasten ##

Betrifft: **[calculator.html](calculator.html)**

Erstelle einen Ziffernblock, wie er auf einem Taschenrechner zu finden ist. (vgl. Num-pad auf der Tastatur)
 * Eine Taste für die Ziffern 0 bis 9
 * Das Tastenfeld sollen aus Reihen mit je drei Tasten bestehen

Wie geht das?
 * In **[calculator.html](calculator.html)** findet ihr die `<div>` mit der Klasse `class='numpad'`, alles was ihr jetzt erstellt kommt in dieses Element
 * Jede Taste wird durch ein `<button>` Element dargestellt
 * Der Inhalt des Elements ist der Text der Taste
 * Um die Tasten in Zeilen anzuornen, verwende den Zeilenumbruch `<br>`.

## 02 Javascript Setup ##

Betrifft: **[calculator.html](calculator.html)**, **[index.js](index.js)**

Heute kümmert ihr euch selbst darum dass euer Javascript auch geladen wird.
* Fügt im HTMl eine `<script>` Tag ein
    * `type='module'` da wir Javascript in ES6 Modulen schreiben
    * `src='./index.js'`, Relativpfad zu unserem Javascript
* importiert `Calculator` in `index.js`
    * `import { Calculator }` named import, wir benutzen keinen `default` Export
    * `from './Calculator.js'` Relativpfad zum Modul. **VSC's Autoimport lässt das `.js` weg, achtet immer darauf dass die Endung nicht fehlt**
* fügt `Calculator` dem globalen Namespace hinzu, damit wir aus der Konsole darauf zugreifen können.
    * `window.Calculator = Calculator;`

## 04 Autostart und querySelector ##

Betrifft: **[Calculator.js](Calculator.js)**, **[index.js](index.js)**

Wie ihr im Starter seht, erwartet der Konstruktor von `Calculator` drei Parameter. Dies sind Referenzen auf die jeweiligen HTML Elemente. Wir wollen, dass eine Instanz von `Calculator` aufgerufen wird wenn wir `calculator.html` aufrufen.

Erstellt dafür in `index.js` eine neue Instanz von `Calculator` und fügt sie dem globalen Namespace hinzu
* `window.calc = new Calculator();`

Der Konstruktor von `Calculator` erwartet aber drei Parameter: `numpad`, `outputCalc` und `outputSolution`
* Dies sind Referenzen auf die jeweiligen HTML Elemente die für Input und Output verwendet werden
* Verwendet den `document.querySelector()` um diese Referenzen zu erstellen und dem Konstruktor zu übergeben
    * `#selector` selektiert das Element mit `id="selector"`
    * `.selector` selektiert das Element mir `class="selector"`

Speichert im Konstruktor die übergebenen Referenzen mit `this` als Attribute der Instanz
* z.B. `this.numPad = numPad;`

## 05 Ziffernblock Interaktion ##

Betrifft: **[Calculator.js](Calculator.js)**

Wir wollen, dass unsere `Calculator` Instanz reagiert wenn wir auf Tasten unseres schönen Ziffernblocks drücken.

Fügt dem Konstruktor einen Aufrufe der `setupNumpad` Methode hinzu
* Methoden innerhalb einer Klasse müssen mit `this` aufgerufen werden `this.setupNumpad()` 

Fügt in `setupNumpad` für jede Taste einen Listener hinzu der bei einem Klick auf das Element die Methode `onButtonClick()` aufruft
* Eine Liste aller Tasten findet ihr in `this.numPad.children`
* Iteriert mit einer Schleife über diese Liste
* Fügt in der Schleife jedem Element einen Listener `element.addEventListener(param1, param2)` hinzu
    * param1 ist das zu beobachtende Event, hier: `'click'`
    * param2 ist die **Callback** Funktion die ausgeführt werden soll wenn der Listener feuert
* Fügt in `onButtonClick` einen `console.log()` hinzu der in der Konsole ausgibt welche Taste gedrückt wurde
      
**Callbacks** können als anonyme Funktion oder Referenz definiert werden.

Anonyme Funktionen:
* klassisch: `function(event) { this.onButtonClick(event) }`
* Fat Arrow Syntax: `event => this.onButtonClick(event)`

Referenz: `this.onButtonClick.bind(this)`
* `bind(this)` stellt sicher, dass Aufrufe von `this` innerhalb von `onButtonClick` sich auf die Instanz von `Calculator` beziehen und nicht auf den Listener

## 06 (BONUS) Ziffernblock erweitert ##

Betrifft: **[Calculator.js](Calculator.js)**

Falls du den Ziffernblock manuell erstellt hast, ersetze dies nun mit einem programmatischen Ansatz. d.h. generiere in `setupNumpad` mit einer Schleife die Buttons. Verbinde dies sinnvoll mit dem Setzen der Listener auf diesen Elementen. 

Erweitere das NumPad (das layout kannst du dir aussuchen)
* Eine Taste für jede Rechenart die ihr gestern in `MyMath` implementiert habt
* Zusätzlich eine Taste `AC`, die alle Eingaben zurücksetzt.

Schau dir auch die CSS Regel `.flex-4` in **[calculator.css](calculator.css)** an. Diese kannst du verwenden um das Numpad ohne `<br>` in Zeilen zu packen.

## 07 (BONUS) Taschenrechner ##

Füge die din `MyMath` implementierten Rechenoperationen hinzu.

Implementiere folgende Funktionalität:

* Der erste Klick auf eine Zahl erzeugt eine Instanz von Number mit diesem Wert.
* Die Abfolge von Klicks auf eine Rechenoperation und dann eine Zahl soll die entsprechende Rechenoperation auf dieser Instanz ausführen.
* Der jeweilige Wert der Instanz soll in mit `printSolution(string)` in der `#solution` textarea angezeigt werden.
* Der gesamte Rechenweg soll mit `print(string)` in der `#calculation` textarea angezeigt werden
* Ein Klick auf `AC` löst `clear()` auf, das beide textareas leert

## 08 (BONUS) Taschenrechner++ ##

Dir ist echt langweilig, und du brauchst eine Herausforderung.

Die obige Implementierung kann nur Ziffern verrechnen und kann keine Eingaben Rückgängig machen. Buh, langweilig!

Hey, 'einfache' Lösung: Wir schreiben einfach nur mit was der User auf dem Tastenfeld so treibt, dann können wir mit einer `DEL` Taste einfach Eingaben weglöschen, ist ja nur Text. Die Berechnung machen wir dann am Ende wenn er auf eine `=` Taste drückt. Simpel. 

Ahja, dann müssen wir aber jetzt Javascript erklären wie es z.B. `"1x1+5/7+3-7/2"` verstehen kann.

Naja wie wärs mit `eval("1x1+5/7+3-7/2")`? 
Geht, ja... aber `eval()` ist böse, damit kann man auch Text als Javascript ausführen und das ist keine Möglichkeit die ihr euren Usern zur Verfügung stellen sollt.

Außerdem ist das ja viel zu einfach, dir ist ja schließlich langweilig sonst wärst du nicht soweit unten in der Übung.

Also auf, ein Parser muss her.
Parser Input: Der inhalt der textarea `#calculation`
Parser Output: Das Ergebnis der Rechnung (Kleine Abweichungen zu `eval(x)` können entstehen, Gleitkommarechnung in Javascript ist keine genaue Wissenschaft auf der n-ten Stelle hinterm Komma)

Es gibt je ein :star: ins Heft für:
* Operatorrangfolge (Punkt vor Strich und so) kann ich beliebig ändern, Operatorrangfolge definiert ihr bitte in `MyMath.js`
* Dem Parser ist es egal wenn ich in `MyMath` neue Rechenoperationen hinzufüge, er rechnet trotzdem korrekt
* die Parserklasse kann das alles und ist unter 30 Zeilen, Erweiterungen in `MyMath` sind unter 15 Zeilen (sauberer ES6 Code)