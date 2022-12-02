const { assert } = require("chai");

const ElectionPortal = artifacts.require("ElectionPortal");

require("chai").use(require("chai-as-promised")).should();

contract("ElectionPortal", ([firstAddress, secondAddress, thirdAddress]) => {
	let portal;

	before(async () => {
		portal = await ElectionPortal.new();
	});

	describe("Deployment", () => {
		it("Deploys successfully", async () => {
			const address = await portal.address;

			assert.notEqual(address, "");
			assert.notEqual(address, undefined);
			assert.notEqual(address, null);
			assert.notEqual(address, 0x0);
		});
	});
	describe("Election Creation", () => {
		// check if election can be created
		it("Create election is successful", async () => {
			let title = "Election Test 1";
			let candidates = ["Candidate 1", "Candidate 2"];
			let voters = [
				"0xeC6F9881e0A399A5040c6c709EF1b5863B3E9414",
				"0x4f2beA512ED613603685c5D3A4749A53c8674ac0",
				"0x33083003f313B261715273B04AE10398d3B932eE",
			];
			let urls = ["url 1", "url 2"];
			// create new election
			await portal.createElection(title, candidates, urls, voters, {
				from: firstAddress,
			});

			// check new election
			const elections = await portal.getElections();

			assert.equal(elections[0], title);
		});

		it("Election creation fails when a candidate is without image url", async () => {
			let title = "Election Test 1";
			let candidates = ["Candidate 1", "Candidate 2"];
			let voters = [
				"0xeC6F9881e0A399A5040c6c709EF1b5863B3E9414",
				"0x4f2beA512ED613603685c5D3A4749A53c8674ac0",
				"0x33083003f313B261715273B04AE10398d3B932eE",
			];
			let urls = ["url 1"];

			await portal.createElection(title, candidates, urls, voters, {
				from: firstAddress,
			}).should.be.rejected;
		});

		it("Election creation fails when there is only one candidate", async () => {
			let title = "Election Test 1";
			let candidates = ["Candidate 1"];
			let voters = [
				"0xeC6F9881e0A399A5040c6c709EF1b5863B3E9414",
				"0x4f2beA512ED613603685c5D3A4749A53c8674ac0",
				"0x33083003f313B261715273B04AE10398d3B932eE",
			];
			let urls = ["url 1"];

			await portal.createElection(title, candidates, urls, voters, {
				from: firstAddress,
			}).should.be.rejected;
		});
	});

	before(async () => {
		let title = "Election Test 1";
		let candidates = ["Candidate 1", "Candidate 2"];
		let voters = [secondAddress]; // Only secondAddress can vote
		let urls = ["url 1", "url 2"];

		await portal.createElection(title, candidates, urls, voters, {
			from: firstAddress,
		}); // Create election
		await portal.startElection(0, { from: firstAddress }); //Start Election
	});

	describe("Voting", () => {
		it("Eligible addresses can vote", async () => {
			await portal.vote(0, 0, { from: secondAddress }).should.be
				.fulfilled;
		});
		it("Eligible addresses cannot vote", async () => {
			await portal.vote(0, 0, { from: thirdAddress }).should.be.rejected;
		});
		it("Addresses that have already voted cannot vote again", async () => {
			await portal.vote(0, 0, { from: secondAddress }).should.be.rejected;
		});
	});
});
