const HDNode = require("./hdnode")

const bip32 = {
  fromSeed: function (seed, network) {
    return HDNode.fromSeedBuffer(seed, network)
  },
  // Implement other bip32 methods as needed
}

module.exports = bip32
