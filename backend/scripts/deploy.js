const hre = require("hardhat");

async function main() {
  try {
    console.log("==== Starting the Deployment Process ====");

    // Compile the contracts
    console.log("Compiling the contracts...");
    await hre.run("compile");
    console.log("Contracts compiled successfully.");

    // Get the contract factory for EvidenceManagement
    console.log("Fetching the EvidenceManagement contract factory...");
    const EvidenceManagement = await hre.ethers.getContractFactory("EvidenceManagement");

    // Deploy the contract
    console.log("Deploying the EvidenceManagement contract...");
    const evidenceManagement = await EvidenceManagement.deploy();

    // Wait for the deployment to complete
    console.log("Waiting for contract deployment to complete...");
    await evidenceManagement.waitForDeployment(); // Updated for Ethers v6

    console.log("Contract deployed successfully!");

    // Log the deployed contract address
    console.log("EvidenceManagement Contract Address:", evidenceManagement.target); // Updated for Ethers v6
    console.log("===========================================");
    console.log("Deployment complete.");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

// Execute the main function to deploy the contract
main();
