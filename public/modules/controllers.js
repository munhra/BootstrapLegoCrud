import { Utilities } from '../modules/utilities.js'
import { Service } from '../modules/service.js'

class ViewController {
  // TODO Create E2E tests
  // TODO Clean npm not used dependencies.
  // TODO check add/edit method and variable names.
  // TODO validate if the partnumber and part name already exists.
  // TODO create utilities attribute to be used in the class, is there a way to call it lazy ?
  // TODO check why bootstrap icons are not working in deploy.

  service = new Service()
  utilities = new Utilities()

  legoPartIdToDelete
  legoPartIdToEdit

  isUpdating = false // maybe it would be nice to create a enum to inform the viewcontroller state
  isBatchDeleting = false
  legoParts = []
  selectedLegoParts = []

  constructor (addLegoPartModal, deleteLegoPartConfirmationModal, bootStrapInformationToast, errorModal) {
    this.addLegoPartModal = addLegoPartModal
    this.deleteLegoPartConfirmationModal = deleteLegoPartConfirmationModal
    this.bootStrapInformationToast = bootStrapInformationToast
    this.errorModal = errorModal
  }

  async fetchLegoParts () {
    try {
      this.legoParts = await this.service.getAllLegoPartsFromAPI()
      this.utilities.sortLegoPartNumbers(this.legoParts)
    } catch (e) {
      this.showErrorDialog('Error when fetching all lego parts, please try again later.')
    }

    const legoPartTableBody = document.getElementById('legoPartTableBody')
    legoPartTableBody.innerHTML = ''
    this.legoParts.forEach(legoPart => {
      legoPartTableBody.innerHTML = legoPartTableBody.innerHTML +
      `<tr>
          <td>
            <div>
              <input class="form-check-input" type="checkbox" id="checkbox_${legoPart.id}" value="" aria-label="...">
            </div>
          </td>
          <td>${legoPart.name}</td>
          <td>${legoPart.description}</td>
          <td>${legoPart.part_number}</td>
          <td>${legoPart.quantity}</td>
          <td>${legoPart.color}</td>
          <td><i class="bi bi-image"></i></td>
          <td><a href="#${legoPart.id}" id="edit_${legoPart.id}" class="link-success">Edit</a>
              <a href="#${legoPart.id}" id="delete_${legoPart.id}" class="link-danger">Delete</a>
          <td>
        </tr>`
    })

    if (this.legoParts.length > 0) {
      document.getElementById('legoPartTable').hidden = false
    }

    const viewController = this
    this.legoParts.forEach(legoPart => {
      const editButton = document.getElementById('edit_' + legoPart.id)
      const deleteButton = document.getElementById('delete_' + legoPart.id)
      const checkButton = document.getElementById('checkbox_' + legoPart.id)
      const nameField = document.getElementById('name')
      const descriptionField = document.getElementById('description')
      const partNumberField = document.getElementById('part_number')
      const quantityField = document.getElementById('quantity')
      const colorField = document.getElementById('color')
      const imageField = document.getElementById('image')

      // edit
      editButton.addEventListener('click', function () {
        const legoPartId = viewController.utilities.getLegoPartIDFromComponent(editButton.id)
        const selectedLegoPart = viewController.utilities.getLegoPartByID(legoPartId, viewController.legoParts)

        viewController.isUpdating = true
        viewController.legoPartIdToEdit = selectedLegoPart.id

        nameField.value = selectedLegoPart.name
        descriptionField.value = selectedLegoPart.description
        partNumberField.value = selectedLegoPart.part_number
        quantityField.value = selectedLegoPart.quantity
        colorField.value = selectedLegoPart.color
        imageField.value = selectedLegoPart.image
        viewController.addLegoPartModal.show()
      })

      // delete
      deleteButton.addEventListener('click', function () {
        viewController.isBatchDeleting = false
        viewController.isUpdating = false
        const legoPartId = viewController.utilities.getLegoPartIDFromComponent(deleteButton.id)
        viewController.showDeleteDialog(legoPartId)
        this.removeEventListener('click', deleteButton) // is this line necessary ?
      })

      // select
      checkButton.addEventListener('click', function () {
        const legoPartId = viewController.utilities.getLegoPartIDFromComponent(checkButton.id)
        if (checkButton.checked) {
          const selectedLegoPart = viewController.utilities.getLegoPartByID(legoPartId, viewController.legoParts)
          viewController.selectedLegoParts.push(selectedLegoPart)
        } else {
          viewController.utilities.removeSelectedLegoPart(legoPartId, viewController.selectedLegoParts)
        }
        viewController.controlSelectedDeleteButtonState()
      })
    })
  }

