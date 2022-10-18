const addLegoPartModal = new bootstrap.Modal(document.getElementById('addLegoPartModal'))
const deleteLegoPartConfirmationModal = new bootstrap.Modal(document.getElementById('deleteLegoPartConfirmationModal'))

var legoPartIdToDelete
var legoParts = []

fetchLegoParts()

async function fetchLegoParts () {
  try {
    legoParts = await getAllLegoPartsFromAPI()
    sortLegoPartNumbers()
  } catch (e) {
    showErrorDialog('Error when fetching all lego parts, please try again later.')
  }
  const legoPartTableBody = document.getElementById('legoPartTableBody')
  legoPartTableBody.innerHTML = ''
  legoParts.forEach(legoPart => {
    legoPartTableBody.innerHTML = legoPartTableBody.innerHTML +
    `<tr>
        <td>${legoPart.name}</td>
        <td>${legoPart.description}</td>
        <td>${legoPart.part_number}</td>
        <td>${legoPart.qtd}</td>
        <td>${legoPart.color}</td>
        <td><i class="bi bi-image"></i></td>
        <td><a href="#${legoPart.id}" class="link-success"><i class="bi bi-pen-fill ms-2"></i></a>
            <a href="#${legoPart.id}" id="${legoPart.id}" class="link-danger" onclick="showDeleteDialog(this)"><i class="bi bi-trash-fill ms-2"></i></a>
      </tr>`
  });
  document.getElementById('legoPartTable').hidden = false
}

async function addLegoPart () {
  const addLegoPartSpinner = document.getElementById('addLegoPartSpinner')
  const legoPartForm = document.getElementById('legoPartForm')
  const legoPartFormData = new FormData(legoPartForm)
  const legoPartFormObject = Object.fromEntries(legoPartFormData)
  const legoPartJSONString = JSON.stringify(legoPartFormObject)
  const addLegoPartModalFooter = document.getElementById('addLegoPartModalFooter')

  var createdLegoPart = {}
  addLegoPartSpinner.hidden = false
  addLegoPartModalFooter.hidden = true

  try {
    createdLegoPart = await createLegoPartFromAPI(legoPartJSONString)
    showInfoToast('Lego part created with success.')
    await fetchLegoParts()
    addLegoPartModal.hide()
  } catch (e) {
    showInfoToast('Error when creating lego part, please try again.')
  } finally {
    legoPartForm.reset()
    addLegoPartSpinner.hidden = true
    addLegoPartModalFooter.hidden = false
  }
}

async function deleteLegoPart () {
  const deleteLegoPartSpinner = document.getElementById('deleteLegoPartSpinner')
  const deleteLegoPartFooterButtons = document.getElementById('deleteLegoPartFooterButtons')
  const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')

  legoPartToDelete = getLegoPartNameByID(legoPartIdToDelete)

  deleteLegoPartSpinner.hidden = false
  deleteLegoPartFooterButtons.hidden = true
  deleteLegoPartConfirmationText.innerText = `Deleting lego part number ${legoPartToDelete.name}.`

  try {
    await deleteLegoPartFromAPI(legoPartIdToDelete)
    showInfoToast('Lego part deleted with success.')
    await fetchLegoParts()
    deleteLegoPartConfirmationModal.hide()
  } catch (e) {
    deleteLegoPartConfirmationModal.hide()
    showErrorDialog('Error when deleting lego part, try again later.')
  } finally {
    deleteLegoPartSpinner.hidden = true
    deleteLegoPartFooterButtons.hidden = false
    deleteLegoPartConfirmationText.innerText = 'Are you sure to delete this lego part ?'
  }
}

function openAddLegoPartModal () {
  addLegoPartModal.show()
}

function showInfoToast (message) {
  const informationToastBody = document.getElementById('infoToastBody')
  informationToastBody.innerText = message
  const informationToast = document.getElementById('informationToast')
  const bootStrapInformationToast = new bootstrap.Toast(informationToast)
  bootStrapInformationToast.show()
}

function showErrorDialog (errorMessage) {
  const errorMessageText = document.getElementById('errorMessage')
  errorMessageText.innerText = errorMessage
  const errorModal = new bootstrap.Modal(document.getElementById('errorDialog'))
  errorModal.show()
}

async function showDeleteDialog (legoPartLink) {
  legoPartIdToDelete = legoPartLink.id
  const deleteLegoPartConfirmationText = document.getElementById('deleteLegoPartConfirmationText')
  legoPartToDelete = getLegoPartNameByID(legoPartIdToDelete)
  deleteLegoPartConfirmationText.innerText = `Are you sure to delete lego part ${legoPartToDelete.name} ?`
  deleteLegoPartConfirmationModal.show()
}
