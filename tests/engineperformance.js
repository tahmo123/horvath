const testdata = require('./testdata.js');

module.exports = {
  "Automated Vehicle Insurance Scenarios": function(browser) {
    Object.entries(testdata).forEach(([scenarioName, szenario]) => {
      browser.perform(() => {
        browser
          .url("http://sampleapp.tricentis.com/101/")
          .waitForElementVisible("body", 1000)
          .click("#nav_automobile")
          .setValue("#make", "Audi")
          .setValue("#engineperformance", szenario["Engine Performance [kW]"])
          .setValue("#dateofmanufacture", "01/01/2021") // oder parse das CSV-Feld, wie du willst!
          .setValue("#numberofseats", szenario["Number of Seats"])
          .setValue("#fuel", "Petrol")
          .setValue("#listprice", szenario["List Price"])
          .setValue("#licenseplatenumber", "AB123CD")
          .setValue("#annualmileage", szenario["Annual Mileage"])
          .click("#nextenterinsurantdata")

          // Insurant Data (Beispielwerte!)
          .setValue("#firstname", "John")
          .setValue("#lastname", "Doe")
          .setValue("#birthdate", "01/01/1990")
          .perform(() => {
            browser.execute(function(gender) {
              document.querySelector('input[name="Gender"][value="' + gender + '"]').click();
            }, [szenario["Gender"] || "Male"]);
          })
          .setValue("#streetaddress", "Musterstraße 1")
          .setValue("#country", "Germany")
          .setValue("#zipcode", "12345")
          .setValue("#city", "Berlin")
          .setValue("#occupation", "Employee")
          .setValue("#website", "https://example.com")
          .perform(() => {
            browser.execute(function() {
              document.querySelector("#other").click();
            });
          })
          .click("#nextenterproductdata")

          // Product Data (Beispiel)
          .setValue("#startdate", "07/01/2025") // Passe an, je nach CSV!
          .setValue("#insurancesum", "7.000.000,00")
          .setValue("#meritrating", "Bonus 5")
          .setValue("#damageinsurance", "Partial Coverage")
          .perform(() => {
            if (szenario["Euro Protection"] === 'true') {
              browser.execute(function() {
                document.querySelector("#EuroProtection").click();
              });
            }
            if (szenario["Legal Defense Insurance"] === 'true') {
              browser.execute(function() {
                document.querySelector("#LegalDefenseInsurance").click();
              });
            }
          })
          .setValue("#courtesycar", "No")
          .click("#nextselectpriceoption")

          // Price Option
          .waitForElementVisible('section#pricePlans .ideal-radio', 10000)
          .click('section#pricePlans .ideal-radio')
          .click("#nextsendquote")

          // Send Quote
          .waitForElementVisible("#email", 2000)
          .setValue("#email", "test@example.com")
          .setValue("#phone", "1234567890")
          .setValue("#username", "testuser")
          .setValue("#password", "Test123!")
          .setValue("#confirmpassword", "Test123!")
          .setValue("#Comments", "Test comment")
          .click("#sendemail")
          .waitForElementVisible(".sweet-alert", 5000);
      });
    });
    browser.end();
  }
};
