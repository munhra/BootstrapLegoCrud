const MySum = require ('../public/modules/dummy')
const Utilities = require('../public/modules/utilities')

//import { Utilities } from '../public/modules/utilities.js'

//const Utilities = require("../public/modules/utilities.js")



describe("Dummy", () => {

  it("should have a createTodo function", () => {
    expect(typeof MySum).toBe("function");
  });

  test('adds 1 + 2 to equal 3', () => {
    expect(MySum(1,2)).toBe(3)
  })
})

describe("Utilities", () => {
  // it("should have a createTodo function", () => {
  //   expect(typeof Utilities).toBe("function");
  // })
  test('get checkbox id', () => {
    expect(new Utilities().dummyMethod()).toBe(1)
  })
})