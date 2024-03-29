//write in front end directory (abi, contract address, chainId)
var path = require("path");

const { ethers, network } = require("hardhat");
const { readFileSync, writeFileSync, fstat } = require("fs");

const abi = "../../Decetralize-Ecommerce-Nextjs/constants/abi.json";
const contractAddress =
  "../../Decetralize-Ecommerce-Nextjs/constants/contract.json";

const abiRFID = "../../Decetralize-Ecommerce-Nextjs/constants/abiRFID.json";
const addressRFID =
  "../../Decetralize-Ecommerce-Nextjs/constants/addressRFID.json";

const abiEcommerce =
  "../../Decetralize-Ecommerce-Nextjs/constants/abiEcommerce.json";
const addressEcommerce =
  "../../Decetralize-Ecommerce-Nextjs/constants/addressEcommerce.json";

const abiEcommerceMarket =
  "../../Decetralize-Ecommerce-Nextjs/constants/abiEcommerceMarket.json";
const addressEcommerceMarket =
  "../../Decetralize-Ecommerce-Nextjs/constants/addressEcommerceMarket.json";

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

  writeFileSync(
    path.join(__dirname, abi),
    IchainlinkPriceFeed.format(ethers.utils.FormatTypes.json)
  );
  writeFileSync(
    path.join(__dirname, abiEcommerce),
    Iecommerce.format(ethers.utils.FormatTypes.json)
  );
  writeFileSync(
    path.join(__dirname, abiRFID),
    Irfid.format(ethers.utils.FormatTypes.json)
  );
  writeFileSync(
    path.join(__dirname, abiEcommerceMarket),
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

  console.log(`
    RFID ADDRESS: ${rfid.address}
    CHAINLINK ADDRESS: ${chainlinkPriceFeed.address}
    ECOMMERCE ADDRESS: ${ecommerce.address}
    ECOMMERCEMARKET ADDRESS: ${ecommerceMarket.address}
  `);

  console.log("Path: ", path.join(__dirname, addressRFID));

  let rfidJSON = JSON.parse(
    readFileSync(path.join(__dirname, addressRFID), "utf8")
  );
  if (chainId in rfidJSON) {
    if (!rfidJSON[chainId].includes(rfid.address)) {
      rfidJSON[chainId].push(rfid.address);
    }
  }
  {
    rfidJSON[chainId] = [rfid.address];
  }
  writeFileSync(path.join(__dirname, addressRFID), JSON.stringify(rfidJSON));

  let contractJSON = JSON.parse(
    readFileSync(path.join(__dirname, contractAddress), "utf8")
  );
  if (chainId in contractJSON) {
    if (!contractJSON[chainId].includes(chainlinkPriceFeed.address)) {
      contractJSON[chainId].push(chainlinkPriceFeed.address);
    }
  }
  {
    contractJSON[chainId] = [chainlinkPriceFeed.address];
  }
  writeFileSync(
    path.join(__dirname, contractAddress),
    JSON.stringify(contractJSON)
  );

  let ecommerceJSON = JSON.parse(
    readFileSync(path.join(__dirname, addressEcommerce), "utf8")
  );
  if (chainId in ecommerceJSON) {
    if (!ecommerceJSON[chainId].includes(ecommerce.address)) {
      ecommerceJSON[chainId].push(ecommerce.address);
    }
  }
  {
    ecommerceJSON[chainId] = [ecommerce.address];
  }
  writeFileSync(
    path.join(__dirname, addressEcommerce),
    JSON.stringify(ecommerceJSON)
  );

  let eMarketJSON = JSON.parse(
    readFileSync(path.join(__dirname, addressEcommerceMarket), "utf8")
  );
  if (chainId in eMarketJSON) {
    if (!eMarketJSON[chainId].includes(ecommerceMarket.address)) {
      eMarketJSON[chainId].push(ecommerceMarket.address);
    }
  }
  {
    eMarketJSON[chainId] = [ecommerceMarket.address];
  }
  writeFileSync(
    path.join(__dirname, addressEcommerceMarket),
    JSON.stringify(eMarketJSON)
  );
}

module.exports.tags = ["all", "frontend"];
