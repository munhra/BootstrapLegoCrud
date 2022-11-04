
import { Utilities } from '../public/modules/utilities.js'
import assert from 'assert'

describe('Utilities', function () {
  const utilities = new Utilities()

  const mockedLegoParts = [
    {
        "quantity": "1",
        "image": "aaa",
        "color": "yellow",
        "name": "BB New Part recorded",
        "part_number": "11233",
        "description": "description",
        "id": "ACLtjhBlTdkwFS9GXQMC"
    },
    {
        "part_number": "1233",
        "image": "",
        "color": "green",
        "quantity": "1",
        "description": "description xxx",
        "name": "Part #1",
        "id": "HLCkQtyWrUh1HIRoaxjR"
    },
    {
        "image": "part.png",
        "name": "AA New Lego Part",
        "quantity": "111",
        "color": "blue",
        "part_number": "232323",
        "description": "a good description",
        "id": "IKlqUunlyEvO01BGuW28"
    }
  ]

  describe('dummyFunction', function () {
    it('should return -1 from dummy method', function () {
      assert.equal(utilities.dummyFunction(), -1)
    })
  })

  describe('getLegoPartIDFromComponent', function () {
    it('should return id from getLegoPartIDFromComponent method', function () {
      assert.equal(utilities.getLegoPartIDFromComponent('mycomponent_id'),'id')
    })
  })

  describe('getLegoPartIDFromComponent', function () {
    it('should return legoPart with id HLCkQtyWrUh1HIRoaxjR', function () {
      assert.equal(utilities.getLegoPartByID('HLCkQtyWrUh1HIRoaxjR', mockedLegoParts).name, 'Part #1')
    })
  })

  describe('sortLegoPartNumbers', function () {
    it('should return sorted legoParts', function () {
      utilities.sortLegoPartNumbers(mockedLegoParts)
      assert.equal(mockedLegoParts[0].name, 'AA New Lego Part')
    })
  })

  describe('cloneLegoParts', function () {
    it('should clone legoParts', function () {
      const clonedLegoParts = utilities.cloneLegoParts(mockedLegoParts)
      assert.equal(clonedLegoParts.length, 3)
    })
  })

  describe('removeSelectedLegoPart', function () {
    const removableLegoParts =
      [
        {
          "part_number": "23232",
          "quantity": "22",
          "image": "sss.jpg",
          "name": "New part",
          "color": "blue",
          "description": "blah",
          "id": "VB8peG4ssxBwGAWOGJ5o"
        },
        {
          "part_number": "123121",
          "quantity": "22",
          "name": "Blahhh part 9999",
          "description": "great description",
          "image": "aaa",
          "color": "blue",
          "id": "fX9wmJRpukj37oFrBZvq"
        }
      ]

    it('should remove legoPart with id VB8peG4ssxBwGAWOGJ5o', function () {
      utilities.removeSelectedLegoPart('VB8peG4ssxBwGAWOGJ5o', removableLegoParts)
      assert.equal(removableLegoParts.length, 1)
    })
  })
})