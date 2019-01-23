var Marketplace = artifacts.require('Marketplace.sol');


module.exports = (deployer, network, accounts) => {
    deployer.deploy(Marketplace, {from: accounts[0]});
};
