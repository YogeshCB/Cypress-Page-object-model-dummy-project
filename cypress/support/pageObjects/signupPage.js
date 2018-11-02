import Chance from 'chance'
const chance = new Chance()

const emailValidValue = chance.email({
	domain: 'mailinator.com'
})
const emailInvalidValue = chance.string()

export const signupPage = {
	verifySignupPage() {
		cy.get('.btn.btn-signup').click({
			force: true
		})
		cy.get('.card-title').contains('Daftar')
	},
	signupWithValidCredentials() {
		cy.get('#email').should('be.visible').type(emailValidValue)
		cy.get('#submit-button').click()
	},
	signupWithInvalidCredentials() {
		cy.get('#email').should('be.visible').type(emailInvalidValue)
		cy.get('#submit-button').click()
		cy.get('.error-message').contains('Alamat e-mail salah')
	}
}