/// <reference types="cypress" /> 

describe('shadow dom', ()=> {

    it('access shadow dom', () => {

        cy.visit('https://radogado.github.io/shadow-dom-demo/')
        cy.get('#app').shadow().find('#container')
//^^ find the root element, use the shadow function & then find the ID element
    })
})