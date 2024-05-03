describe('GeoTemp Application', () => {
    beforeEach(() => {
        // Define a URL base para todos os testes
        cy.visit('http://127.0.0.1:5173');
    });

    it('successfully loads', () => {
        cy.get('input[placeholder="Consultar a cidade"]').should('be.visible'); // Verifica se o botão de consulta está presente
    });

    // Testa o imput para ver se a requisição foi
    it('allows user to input a city and search', () => {
        cy.get('#mapInput').type('Sao Paulo');
        cy.get('#btnConsult').click();
        cy.wait('@getWeather');
    });

    it('updates city list after search', () => {
        // Verifica se a cidade pesquisada é adicionada ao select
        cy.get('#mapInput').type('Sao Paulo');
        cy.get('#btnConsult').click();
        cy.get('#citySelect').should('contain', 'Sao Paulo');
    });

    it('can select a city and view details', () => {
        // Escolher uma cidade do select e verificar a atualização do modal
        cy.get('#citySelect').select('Sao Paulo');
        cy.get('#modalContent').should('be.visible');
    });
});
