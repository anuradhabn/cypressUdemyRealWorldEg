/// <reference types= "cypress"/>

describe('Test Log Out', () =>{

    beforeEach('Login to the application',() =>{
        cy.loginToApplication()
    })

    it('Verify user can logout successfully',{retries:2},() => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain','Sign in')
    })
})