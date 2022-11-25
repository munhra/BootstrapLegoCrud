import { ViewController } from '../public/modules/controllers.js'
import { JSDOM } from 'jsdom'
import { resolve } from 'path'
import assert from 'assert'

describe('ViewController', async function () {
  const mockLegoParts = [
    {

      quantity: 1,
      image: 'aaa',
      color: 'yellow',
      name: 'Test Lego Part Name',
      part_number: '11233',
      description: 'description',
      id: 'YEn54wfXvb9KO1KZJyKi'

    },
    {

      quantity: 15,
      image: 'aaa',
      color: 'green',
      name: 'This is a new part registered',
      part_number: '1232321',
      description: 'description of part number',
      id: 'VB8peG4ssxBwGAWOGJ5o'

    },
    {

      quantity: 12,
      image: 'zzzz',
      color: 'green2',
      name: 'This is a new part registered aaa',
      part_number: '12323214',
      description: 'description of part number 666',
      id: 'HLCkQtyWrUh1HIRoaxjR'

    },
    {

      quantity: 18,
      image: 'zzz',
      color: 'brow',
      name: 'This is a new part registered XXXX',
      part_number: '1232323223221',
      description: 'description of part number 888',
      id: 'tsRZXfEMUhg5NYyFXqDc'
    }
  ]

  class MockServices {
    isGetAllLegoPartsFromAPICalled = false
    isUpdateLegoPartFromAPICalled = false
    isCreateLegoPartFromAPICalled = false
    deleteLegoPartFromAPICalled = false

    getAllLegoPartsFromAPI () {
      this.isGetAllLegoPartsFromAPICalled = true
      return mockLegoParts
    }

    updateLegoPartFromAPI () {
      this.isUpdateLegoPartFromAPICalled = true
    }

    createLegoPartFromAPI (legoPartJSONString) {
      this.isCreateLegoPartFromAPICalled = true
    }

    deleteLegoPartFromAPI (legoPartIdToDelete) {
      this.deleteLegoPartFromAPICalled = true
    }
  }

  class MockUtilities {
    isGetLegoPartByIDCalled = false
    isSortLegoPartNumbersCalled = false
    isCloneLegoPartsCalled = false
    isGetLegoPartIDFromComponentCalled = false
    isRemoveSelectedLegoPartCalled = false

    getLegoPartByID (legoPartID, legoParts) {
      this.isGetLegoPartByIDCalled = true
      return mockLegoParts.find((legoPart) => legoPart.id === legoPartID)
    }

    sortLegoPartNumbers (legoParts) {
      this.isSortLegoPartNumbersCalled = true
    }

    cloneLegoParts (legoParts) {
      this.isCloneLegoPartsCalled = true
      return legoParts
    }

    getLegoPartIDFromComponent (componentID) {
      this.isGetLegoPartIDFromComponentCalled = true
      return mockLegoParts[0].id
    }

    removeSelectedLegoPart (legoPartID, selectedLegoParts) {
      this.isRemoveSelectedLegoPartCalled = true
    }
  }

  class MockModal {
    isShowCalled = false
    isSortLegoPartNumbersCalled = false
    show () {
      this.isShowCalled = true
    }

    sortLegoPartNumbers (legoParts) {
      this.isSortLegoPartNumbersCalled = true
    }
  }

  class MockFormData {
    * [Symbol.iterator] () {
      const formDataEntry = {
        length: 0,
        name: 'entries'
      }
      yield formDataEntry
    }

    entries () {}
    keys () {}
    values () {}
  }

  const dom = await JSDOM.fromFile(resolve('test/index.html'))

  global.window = dom.window
  global.document = dom.window.document
  global.FormData = MockFormData

  const viewController = new ViewController()
  describe('dummyMethod', function () {
    it('dummy method should return 1', function () {
      assert.equal(viewController.dummyMethod(), 1)
    })
  })

  describe('unSelectAllLegoParts', function () {
    it('should unselect all lego parts.', function () {
      viewController.legoParts = mockLegoParts
      viewController.unSelectAllLegoParts()
      assert.equal(viewController.selectedLegoParts.length, 0)
      const legoPartCheckBox0 = document.getElementById('checkbox_' + mockLegoParts[0].id)
      const legoPartCheckBox1 = document.getElementById('checkbox_' + mockLegoParts[1].id)
      const legoPartCheckBox2 = document.getElementById('checkbox_' + mockLegoParts[2].id)
      const legoPartCheckBox3 = document.getElementById('checkbox_' + mockLegoParts[3].id)
      assert.equal(legoPartCheckBox0.checked, false)
      assert.equal(legoPartCheckBox1.checked, false)
      assert.equal(legoPartCheckBox2.checked, false)
      assert.equal(legoPartCheckBox3.checked, false)
    })
  })

  describe('should select all lego parts.', function () {
    it('should select all lego parts.', function () {
      const mockUtilities = new MockUtilities()
      viewController.legoParts = mockLegoParts
      viewController.utilities = mockUtilities
      viewController.selectedLegoParts = []
      viewController.selectAllLegoParts()
      assert.equal(mockUtilities.isCloneLegoPartsCalled, true)
      const legoPartCheckBox1 = document.getElementById('checkbox_' + mockLegoParts[0].id)
      const legoPartCheckBox2 = document.getElementById('checkbox_' + mockLegoParts[1].id)
      const legoPartCheckBox3 = document.getElementById('checkbox_' + mockLegoParts[2].id)
      const legoPartCheckBox4 = document.getElementById('checkbox_' + mockLegoParts[3].id)
      assert.equal(legoPartCheckBox1.checked, true)
      assert.equal(legoPartCheckBox2.checked, true)
      assert.equal(legoPartCheckBox3.checked, true)
      assert.equal(legoPartCheckBox4.checked, true)
      assert.equal(viewController.selectedLegoParts.length, 4)
    })
  })

  describe('openAddLegoPartModal', function () {
    it('should open add lego part modal.', function () {
      const mockAddLegoPartModal = new MockModal()
      viewController.addLegoPartModal = mockAddLegoPartModal
      viewController.openAddLegoPartModal()
      assert.equal(viewController.isUpdating, false)
      assert.equal(viewController.addLegoPartModal.isShowCalled, true)
    })
  })

  describe('showInfoToast', function () {
    it('should show info toast.', function () {
      const testMessage = 'Test Toast Message.'
      const bootStrapInformationToast = new MockModal()
      viewController.bootStrapInformationToast = bootStrapInformationToast
      viewController.showInfoToast(testMessage)
      assert.equal(viewController.bootStrapInformationToast.isShowCalled, true)
      const informationToastBody = document.getElementById('infoToastBody').innerText
      assert.equal(informationToastBody, testMessage)
    })
  })

  describe('showErrorDialog', function () {
    it('should show error dialog.', function () {
      const testMessage = 'Test Error Toast Message.'
      const errorModal = new MockModal()
      viewController.errorModal = errorModal
      viewController.showErrorDialog(testMessage)
      assert.equal(viewController.errorModal.isShowCalled, true)
      const errorMessageText = document.getElementById('errorMessage').innerText
      assert.equal(errorMessageText, testMessage)
    })
  })

  describe('showErrorDialog', function () {
    it('should show delete dialog.', function () {
      const legoPartToDeleteID = 'tsRZXfEMUhg5NYyFXqDc'
      const deleteLegoPartConfirmationModal = new MockModal()
      const mockUtilities = new MockUtilities()
      viewController.deleteLegoPartConfirmationModal = deleteLegoPartConfirmationModal
      viewController.utilities = mockUtilities
      viewController.showDeleteDialog(legoPartToDeleteID)
      assert.equal(viewController.deleteLegoPartConfirmationModal.isShowCalled, true)
      const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText').innerText
      assert.equal(deleteLegoPartConfirmationText, 'Are you sure to delete lego part This is a new part registered XXXX ?')
    })
  })

  describe('fetchLegoParts', function () {
    it('should fetch lego parts', function () {
      const mockServices = new MockServices()
      const mockUtilities = new MockUtilities()
      viewController.utilities = mockUtilities
      viewController.service = mockServices
      viewController.fetchLegoParts()
      assert.equal(viewController.service.isGetAllLegoPartsFromAPICalled, true)
    })
  })

  describe('editButtonClick', function () {
    it('should show edit lego part form.', function () {
      const mockServices = new MockServices()
      const mockUtilities = new MockUtilities()
      const legoPartEditButton = document.getElementById('edit_' + mockLegoParts[0].id)
      viewController.service = mockServices
      viewController.utilities = mockUtilities
      viewController.fetchLegoParts()
      viewController.selectedLegoPart = mockLegoParts[0]
      legoPartEditButton.click()
      assert.equal(mockUtilities.isGetLegoPartIDFromComponentCalled, true)
      assert.equal(viewController.isUpdating, true)
      assert.equal(viewController.legoPartIdToEdit, mockLegoParts[0].id)

      const nameField = document.getElementById('name')
      const descriptionField = document.getElementById('description')
      const partNumberField = document.getElementById('part_number')
      const quantityField = document.getElementById('quantity')
      const colorField = document.getElementById('color')
      const imageField = document.getElementById('image')

      assert.equal(nameField.value, viewController.selectedLegoPart.name)
      assert.equal(descriptionField.value, viewController.selectedLegoPart.description)
      assert.equal(partNumberField.value, viewController.selectedLegoPart.part_number)
      assert.equal(quantityField.value, viewController.selectedLegoPart.quantity)
      assert.equal(colorField.value, viewController.selectedLegoPart.color)
      assert.equal(imageField.value, viewController.selectedLegoPart.image)
    })
  })

  describe('legoPartDeleteButton', function () {
    it('should delete the lego part.', function () {
      const mockServices = new MockServices()
      const mockUtilities = new MockUtilities()
      const legoPartDeleteButton = document.getElementById('delete_' + mockLegoParts[0].id)
      viewController.service = mockServices
      viewController.utilities = mockUtilities
      viewController.fetchLegoParts()
      viewController.selectedLegoPart = mockLegoParts[0]
      legoPartDeleteButton.click()
      assert.equal(viewController.isUpdating, false)
      const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
      assert.equal(deleteLegoPartConfirmationText.innerText, `Are you sure to delete lego part ${mockLegoParts[0].name} ?`)
    })
  })

  describe('legoPartCheckButton', function () {
    it('should check the lego part.', function () {
      const mockServices = new MockServices()
      const mockUtilities = new MockUtilities()
      const legoPartCheckButton = document.getElementById('checkbox_' + mockLegoParts[0].id)
      viewController.service = mockServices
      viewController.utilities = mockUtilities
      viewController.fetchLegoParts()
      viewController.selectedLegoPart = mockLegoParts[0]
      legoPartCheckButton.click()
      assert.equal(mockUtilities.isRemoveSelectedLegoPartCalled, true)
    })

    it('should uncheck the lego part.', function () {
      const mockServices = new MockServices()
      const mockUtilities = new MockUtilities()
      const legoPartCheckButton = document.getElementById('checkbox_' + mockLegoParts[0].id)
      legoPartCheckButton.checked = false
      viewController.service = mockServices
      viewController.utilities = mockUtilities
      viewController.legoParts = mockLegoParts
      viewController.selectedLegoParts = []
      viewController.fetchLegoParts()
      legoPartCheckButton.click()
      assert.equal(viewController.selectedLegoParts[0].id, mockLegoParts[0].id)
    })
  })

  describe('editLegoPart', async function () {
    it('should edit lego part calling server endopoint.', async function () {
      const mockServices = new MockServices()
      viewController.service = mockServices
      await viewController.editLegoPart()
      assert(mockServices.isUpdateLegoPartFromAPICalled, true)
    })
  })

  describe('addLegoPart', async function () {
    it('should add lego part calling server endopoint.', async function () {
      const mockServices = new MockServices()
      viewController.service = mockServices
      viewController.addLegoPart()
      assert(mockServices.isCreateLegoPartFromAPICalled, true)
    })
  })

  describe('deleteLegoPart', async function () {
    it('should delete lego part calling server endopoint.', async function () {
      const legoPartToDeleteID = 'tsRZXfEMUhg5NYyFXqDc'
      const mockServices = new MockServices()
      viewController.service = mockServices
      viewController.deleteLegoPart(legoPartToDeleteID)
      assert(mockServices.deleteLegoPartFromAPICalled, true)
    })
  })
})
