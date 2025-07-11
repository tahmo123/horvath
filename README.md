# Dokumentation: Testautomatisierung für die Vehicle Insurance Web App

---

## 1. Einleitung und Zielsetzung

Diese Dokumentation beschreibt Konzept, technische Umsetzung und Betrieb der automatisierten End-to-End-Tests für die Vehicle Insurance Web App.  
**Ziel:** Die Qualität der Anwendung kontinuierlich und nachvollziehbar abzusichern, sodass Fehler schnell erkannt und vor einem Release behoben werden können.

Moderne Webanwendungen werden ständig weiterentwickelt und neue Features müssen schnell, zuverlässig und in gleichbleibender Qualität ausgeliefert werden. Testautomatisierung sorgt dafür, dass sowohl neue als auch bestehende Funktionen stabil bleiben. Die Integration in einen CI/CD-Prozess ermöglicht dabei eine kontinuierliche Überwachung aller Kernfunktionen.

---

## 2. Projektüberblick

### 2.1 Motivation

Automatisierte Tests sind entscheidend, um Wartbarkeit, Stabilität und Weiterentwicklung von Webanwendungen zu sichern.  
Ein CI/CD-Workflow prüft nach jedem Code-Update automatisiert die wichtigsten Kernprozesse.

**Hintergrund:**  
Manuelle Tests sind zeitaufwändig und fehleranfällig, insbesondere bei komplexen Anwendungen oder häufigen Änderungen. Durch automatisierte Tests wird sichergestellt, dass bestehende Funktionalitäten nach Updates weiterhin wie gewünscht funktionieren (Regressionstests).

**Begründung für die Toolwahl:**  
Nightwatch.js bietet eine gute Integration mit JavaScript-Stacks und eine einfache Syntax. Travis CI ist ein etabliertes CI/CD-Tool mit einfacher Anbindung an GitHub.

### 2.2 Zielgruppe dieser Dokumentation

Diese Doku richtet sich an Entwickler und IT-Fachkräfte (Bachelor-Niveau), die mit Softwareentwicklung, Versionierung (Git), Node.js und Webtechnologien vertraut sind. Detailliertes Spezialwissen zu Nightwatch.js oder Travis CI ist nicht erforderlich, die wichtigsten Konzepte werden im Verlauf erklärt.

---

## 3. Technischer Stack & Komponenten

- **Nightwatch.js:** Framework für End-to-End-Browserautomatisierung mit JavaScript/Node.js.  
  Vorteile: Einfaches Setup, umfangreiche Dokumentation, unterstützt verschiedene Browser, Integration mit Selenium/Webdriver möglich.
- **Travis CI:** Automatisiert Build- und Testprozesse bei jedem Commit/Push.  
  Vorteile: Cloudbasiert, kostenlos für Open-Source-Projekte, einfache Konfiguration über `.travis.yml`.
- **GitHub:** Zentrales Repository und Trigger für die Pipeline.  
  Nutzung von Branches für Features, Pull Requests und Zusammenarbeit.
- **Chrome Headless:** Browser für automatisierte Tests, läuft ohne UI.  
  Vorteile: Ressourcenarm, kein GUI notwendig, ideal für CI/CD-Umgebungen.
- **Test-Reports:** Automatische Auswertung und Darstellung der Ergebnisse (HTML).  
  Die Reports geben einen Überblick über alle durchgeführten Tests, fehlerhafte Szenarien werden sofort sichtbar.

**Erweiterungsoptionen:**  
- Die Architektur ist offen für weitere Tools (z.B. Integration mit Slack für Benachrichtigungen, Umstellung auf GitHub Actions, Reporting-Erweiterungen).

---

## 4. Projektstruktur

