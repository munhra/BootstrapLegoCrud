function sortLegoPartNumbers() {
  legoParts.sort((p1, p2) => {
      if (p1.name > p2.name)
        return 1;
      if (p1.name < p2.name)
        return -1;
      return 0;
  });
}

function getLegoPartNameByID(legoPartID) {
  return legoParts.find((legoPart) => legoPart.id == legoPartID);
}