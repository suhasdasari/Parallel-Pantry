import hre from "hardhat";
import fs from "fs";

async function main() {
    console.log("Deploying ParallelPantryVault to Tempo network...");

    // pathUSD token address on Tempo (predeployed)
    const pathUSDAddress = "0x20c0000000000000000000000000000000000000";

    // AI agent address (replace with actual address)
    // For now, using deployer address as placeholder
    const [deployer] = await hre.ethers.getSigners();
    const aiAgentAddress = deployer.address;

    console.log("Deploying with account:", deployer.address);
    console.log("pathUSD address:", pathUSDAddress);
    console.log("AI Agent address:", aiAgentAddress);

    // Deploy the vault contract
    const Vault = await hre.ethers.getContractFactory("ParallelPantryVault");
    const vault = await Vault.deploy(pathUSDAddress, aiAgentAddress);

    await vault.waitForDeployment();

    const vaultAddress = await vault.getAddress();
    console.log("ParallelPantryVault deployed to:", vaultAddress);

    // Log deployment info
    console.log("\n=== Deployment Summary ===");
    console.log("Vault Address:", vaultAddress);
    console.log("pathUSD Token:", pathUSDAddress);
    console.log("AI Agent:", aiAgentAddress);
    console.log("Owner:", deployer.address);
    console.log("========================\n");

    // Save deployment info to file
    const deploymentInfo = {
        network: "tempo-testnet",
        chainId: 42429,
        vaultAddress: vaultAddress,
        pathUSDAddress: pathUSDAddress,
        aiAgentAddress: aiAgentAddress,
        owner: deployer.address,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        "deployment-info.json",
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Deployment info saved to deployment-info.json");

    // Wait for block confirmations before verifying
    console.log("Waiting for block confirmations...");
    await vault.deploymentTransaction().wait(5);

    console.log("\nTo verify the contract, run:");
    console.log(`npx hardhat verify --network tempo ${vaultAddress} ${pathUSDAddress} ${aiAgentAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
