# Übung 3 - CSS #

Starter Code:
* **[basic.css](./src/css/basic/basic.css)**
* **[mech-animated-accent.css](./src/css/mech/mech-animated-accent.css)**

Diese Dateien müssen nicht verändert werden:
* Alles andere

## 00 Vorbereitung ##

* Wechselt zum `master` Branch und erstellt einen neuen Branch für die heutige Übung. z.B. `Ü3-bearbeitung`

## 01 Schaut euch erst mal um ##

Euer Ziel wird es heute sein einen weiteren Skin für die **[GameBox](./gamebox.html)** zu erstellen.

**Mit den Zwei Knöpfen unten links könnt ihr zwischen den Skins wechseln.**

Die Übung heute hat umfangreichen Beispielcode um euch das Leben leichter zu machen und euch Anhaltspunkte für euer Vorgehen zu geben.
Alles ist sauber in Ordner verteilt um die Übersicht nicht zu verlieren. Dieses Starterpaket beinhaltet ~20 Dateien, wer soll sich da sonst noch zurecht finden?

Vorgegebene Ordnerstruktur:
* Im root Vereichnis liegt nur diese Anleitung und unser HTML Einsteigspunkt
    * `/src` beinhaltet allen Quellcode
        * `/css` beinhaltet alle Stylesheets
            * Je ein Unterordner für jeden Skin den wir laden können
            * Das zentrale Stylesheet das die anderen importiert heißt jeweils so wie der Ordner
        * `/js` beinhaltet alle Javascript Module

## 02 Zahnrad ##

Betrifft: **[mech-animated-accent.css](./src/css/mech/mech-animated-accent.css)**

Erst erweitern wir eine bestehenden Skin um einen Design Element, damit ihr ein Gefühl für CSS bekommt. Hierzu werden wir das `.accent` Element des `mech` Skins als Zahnrad stylen.

### 02.1 Grundgerüst ###

**Position und Größe**

Als erstes legen wir fest wo das Element sich befindet, und wie groß es ist.

Erweitert die CSS Regel `.accent`
* Das Element soll sich `.5vh` vom rechten Rand seines Elternelements positionieren ( `1vh` entspricht 1% der Höhe des Browserfensters, **v**iewport **h**eight)
* Das Element soll sich `.5vh` vom unteren Rand seines Elternelements positionieren
* Das Element ist `20vh` breit
* Das Element ist `20vh` hoch

**Farbe und Form**

Erweitert die CSS Regel `.accent`
* Die Hintergrundfarbe ist `#777`
* Der Radius der Border beträgt `50%`, das Element ist ein Kreis


### 02.2 Die Div-Box, die hat Zähne ###

Erweitere die CSS Regel `.accent` um den Zahnrad-effekt zu erreichen.
* Die Border: `1vh` breit, gestreift (`dashed`), Farbe `#999`
* Um den Hintergrund nicht hinter der Border zu sehen, setzen wir dessen clip Eingeschaft: `background-clip: padding-box;`

In Google Chrome sieht dies etwas ungleichmäßig aus, in Firefox verteilen sich die "Zähne" perfekt.

### 02.3 Schattenspiel ###

Um dem Zahnrad Plastizität zu verleihen, nutzen wir verschachtelte box-shadows.
```css
box-shadow: 0 0 0 .8vh inset #999, 
    0 0 .5vh 1.2vh inset #666, 
    0 0 .5vh 3vh inset #aaa, 
    0 0 0 3.5vh inset #666, 
    0 0 0 4.5vh inset #999,
    0 0 .5vh 7vh inset #61492b,
    0 0 0 7vh inset black,
    0 0 0 8vh inset #aaa;
```

Fügt die Zeilen einzeln hinzu um zu sehen wie der Effekt Stück für Stück entsteht.
Solche Effekte brauchen viel Erfahrung, ermöglichen aber ohne viele HTML Elemente zu verschachteln plastische Darstellung.

### 02.4 Animation ###

Ereitern nun die Keyframeanimation `@keyframes rotate {...}` im Stylesheet.

Animiert die Rotation von 0° bis 360° mit der `transform: rotate(deg)` Eigenschaft.

Füge `.accent` eine Animation hinzu: `animation: rotate 5s normal linear infinite;`
* `rotate`: Bezeichnet die Keyframeanimation die verwendet werden soll
* `5s`: wie lange dauert ein Durchlauf der Animation
* `normal`: das Zahnrad läuft die Animation von vorne nach hinten durch
* `linear`: die Animation wird linear durchlaufen
* `infinite`: die Animation läuft endlos


### 02.5 Einbettung ###

Jetzt liegt das Zahnrad einfach so auf der GameBox, das geht doch besser.

Wir schneiden ein passendes Loch in das Elternelement indem wir einen teilweise transparenten Verlauf als hintergrund setzten.
Erweitert hierzu die Regel `.gameBox` in **[mech-animated-accent.css](./src/css/mech/mech-animated-accent.css)** um folgenden Code:
```css
background: radial-gradient(
    circle at 100% 100%, 
    transparent 16%, 
    rgb(97, 73, 43) 16.2%, 
    rgb(114, 133, 72) 50%, 
    rgb(97, 73, 43) 100%
);
```
Falls ihr eher ein eckiges Design wollt:
```css
background: linear-gradient(
    -45deg, 
    transparent 16.5%, 
    rgb(97, 73, 43) 16.7%, 
    rgb(114, 133, 72) 50%, 
    rgb(97, 73, 43) 100%
);
```

Nun muss das Zahnrad nur noch so aussehen als ob es in der GameBox ist.

Erweitert `.accent` mit dem Attribut `z-index: -1`, dies sogt dafür, dass `.accent` hinter `.gameBox` gerendert wird.

## 03 Ein eigener Skin ##

Erstellt einen eigenen Skin mit eurem ganz eigenen Stil.
Wichtig ist vor allem eine klare Idee, die sich durch das ganze Design zieht.
Nehmt euch ruhig etwas mehr Zeit eine klare Idee zu fassen. Ein klares Konzept macht Designentscheidungen später einfacher.
Im Fall der Beispiel-Skins:
* `peach`: warme farben und runde Formen
* `gold`: Name ist Programm
* `win95`: klassischer Windows 95 Charme

Vorbereitung:
* Erstellt einen neuen Ordner in `/css` mit dem Namen eures Skins
* fügt ein zentrales Stylesheet mit dem selben Namen hinzu  
* Alle stylesheets sollten mit dem Namen eures Skins beginnen, um bei der Entwicklung verwirrung durch gleiche Namen zu verhindern
* Fügt dem Namen eures Skins dem `skins = []` Array in [index.js](./src/js/index.js) hinzu 
* Ändert den Standard Skin zu eurem Skin `skinChanger.activeSkin = "mySkinName"`
* Seht euch die Stylesheets der anderen Skins an und lasst euch inspirieren (lese: klaut Code)

Kriterien für euren Skin (Nicht verplichtend, solange das Ergebnis passt):
* Verwendet mindestens einen Gradienten
* Verwendet box-shadows um im Stil des Material Designs "3D" Effekte zu erhalten
* Ändert die Form und Farbe des D-Pads (`border-bottom-right-radius: _px _px`, usw erlaubt genaue Kontrolle über Eckradien)
* Tasten ändern ihren Style bei Klicks
* Jedes verwendete Html Element ist mit neuen Styles erweitert

Hilfreiche Links:
[Google Fonts](https://fonts.google.com) (siehe **[mech-variables.css](./src/css/mech/mech-variables.css)** für Import)
[Pure CSS Patterns](https://leaverou.github.io/css3patterns/#) Alles ist möglich