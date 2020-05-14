import { TEXTS } from '../../shared/constants';

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Check integrity', () => {
    it('h1 is correct', () => {
      cy.queryByText(TEXTS.HOME_TITLE).should('exist');
    });
  });
});

// describe('Data load', () => {
//   it('confirm events dropdown populates', () => {
//     cy.visit('/');
//     cy.get('.event-selector')
//       .find('option')
//       .its('length')
//       .should('be.gt', 1);
//   });
// });