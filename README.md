Dokumentation: Testautomatisierung für die Vehicle Insurance Web App

1. Projektüberblick
   
Ziel des Projekts ist die End-to-End-Testautomatisierung einer Fahrzeug-Versicherungsapplikation mithilfe von Nightwatch.js. Die Testfälle decken verschiedene Versicherungsszenarien ab. Zusätzlich wurde eine CI/CD-Integration mit Travis CI realisiert, um automatisierte Tests bei jedem Commit/Push auszuführen.

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

Wichtige Dateien:

  engineperformance.js: Zentrales Nightwatch-Testskript für alle Szenarien.

  testdata.js: Alle Testszenarien mit dynamisch generierten Testdaten (z. B. Namen, Geburtsdaten).

  Scenarios_Vehicle_Insurance_App.csv: Enthält Testdaten als CSV-Grundlage.
  
  nightwatch.conf.js: Konfiguration für Testausführung (Browser, Reporter, usw.).

  .travis.yml: Travis-CI-Config für automatisierten Build/Test-Lauf.

  tests_output/: Enthält automatisch generierte Berichte & Logs.

3. Testautomatisierung mit Nightwatch.js
   
3.1. Testdatenverwaltung

Die Datei testdata.js beinhaltet sämtliche Szenarien als JavaScript-Objekt. Testdaten werden dynamisch generiert, um realitätsnahe Tests zu gewährleisten (verschiedene Namen, Geburtsdaten, usw.).

Beispiel eines Szenarios:

const scenarios = {
  straightThrough: {
    make: "Audi",
    enginePerformance: 500,
    dateOfManufacture: yearsAgo(3),
    numberOfSeats: 5,
    fuelType: "Petrol",
    listPrice: 20000,
    licensePlateNumber: "AB123CD",
    annualMileage: 50000,
    firstName: "John",
    lastName: "Smith",
    birthdate: getBirthdate(26),
    gender: "Male",
    street: "Park Avenue 5",
    country: "United States",
    zipcode: "10001",
    city: "New York",
    occupation: "Employee",
    website: "https://straightthrough.com",
    preferredStartDate: monthsAndDaysFromNow(1, 1),
    insuranceSum: 7000000,
    meritRating: "Bonus 5",
    damageInsurance: "Partial Coverage",
    euroProtection: false,
    legalDefenseInsurance: true,
    courtesyCarOption: "No",
    prices: { silver: 331.0, gold: 977.0, platinum: 1917.0, ultimate: 3652.0 }
  },

3.2. Testskript

Das Skript engineperformance.js liest alle Szenarien aus und führt sie automatisch im Browser aus. Es werden sämtliche Formulare ausgefüllt, Optionen selektiert und der komplette Angebotsprozess inklusive Bestätigung getestet.

Kernpunkte:

  Jede Ausführung nutzt frische, konsistente Testdaten.

  Nach jedem Szenario wird die Seite neu geladen (Clean State).

  Die Resultate werden im HTML-Report abgelegt.

4. CI/CD Integration mit Travis CI
   
4.1. Travis Konfiguration

.travis.yml

language: node_js
node_js:
  - "18"

addons:
  chrome: stable   # Chrome installieren

install:
  - npm install

before_script:
  - export DISPLAY=:99.0
  - sh -e /etc/init.d/xvfb start
  - sleep 3

script:
  - ./node_modules/.bin/nightwatch --env chrome tests/engineperformance.js

  Build & Test: Travis installiert die Abhängigkeiten und führt dann das Nightwatch-Testskript in Google Chrome im Headless-Modus aus.

  Berichte: Die Testergebnisse werden als HTML im tests_output-Verzeichnis gespeichert.

4.2. GitHub & Travis

  Das Repository ist mit Travis CI per GitHub App & Webhook verbunden.

  Jeder Push auf den Hauptbranch (main) löst automatisch einen Build und Testlauf aus.

  Die Travis-Weboberfläche zeigt den Status und Logs für jeden Commit.

5. Projekteinrichtung (lokal & CI/CD)
   
Lokal:
Node.js (mind. v18) installieren.

Projekt klonen:
git clone https://github.com/tahmo123/horvath.git

Abhängigkeiten installieren:
npm install

Tests lokal ausführen:
npx nightwatch --env chrome tests/engineperformance.js

Im CI/CD (Travis):
Nach jedem Push an GitHub wird der Build auf Travis automatisch gestartet (sofern Travis aktiviert ist und der Plan dies erlaubt).

6. Troubleshooting / Hinweise
   
Timeouts beim Testen: Pausen (.pause()) nach Klicks ggf. erhöhen, wenn UI/Netzwerk langsam ist.

Elemente nicht sichtbar/klickbar: Überprüfen, ob die richtigen Selectors und Ladezeiten gesetzt sind.

Travis CI Plan: Öffentliche Repos sind im Free Plan oft beschränkt, Build-Kontingente beachten!

Browser: Default ist Chrome Headless (kann im Nightwatch-Config geändert werden).


8. Kontakt

 Gruppe 5: Tahmoores Khorzad, Korab Thaci, Ahmed-Amir Sultan, Daniel Schneider.
 


