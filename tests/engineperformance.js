const testdata = require('./testdata.js');

module.exports = {
  "Automated Vehicle Insurance Scenarios": function (browser) {
    Object.entries(testdata).forEach(([scenarioName, szenario], idx, arr) => {
      browser.perform(() => {
        browser
          .url("http://sampleapp.tricentis.com/101/")
          .waitForElementVisible("body", 2000)
          .click("#nav_automobile")
          .pause(800)

          // --- Enter Vehicle Data ---
          .setValue("#make", szenario.make)
          .setValue("#engineperformance", szenario.enginePerformance.toString())
          .setValue("#dateofmanufacture", szenario.dateOfManufacture)
          .setValue("#numberofseats", szenario.numberOfSeats.toString())
          .setValue("#fuel", szenario.fuelType)
          .setValue("#listprice", szenario.listPrice.toString())
          .setValue("#licenseplatenumber", szenario.licensePlateNumber)
          .setValue("#annualmileage", szenario.annualMileage.toString())
          .click("#nextenterinsurantdata")
          .pause(700)

          // --- Enter Insurant Data ---
          .setValue("#firstname", szenario.firstName)
          .setValue("#lastname", szenario.lastName)
          .setValue("#birthdate", szenario.birthdate)
          .perform(() => {
            browser.execute(function (gender) {
              const el = document.querySelector(`input[name='Gender'][value='${gender}']`);
              if (el) el.click();
            }, [szenario.gender]);
          })
          .setValue("#streetaddress", szenario.street)
          .setValue("#country", szenario.country)
          .setValue("#zipcode", szenario.zipcode)
          .setValue("#city", szenario.city)
          .setValue("#occupation", szenario.occupation)
          .setValue("#website", szenario.website)
          .perform(() => {
            browser.execute(function () {
              const hobby = document.querySelector("#other");
              if (hobby) hobby.click();
            });
          })
          .click("#nextenterproductdata")
          .pause(700)

          // --- Enter Product Data ---
          .setValue("#startdate", szenario.preferredStartDate)
          .setValue("#insurancesum", szenario.insuranceSum.toString())
          .setValue("#meritrating", szenario.meritRating)
          .setValue("#damageinsurance", szenario.damageInsurance)
          .perform(() => {
            if (szenario.euroProtection === true) {
              browser.execute(function () {
                let input = document.querySelector("#EuroProtection");
                if (input && !input.checked) input.click();
              });
            }
            if (szenario.legalDefenseInsurance === true) {
              browser.execute(function () {
                let input = document.querySelector("#LegalDefenseInsurance");
                if (input && !input.checked) input.click();
              });
            }
          })
          .setValue("#courtesycar", szenario.courtesyCarOption)
          .click("#nextselectpriceoption")
          .pause(1200)

          // --- Select Price Option ---
          .waitForElementVisible('section#pricePlans .ideal-radio', 8000)
          .click('section#pricePlans .ideal-radio')
          .click("#nextsendquote")
          .pause(800)

          // --- Send Quote ---
          .setValue("#email", `khorzad${Date.now()}@example.com`)
          .setValue("#phone", "1234567890")
          .setValue("#username", `tahmoores${Math.floor(Math.random() * 100000)}`)
          .setValue("#password", "Test123!")
          .setValue("#confirmpassword", "Test123!")
          .setValue("#Comments", "Test comment from Group5")
          .pause(1500)
          .click("#sendemail")
          .waitForElementVisible(".sweet-alert", 12000)
          .assert.visible(".sweet-alert")
          .pause(600)           // <- Kurze Pause, damit das Popup bereit ist
          .click(".confirm")    // <- SweetAlert-OK-Button
          .pause(2000);          // <- Pause nach dem Klick
      });

      // Seite reloaden – das ist stabiler, als auf Verschwinden zu warten
      browser.perform(() => {
        if (idx < arr.length - 1) {
          browser.url("http://sampleapp.tricentis.com/101/").pause(1400);
          browser.waitForElementVisible('body', 2500);
        }
      });
    });

    browser.end();
  }
};
