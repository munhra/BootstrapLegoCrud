import { ViewController } from 'http://localhost:8080/modules/controllers.js'

const openAddLegoPartModalButton = document.getElementById('openAddLegoPartModal')
const addLegoPartModalSaveButton = document.getElementById('addLegoPartModalSave')
const deleteSelectedLegoPartsButton = document.getElementById('deleteSelectedLegoParts')

const viewController = new ViewController()
viewController.fetchLegoParts()

openAddLegoPartModalButton.addEventListener('click', openAddLegoPartModal)
addLegoPartModalSaveButton.addEventListener('click', addLegoPartModalSave)
deleteSelectedLegoPartsButton.addEventListener('click', deleteSelectedLegoParts)

function openAddLegoPartModal () {
  viewController.openAddLegoPartModal()
}

function addLegoPartModalSave () {
  viewController.addLegoPart()
}

function deleteSelectedLegoParts () {
  console.log('TODO deleteSelectedLegoParts')
}

export { openAddLegoPartModal }
