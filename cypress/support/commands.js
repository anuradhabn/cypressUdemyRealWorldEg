// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Add login method

// Cypress.Commands.add('loginToApplication',() => {
//     cy.visit('/login')
//     cy.get('[placeholder="Email"]').type("anu.bengaluru@gmail.com")
//     cy.get('[placeholder="Password"]').type("Ganapathi2024!")
//     cy.get('[type="submit"]').contains('Sign in').click()
// })

//Headless Authorization

Cypress.Commands.add('loginToApplication', () => {

    // const userCredentials = {
    //     "user": {
    //       "email": "anu.bengaluru@gmail.com",
    //       "password": "Ganapathi2024!"
    //     }
    //   }

    //Modified userCredentials after Environment Variables lesson

    const userCredentials = {
        "user": {
          "email": Cypress.env('userName'),
          "password": Cypress.env('password')
        }
      }

    cy.request('POST',Cypress.env('apiURL')+'/api/users/login',userCredentials)
    .its('body').then(body => {
        const token = body.user.token
        //further simplification of the code
        cy.wrap(token).as('token') // Saving it globally as a token which can be used in the tests

        cy.visit('/',{
            onBeforeLoad(win){
                win.localStorage.setItem('jwtToken',token)
            }
        })
    })
})