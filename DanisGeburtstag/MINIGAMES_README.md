# 🎮 Minigame System - Die Verbotene Abteilung

## Übersicht

Ein modulares Escape-Room-System mit 8 zusammenhängenden Minigames, die zu einem emotionalen Finale führen.

## Dateien

- **`library_clean.html`** - Hauptdatei mit SVG-Bibliothek und Modal-HTML
- **`minigames.js`** - Gesamte Spiellogik für alle 8 Minigames
- **`minigames.css`** - Styling für Modals und Minigame-UI

## Spielablauf

### Hub (Bibliothek)
- 8 Slots in den Regalen (4 links, 4 rechts)
- Klick auf Slot öffnet entsprechendes Minigame
- HUD oben zeigt Fortschritt (8 Schlösser)
- Orb in der Mitte zeigt visuelle Fortschritts-Segmente

### Minigame-Flow
1. Slot klicken → Modal öffnet sich
2. Bibliothek wird abgedunkelt (dimmed)
3. Minigame spielen
4. Bei Erfolg: Artefakt erhalten + Slot wird gelöst
5. Modal schließt automatisch
6. Zurück zum Hub

## Die 8 Minigames

### 1. 🧪 Das Polyjuice-Labor (Logik-Gitter)
- **Typ:** Drag & Drop Zuordnung
- **Ziel:** 4 Zutaten den richtigen Kesseln zuordnen
- **Hinweise:** Zerrissene Notizen mit Ausschluss-Logik
- **Fehler:** Explosion-Animation + Reset
- **Belohnung:** 🧪 Beschriftete Phiole

### 2. 🔊 Muffliato – Audio-Balance
- **Typ:** Schieberegler-Rätsel
- **Ziel:** 5 Audio-Spuren balancieren (nur Flüstern auf 100%, Rest auf 0%)
- **Visuell:** Wellenformen beruhigen sich bei korrekter Balance
- **Erfolg:** Stimme flüstert dreistellige Zahl (427)
- **Belohnung:** 🔊 Flüsternde Erinnerung + Zahl

### 3. 📜 Die Bibliothekars-Chiffre (Substitution)
- **Typ:** Runen-zu-Buchstaben Zuordnung
- **Ziel:** Passwort "HAMBURG" entschlüsseln
- **Hinweise:** Kontext-Sätze ("Stadt an der Elbe")
- **Erfolg:** Zahl 193 wird enthüllt
- **Belohnung:** 📜 Pergament mit Zahl

### 4. 🪜 Rotierende Treppen (Geometrisches Labyrinth)
- **Typ:** Isometrisches Puzzle
- **Ziel:** Von Start zu Ziel navigieren
- **Mechanik:** Jede Bewegung rotiert zufällige Treppe
- **Fehler:** Figur fällt → Reset
- **Belohnung:** 🪨 Stein-Token

### 5. 🕯️ Invisible Ink (Physik-Simulation)
- **Typ:** Maus-basierte Hitze-Simulation
- **Ziel:** Notenschlüssel-Muster sichtbar machen
- **Mechanik:** Maus = Kerze, zu lange = Verbrennung
- **Erfolg:** Zahl 851 erscheint
- **Belohnung:** 🎼 Notenblatt + Zahl

### 6. 🔔 Glockenspiel der Hauselfen (Rhythmus & Gedächtnis)
- **Typ:** Simon Says + Reverse
- **Phase 1:** Melodie nachspielen (vorwärts)
- **Phase 2:** Melodie rückwärts spielen
- **Fehler:** Reset bei falscher Note
- **Belohnung:** 🔔 Glocken-Erinnerung

### 7. 📚 Deep-Dive Bücherregal (Sortier-Rätsel)
- **Typ:** Drag & Drop Sortierung
- **Ziel:** 7 HP-Bände in richtiger Reihenfolge
- **Hinweis:** "Vom Stein zum Tod"
- **Mechanik:** Bücher tauschen per Drag & Drop
- **Belohnung:** 📚 Sortierte Bände

### 8. 🌀 Der Denkarium-Code (FINALE)
- **Typ:** Artefakt-Anordnung
- **Ziel:** 4 Erinnerungen in richtiger Reihenfolge platzieren
- **Logik:** Reihenfolge ergibt sich aus Zahlen (Minigame 2, 3, 5)
- **Erfolg:** Video/Bild des echten Geschenks
- **Belohnung:** 🎁 Das Geschenk (Harry Potter Musical Hamburg)

## Technische Features

### Modal-System
```javascript
openMinigame(slotId)   // Öffnet Modal, dimmt Hub
closeMinigame(num)     // Schließt Modal
resetMinigame(num)     // Setzt Minigame zurück
showHint(num)          // Zeigt kontextuellen Hinweis
```

### Game State
```javascript
gameState = {
    solved: [false × 8],           // Gelöste Rätsel
    artifacts: [null × 8],         // Gesammelte Artefakte
    numbers: {                     // Zahlen für Finale
        minigame2: 427,
        minigame3: 193,
        minigame5: 851
    }
}
```

### Feedback-System
```javascript
showMessage(text, type)
// Types: 'success', 'error', 'warning', 'hint', 'info'
```

### Fortschritts-Anzeige
- **HUD Locks:** `#hudLock1` bis `#hudLock8` (🔒 → 🔓)
- **Orb Segments:** `#seg1` bis `#seg8` (dunkel → golden)

## Anpassungen

### Neue Minigames hinzufügen
1. HTML-Modal in `library_clean.html` erstellen
2. Init-Funktion in `minigames.js` schreiben
3. CSS-Styling in `minigames.css` hinzufügen
4. `initMinigame()` Switch erweitern

### Schwierigkeit anpassen
- **Polyjuice:** Mehr Kessel/Zutaten
- **Audio:** Mehr Spuren, engere Toleranz
- **Cipher:** Längeres Passwort
- **Staircase:** Größeres Grid
- **Ink:** Kleineres Muster, engere Hitze-Schwelle
- **Bells:** Längere Melodie
- **Books:** Mehr Bände

### Zahlen ändern
In `minigames.js`:
```javascript
audioState.secretNumber = 427;      // Minigame 2
cipherState.secretNumber = 193;     // Minigame 3
inkState.secretNumber = 851;        // Minigame 5
```

## Finale anpassen

In `revealFinalGift()` (minigames.js):
```javascript
function revealFinalGift() {
    // Hier Video, Bild oder Text einfügen
    alert('🎭✨ HARRY POTTER UND DAS VERWUNSCHENE KIND\n\nHamburg, 2025');
}
```

## Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile: Funktioniert, aber Desktop empfohlen

## Lizenz

Privates Geschenk-Projekt. Nicht für kommerzielle Nutzung.

