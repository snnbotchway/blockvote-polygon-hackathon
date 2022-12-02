/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

const ElectionPortal = artifacts.require("ElectionPortal");

module.exports = async function (callback) {
	const deployed = await ElectionPortal.deployed();

	const elections = await deployed.getElections();
	console.log(`Current elections value: ${elections}`);

	callback();
};
