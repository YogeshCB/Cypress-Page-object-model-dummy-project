import Chance from 'chance'
const chance = new Chance()

const emailValidValue = 'ujang.jajang@mailinator.com'
const emailInvalidValue = chance.string()
const emailUnregisteredValue = chance.email({
	domain: 'mailinator.com'
})

export const loginPage = {
	verifyLoginPage() {
		cy.get('.btn.btn-login').click()
		cy.get('.card-title').contains('Masuk')
	},
	loginWithValidCredentials() {
		cy.get('#email').should('be.visible').type(emailValidValue)
		cy.get('#submit-button').click()
	},
	loginWithInvalidCredentials() {
		cy.get('#email').should('be.visible').type(emailInvalidValue)
		cy.get('#submit-button').click()
		// cy.get('.error-message').contains('Alamat e-mail salah')
    },
    loginWithUnregisteredCredentials() {
        cy.get('#email').should('be.visible').type(emailUnregisteredValue)
		cy.get('#submit-button').click()
		// cy.get('.error-message').contains('Akun tidak ditemukan')
    }
}