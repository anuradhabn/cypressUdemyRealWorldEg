/// <reference types= "cypress"/>

describe('Test with backend', () => {
  beforeEach('Login to the app', () => {
    // cy.intercept('GET','https://api.realworld.io/api/tags', {fixture:'tags.json'}) //Works
    // cy.intercept('GET','**/tags', {fixture:'tags.json'})
    //replacing 1st parameter with object.. object will have method
    cy.intercept({method:'Get',path:'tags'}, {fixture:'tags.json'})
    cy.loginToApplication()
  }) 

  it('Verify correct request & response', () => {    
    cy.intercept('POST','https://api.realworld.io/api/articles/').as('postArticles')
    //^^ inside intercept, first parameter is the method
    //^^ postArticles is a variable
    // cy.contains('New Article').click()
    cy.get('[routerlink="/editor"]').click()
    cy.get('[placeholder="Article Title"]').type("New Article Title")
    cy.get('[formcontrolname="description"]').type("This is the description")
    cy.get('[formcontrolname="body"]').type("This is the body")
    cy.contains('Publish Article ').click()
    cy.wait(1500)
    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      //Assertion on the Reponse elements
      expect(xhr.response.statusCode).to.be.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is the body')
      expect(xhr.response.body.article.body).to.equal('This is the body')
      expect(xhr.response.body.article.description).to.equal("This is the description")

    })
    // Below 3 lines is ABN code
    // cy.contains('Delete Article').click()
    // cy.wait(1000)
    // cy.reload()

  })

  //Below test was after learning about interception in Chapter 40

  it.only('Intercepting & Modifying the request&response(Verify correct request & response)', () => {    
    // cy.intercept('POST','**/articles',(interceptedReq)=>{
    //   interceptedReq.body.article.description = "This is intercepted description2"
    // }).as('postArticles')

    cy.intercept('POST','**/articles',(actualReq)=>{
      //reply is a method of Cypress sorta representing response
      actualReq.reply(res => {
        //actually validating the correct value in the below line
        expect(res.body.article.description).to.equal("This is the description")
        //then later on replacing it with intercepted response
        res.body.article.description = "This is intercepted description2" 
      })
    }).as('postArticles')
    
    cy.get('[routerlink="/editor"]').click()
    cy.get('[placeholder="Article Title"]').type("New Article Title")
    cy.get('[formcontrolname="description"]').type("This is the description")
    //although we have a line above for "This is the desciption", since we are now intercepting the call before it
    //gets to this point, we are even asserting "This is intercepted description2"
    cy.get('[formcontrolname="body"]').type("This is the body")
    cy.contains('Publish Article ').click()
    cy.wait(1500)
    cy.wait('@postArticles').then( xhr => {
      console.log(xhr)
      //Assertion on the Reponse elements
      expect(xhr.response.statusCode).to.be.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is the body')      
      expect(xhr.response.body.article.description).to.equal("This is intercepted description2")
    })
  })

  it('Verify Popular Tags are displayed - Mock Response1', () => {
    //Now to assert the values
    // cy.log('Hello')
    cy.get('.tag-list')
    .should('contain','Cypress')
    .and('contain','Automation')
    .and('contain','ABN')
    .and('contain','HelloWorld')
    .and('contain','Hyderabad')
  })

  it('Verify Global feed likes count', {browser:'egde'},()=> {

    //Intercepting pages should always be declared first
    // cy.intercept('GET','https://api.realworld.io/api/articles?limit=10&offset=0',{fixture: 'globalFeedArticles.json'})
    //Refactored Code
    cy.intercept('GET','https://api.realworld.io/api/articles/feed*',{"articles:[],articlesCount":0})
    cy.intercept('GET','https://api.realworld.io/api/articles/*',{fixture: 'globalFeedArticles.json'})
    //* means anything after that is okay

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('3')
      expect(heartList[1]).to.contain('6')
    })

    cy.fixture('globalFeedArticles').then(file => {
      const articleLink = file.globalFeedArticles[1].slug //getting PK thara because it is part of the URL as well
      file.globalFeedArticles[1].favoritesCount = 6
      //cy.intercept('POST','https://api.realworld.io/api/articles/New-Article-Title-2-378455/favorite',file)
      //Modified above line
      cy.intercept('POST','https://api.realworld.io/api/articles/'+articleLink+'/favorite',file)

    })
    //Assertion
    cy.get('app-article-list button').eq(1).should('contain','6')

  })

})
