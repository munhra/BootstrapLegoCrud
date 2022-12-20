// import { setGlobalDispatcher, Agent } from 'undici'
import { Service } from '../public/modules/service.js'
console.log('populate db')
// setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }))

const service = new Service()

// code below generate UND_ERR_CONNECT_TIMEOUT

// const selectedLegoPartIDs = {}
// selectedLegoPartIDs.ids = []
// await service.deleteLegoPartsFromAPI(selectedLegoPartIDs)

for (let i = 1; i < 10; i++) {
  const legoPart = {}
  legoPart.name = `Lego Part ${i}`
  legoPart.quantity = i * 100
  legoPart.image = `Image ${i}`
  legoPart.color = `Color ${i}`
  legoPart.part_number = `12345ABCD${i + 11}`
  legoPart.description = `Description ${i}`

  const legoPartJSONString = JSON.stringify(legoPart)
  console.log(legoPartJSONString)
  await service.createLegoPartFromAPI(legoPartJSONString)
}
