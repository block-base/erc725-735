var {readFileSync} = require('fs')

var UserRegistry = artifacts.require('UserRegistry')
var Identity = artifacts.require('Identity')

var ClaimHolder = artifacts.require('ClaimHolder')
var KeyHolder = artifacts.require('KeyHolder')
var ClaimVerifier = artifacts.require('ClaimVerifier')

var Web3Utils = require('web3-utils');

var signerPrivKeyString = readFileSync('signer_priv_key', 'utf-8')

var Web3 = require('web3');
const web3_v1 = new Web3(web3.currentProvider);

contract('Integration', async function(accounts) {
  
  it('Deploy identity', async function() {
    var userRegistry = await UserRegistry.deployed()
    await Identity.new(userRegistry.address);
  })
  
  it('Add key to identity', async function() {
    var claimVerifier = await ClaimVerifier.deployed();
    var userRegistry = await UserRegistry.deployed();
    var user = await userRegistry.users(accounts[0]);

    var claimHolder = await ClaimHolder.at(user);

    var issuer = await KeyHolder.deployed();
    var claimType = 0;

    var rawData = "Verified OK";
    var hexData = Web3Utils.asciiToHex(rawData)  

    var data = Web3Utils.soliditySha3(user,claimType,hexData)
    var sig = web3_v1.eth.accounts.sign(data, signerPrivKeyString).signature;

    await claimHolder.addClaim(
      claimType,
      0,
      issuer.address,
      sig,
      hexData,
      ""
    )

    result = await claimVerifier.claimIsValid(user, claimType);
    assert.equal(result, true);
    
  })

})