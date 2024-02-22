const bitcoinOps = require('bitcoin-ops')
const bscript = require('../script')
const bcrypto = require('../crypto')

async function p2pkh({ pubkey, network }) {
  network = network || require('../networks').bitcoin

  const pkh = await bcrypto.hash160(pubkey) // Adjusted to await the promise
  const scriptPubKey = bscript.compile([
    bitcoinOps.opcodes.OP_DUP,
    bitcoinOps.opcodes.OP_HASH160,
    Buffer.from(pkh), // Ensure pkh is a Buffer
    bitcoinOps.opcodes.OP_EQUALVERIFY,
    bitcoinOps.opcodes.OP_CHECKSIG,
  ])

  const address = require('../address').toBase58Check(pkh, network.pubKeyHash)

  return { scriptPubKey, address }
}

module.exports = { p2pkh }