Die wichtigsten Verzeichnisse und Dateien im Projekt:

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
├── .travis.yml
├── nightwatch.conf.js
├── package.json
├── README.md
└── dummy.txt
```

**Kurzbeschreibung:**
- `engineperformance.js`: Zentrales Testskript (Nightwatch.js) mit allen Testfällen.
- `testdata.js`: Szenarien und Testdaten (dynamisch generiert).
- `Scenarios_Vehicle_Insurance_App.csv`: Testdaten-Quelle, Pflege und Erweiterung von Testszenarien.
- `nightwatch.conf.js`: Konfigurationsdatei für Nightwatch.js (Browser, Reporter).
- `.travis.yml`: CI/CD-Steuerdatei für Travis.
- `tests_output/`: Automatisch erzeugte Test-Reports und Logs.

**Best Practice:**  
Alle Änderungen an Testdaten oder Testskripten sollten über Pull Requests eingespielt werden, um eine Review durch Teammitglieder zu ermöglichen.

---

## 5. Ablauf: Von Code bis Testreport

### 5.1 Testdatenverwaltung

Alle Testfälle werden als JavaScript-Objekte in `testdata.js` abgelegt, ergänzt durch CSV-Import aus `Scenarios_Vehicle_Insurance_App.csv` für größere Szenarienmengen.  
Testdaten (z. B. Name, Geburtsdatum, Fahrzeugdaten) werden zur Laufzeit generiert oder aus der CSV gelesen.

**Beispiel für die dynamische Generierung:**
```js
function getBirthdate(age) {
  const today = new Date();
  return `${today.getFullYear() - age}-${today.getMonth()+1}-${today.getDate()}`;
}

const scenarios = {
  basicCase: {
    make: "Volkswagen",
    enginePerformance: 120,
    firstName: "Max",
    lastName: "Mustermann",
    birthdate: getBirthdate(29),
    gender: "Male",
    // ...
  }
};
```

**Vorteile der dynamischen Testdaten:**  
- Mehr Testabdeckung durch variierende Daten
- Vermeidung von "statischen" Fehlern durch immer gleiche Werte
- Simulation realistischer Userdaten

**Tipp:**  
Bei größeren oder wiederkehrenden Szenarien empfiehlt sich die Pflege in der CSV, weil sie einfacher zu bearbeiten und zu versionieren ist.

### 5.2 Testdurchführung mit Nightwatch.js

- Das Skript `engineperformance.js` liest Testfälle/Szenarien ein.
- Pro Szenario wird:
  - Die Anwendung im Browser (Headless Chrome) geöffnet
  - Alle Formulare automatisiert ausgefüllt (inkl. Validierung von Pflichtfeldern, Auswahl von Dropdowns, etc.)
  - Geschäftsregeln (z. B. Preise, Angebotsbestätigungen) geprüft
  - Nach jedem Durchlauf: Seite/Browsertab zurückgesetzt (Clean State), um Seiteneffekte zwischen Szenarien zu vermeiden.

**Ablauf im Testskript:**  
1. Initialisierung der Testumgebung und Laden der Testdaten  
2. Durchlaufen jedes Szenarios (Daten befüllen, Aktionen durchführen)  
3. Validierung der erwarteten Ergebnisse (z.B. Preis, Angebotsnummer)  
4. Fehlerlogging und Reporting (mit Screenshot bei Fehler)

**Vorteile:**  
- Automatisierte Tests laufen auch nachts oder am Wochenende, niemand muss manuell testen.
- Fehler werden schnell gefunden und können anhand der Reports gezielt nachvollzogen werden.

**Hinweis:**  
Nightwatch.js bietet die Möglichkeit, eigene Commands oder Custom Assertions zu schreiben, um komplexe Validierungen (z.B. Plausibilitätsprüfungen für Versicherungsprämien) zu integrieren.

### 5.3 CI/CD-Prozess mit Travis CI

- Jeder **Push**/Commit auf GitHub löst die Pipeline aus (Webhook).
- Travis installiert Dependencies und führt das Nightwatch-Testskript aus.
- Ergebnisse werden als HTML-Report generiert.
- Build-Status und Logs werden in Travis und GitHub angezeigt.

**Vorteile des CI/CD-Workflows:**  
- Fehler werden früh im Entwicklungsprozess erkannt (Shift Left Testing)
- Entwickler erhalten unmittelbares Feedback nach jedem Commit
- Die Testpipeline ist immer reproduzierbar (gleiche Node.js-Version, gleiche Abhängigkeiten)

**Travis-Config Beispiel:**
```yaml
language: node_js
node_js:
  - "18"
