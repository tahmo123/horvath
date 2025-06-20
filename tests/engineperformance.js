const testdata = require('./testdata.js');

module.exports = {
  "Automated Vehicle Insurance Scenarios": function (browser) {
    Object.entries(testdata).forEach(([scenarioName, szenario]) => {
      browser.perform(() => {
        browser
          .url("http://sampleapp.tricentis.com/101/")
          .waitForElementVisible("body", 1000)
          .click("#nav_automobile")

          // Vehicle Data
          .setValue("#make", szenario["Make"] || "Audi")
          .setValue("#engineperformance", szenario["Engine Performance [kW]"] || "120")
          .setValue("#dateofmanufacture", szenario["Date of Manufacture"] || "01/01/2021")
          .setValue("#numberofseats", szenario["Number of Seats"] || "5")
          .setValue("#fuel", szenario["Fuel Type"] || "Petrol")
          .setValue("#listprice", szenario["List Price"] || "25000")
          .setValue("#licenseplatenumber", szenario["License Plate Number"] || "AB123CD")
          .setValue("#annualmileage", szenario["Annual Mileage"] || "10000")
          .click("#nextenterinsurantdata")

          // Insurant Data
          .setValue("#firstname", szenario["First Name"] || "John")
          .setValue("#lastname", szenario["Last Name"] || "Doe")
          .setValue("#birthdate", szenario["Birthdate"] || "01/01/1990")
          .perform(() => {
            browser.execute(function (gender) {
              const el = document.querySelector(`input[name='Gender'][value='${gender}']`);
              if (el) el.click();
            }, [szenario["Gender"] || "Male"]);
          })
          .setValue("#streetaddress", szenario["Street"] || "Musterstraße 1")
          .setValue("#country", szenario["Country"] || "Germany")
          .setValue("#zipcode", szenario["Zipcode"] || "12345")
          .setValue("#city", szenario["City"] || "Berlin")
          .setValue("#occupation", szenario["Occupation"] || "Employee")
          .setValue("#website", szenario["Website"] || "https://example.com")
          .perform(() => {
            browser.execute(() => {
              const hobby = document.querySelector("#other");
              if (hobby) hobby.click();
            });
          })
          .click("#nextenterproductdata")

          // Product Data
          .setValue("#startdate", szenario["Preferred Start Date"] || "08/01/2025")
          .setValue("#insurancesum", szenario["Insurance Sum [ ]"] || "7.000.000,00")
          .setValue("#meritrating", szenario["Merit Rating"] || "Bonus 5")
          .setValue("#damageinsurance", szenario["Damage Insurance"] || "Partial Coverage")
          .perform(() => {
            const euro = (szenario["Euro Protection"] || "").toString().toLowerCase();
            const legal = (szenario["Legal Defense Insurance"] || "").toString().toLowerCase();
          
            // Immer mindestens EINE Checkbox aktivieren!
            if (euro === "true") {
              browser.execute(function() {
                let input = document.querySelector('#EuroProtection');
                if (input && !input.checked) input.click();
                // Falls auch das nicht geht:
                if (input && !input.checked) input.checked = true;
              });
            }
            if (legal === "true") {
              browser.execute(function() {
                let input = document.querySelector('#LegalDefenseInsurance');
                if (input && !input.checked) input.click();
                if (input && !input.checked) input.checked = true;
              });
            }
            // Wenn beides "false", dann aktiviere EINE Checkbox (z.B. EuroProtection)
            if (euro !== "true" && legal !== "true") {
              browser.execute(function() {
                let input = document.querySelector('#EuroProtection');
                if (input && !input.checked) input.click();
                if (input && !input.checked) input.checked = true;
              });
            }
            // Extra Pause – kann bei langsamer UI helfen
            browser.pause(500);
          })
          .setValue("#courtesycar", szenario["Courtesy Car Option"] || "No")
          .click("#nextselectpriceoption")

          // Price Option
          .waitForElementVisible('section#pricePlans .ideal-radio', 5000)
          .click('section#pricePlans .ideal-radio')
          .click("#nextsendquote")

          // Send Quote
          .setValue("#email", `test${Date.now()}@example.com`)
          .setValue("#phone", "1234567890")
          .setValue("#username", `testuser${Math.floor(Math.random() * 100000)}`)
          .setValue("#password", "Test123!")
          .setValue("#confirmpassword", "Test123!")
          .setValue("#Comments", "Test comment")
          .pause(1500) // Gib dem Frontend kurz Zeit!
          .click("#sendemail")
          .pause(5000)
          .waitForElementVisible(".sweet-alert", 7000);

      });
    });
    
    browser.end();
  }
};
