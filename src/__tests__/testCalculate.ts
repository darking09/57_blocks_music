import sum from '../testCalculate';


describe('Sum', () => {
  it('2 + 2 = 4', ()=> {
    expect(sum(2,2)).toEqual(4)
  })
})
