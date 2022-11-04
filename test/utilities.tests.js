
import { Utilities } from '/Users/vntraal/projects/legoCRUDBootstrap/public/modules/utilities.js'
import assert from 'assert'

describe('Utilities', function () {
  describe('dummyFunction', function () {
    it('should return -1 from dummy method', function () {
      const utilities = new Utilities()
      assert.equal(utilities.dummyFunction(), -1)
    })
  })
})