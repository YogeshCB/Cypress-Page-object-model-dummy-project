export const mainPage = {
	verifyBannerElements() {
		cy.get('#highlights > .logo-copyright').should('be.visible')
	},
	verifyIndonesianLanguage() {
		cy.get('.nav-link > span').contains('Bahasa Indonesia')
	}
}