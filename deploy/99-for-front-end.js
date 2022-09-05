//write in front end directory (abi, contract address, chainId)

const { ethers, network } = require("hardhat");
const { readFileSync, writeFileSync, fstat } = require("fs");

const abi = "../Decentralize-Ecommerce-Nextjs/constants/abi.json";
const contractAddress = "../Decentralize-Ecommerce-Nextjs/constants/contract.json";

const abiEcommerce = "../Decentralize-Ecommerce-Nextjs/constants/abiEcommerce.json";
const addressEcommerce = "../Decentralize-Ecommerce-Nextjs/constants/addressEcommerce.json";

const abiEcommerceMarket = "../Decentralize-Ecommerce-Nextjs/constants/abiEcommerceMarket.json";
const addressEcommerceMarket =
  "../Decentralize-Ecommerce-Nextjs/constants/addressEcommerceMarket.json";

module.exports = async ({ getNamedAccounts, deployments }) => {
  console.log("Front End Deployment");
  await contractAddressDeployment(deployments);
  await abiDeployment(deployments);
};

async function abiDeployment(deployments) {
  // await deployments.fixture(["all"]);
  // const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");

  /**
   * Can Also Use the upper commented lines instead
   */

  // const chainlinkPriceFeed = await ethers.getContract("ChainlinkPriceFeed");

  // writeFileSync(abi, chainlinkPriceFeed.interface.format(ethers.utils.FormatTypes.json));

  /**
   * Another way
   */
  const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");
  const ecommerce = await deployments.get("Ecommerce");
  const ecommerceMarket = await deployments.get("EcommerceMarket");

  console.log(`
      PriceFeed ABI:  ${chainlinkPriceFeed.abi}
      Ecommerce ABI: ${ecommerce.abi}
      Ecommerce market: ${ecommerceMarket.abi}
    `);

  const IchainlinkPriceFeed = new ethers.utils.Interface(
    chainlinkPriceFeed.abi
  );
  const Iecommerce = new ethers.utils.Interface(ecommerce.abi);
  const IecommerceMarket = new ethers.utils.Interface(ecommerceMarket.abi);

  writeFileSync(abi, IchainlinkPriceFeed.format(ethers.utils.FormatTypes.json));
  writeFileSync(abiEcommerce, Iecommerce.format(ethers.utils.FormatTypes.json));
  writeFileSync(
    abiEcommerceMarket,
    IecommerceMarket.format(ethers.utils.FormatTypes.json)
  );
}

async function contractAddressDeployment(deployments) {
  const chainId = network.config.chainId.toString();
  // await deployments.fixture(["all"]);
  // const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");

  /**
   * Can Also Use the upper commented lines instead
   */
  // const chainlinkPriceFeed = await ethers.getContract("ChainlinkPriceFeed");

  /**
   * Another way
   */

  const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");
  const ecommerce = await deployments.get("Ecommerce");
  const ecommerceMarket = await deployments.get("EcommerceMarket");

  let contractJSON = JSON.parse(readFileSync(contractAddress, "utf8"));
  if (chainId in contractJSON) {
    if (!contractJSON[chainId].includes(chainlinkPriceFeed.address)) {
      contractJSON[chainId].push(chainlinkPriceFeed.address);
    }
  }
  {
    contractJSON[chainId] = [chainlinkPriceFeed.address];
  }
  writeFileSync(contractAddress, JSON.stringify(contractJSON));

  let ecommerceJSON = JSON.parse(readFileSync(addressEcommerce, "utf8"));
  if (chainId in ecommerceJSON) {
    if (!ecommerceJSON[chainId].includes(ecommerce.address)) {
      ecommerceJSON[chainId].push(ecommerce.address);
    }
  }
  {
    ecommerceJSON[chainId] = [ecommerce.address];
  }
  writeFileSync(addressEcommerce, JSON.stringify(ecommerceJSON));

  let eMarketJSON = JSON.parse(readFileSync(addressEcommerceMarket, "utf8"));
  if (chainId in eMarketJSON) {
    if (!eMarketJSON[chainId].includes(ecommerceMarket.address)) {
      eMarketJSON[chainId].push(ecommerceMarket.address);
    }
  }
  {
    eMarketJSON[chainId] = [ecommerceMarket.address];
  }
  writeFileSync(addressEcommerceMarket, JSON.stringify(eMarketJSON));
}

module.exports.tags = ["all", "frontend"];
