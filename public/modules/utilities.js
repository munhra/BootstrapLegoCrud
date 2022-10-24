class Utilities {
  constructor (legoParts) {
    this.legoParts = legoParts
  }

  sortLegoPartNumbers () {
    this.legoParts.sort((p1, p2) => {
      if (p1.name > p2.name) {
        return 1
      }
      if (p1.name < p2.name) {
        return -1
      }
      return 0
    })
  }

  getLegoPartNameByID (legoPartID) {
    return this.legoParts.find((legoPart) => legoPart.id === legoPartID)
  }
}

export { Utilities }