install:
  - npm install
script:
  - ./node_modules/.bin/nightwatch --env chrome tests/engineperformance.js
```
**Erweiterungsideen:**  
- Integration weiterer Stages (z.B. Deployment nach erfolgreichem Test)
- Einbindung von Benachrichtigungen (E-Mail, Slack, Teams)
- Nutzung von Matrix-Builds für verschiedene Browser/Umgebungen

---

## 6. Lokale Ausführung & Entwickler-Workflow

**Setup (Schritte für lokale Entwicklung):**
1. Node.js v18+ installieren.
2. Repository klonen:  
   `git clone https://github.com/tahmo123/horvath.git`
3. Abhängigkeiten installieren:  
   `npm install`
4. Tests lokal ausführen:  
   `npx nightwatch --env chrome tests/engineperformance.js`
5. Ergebnisse ansehen im Ordner `tests_output/nightwatch-html-report`.

**Ergänzung:**  
- Für die lokale Ausführung ist ein installierter Chrome-Browser notwendig.
- Die Ausführung in Docker-Containern ist möglich (z.B. für reproduzierbare Build-Umgebungen oder wenn mehrere Versionen getestet werden sollen).
- Lokale Tests sind wichtig, um Fehler vor dem Push zu erkennen und schnell zu debuggen.

**Best Practice:**  
Vor jedem Push sollten alle Tests lokal erfolgreich durchlaufen, um Fehler frühzeitig zu erkennen.

**Empfehlung:**  
Regelmäßig die Abhängigkeiten (`package.json`) prüfen und Nightwatch.js sowie andere Pakete aktuell halten, um Sicherheitslücken zu vermeiden.

---

## 7. Fehlerbehandlung & Troubleshooting

- **Timeouts:**  
  ggf. Wartezeiten (`.pause()`, `waitForElementVisible`) erhöhen, vor allem bei langsamer Umgebung oder komplexen Formularen.
- **Elemente nicht auffindbar:**  
  Selektoren (CSS/XPath) prüfen, Ladezeiten anpassen. Nutzen von `waitForElementPresent` oder `waitForElementVisible` empfiehlt sich.
- **Travis Build schlägt fehl:**  
  Logfiles im Travis-Webinterface prüfen, ggf. lokale Ausführung testen. Häufige Ursachen sind geänderte Abhängigkeiten oder fehlende Umgebungsvariablen.
- **Konflikte bei Git Push:**  
  Immer zuerst `git pull` und Konflikte manuell im Editor lösen. 
- **Browser-/Umgebungskonflikte:**  
  Unterschiedliche Versionen von Node.js, Nightwatch.js oder Chrome können zu Abweichungen führen. Im CI/CD immer feste Versionen deklarieren.

**Weitere Tipps:**  
- Fehlerhafte Szenarien sollten im HTML-Report klar hervorgehoben und – wenn möglich – mit Screenshot dokumentiert werden.
- Bei wiederkehrenden Fehlern lohnt es sich, Testdaten, Netzwerkbedingungen oder Browserversionen zu überprüfen.
- Tests können temporär mit `.skip()` übersprungen werden, bis ein Bug gefixt ist – so bleibt die Pipeline grün, bis das Problem gelöst ist.

---

## 8. Erweiterung & Anpassung

- **Neue Testszenarien:**  
  Testdaten in `testdata.js` oder der CSV ergänzen. Sinnvoll ist eine klare Namensgebung und kurze Beschreibung der Szenarien.
- **Weitere Browser:**  
  Anpassung in `nightwatch.conf.js` (Edge, Firefox etc.), ggf. Nutzung externer Selenium Grids oder Browserstack für Cross-Browser-Tests.
- **Andere CI/CD Tools:**  
  Die vorhandene Struktur kann mit GitHub Actions, Jenkins, GitLab CI genutzt werden. Für die Umstellung muss meist nur die Pipeline-Konfigurationsdatei angepasst werden.
