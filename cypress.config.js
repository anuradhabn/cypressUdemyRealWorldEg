// module.exports = {
//   e2e: {
    
//     setupNodeEvents(on, config) {
//       // implement node event listeners here
//     },
//   },
// };

const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    baseUrl:'https://angular.realworld.how/',        
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
    video:false,
    setupNodeEvents(on, config) {
      
      // implement node event listeners here
    },
  },
});
