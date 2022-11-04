import { ViewController } from 'http://localhost:8080/modules/controllers.js'

const openAddLegoPartModalButton = document.getElementById('openAddLegoPartModal')
const addLegoPartModalSaveButton = document.getElementById('addLegoPartModalSave')
const deleteSelectedLegoPartsButton = document.getElementById('deleteSelectedLegoParts')
const deleteLegoPartDialogButton = document.getElementById('deleteLegoPartDialogButton')
const selectAllLegoPartsCheckBox = document.getElementById('selectAllLegoPartsCheckBox')

const viewController = new ViewController()
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
  console.log('ViewController state ' + viewController.isUpdating)
  if (viewController.isUpdating) {
    viewController.editLegoPart()
  } else {
    viewController.addLegoPart()
  }
}

function deleteSelectedLegoParts () {
  console.log('TODO deleteSelectedLegoParts')
  viewController.deleteAllSelectedLegoParts()
}

function deleteLegoPartDialog () {
  viewController.deleteLegoPart(viewController.legoPartIdToDelete)
}

function selectAllLegoParts () {
  console.log('Select All Lego Parts')
  if (selectAllLegoPartsCheckBox.checked) {
    viewController.selectAllLegoParts()
  } else {
    viewController.unSelectAllLegoParts()
  }
}

export { openAddLegoPartModal }
