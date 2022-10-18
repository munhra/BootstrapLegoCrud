// improve the urls to fast switch between test and production
const productionGetAllLegoPartsURL = 'https://us-central1-lego-1ee0d.cloudfunctions.net/lego_parts';
const productionCreateLegoPartURL = 'https://us-central1-lego-1ee0d.cloudfunctions.net/lego_parts';
const productionDeleteLegoPartURL = 'https://us-central1-lego-1ee0d.cloudfunctions.net/lego_parts';

async function getAllLegoPartsFromAPI() {
  // maybe sort on the server is a better aproach
  const response = await fetch(productionGetAllLegoPartsURL, {
    mode:"cors"
  });
  if (response.ok) {
    const legoParts = await response.json();
    return legoParts;
  } else {
    throw new Error('Server Error when getAllLegoParts');
  }
}

async function createLegoPartFromAPI(legoPartJSONString) {
  const response = await fetch(productionCreateLegoPartURL, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    mode:"cors",
    body:legoPartJSONString
  });
  if (response.ok) {
    const createdLegoPart = await response.json();
    return createdLegoPart;
  } else {
    throw new Error('Server error when createLegoPart');
  }
}

async function deleteLegoPartFromAPI(legoPartId) {
  const response = await fetch(`${productionDeleteLegoPartURL}/${legoPartId}`, {
    method:"DELETE",
    mode:"cors"
  });
  if (response.ok) {
    const deletedLegoPartId = response.json();
  } else {
    throw new Error(`Server error when deleting lego part with id ${deletedLegoPartId.id}`)
  }
}