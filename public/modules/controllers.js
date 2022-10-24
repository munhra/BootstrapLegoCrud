import { Utilities } from 'http://localhost:8080/modules/utilities.js'
import { Service } from 'http://localhost:8080/modules/service.js'

class ViewController {
  addLegoPartModal = new bootstrap.Modal(document.getElementById('addLegoPartModal'))
  deleteLegoPartConfirmationModal = new bootstrap.Modal(document.getElementById('deleteLegoPartConfirmationModal'))

  service = new Service()

  legoPartIdToDelete
  legoParts = []

  constructor () {
    this.addListenerToDeleteDialogButton()
  }

  async fetchLegoParts () {
    try {
      this.legoParts = await this.service.getAllLegoPartsFromAPI()
      const utilities = new Utilities(this.legoParts)
      utilities.sortLegoPartNumbers()
    } catch (e) {
      this.showErrorDialog('Error when fetching all lego parts, please try again later.')
    }

    const legoPartTableBody = document.getElementById('legoPartTableBody')
    legoPartTableBody.innerHTML = ''

    this.legoParts.forEach(legoPart => {
      legoPartTableBody.innerHTML = legoPartTableBody.innerHTML +
      `<tr>
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

    self = this
    this.legoParts.forEach(legoPart => {
      const deleteButton = document.getElementById(legoPart.id)
      deleteButton.addEventListener('click', function () {
        console.log('deleteButton ' + deleteButton.id)
        self.showDeleteDialog(deleteButton.id)
        removeEventListener('click', deleteButton)
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
    const utilities = new Utilities(this.legoParts)

    const legoPartToDelete = utilities.getLegoPartNameByID(legoPartIdToDelete)

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
    const utilities = new Utilities(this.legoParts)
    const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
    const legoPartToDelete = utilities.getLegoPartNameByID(this.legoPartIdToDelete)
    deleteLegoPartConfirmationText.innerText = `Are you sure to delete lego part ${legoPartToDelete.name} ?`
    this.deleteLegoPartConfirmationModal.show()
  }

  addListenerToDeleteDialogButton () {
    const deleteLegoPartDialogButton = document.getElementById('deleteLegoPartDialogButton')
    self = this
    deleteLegoPartDialogButton.addEventListener('click', async function () {
      await self.deleteLegoPart(self.legoPartIdToDelete)
    })
  }
}

export { ViewController }
