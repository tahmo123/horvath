# Dokumentation: Testautomatisierung für die Vehicle Insurance Web App

## 1. Projektüberblick

Ziel des Projekts ist die End-to-End-Testautomatisierung einer Fahrzeug-Versicherungsapplikation mithilfe von **Nightwatch.js**. Die Testfälle decken verschiedene Versicherungsszenarien ab. Zusätzlich wurde eine **CI/CD-Integration mit Travis CI** realisiert, um automatisierte Tests bei jedem Commit/Push auszuführen.

---

## 2. Projektstruktur und -dateien

```
horvath/
├── node_modules/
├── tests/
│   ├── csvReader.js
│   ├── engineperformance.js
│   ├── Scenarios_Vehicle_Insurance_App.csv
│   └── testdata.js
├── tests_output/
│   └── nightwatch-html-report/
│   └── ...
├── .travis.yml
├── nightwatch.conf.js
├── package.json
├── README.md
└── dummy.txt
```

**Wichtige Dateien:**

- `engineperformance.js`: Zentrales Nightwatch-Testskript für alle Szenarien.
- `testdata.js`: Alle Testszenarien mit dynamisch generierten Testdaten (z. B. Namen, Geburtsdaten).
- `Scenarios_Vehicle_Insurance_App.csv`: Enthält Testdaten als CSV-Grundlage.
- `nightwatch.conf.js`: Konfiguration für Testausführung (Browser, Reporter, usw.).
- `.travis.yml`: Travis-CI-Config für automatisierten Build/Test-Lauf.
- `tests_output/`: Enthält automatisch generierte Berichte & Logs.

---

## 3. Testautomatisierung mit Nightwatch.js

### 3.1. Testdatenverwaltung

Die Datei `testdata.js` beinhaltet sämtliche Szenarien als JavaScript-Objekt. Testdaten werden **dynamisch generiert**, um realitätsnahe Tests zu gewährleisten (verschiedene Namen, Geburtsdaten, usw.).

**Beispiel eines Szenarios:**

```js
const scenarios = {
  straightThrough: {
    make: "Audi",
    enginePerformance: 500,
    // ...
    firstName: "John",
    lastName: "Doe",
    birthdate: getBirthdate(26),
    gender: "Male",
    // ...
  },
  // Weitere Szenarien ...
};
```

### 3.2. Testskript

Das Skript `engineperformance.js` liest alle Szenarien aus und führt sie automatisch im Browser aus. Es werden sämtliche Formulare ausgefüllt, Optionen selektiert und der komplette Angebotsprozess inklusive Bestätigung getestet.

**Kernpunkte:**

- Jede Ausführung nutzt frische, konsistente Testdaten.
- Nach jedem Szenario wird die Seite neu geladen (**Clean State**).
- Die Resultate werden im HTML-Report abgelegt.

---

## 4. CI/CD Integration mit Travis CI

### 4.1. Travis Konfiguration

**.travis.yml**

```yaml
language: node_js
node_js:
  - "18"
install:
  - npm install
script:
  - ./node_modules/.bin/nightwatch --env chrome tests/engineperformance.js
```

- **Build & Test:** Travis installiert die Abhängigkeiten und führt dann das Nightwatch-Testskript in Google Chrome im Headless-Modus aus.
- **Berichte:** Die Testergebnisse werden als HTML im `tests_output`-Verzeichnis gespeichert.

### 4.2. GitHub & Travis

- Das Repository ist mit Travis CI per GitHub App & Webhook verbunden.
- Jeder Push auf den Hauptbranch (`main`) löst automatisch einen Build und Testlauf aus.
- Die Travis-Weboberfläche zeigt den Status und Logs für jeden Commit.

---

## 5. Projekteinrichtung (lokal & CI/CD)

**Lokal:**

1. **Node.js (mind. v18) installieren.**
2. **Projekt klonen:**
    ```bash
    git clone https://github.com/tahmo123/horvath.git
    ```
3. **Abhängigkeiten installieren:**
    ```bash
    npm install
    ```
4. **Tests lokal ausführen:**
    ```bash
    npx nightwatch --env chrome tests/engineperformance.js
    ```

**Im CI/CD (Travis):**

- Nach jedem Push an GitHub wird der Build auf Travis automatisch gestartet (sofern Travis aktiviert ist und der Plan dies erlaubt).

---

## 6. Troubleshooting / Hinweise

- **Timeouts beim Testen:** Pausen (`.pause()`) nach Klicks ggf. erhöhen, wenn UI/Netzwerk langsam ist.
- **Elemente nicht sichtbar/klickbar:** Überprüfen, ob die richtigen Selectors und Ladezeiten gesetzt sind.
- **Travis CI Plan:** Öffentliche Repos sind im Free Plan oft beschränkt, Build-Kontingente beachten!
- **Browser:** Default ist Chrome Headless (kann im Nightwatch-Config geändert werden).

---

## 7. Anhang: Beispiel-Testablauf

1. Test startet, öffnet die Zielseite.
2. Formulare werden mit aktuellen Testdaten befüllt.
3. Angebot wird angefordert, Pop-up mit Bestätigung geprüft.
4. Nächstes Szenario startet nach Seitenreload.
5. Ergebnisse werden im HTML-Report gespeichert.

---

## 8. Kontakt

**Autor:**  
Khorzad - Gruppe 5   
[GitHub-Projekt](https://github.com/tahmo123/horvath)
