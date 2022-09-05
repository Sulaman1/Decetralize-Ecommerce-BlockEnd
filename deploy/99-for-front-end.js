//write in front end directory (abi, contract address, chainId)

const { ethers, network } = require("hardhat");
const { readFileSync, writeFileSync, fstat } = require("fs");

const abi = "../fundmefe/constants/abi.json";
const contractAddress = "../fundmefe/constants/contract.json";

const abiRFID = "../fundmefe/constants/abiRFID.json";
const addressRFID = "../fundmefe/constants/addressRFID.json";

const abiEcommerce = "../fundmefe/constants/abiEcommerce.json";
const addressEcommerce = "../fundmefe/constants/addressEcommerce.json";

const abiEcommerceMarket = "../fundmefe/constants/abiEcommerceMarket.json";
const addressEcommerceMarket =
  "../fundmefe/constants/addressEcommerceMarket.json";

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
  const rfid = await deployments.get("RFID");
  const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");
  const ecommerce = await deployments.get("Ecommerce");
  const ecommerceMarket = await deployments.get("EcommerceMarket");

  console.log(`
      RFID : ${rfid.abi}    
      PriceFeed ABI:  ${chainlinkPriceFeed.abi}
      Ecommerce ABI: ${ecommerce.abi}
      Ecommerce market: ${ecommerceMarket.abi}
    `);

  const Irfid = new ethers.utils.Interface(rfid.abi);
  const IchainlinkPriceFeed = new ethers.utils.Interface(
    chainlinkPriceFeed.abi
  );
  const Iecommerce = new ethers.utils.Interface(ecommerce.abi);
  const IecommerceMarket = new ethers.utils.Interface(ecommerceMarket.abi);

  writeFileSync(abi, IchainlinkPriceFeed.format(ethers.utils.FormatTypes.json));
  writeFileSync(abiEcommerce, Iecommerce.format(ethers.utils.FormatTypes.json));
  writeFileSync(abiRFID, Irfid.format(ethers.utils.FormatTypes.json));
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
  const rfid = await deployments.get("RFID");
  const chainlinkPriceFeed = await deployments.get("ChainlinkPriceFeed");
  const ecommerce = await deployments.get("Ecommerce");
  const ecommerceMarket = await deployments.get("EcommerceMarket");

  let rfidJSON = JSON.parse(readFileSync(addressRFID, "utf8"));
  if (chainId in rfidJSON) {
    if (!rfidJSON[chainId].includes(rfid.address)) {
      rfidJSON[chainId].push(rfid.address);
    }
  }
  {
    rfidJSON[chainId] = [rfid.address];
  }
  writeFileSync(addressRFID, JSON.stringify(rfidJSON));

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
