import { ViewController } from './modules/controllers.JS'

const openAddLegoPartModalButton = document.getElementById('openAddLegoPartModal')
const addLegoPartModalSaveButton = document.getElementById('addLegoPartModalSave')
const deleteSelectedLegoPartsButton = document.getElementById('deleteSelectedLegoParts')
const deleteLegoPartDialogButton = document.getElementById('deleteLegoPartDialogButton')
const selectAllLegoPartsCheckBox = document.getElementById('selectAllLegoPartsCheckBox')

const viewController = new ViewController(new bootstrap.Modal(document.getElementById('addLegoPartModal')),
                                          new bootstrap.Modal(document.getElementById('deleteLegoPartConfirmationModal')),
                                          new bootstrap.Toast(document.getElementById('informationToast')),
                                          new bootstrap.Modal(document.getElementById('errorDialog')))
viewController.fetchLegoParts()

openAddLegoPartModalButton.addEventListener('click', openAddLegoPartModal)
addLegoPartModalSaveButton.addEventListener('click', addLegoPartModalSave)
deleteSelectedLegoPartsButton.addEventListener('click', deleteSelectedLegoParts)
deleteLegoPartDialogButton.addEventListener('click', deleteLegoPartDialog)
selectAllLegoPartsCheckBox.addEventListener('click', selectAllLegoParts)

function openAddLegoPartModal () {
  viewController.openAddLegoPartModal()
}

function addLegoPartModalSave () {
  if (viewController.isUpdating) {
    viewController.editLegoPart()
  } else {
    viewController.addLegoPart()
  }
}

function deleteSelectedLegoParts () {
  viewController.showDeleteAllSelectedLegoPartsDialog()
}

function deleteLegoPartDialog () {
  if (viewController.isBatchDeleting) {
    viewController.deleteAllSelectedLegoParts()
  } else {
    viewController.deleteLegoPart(viewController.legoPartIdToDelete)
  }
}

function selectAllLegoParts () {
  if (selectAllLegoPartsCheckBox.checked) {
    viewController.selectAllLegoParts()
  } else {
    viewController.unSelectAllLegoParts()
  }
}

export { openAddLegoPartModal }
