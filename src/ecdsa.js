import { HmacSHA256 } from "crypto-es";
import { WordArray } from "crypto-es/lib/core";
import BigInteger from "bigi";
var typeforce = require("typeforce");
var types = require("./types");

var ECSignature = require("./ecsignature");

var ecurve = require("ecurve");
var secp256k1 = ecurve.getCurveByName("secp256k1");

// https://tools.ietf.org/html/rfc6979#section-3.2
function deterministicGenerateK(hash, x, checkSig, secp256k1) {
  typeforce(
    types.tuple(types.Hash256bit, types.Buffer256bit, types.Function),
    arguments
  );

  let k = WordArray.create(new Uint8Array(32));
  let v = WordArray.create(new Uint8Array(32));
  const ZERO = WordArray.create([0]);
  const ONE = WordArray.create([1]);

  // Step A, ignored as hash already provided
  // Step B
  v.fill(1);

  // Step C
  k.fill(0);

  // Step D
  k = HmacSHA256(v.concat(ZERO).concat(x).concat(hash), k);

  // Step E
  v = HmacSHA256(v, k);

  // Step F
  k = HmacSHA256(v.concat(ONE).concat(x).concat(hash), k);

  // Step G
  v = HmacSHA256(v, k);

  // Step H1/H2a, ignored as tlen === qlen (256 bit)
  // Step H2b
  v = HmacSHA256(v, k);

  let T = BigInteger.fromBuffer(Buffer.from(v.toString(), "hex"));

  // Step H3, repeat until T is within the interval [1, n - 1] and is suitable for ECDSA
  while (T.signum() <= 0 || T.compareTo(secp256k1.n) >= 0 || !checkSig(T)) {
    k = HmacSHA256(v.concat(ZERO), k);
    v = HmacSHA256(v, k);
    v = HmacSHA256(v, k); // Repeated as per original logic
    T = BigInteger.fromBuffer(Buffer.from(v.toString(), "hex"));
  }

  return T;
}

var N_OVER_TWO = secp256k1.n.shiftRight(1);

function sign(hash, d) {
  typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments);

  var x = d.toBuffer(32);
  var e = BigInteger.fromBuffer(hash);
  var n = secp256k1.n;
  var G = secp256k1.G;

  var r, s;
  deterministicGenerateK(hash, x, function (k) {
    var Q = G.multiply(k);

    if (secp256k1.isInfinity(Q)) return false;

    r = Q.affineX.mod(n);
    if (r.signum() === 0) return false;

    s = k
      .modInverse(n)
      .multiply(e.add(d.multiply(r)))
      .mod(n);
    if (s.signum() === 0) return false;

    return true;
  });

  // enforce low S values, see bip62: 'low s values in signatures'
  if (s.compareTo(N_OVER_TWO) > 0) {
    s = n.subtract(s);
  }

  return new ECSignature(r, s);
}

function verify(hash, signature, Q) {
  typeforce(
    types.tuple(types.Hash256bit, types.ECSignature, types.ECPoint),
    arguments
  );

  var n = secp256k1.n;
  var G = secp256k1.G;

  var r = signature.r;
  var s = signature.s;

  // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
  if (r.signum() <= 0 || r.compareTo(n) >= 0) return false;
  if (s.signum() <= 0 || s.compareTo(n) >= 0) return false;

  // 1.4.2 H = Hash(M), already done by the user
  // 1.4.3 e = H
  var e = BigInteger.fromBuffer(hash);

  // Compute s^-1
  var sInv = s.modInverse(n);

  // 1.4.4 Compute u1 = es^−1 mod n
  //               u2 = rs^−1 mod n
  var u1 = e.multiply(sInv).mod(n);
  var u2 = r.multiply(sInv).mod(n);

  // 1.4.5 Compute R = (xR, yR)
  //               R = u1G + u2Q
  var R = G.multiplyTwo(u1, Q, u2);

  // 1.4.5 (cont.) Enforce R is not at infinity
  if (secp256k1.isInfinity(R)) return false;

  // 1.4.6 Convert the field element R.x to an integer
  var xR = R.affineX;

  // 1.4.7 Set v = xR mod n
  var v = xR.mod(n);

  // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
  return v.equals(r);
}

module.exports = {
  deterministicGenerateK: deterministicGenerateK,
  sign: sign,
  verify: verify,

  // TODO: remove
  __curve: secp256k1,
};
