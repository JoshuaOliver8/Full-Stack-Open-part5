describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'James Franco',
      username: 'test-jaja',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    const user2 = {
      name: 'Frames Janco',
      username: 'EVIL-jaja',
      password: 'password'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test-jaja')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('James Franco logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('supastar')
      cy.get('#password').type('fancy cars')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test-jaja')
      cy.get('#password').type('password')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.get('#newBlog').click()

      cy.get('#title').type('testentry')
      cy.get('#author').type('john doe')
      cy.get('#url').type('default')
      cy.get('#likes').type(404)

      cy.get('#submit').click()
      cy.contains('testentry john doe')
    })

    describe('Testing the details of an existing blog', function() {
      beforeEach(function() {
        cy.get('#newBlog').click()

        cy.get('#title').type('testentry')
        cy.get('#author').type('john doe')
        cy.get('#url').type('default')
        cy.get('#likes').type(404)

        cy.get('#submit').click()

        cy.contains('testentry')
        cy.contains('view').click()
      })

      it('Users can like blogs', function() {
        cy.contains('404')
        cy.get('#addLike').click()
        cy.contains('405')
      })

      it('The creator of a blog can delete it', function() {
        cy.get('#removeButton').should('be.visible').click()
        
        cy.get('.success')
          .should('contain', 'Deleted testentry john doe')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
        
        cy.get('html').should('not.contain', '.details')
      })

      describe('Second user is logged on and views other user blog', function() {
        beforeEach(function() {
          cy.get('#logOut').click()

          cy.get('#username').type('EVIL-jaja')
          cy.get('#password').type('password')
          cy.get('#login-button').click()
        })
    
        it.only('User cannot delete blog created by other user', function() {
          cy.contains('testentry')
          cy.contains('view').click()
          cy.get('html').should('not.contain', '#removeButton')
        })
      })

      describe('Second blog is created', function() {
        beforeEach(function() {
          cy.get('#newBlog').click()
  
          cy.get('#title').type('test2')
          cy.get('#author').type('jane doe')
          cy.get('#url').type('default')
          cy.get('#likes').type(403)
  
          cy.get('#submit').click()
  
          cy.contains('test2')
          cy.contains('view').click()
        })

        it.only('Blogs are sorted by the largest like count', function() {
          cy.get('.details').eq(0).should('contain', 'testentry')
          cy.get('.details').eq(1).should('contain', 'test2')

          cy.contains('403')
          cy.get('.details').eq(1).find('#addLike').click()
          cy.get('.details').eq(1).should('contain', '404')
          cy.get('.details').eq(1).find('#addLike').click()

          cy.get('.details').eq(0).should('contain', 'test2')
          cy.get('.details').eq(1).should('contain', 'testentry')
        })
      })
    })
  })
})