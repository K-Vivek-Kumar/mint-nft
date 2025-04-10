var NFTRecord = artifacts.require("./NFTRecord.sol");

module.exports = function (deployer) {
  deployer.deploy(NFTRecord);
};
