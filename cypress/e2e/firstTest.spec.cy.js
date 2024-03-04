/// <reference types= "cypress"/>

describe('Test with backend', () => {
  beforeEach('Login to the app', () => {
    // cy.intercept('GET','https://api.realworld.io/api/tags', {fixture:'tags.json'}) //Works
    // cy.intercept('GET','**/tags', {fixture:'tags.json'})
    //replacing 1st parameter with object.. object will have method
    cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
    cy.loginToApplication()
  })

  it.only('Verify correct request & response', () => {
    cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles')
    //^^ inside intercept, first parameter is the method
    //^^ postArticles is a variable
    // cy.contains('New Article').click()
    cy.get('[routerlink="/editor"]').click()
    cy.get('[placeholder="Article Title"]').type("New Article Title")
    cy.get('[formcontrolname="description"]').type("This is the description")
    cy.get('[formcontrolname="body"]').type("This is the body")
    cy.contains('Publish Article ').click()
    cy.wait(1500)
    cy.wait('@postArticles').then(xhr => {
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

  // Below test was after learning about interception in Chapter 40
  //Before running the below test, no new Article should be present in the webside
  it('Intercepting Mock req/resp', () => {
    //Intercepting & Modifying the request&response(Verify correct request & response)
    //Intercepting Request  :D 
    // cy.intercept('POST','**/articles',(interceptedReq)=>{
    //   interceptedReq.body.article.description = "This is intercepted description2"
    // }).as('postArticles')

    cy.intercept('POST', '**/articles', (actualReq) => {
      //reply is a method of Cypress sorta representing response
      actualReq.reply(res => {
        //actually validating the correct value in the below line
        expect(res.body.article.description).to.equal("This is the description")
        //then later on replacing it with intercepted response .. i.e. replacing just parameter res
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
    cy.wait('@postArticles').then(xhr => {
      console.log(xhr)
      //Assertion on the Reponse elements
      expect(xhr.response.statusCode).to.be.equal(201)
      expect(xhr.request.body.article.body).to.equal('This is the body')
      expect(xhr.response.body.article.description).to.equal("This is intercepted description2")
    })
  })


  it.only('Verify Popular Tags are displayed - Mock Response1', () => {
    //Now to assert the values
    // cy.log('Hello')
    cy.get('.tag-list')
      .should('contain', 'Cypress')
      .and('contain', 'Automation')
      .and('contain', 'ABN')
      .and('contain', 'HelloWorld')
      .and('contain', 'Hyderabad')
  })

  it.only('Verify Global feed likes count', () => {

    //Intercepting pages should always be declared first
    // cy.intercept('GET','https://api.realworld.io/api/articles?limit=10&offset=0',{fixture: 'globalFeedArticles.json'})
    //Refactored Code
    cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', { "articles:[],articlesCount": 0 })
    cy.intercept('GET', 'https://api.realworld.io/api/articles*', { fixture: 'globalFeedArticles.json' })//error (removed / )
    //* means anything after that is okay

    cy.contains('Global Feed').click()
    cy.get('app-article-list button').then(heartList => {
      expect(heartList[0]).to.contain('3')
      expect(heartList[1]).to.contain('6')
    })

    cy.fixture('globalFeedArticles.json').then(file => {
      const articleLink = file.articles[1].slug //articles is from the structure & has nothing to do with the file name
      //getting PK thara because it is part of the URL as well
      file.articles[1].favoritesCount = 6
      //cy.intercept('POST','https://api.realworld.io/api/articles/New-Article-Title-2-378455/favorite',file)
      //Modified above line
      cy.intercept('POST', 'https://api.realworld.io/api/articles/' + articleLink + '/favorite', file)

    })
    //Assertion
    cy.get('app-article-list button').eq(1).should('contain', '6')

  }) 

  it.only('Delete a new article in global feed making use of API calls.. Postman & token stuff', () => {
    //this is very similar to route
    // const userCredentials = {
    //   "user": {
    //     "email": "anu.bengaluru@gmail.com",
    //     "password": "Ganapathi2024!"
    //   }
    // } Not needed after headless authorization

    const bodyRequest = {
      "article": {
        "title": "Request from API", //Request from API or API Request from Postman with token
        "description": "Cypress API Automation",
        "body": "Body Content",
        "tagList": []
      }
    }

    //Simple request to the API
    //1st request to get the token
    // cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
    //   .its('body').then(body => {
    //     const token = body.user.token

    // After headless Authorization
    cy.get('@token').then(token => {    

        //2nd request POST request to create a new article
        cy.request({
          url: 'https://api.realworld.io/api/articles/',
          headers: { Authorization: 'Token ' + token },
          method: 'POST',
          body: bodyRequest
        })
          .then(response => {
            expect(response.status).to.equal(201) //200 doesn't seem to work.. 
          })

        //3rd request
        cy.contains('Global Feed').click()
        cy.get('.preview-link').first().click()
        cy.get('.article-actions').contains('Delete Article').click()        
        
        //Assertion that the article was truly deleted.. another API request call
        cy.request({
          url:'https://api.realworld.io/api/articles',
          headers: { Authorization: 'Token ' + token },
          method: 'GET'
        }).its('body').then(body => {
          expect(body.articles[0].title).not.to.equal('Request from API')
        })


      })
  })
})
