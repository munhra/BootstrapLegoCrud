import { Utilities } from 'http://localhost:8080/modules/utilities.js'
import { Service } from 'http://localhost:8080/modules/service.js'

class ViewController {
  addLegoPartModal = new bootstrap.Modal(document.getElementById('addLegoPartModal'))
  deleteLegoPartConfirmationModal = new bootstrap.Modal(document.getElementById('deleteLegoPartConfirmationModal'))
  // TODO create utilities attribute to be used in the class, is there a way to call it lazy ?
  // TODO error on select all lines
  service = new Service()

  legoPartIdToDelete
  utilities
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
          <td>${legoPart.qtd}</td>
          <td>${legoPart.color}</td>
          <td><i class="bi bi-image"></i></td>
          <td><a href="#${legoPart.id}" class="link-success">Edit</a>
              <a href="#${legoPart.id}" id="${legoPart.id}" class="link-danger">Delete</a>
          <td>
        </tr>`
    })
    document.getElementById('legoPartTable').hidden = false
    // check why bootstrap icons are not working in deploy

    const viewController = this
    this.legoParts.forEach(legoPart => {
      const deleteButton = document.getElementById(legoPart.id)
      const checkButton = document.getElementById('checkbox_' + legoPart.id)

      deleteButton.addEventListener('click', function () {
        viewController.showDeleteDialog(deleteButton.id)
        removeEventListener('click', deleteButton) // is this line necessary ?
      })

      checkButton.addEventListener('click', function () {
        const legoPartId = viewController.utilities.getLegoPartIDFromCheckbox(checkButton.id)
        console.log('Lego Part ID => ' + legoPartId)
        if (checkButton.checked) {
          console.log('Part checked')
          const selectedLegoPart = viewController.utilities.getLegoPartNameByID(legoPartId, viewController.legoParts)
          console.log('Push lego part in selected array ' + selectedLegoPart.id)
          viewController.selectedLegoParts.push(selectedLegoPart)
          console.log('Part added to selectedLegoParts ' + viewController.selectedLegoParts.length)
        } else {
          console.log('Part UNchecked')
          viewController.utilities.removeSelectedLegoPart(legoPartId, viewController.selectedLegoParts)
          console.log('selectedLegoParts count -> ' + viewController.selectedLegoParts.length)
        }
      })
    })
  }

  async addLegoPart () {
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
    const legoPartToDelete = this.utilities.getLegoPartNameByID(legoPartIdToDelete, this.legoParts)

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
    const legoPartToDelete = this.utilities.getLegoPartNameByID(this.legoPartIdToDelete, this.legoParts)
    deleteLegoPartConfirmationText.innerText = `Are you sure to delete lego part ${legoPartToDelete.name} ?`
    this.deleteLegoPartConfirmationModal.show()
  }
}

export { ViewController }
