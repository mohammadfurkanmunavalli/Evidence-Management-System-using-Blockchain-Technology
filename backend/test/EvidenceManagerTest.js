const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EvidenceManager", () => {
  it("should allow adding, fetching, and deleting evidence", async () => {
    const EvidenceManager = await ethers.getContractFactory("EvidenceManager");
    const evidenceManager = await EvidenceManager.deploy();
    await evidenceManager.deployed();

    const [owner] = await ethers.getSigners();

    await evidenceManager.addEvidence("Title1", "Description1", "FileHash1");
    const evidence = await evidenceManager.getEvidence(0);

    expect(evidence.title).to.equal("Title1");
    expect(evidence.description).to.equal("Description1");

    await evidenceManager.deleteEvidence(0);
    const allEvidence = await evidenceManager.getAllEvidence();
    expect(allEvidence.length).to.equal(0);
  });
});
