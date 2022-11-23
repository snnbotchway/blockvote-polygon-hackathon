const ElectionPortal = artifacts.require("ElectionPortal");

module.exports = function (deployer) {
	deployer.deploy(ElectionPortal);
};
