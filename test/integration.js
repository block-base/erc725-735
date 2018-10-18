var {readFileSync} = require('fs')

var UserRegistry = artifacts.require('UserRegistry')
var KeyHolder = artifacts.require('KeyHolder')
var ClaimVerifier = artifacts.require('ClaimVerifier')

var Web3Utils = require('web3-utils');

var Wallet = require('ethereumjs-wallet');
var wallet = Wallet.generate();

var signerPrivKey = wallet.getPrivateKeyString();
var signerAddress = wallet.getAddressString();

var signerKey = Web3Utils.soliditySha3(signerAddress)


contract('Issuer', async function(accounts) {

  it('Deploy issuer', async function() {
    var keyHolder = await KeyHolder.deployed();
    await keyHolder.addKey(signerKey, 3, 1,{from: accounts[0]});
    var key = await keyHolder.getKey(signerKey);

    assert.equal(key[0], 3);
    assert.equal(key[1], 1);
    assert.equal(key[2], signerKey);

  })

})

contract('UserRegistry', async function(accounts) {
  
  var userRegistry = await UserRegistry.deployed();

  it('Deploy identity', async function() {
    await userRegistry.identity({from: accounts[0]});
    user = await userRegistry.users(accounts[0]);
    assert.notEqual(user, 0x0000000000000000000000000000000000000000);
  })

  it('Add claim', async function() {
    user = await userRegistry.users(accounts[0]);
    console.log(user);    
    
  })

})