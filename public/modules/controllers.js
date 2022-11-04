import { Utilities } from 'http://localhost:8080/modules/utilities.js'
import { Service } from 'http://localhost:8080/modules/service.js'

class ViewController {
  addLegoPartModal = new bootstrap.Modal(document.getElementById('addLegoPartModal'))
  deleteLegoPartConfirmationModal = new bootstrap.Modal(document.getElementById('deleteLegoPartConfirmationModal'))

  // TODO check add/edit method and variable names
  // TODO validate if the partnumber and part name already exists
  // TODO create utilities attribute to be used in the class, is there a way to call it lazy ?

  service = new Service()

  legoPartIdToDelete
  legoPartIdToEdit
  utilities
  isUpdating = false // maybe it would be nice to create a enum to inform the viewcontroller state
  legoParts = []
  selectedLegoParts = []

  async fetchLegoParts () {
    try {
      this.legoParts = await this.service.getAllLegoPartsFromAPI()
      this.utilities = new Utilities()
      this.utilities.sortLegoPartNumbers(this.legoParts)
    } catch (e) {
      this.showErrorDialog('Error when fetching all lego parts, please try again later.')
    }

    const legoPartTableBody = document.getElementById('legoPartTableBody')
    legoPartTableBody.innerHTML = ''
    console.log(this.legoParts)
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
    document.getElementById('legoPartTable').hidden = false
    // check why bootstrap icons are not working in deploy

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
        descriptionField.value = selectedLegoPart.value
        partNumberField.value = selectedLegoPart.part_number
        quantityField.value = selectedLegoPart.quantity
        colorField.value = selectedLegoPart.color
        imageField.value = selectedLegoPart.image

        viewController.addLegoPartModal.show()
      })

      // delete
      deleteButton.addEventListener('click', function () {
        viewController.isUpdating = false

        const legoPartId = viewController.utilities.getLegoPartIDFromComponent(deleteButton.id)
        viewController.showDeleteDialog(legoPartId)
        removeEventListener('click', deleteButton) // is this line necessary ?
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
      })
    })
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

  selectAllLegoParts () {
    this.legoParts.forEach(legoPart => {
      const legoPartCheckBox = document.getElementById('checkbox_' + legoPart.id)
      legoPartCheckBox.checked = true
    })
    this.selectedLegoParts = this.utilities.cloneLegoParts(this.legoParts)
  }

  unSelectAllLegoParts () {
    this.legoParts.forEach(legoPart => {
      const legoPartCheckBox = document.getElementById('checkbox_' + legoPart.id)
      legoPartCheckBox.checked = false
    })
    this.selectedLegoParts = []
  }

  async deleteAllSelectedLegoParts () {
    console.log('Call API to deleteAllSelectedLegoParts')
  }

  openAddLegoPartModal () {
    this.isUpdating = false
    this.addLegoPartModal.show()
  }

  showInfoToast (message) {
    const informationToastBody = document.getElementById('infoToastBody')
    informationToastBody.innerText = message
    const informationToast = document.getElementById('informationToast')
    const bootStrapInformationToast = new bootstrap.Toast(informationToast)
    bootStrapInformationToast.show()
  }

  showErrorDialog (errorMessage) {
    const errorMessageText = document.getElementById('errorMessage')
    errorMessageText.innerText = errorMessage
    const errorModal = new bootstrap.Modal(document.getElementById('errorDialog'))
    errorModal.show()
  }

  showDeleteDialog (legoPartIdToDelete) {
    this.legoPartIdToDelete = legoPartIdToDelete
    const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
    const legoPartToDelete = this.utilities.getLegoPartByID(this.legoPartIdToDelete, this.legoParts)
    deleteLegoPartConfirmationText.innerText = `Are you sure to delete lego part ${legoPartToDelete.name} ?`
    this.deleteLegoPartConfirmationModal.show()
  }
}

export { ViewController }
