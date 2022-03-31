// Dependecies
import regularExpressions from "../regularExpressions";

describe('Utils Unit Test', () => {
  describe('Regular expressions', () => {
    describe('Validate email', () => {
      it('Should return true if it sent an email valid', () => {
        expect(regularExpressions.validateEmail('fernando@test.co')).toEqual(true);
      })

      it('Should return false if it sent an email doesn\'t valid', () => {
        expect(regularExpressions.validateEmail('fernando@testco')).toEqual(false);
      })
    });

    describe('Validate password', () => {
      it('Should return true if it fulfills all password criterion', () => {
        expect(regularExpressions.validatePassword('Password@p')).toEqual(true);
      })

      it('Should return false if it doesn\'t fulfill password criterion length greater than or equal to 10', () => {
        expect(regularExpressions.validatePassword('Password@')).toEqual(false);
      })

      it('Should return false if it doesn\'t fulfill password criterion at least a uppercase', () => {
        expect(regularExpressions.validatePassword('password@o')).toEqual(false);
      })

      it('Should return false if it doesn\'t fulfill password criterion at least a lowercase', () => {
        expect(regularExpressions.validatePassword('PASSWORD@O')).toEqual(false);
      })

      it('Should return false if it doesn\'t fulfill password criterion at least a special character', () => {
        expect(regularExpressions.validatePassword('Passwordop')).toEqual(false);
      })

      it('Should return false if it doesn\'t fulfill password criterion at least a special character because the special character sent, it isn\'t valid', () => {
        expect(regularExpressions.validatePassword('Passwordop\\')).toEqual(false);
      })
    });
  });
});
