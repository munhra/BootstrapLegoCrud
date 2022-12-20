import { Service } from '../public/modules/service.js'
console.log('populate db')

const service = new Service()

const selectedLegoPartIDs = {}
selectedLegoPartIDs.ids = []
await service.deleteLegoPartsFromAPI(selectedLegoPartIDs)

for (let i = 1; i < 10; i++) {
  const legoPart = {}
  legoPart.name = `Lego Part ${i}`
  legoPart.quantity = i * 100
  legoPart.image = `Image ${i}`
  legoPart.color = `Color ${i}`
  legoPart.part_number = `12345ABCD${i + 11}`
  legoPart.description = `Description ${i}`

  const legoPartJSONString = JSON.stringify(legoPart)
  await service.createLegoPartFromAPI(legoPartJSONString)
}
