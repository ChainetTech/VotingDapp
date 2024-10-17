async function main() {
  // Fetch the ContractFactory and Signers
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy the Election contract
  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy();
  await election.deployed();

  console.log("Election contract deployed to:", election.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });