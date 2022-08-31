const CryptoChickens = artifacts.require("CryptoChickens");
module.exports = function (deployer) {
  deployer.deploy(CryptoChickens);
};
