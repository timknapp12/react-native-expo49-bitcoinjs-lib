module.exports = {
  Block: require('./block'),
  ECPair: require('./ecpair'),
  ECSignature: require('./ecsignature'),
  HDNode: require('./hdnode'),
  Transaction: require('./transaction'),
  TransactionBuilder: require('./transaction_builder'),

  address: require('./address'),
  bufferutils: require('./bufferutils'), // TODO: remove in 4.0.0
  crypto: require('./crypto'),
  networks: require('./networks'),
  opcodes: require('bitcoin-ops'),
  script: require('./script'),
  bip32: require('./bip32'),
  payments: {
    p2pkh: require('./payments/p2pkh'),
    // Add other payment types as needed
  },
}
