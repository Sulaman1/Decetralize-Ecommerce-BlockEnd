require("@nomicfoundation/hardhat-toolbox");
require("@appliedblockchain/chainlink-plugins-fund-link");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */

const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.ALCHEMY_MAINNET_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL ||
  "https://eth-rinkeby.alchemyapi.io/v2/your-api-key";
const KOVAN_RPC_URL =
  process.env.KOVAN_RPC_URL ||
  "https://eth-kovan.alchemyapi.io/v2/your-api-key";
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_RPC_URL ||
  "https://polygon-mainnet.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// optional
const MNEMONIC = process.env.MNEMONIC || "Your mnemonic";
const FORKING_BLOCK_NUMBER = process.env.FORKING_BLOCK_NUMBER;

// Your API key for Etherscan, obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY =
  process.env.ETHERSCAN_API_KEY || "Your etherscan API key";
const POLYGONSCAN_API_KEY =
  process.env.POLYGONSCAN_API_KEY || "Your polygonscan API key";
const REPORT_GAS = process.env.REPORT_GAS || false;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.4",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.6.0",
      },
      {
        version: "0.4.24",
      },
    ],
  },

  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      // If you want to do some forking set `enabled` to true
      forking: {
        url: MAINNET_RPC_URL,
        blockNumber: FORKING_BLOCK_NUMBER,
        enabled: false,
      },
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/bf2aa466a0b54373b677c2dc1b830d49",
      accounts: [
        "b8ed812a73ca25905a534c4afc5b0f5ba2b387727cf73e4700fe843dcb7971b6",
        "905b79862f541aa6a594284b4f3ab485f479c641f35fa5d6023a4f9aff27cb30",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
      chainId: 5,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/33b80616d03249baa458695ca6f348b4",
      accounts: [
        "905b79862f541aa6a594284b4f3ab485f479c641f35fa5d6023a4f9aff27cb30",
        "b8ed812a73ca25905a534c4afc5b0f5ba2b387727cf73e4700fe843dcb7971b6",
      ],
      gas: 2100000,
      gasPrice: 8000000000,
      chainId: 4,
    },
  },

  gasReporter: {
    enabled: true,
    currency: "PKR",
    // outputFile: "gas-report.txt",
    noColors: false,
    coinmarketcap: "78b95322-5831-4339-a7d0-dbfddec9ded2",
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
};
