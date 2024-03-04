const { defineConfig } = require("cypress")

module.exports = defineConfig({
  projectId: "yvnzq2",
  e2e: {
    baseUrl: 'https://angular.realworld.how/',
    experimentalWebKitSupport: true,
    
    //apiLoginURL: 'https://concentrix-intranet-pilot.vercel.app/login',
    // excludeSpecPattern :['**/1-getting-started','**/2-advanced-examples'],
    // experimentalSessionAndOrigin: true,
    // experimentalModifyObstructiveThirdPartyCode : true,
    // experimentalRunAllSpecs: true,
    // experimentalSkipDomainInjection: [
    //   '*.salesforce.com',
    //   '*.force.com',
    //   '*.google.com',
    //   '*.microsoft.com',
    // ],
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: true,
    video: false,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      configFile: 'reporter-config.json',
    },    
    //retries:2,
    retries: {
      runMode: 2,//headless
      openMode: 0 //non-headless     
    },
    env: {
      userName: 'anu.bengaluru@gmail.com',
      password: 'Ganapathi2024!',
      apiURL: 'https://api.realworld.io'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here

      const userName = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      //if we don't want the process to start if password isn't provided, we are adding the below condition
      // if (!password) {
      //   throw new Error('missing PASSWORD environment variable')
      // }
      // config.env = { userName, password }
      // return config
    },
  },
});
