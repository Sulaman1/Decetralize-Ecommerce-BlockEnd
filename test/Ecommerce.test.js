const { getNamedAccounts, ethers, network } = require("hardhat");
const { expect, assert } = require("chai");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

let price = ethers.utils.parseEther("0.0000000002");
let purchasePrice = ethers.utils.parseEther("1");
let emarket, market;

describe("Ecommerce", function () {
  beforeEach(async () => {
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const Emarket = await ethers.getContractFactory("EcommerceMarket");
    emarket = await Emarket.deploy();
    await emarket.deployed();
    // console.log("EMarket Address: ", emarket.address);

    const Market = await ethers.getContractFactory("Ecommerce");
    market = await Market.deploy(emarket.address);
    await market.deployed();
    // console.log("Market Address: ", market.address);

    console.log(`
        Price:  ${price}
        ChainId: ${chainId}
        EMarket: ${emarket.address}
        Market: ${market.address}
    `);
  });

  it("Should Pass", async () => {
    await emarket.productCreate(emarket.address, 0, price, { value: price });
  });
  it("Should also Pass", async () => {
    await emarket.productCreate(emarket.address, 0, price, { value: price });
    await emarket.productPurchase(emarket.address, 0, { value: purchasePrice });
  });
});
