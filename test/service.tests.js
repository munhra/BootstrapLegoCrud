import { Service } from '../public/modules/service.js'
import assert from 'assert'
import fetchMock from 'fetch-mock'

describe('Service', function () {
  const service = new Service()
  fetchMock.config.overwriteRoutes = true

  describe('getAllLegoPartsFromAPI', function () {
    it('should return all parts from the API', async function () {
      const responseBody =
      `[
        {
            "quantity": "1",
            "image": "aaa",
            "color": "yellow",
            "name": "New Part recorded",
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
        }
      ]`
      fetchMock.mock(service.productionURL, responseBody)
      const legoParts = await service.getAllLegoPartsFromAPI()
      assert.equal(legoParts.length, 2)
      fetchMock.restore()
    })
    it('should return ERROR when fetching parts from the API', async function () {
      fetchMock.mock(service.productionURL, 404)
      try {
        await service.getAllLegoPartsFromAPI()
      } catch (error) {
        assert.equal(error.message, 'Server Error when getAllLegoParts')
      }
      fetchMock.restore()
    })
  })

  describe('createLegoPartFromAPI', function () {
    const newLegoPart =
      `{
        "name": "Technic Changeover Plate",
        "description": "Very nice part to be used anywere",
        "part_number": "6631",
        "color": "Black",
        "image": "link to image",
        "quantity": 9
      }`
    it('should create a new part in the API', async function () {
      const newCreatedLegoPart =
      `{
        "name": "Technic Changeover Plate",
        "description": "Very nice part to be used anywere",
        "part_number": "6631",
        "color": "Black",
        "image": "link to image",
        "quantity": 9,
        "id": "KXMon0p50kaQumHomn5B"
      }`
      fetchMock.mock(service.productionURL, newCreatedLegoPart)
      const createdLegoPart = await service.createLegoPartFromAPI(newLegoPart)
      assert.equal(createdLegoPart.name, 'Technic Changeover Plate')
      assert.equal(createdLegoPart.id, 'KXMon0p50kaQumHomn5B')
      fetchMock.restore()
    })
    it('should return ERROR when creating new lego part from the API', async function () {
      fetchMock.mock(service.productionURL, 404)
      try {
        await service.createLegoPartFromAPI(newLegoPart)
      } catch (error) {
        assert.equal(error.message, 'Server Error when createLegoPart')
      }
      fetchMock.restore()
    })
  })

  describe('updateLegoPartFromAPI', function () {
    const updatedLegoPart =
      `{
        "name": "Technic Changeover Plate UPDATED",
        "description": "Very nice part to be used anywere",
        "part_number": "6631",
        "color": "Black",
        "image": "link to image",
        "quantity": 20
      }`

    const newUpdatedLegoPart =
      `{
        "name": "Technic Changeover Plate UPDATED",
        "description": "Very nice part to be used anywere",
        "part_number": "6631",
        "color": "Black",
        "image": "link to image",
        "quantity": 20,
        "id": "12TPDW9RGaAAAm0AklIh"
      }`
    it('should update the lego part in the API', async function () {
      fetchMock.mock(service.productionURL, newUpdatedLegoPart)
      const updatedLegoPartResponse = await service.updateLegoPartFromAPI(updatedLegoPart, '12TPDW9RGaAAAm0AklIh')
      assert.equal(updatedLegoPartResponse.name, 'Technic Changeover Plate UPDATED')
      assert.equal(updatedLegoPartResponse.id, '12TPDW9RGaAAAm0AklIh')
      fetchMock.restore()
    })

    it('should return ERROR when updating new lego part from the API', async function () {
      fetchMock.mock(service.productionURL, 404)
      try {
        await service.updateLegoPartFromAPI(updatedLegoPart, '12TPDW9RGaAAAm0AklIh')
      } catch (error) {
        assert.equal(error.message, 'Server error when updateLegoPart')
      }
      fetchMock.restore()
    })
  })

  describe('deleteLegoPartFromAPI', function () {
    it('should delete the lego part in the API', async function () {
      const deletedLegoPartResponse = '{"id": "ACLtjhBlTdkwFS9GXQMC"}'
      fetchMock.mock(service.productionURL, deletedLegoPartResponse)
      const deletedLegoPart = await service.deleteLegoPartFromAPI('ACLtjhBlTdkwFS9GXQMC')
      assert.equal(deletedLegoPart.id, 'ACLtjhBlTdkwFS9GXQMC')
      fetchMock.restore()
    })

    it('should return ERROR when deleting lego part from the API', async function () {
      fetchMock.mock(service.productionURL, 404)
      try {
        await service.deleteLegoPartFromAPI('ACLtjhBlTdkwFS9GXQMC')
      } catch (error) {
        assert.equal(error.message, 'Server error when deleting lego part with id ACLtjhBlTdkwFS9GXQMC')
      }
      fetchMock.restore()
    })
  })
})
