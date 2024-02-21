import * as Crypto from "expo-crypto";

async function ripemd160(buffer) {
  const hashBuffer = await Crypto.digest(
    Crypto.CryptoDigestAlgorithm.RIPEMD160,
    buffer
  );
  return new Uint8Array(hashBuffer);
}

async function sha1(buffer) {
  const hashBuffer = await Crypto.digest(
    Crypto.CryptoDigestAlgorithm.SHA1,
    buffer
  );
  return new Uint8Array(hashBuffer);
}

async function sha256(buffer) {
  const hashBuffer = await Crypto.digest(
    Crypto.CryptoDigestAlgorithm.SHA256,
    buffer
  );
  return new Uint8Array(hashBuffer);
}

async function hash160(buffer) {
  const sha256Buffer = await sha256(buffer);
  return ripemd160(sha256Buffer);
}

async function hash256(buffer) {
  const firstPass = await sha256(buffer);
  return sha256(firstPass);
}

module.exports = {
  hash160,
  hash256,
  ripemd160,
  sha1,
  sha256,
};