  controlSelectedDeleteButtonState () {
    const deleteSelectedLegoPartsButton = document.getElementById('deleteSelectedLegoParts')
    if (this.selectedLegoParts.length === 0) {
      deleteSelectedLegoPartsButton.disabled = true
    } else {
      deleteSelectedLegoPartsButton.disabled = false
    }
  }

  async editLegoPart () {
    // TODO duplicated code create a method for it
    const addLegoPartSpinner = document.getElementById('addLegoPartSpinner')
    const legoPartForm = document.getElementById('legoPartForm')
    const legoPartFormData = new FormData(legoPartForm)
    const legoPartFormObject = Object.fromEntries(legoPartFormData)
    const legoPartJSONString = JSON.stringify(legoPartFormObject)
    const addLegoPartModalFooter = document.getElementById('addLegoPartModalFooter')

    addLegoPartSpinner.hidden = false
    addLegoPartModalFooter.hidden = true

    try {
      await this.service.updateLegoPartFromAPI(legoPartJSONString, this.legoPartIdToEdit)
      this.showInfoToast('Lego part updated with success.')
      await this.fetchLegoParts()
      this.addLegoPartModal.hide()
    } catch (e) {
      this.showInfoToast('Error when updating lego part, please try again.')
    } finally {
      legoPartForm.reset()
      addLegoPartSpinner.hidden = true
      addLegoPartModalFooter.hidden = false
    }
  }

  async addLegoPart () {
    // TODO duplicated code create a method for it
    const addLegoPartSpinner = document.getElementById('addLegoPartSpinner')
    const legoPartForm = document.getElementById('legoPartForm')
    const legoPartFormData = new FormData(legoPartForm)
    const legoPartFormObject = Object.fromEntries(legoPartFormData)
    const legoPartJSONString = JSON.stringify(legoPartFormObject)
    const addLegoPartModalFooter = document.getElementById('addLegoPartModalFooter')

    addLegoPartSpinner.hidden = false
    addLegoPartModalFooter.hidden = true

    try {
      await this.service.createLegoPartFromAPI(legoPartJSONString)
      this.showInfoToast('Lego part created with success.')
      await this.fetchLegoParts()
      this.addLegoPartModal.hide()
    } catch (e) {
      this.showInfoToast('Error when creating lego part, please try again.')
    } finally {
      legoPartForm.reset()
      addLegoPartSpinner.hidden = true
      addLegoPartModalFooter.hidden = false
    }
  }

  async deleteLegoPart (legoPartIdToDelete) {
    const deleteLegoPartSpinner = document.getElementById('deleteLegoPartSpinner')
    const deleteLegoPartFooterButtons = document.getElementById('deleteLegoPartFooterButtons')
    const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
    const legoPartToDelete = this.utilities.getLegoPartByID(legoPartIdToDelete, this.legoParts)

    deleteLegoPartSpinner.hidden = false
    deleteLegoPartFooterButtons.hidden = true
    deleteLegoPartConfirmationText.innerText = `Deleting lego part number ${legoPartToDelete.name}.`

    try {
      await this.service.deleteLegoPartFromAPI(legoPartIdToDelete)
      this.showInfoToast('Lego part deleted with success.')
      await this.fetchLegoParts()
      this.deleteLegoPartConfirmationModal.hide()
    } catch (e) {
      this.deleteLegoPartConfirmationModal.hide()
      this.showErrorDialog('Error when deleting lego part, try again later.')
    } finally {
      deleteLegoPartSpinner.hidden = true
      deleteLegoPartFooterButtons.hidden = false
      deleteLegoPartConfirmationText.innerText = 'Are you sure to delete this lego part ?'
    }
  }

