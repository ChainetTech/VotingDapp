
# Blockchain Voting System - Installation and Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- Ubuntu 22.04 or higher. 
- VSCode editor
- Node.js (v18.0.0 or later)
- npm (usually comes with Node.js)
- Git

## Installation

1. Unzip the folder using this command: unzip VotingDapp, then
   ```
   cd VotingDapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Hardhat globally (if not already installed):
   ```
   npm install -g hardhat
   ```

## Smart Contract Setup

1. Compile the smart contract:
   ```
   npx hardhat compile
   ```

2. Deploy the smart contract to a local Hardhat network:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```
   Note: Make sure to save the deployed contract address, you'll need it later.

3. Start a local Hardhat node
   ```
   npx hardhat node
   ```
   Keep this terminal window open.

## Frontend Setup

1. Update the contract address
   Open `src/App.js` and update the `contractAddress` variable with the address of your deployed contract.
   If you used the command: npx hardhat node, you dont need to update as it has already been done.

2. Start the React development server
   In a new terminal window:
   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## MetaMask Setup

1. Install the MetaMask browser extension if you haven't already.

2. Connect MetaMask to the Hardhat network:
   - Network Name: Hardhat
   - New RPC URL: http://127.0.0.1:8545/
   - Chain ID: 31337
   - Currency Symbol: ETH

3. Import an account from Hardhat:
   - When you started the Hardhat node, it displayed a list of accounts and private keys.
   - In MetaMask, click "Import Account" and paste one of the private keys.

## Running the Application

1. Ensure you have three terminal windows open:
   - One running the Hardhat node
   - One in the project root where you deployed the contract
   - One running the React development server

2. Connect your MetaMask to the Hardhat network and select the imported account.

3. Interact with the application through your web browser.

## Troubleshooting

- If you encounter issues with contract interactions, ensure that:
  - The contract is deployed to the Hardhat network
  - The correct contract address is set in `App.js`
  - MetaMask is connected to the Hardhat network
  - You're using an account with sufficient ETH (all Hardhat accounts start with 10000 ETH)

- If the frontend is not reflecting contract state changes:
  - Check the browser console for any errors
  - Ensure that the contract events are being properly emitted and listened to

## Additional Commands

- Run tests: `npx hardhat test`
- Deploy to a testnet (e.g., Sepolia):
  ```
  npx hardhat run scripts/deploy.js --network sepolia
  ```
  Note: Make sure to configure the network in `hardhat.config.js` and have test ETH in your account.

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request, or open an issue for discussion.

## License

This project is licensed under the MIT License.
```

This documentation provides a step-by-step guide for setting up and running your blockchain voting system. It covers the installation process, smart contract deployment, frontend setup, and MetaMask configuration. It also includes some troubleshooting tips and additional commands that might be useful for development and testing.

Remember to replace `yourusername` in the git clone URL with your actual GitHub username if you've hosted the project there. Also, if you have any specific configuration files or environment variables that need to be set up, make sure to include instructions for those as well.

You may want to save this as a `README.md` file in your project root directory, so it's easily accessible to anyone who clones your repository.