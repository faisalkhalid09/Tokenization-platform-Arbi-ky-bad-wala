const { ethers } = require("hardhat");
const fs = require("fs").promises;
const path = require("path");

/**
 * Parse command line arguments
 * Usage: npx hardhat run scripts/deploy.js --network mumbai -- --name "DemoToken" --symbol "DMT" --supply "1000000"
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const config = {
    name: "DemoToken",
    symbol: "DMT", 
    supply: "1000000"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) {
      config.name = args[i + 1];
      i++;
    } else if (args[i] === "--symbol" && args[i + 1]) {
      config.symbol = args[i + 1];
      i++;
    } else if (args[i] === "--supply" && args[i + 1]) {
      config.supply = args[i + 1];
      i++;
    }
  }

  return config;
}

/**
 * Save deployment information to JSON file
 */
async function saveDeployment(network, contractInfo) {
  try {
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    
    // Ensure deployments directory exists
    try {
      await fs.access(deploymentsDir);
    } catch (error) {
      await fs.mkdir(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(deploymentsDir, `${network}.json`);
    
    // Read existing deployments or create new object
    let deployments = {};
    try {
      const existingData = await fs.readFile(deploymentFile, 'utf-8');
      deployments = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
    }

    // Add new deployment
    deployments[contractInfo.name] = {
      address: contractInfo.address,
      txHash: contractInfo.txHash,
      blockNumber: contractInfo.blockNumber,
      timestamp: new Date().toISOString(),
      deployer: contractInfo.deployer,
      constructorArgs: contractInfo.constructorArgs
    };

    await fs.writeFile(deploymentFile, JSON.stringify(deployments, null, 2));
    console.log(`✅ Deployment info saved to ${deploymentFile}`);
  } catch (error) {
    console.error("⚠️ Failed to save deployment info:", error.message);
  }
}

async function main() {
  console.log("🚀 Starting MyToken deployment...\n");

  // Parse command line arguments
  const config = parseArguments();
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Name: ${config.name}`);
  console.log(`   Symbol: ${config.symbol}`);
  console.log(`   Initial Supply: ${config.supply} tokens\n`);

  // Validate inputs
  if (!config.name || !config.symbol || !config.supply) {
    throw new Error("Missing required parameters: --name, --symbol, --supply");
  }

  const initialSupply = ethers.parseUnits(config.supply, 0); // Parse as whole number
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log(`🌐 Deploying to network: ${network.name} (Chain ID: ${network.chainId})\n`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  
  console.log("👤 Deployer account:", deployerAddress);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    throw new Error("Deployer account has no funds. Please fund it with testnet tokens.");
  }

  // Deploy the contract
  console.log("⏳ Deploying MyToken contract...");
  const MyToken = await ethers.getContractFactory("MyToken");
  
  const token = await MyToken.deploy(config.name, config.symbol, initialSupply);
  
  console.log("⌛ Waiting for deployment confirmation...");
  const deployReceipt = await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  
  console.log("\n✅ Deployment successful!");
  console.log("📄 Contract address:", tokenAddress);
  console.log("🔍 Transaction hash:", token.deploymentTransaction().hash);
  console.log("📦 Block number:", token.deploymentTransaction().blockNumber);

  // Verify deployment by reading contract state
  console.log("\n🔍 Verifying deployment...");
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();
  const owner = await token.owner();

  console.log("   Name:", name);
  console.log("   Symbol:", symbol);
  console.log("   Decimals:", decimals);
  console.log("   Total Supply:", ethers.formatUnits(totalSupply, decimals));
  console.log("   Owner:", owner);

  // Save deployment information
  const networkName = network.name === "unknown" ? `chainId-${network.chainId}` : network.name;
  await saveDeployment(networkName, {
    name: `${config.name}-${config.symbol}`,
    address: tokenAddress,
    txHash: token.deploymentTransaction().hash,
    blockNumber: token.deploymentTransaction().blockNumber,
    deployer: deployerAddress,
    constructorArgs: {
      name: config.name,
      symbol: config.symbol,
      initialSupply: config.supply
    }
  });

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Copy the contract address to your .env file:");
  console.log(`   NEXT_PUBLIC_DEPLOYED_TOKEN_ADDRESS="${tokenAddress}"`);
  console.log("2. Consider verifying the contract on the block explorer");
  console.log("3. Fund some test accounts for interaction testing");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
