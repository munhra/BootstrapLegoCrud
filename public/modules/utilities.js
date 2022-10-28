class Utilities {
  sortLegoPartNumbers (legoParts) {
    legoParts.sort((p1, p2) => {
      if (p1.name > p2.name) {
        return 1
      }
      if (p1.name < p2.name) {
        return -1
      }
      return 0
    })
  }

  getLegoPartNameByID (legoPartID, legoParts) {
    return legoParts.find((legoPart) => legoPart.id === legoPartID)
  }

  getLegoPartIDFromCheckbox (checkboxID) {
    const splittedCheckboxID = checkboxID.split('_')
    return splittedCheckboxID[1]
  }

  removeSelectedLegoPart (legoPartID, selectedLegoParts) {
    const legoPartIndex = selectedLegoParts.findIndex((legoPart) => legoPart.id === legoPartID)
    if (legoPartIndex > -1) {
      selectedLegoParts.splice(legoPartIndex, 1)
    }
  }

  cloneLegoParts (legoParts) {
    const clonedLegoParts = []
    legoParts.forEach(legoPart => {
      clonedLegoParts.push(legoPart)
    })
    return clonedLegoParts
  }
}

export { Utilities }
