// Dependecies
import number from "../number";
const DEFAULT_VALUE = 0;

describe('Numbers', () => {
  it('Should return a number if this gets a number', () => {
    expect(number.parseStringToInt(5, DEFAULT_VALUE)).toEqual(5)
  })

  it('Should return a number if this gets a number but on string type', () => {
    expect(number.parseStringToInt('5', DEFAULT_VALUE)).toEqual(5)
  })

  it('Should return a positive number if this gets a negative number', () => {
    expect(number.parseStringToInt(-5, DEFAULT_VALUE)).toEqual(5)
  })

  it('Should return default value if this gets a string and it is not a number', () => {
    expect(number.parseStringToInt('a', DEFAULT_VALUE)).toEqual(0)
  })
});
