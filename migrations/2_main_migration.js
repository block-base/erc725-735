var { writeFileSync, readFileSync } = require('fs')
var Web3Utils = require('web3-utils');
var UserRegistry = artifacts.require("./UserRegistry.sol");
var KeyHolder = artifacts.require("./KeyHolder.sol");
var ClaimVerifier = artifacts.require("./ClaimVerifier.sol");

var Wallet = require('ethereumjs-wallet');
var wallet = Wallet.generate();

var signerPrivKey = wallet.getPrivateKeyString();
var signerAddress = wallet.getAddressString();
writeFileSync('../signer_priv_key', signerPrivKey)

module.exports = async function (deployer) {
  deployer.then(async function () {

    await deployer.deploy(KeyHolder).then(async () => {
      var issuerInstance = await KeyHolder.deployed()
      var signerKey = Web3Utils.soliditySha3(signerAddress)
      issuerInstance.addKey(signerKey, 3, 1)
      writeFileSync('issuer_address', issuerInstance.address)
    });

    await deployer.deploy(UserRegistry).then(async () => {
      var registryInstance = await UserRegistry.deployed()
      writeFileSync('registory_address', registryInstance.address)
    });

    await deployer.deploy(ClaimVerifier, readFileSync('issuer_address', 'utf-8')).then(async () => {
      var verifierInstance = await ClaimVerifier.deployed()
      writeFileSync('verifier_address', verifierInstance.address)      
    });

  })
};