  async deleteAllSelectedLegoParts () {
    const deleteLegoPartSpinner = document.getElementById('deleteLegoPartSpinner')
    const deleteLegoPartFooterButtons = document.getElementById('deleteLegoPartFooterButtons')

    deleteLegoPartSpinner.hidden = false
    deleteLegoPartFooterButtons.hidden = true

    try {
      const selectedLegoPartIDs = {}
      selectedLegoPartIDs.ids = this.selectedLegoParts.map(legoPart => legoPart.id)
      await this.service.deleteLegoPartsFromAPI(selectedLegoPartIDs)
      this.showInfoToast('Lego parts deleted with success.')
      await this.fetchLegoParts()
      this.controlSelectedDeleteButtonState()
      if (this.legoParts.length === 0) {
        document.getElementById('legoPartTable').hidden = true
        const deleteSelectedLegoPartsButton = document.getElementById('deleteSelectedLegoParts')
        deleteSelectedLegoPartsButton.disabled = true
      }
      this.deleteLegoPartConfirmationModal.hide()
    } catch (e) {
      this.deleteLegoPartConfirmationModal.hide()
      this.showErrorDialog('Error when deleting lego parts, try again later.')
    } finally {
      deleteLegoPartSpinner.hidden = true
      deleteLegoPartFooterButtons.hidden = false
    }
  }

  showDeleteAllSelectedLegoPartsDialog () {
    this.isBatchDeleting = true
    this.showDeleteLegoPartsDialog()
  }

  selectAllLegoParts () {
    this.legoParts.forEach(legoPart => {
      const legoPartCheckBox = document.getElementById('checkbox_' + legoPart.id)
      legoPartCheckBox.checked = true
    })
    this.selectedLegoParts = this.utilities.cloneLegoParts(this.legoParts)
    this.controlSelectedDeleteButtonState()
  }

  unSelectAllLegoParts () {
    this.legoParts.forEach(legoPart => {
      const legoPartCheckBox = document.getElementById('checkbox_' + legoPart.id)
      legoPartCheckBox.checked = false
    })
    this.selectedLegoParts = []
    this.controlSelectedDeleteButtonState()
  }

  openAddLegoPartModal () {
    this.isUpdating = false
    this.addLegoPartModal.show()
  }

  showInfoToast (message) {
    const informationToastBody = document.getElementById('infoToastBody')
    informationToastBody.innerText = message
    this.bootStrapInformationToast.show()
  }

  showErrorDialog (errorMessage) {
    const errorMessageText = document.getElementById('errorMessage')
    errorMessageText.innerText = errorMessage
    this.errorModal.show()
  }

  showDeleteDialog (legoPartIdToDelete) {
    this.legoPartIdToDelete = legoPartIdToDelete
    const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
    const legoPartToDelete = this.utilities.getLegoPartByID(this.legoPartIdToDelete, this.legoParts)
    deleteLegoPartConfirmationText.innerText = `Are you sure to delete lego part ${legoPartToDelete.name} ?`
    this.deleteLegoPartConfirmationModal.show()
  }

  showDeleteLegoPartsDialog () {
    const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
    deleteLegoPartConfirmationText.innerText = 'Are you sure to delete lego the selected parts ?'
    this.deleteLegoPartConfirmationModal.show()
  }

  dummyMethod () {
    return 1
  }
}

export { ViewController }
