# React Native Expo BitcoinJS (react-native-expo49-bitcoinjs-lib)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

React Native-ready fork of [react-native-expo-bitcoinjs-lib](https://github.com/maooricio/react-native-expo-bitcoinjs-lib) which was a fork of the [original bitcoinjs package](https://github.com/bitcoinjs/bitcoinjs-lib).

I needed a bitcoinjs-lib version that was compatible with react-native and expo sdk 49. The repo I forked [react-native-expo-bitcoinjs-lib](https://github.com/maooricio/react-native-expo-bitcoinjs-lib) used `expo-random`, which is deprecated and no longer supported in expo sdk 49. So I replaced the code using `expo-random` with `expo-crypto`. Test first before you trust it! This is still very new and I am still working out the issues and adding support for my needs. It does not have all the functionality as the bitcoinjs-lib.

## Installation

yarn: `yarn add react-native-expo49-bitcoinjs-lib` or npm: `npm install react-native-expo49-bitcoinjs-lib`

## Usage

Edit index.android.js and index.ios.js

```javascript
import Bitcoin from 'react-native-expo49-bitcoinjs-lib'
[...]
const keypair = await Bitcoin.ECPair.makeRandom()
console.log(keypair.getAddress()) // your brand new base58-encoded Bitcoin address
```

## Examples

Run the example app or refer to the [original repository](https://github.com/bitcoinjs/bitcoinjs-lib#examples) for more available examples.

## LICENSE [MIT](LICENSE)

Released under MIT license
