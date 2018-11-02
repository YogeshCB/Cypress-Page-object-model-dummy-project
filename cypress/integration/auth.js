import {
	mainPage
} from '../support/pageObjects/mainPage'
import {
	signupPage
} from '../support/pageObjects/signupPage'
import {
	loginPage
} from '../support/pageObjects/loginPage'

describe('HOOQ - Bahasa Indonesia', () => {
	context('Authentications', () => {
		beforeEach(() => {
			cy.visit('https://hooq.tv/')
			mainPage.verifyBannerElements()
			mainPage.verifyIndonesianLanguage()
		})

		it('Signup with Valid Credentials', () => {
			signupPage.verifySignupPage()
			signupPage.signupWithValidCredentials()
		})

		it('Signup with Invalid Credentials', () => {
			signupPage.verifySignupPage()
			signupPage.signupWithInvalidCredentials()
        })
        
        it('Login with Valid Credentials', () => {
			signupPage.verifySignupPage()
			signupPage.loginWithValidCredentials()
        })
        
        it('Login with Invalid Credentials', () => {
            loginPage.verifyLoginPage()
            loginPage.loginWithInvalidCredentials()
        })
        
        it('Login with Unregistered Credentials', () => {
            loginPage.verifyLoginPage()
            loginPage.loginWithUnregisteredCredentials()
		})
	})
})