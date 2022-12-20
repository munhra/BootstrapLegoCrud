// improve the urls to fast switch between test and production
const productionURL = 'https://us-central1-lego-1ee0d.cloudfunctions.net/lego_parts'

class Service {
  async getAllLegoPartsFromAPI () {
    const response = await fetch(productionURL, {
      mode: 'cors'
    })
    if (response.ok) {
      const legoParts = await response.json()
      return legoParts
    } else {
      throw new Error('Server Error when getAllLegoParts')
    }
  }

  async createLegoPartFromAPI (legoPartJSONString) {
    const response = await fetch(productionURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: legoPartJSONString
    })
    if (response.ok) {
      const createdLegoPart = await response.json()
      return createdLegoPart
    } else {
      throw new Error('Server Error when createLegoPart')
    }
  }

  async updateLegoPartFromAPI (legoPartJSONString, legoPartId) {
    const response = await fetch(`${productionURL}/${legoPartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: legoPartJSONString
    })
    if (response.ok) {
      const updatedLegoPart = await response.json()
      return updatedLegoPart
    } else {
      throw new Error('Server error when updateLegoPart')
    }
  }

  async deleteLegoPartFromAPI (legoPartId) {
    const response = await fetch(`${productionURL}/${legoPartId}`, {
      method: 'DELETE',
      mode: 'cors'
    })
    let deletedLegoPartId
    if (response.ok) {
      deletedLegoPartId = response.json()
      return deletedLegoPartId
    } else {
      throw new Error(`Server error when deleting lego part with id ${legoPartId}`)
    }
  }

  async deleteLegoPartsFromAPI (legoParts) {
    const legoPartsJSONString = JSON.stringify(legoParts)
    const response = await fetch(productionURL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: legoPartsJSONString
    })
    if (!response.ok) {
      throw new Error('Server error when deleting lego parts.')
    }
  }
}

export { Service }