- **Reporting:**  
  Erweiterbar um Screenshots, zusätzliche Auswertungen, E-Mail-Versand der Reports oder Einbindung in Dashboards.
- **Security & Datenschutz:**  
  Bei sensiblen Testdaten empfiehlt sich der Einsatz von Dummy-Daten oder die Maskierung personenbezogener Informationen.

**Erweiterungspotential:**  
- Automatisches Erstellen von Testfällen durch KI/ML-Methoden.
- Integration von API-Tests für Backendschnittstellen.
- Automatisches Deployment nach erfolgreichem Test (Continuous Deployment).

---

## 9. Visualisierung des Gesamtprozesses

Nachfolgend die grafische Darstellung des Ablaufs (PNG im Repo):

![Testablauf Diagramm](Diagramm/Gruppe5-Karte.png)

**Hinweis:**  
Das Diagramm illustriert den End-to-End-Prozess von Commit über Testausführung bis zum Testergebnis.

---

## 10. Wichtige Begriffe

- **End-to-End-Test (E2E):**  
  Ein Testfall, der die Anwendung wie ein echter Nutzer komplett durchläuft (z. B. von Anmeldung bis Abschluss einer Versicherung). E2E-Tests decken Frontend, Backend und Integration mit Drittsystemen ab.
- **CI/CD:**  
  Automatisiertes Zusammenführen (Continuous Integration) und Ausliefern (Continuous Delivery/Deployment) von Software nach jedem Update. Ziel ist es, Software iterativ, schnell und sicher auszuliefern.
- **Headless-Browser:**  
  Browser läuft ohne Benutzeroberfläche, wird für automatisierte Tests auf Servern eingesetzt. Typisch sind Chrome Headless oder Firefox Headless.
- **Regressionstest:**  
  Tests, die sicherstellen, dass neue Änderungen keine bestehenden Funktionen beschädigen.
- **Pipeline:**  
  Abfolge von automatisierten Schritten (Build, Test, Deploy) nach einem Commit/Push.
- **Testdatenmanagement:**  
  Die Organisation und Pflege von Daten, die für die Testausführung benötigt werden.

---

## 11. Typischer Ablauf (Zusammenfassung für die Präsentation)

1. Entwickler pusht Änderungen nach GitHub.
2. Travis CI erkennt den Push und startet automatisch alle Tests.
3. Nightwatch.js simuliert echte Nutzereingaben und prüft die App im Browser.
4. Ergebnisse werden im HTML-Report dokumentiert.
5. Status und Logs sind für das Team sofort sichtbar.
6. Bei Fehlern können Reports analysiert und Korrekturen direkt vorgenommen werden.

**Vorteile für das Team:**  
- Transparenz über den Qualitätsstatus der Anwendung
- Fehler werden sofort gemeldet und können vor dem Release behoben werden
- Die Testdokumentation hilft bei Einarbeitung neuer Teammitglieder

---

## 12. FAQ

**Kann ich Tests lokal ausführen?**  
Ja, über die Nightwatch-Befehle (`npx nightwatch ...`) und mit Node.js v18+.

**Was passiert, wenn ein Test fehlschlägt?**  
Der Fehler wird im HTML-Report und im Travis-Log angezeigt. Das Deployment wird abgebrochen.

**Wie ergänze ich neue Testdaten?**  
In `testdata.js` als neues Objekt oder per Eintrag in der CSV-Datei.

**Wie kann ich die Pipeline für mehrere Browser nutzen?**  
Entsprechende Umgebungen in `nightwatch.conf.js` konfigurieren, ggf. Matrix-Builds in Travis nutzen.

**Wie kann ich die Berichte weiterverwenden?**  
Reports lassen sich archivieren, mit Screenshots versehen und z.B. per E-Mail oder Slack ans Team senden.

---

## 13. Kontakt

Autor:  
tahmo123 / horvath  
[GitHub-Projekt](https://github.com/tahmo123/horvath)

---
