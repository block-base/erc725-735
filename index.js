var {readFileSync} = require('fs')
var signerPrivKeyString = readFileSync('signer_priv_key', 'utf-8')

var Web3 = require('web3');
var web3 = new Web3("https://mainnet.infura.io");

var url = require('url');

var express = require('express');
var app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
  if (!req.xhr) {
    res.status(500).send('Not AJAX');
  }
  else {
    next();
  }
});

app.get('/add', function (req, res) {

  var urlParts = url.parse(req.url, true);
  var parameters = urlParts.query;
  var identity = parameters.identity;
  var claimType = parameters.claimType;

  var rawData = "Verified OK";
  var hexData = web3.utils.asciiToHex(rawData)  
  var hash = web3.utils.soliditySha3(identity ,claimType,hexData)

  var sig = web3.eth.accounts.sign(hash, signerPrivKeyString).signature;

  res.json(
    { 
      sig: sig,
      data: hexData,
      status: true,
    });  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});