// module.exports = {
//   transform: {}
// }

// module.exports = {
//   testEnvironment: "node"
// }

module.exports = {
  preset: 'js-jest',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
    "../public/modules/utilities.js": "babel-jest"
  },
  verbose: 'true'
}

// //"../public/modules/utilities.js": "babel-jest"