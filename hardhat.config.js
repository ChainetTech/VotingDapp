require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337, // Default chain ID for Hardhat network
    },
    // Optional: Use this if you want to explicitly use a localhost network configuration
    
  },
};

//Incase you prefer to use Public Testnet you can use the following code instead of the one above:
//But remeber to update the .env file in the VotingDapp/.env
 /**
// /* @type import('hardhat/config').HardhatUserConfig
 */
// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config();

// const { API_URL_KEY, PRIVATE_KEY } = process.env;

// module.exports = {
//   solidity: "0.8.20",
//   defaultNetwork: "amoy",
//   networks: {
//     hardhat: {},
//     amoy: {
//       url: API_URL_KEY,
//       accounts: [`0x${PRIVATE_KEY}`],
//     },
//   },
// };