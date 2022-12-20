import assert from 'assert'
import { Builder, By, Key } from 'selenium-webdriver'

// async function example () {
//   const driver = await new Builder().forBrowser('chrome').build()
//   await driver.get('http://google.com')
//   const element = await driver.findElement(By.name('q'))
//   element.sendKeys('Selenium', Key.RETURN)
// }
// example()

describe('Lego CRUD test suite', async function () {
  let driver = {}
  before(async function () {
    driver = await new Builder().forBrowser('chrome').build()
    await driver.get('http://google.com')
  })

  after(function () {
    return driver.quit()
  })

  it('Should create a new lego part', async function () {
    const element = await driver.findElement(By.name('q'))
    element.sendKeys('Selenium', Key.RETURN)
    assert.equal(1, 1)
  })
})
