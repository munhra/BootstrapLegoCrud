//mocha.setup('tdd')
import { ViewController } from '../public/modules/controllers.js'
// import { JSDOM } from 'jsdom'
// const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')
// global.window = dom.window
// global.document = dom.window.document
import assert from 'assert'
//import bootstrap from 'bootstrap'




describe('ViewController', function () {
  // const document = new JSDOM()
  const viewController = new ViewController()
  // viewController.document = document

  it('dummy method should return 1', function () {
    assert.equal(viewController.dummyMethod(), 1)
  })

  it('should return unSelectAllLegoParts', function () {
    viewController.unSelectAllLegoParts()
    assert.equal(viewController.selectedLegoParts.length, 0)
  })

  // it('should open add lego part modal', function () {
  //   viewController.openAddLegoPartModal()
  //   assert.equal(viewController.isUpdating, false)
  // })
})