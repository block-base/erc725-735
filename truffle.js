var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNEMONIC;
var accessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    //This is for migrating to ganache private chain
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },

    //This is for migrating to mainnet
    live: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://mainnet.infura.io/"
        );
      },
      //It is recommend to set gasPrice (in wei)
      gasPrice: 15000000000, //ex. 10 gwei = 10000000000
      network_id: 1
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/"
        );
      },
      //Ropsten gas limit is 4700000 (Truffle default gas limit is 4712388).
      gas:4700000,
      network_id: 3
    },

    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/"
        );
      },
      network_id: 4
    }

  }
}
