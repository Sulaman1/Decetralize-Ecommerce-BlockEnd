const { getNamedAccounts, ethers, network } = require("hardhat");
const { expect, assert } = require("chai");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

describe("ChainlinkPriceFeed", function () {
  let chainlinkPriceFeed;
  let mockV3;
  let rfid;
  let linkT;
  let chainId;
  let deployer, acc1, acc2, acc3, acc4;

  const DECIMALS = "8";
  const INITIAL_PRICE = "200000000000"; // 2000
  let sendAmount = ethers.utils.parseEther("0.04");
  let lessAmount = ethers.utils.parseEther("0.002");

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    [acc1, acc2, acc3, acc4] = await ethers.getSigners();
    chainId = network.config.chainId;
    console.log("chain id: ", chainId);

    // const ChainlinkPriceFeed = await hre.ethers.getContractFactory("ChainlinkPriceFeed");
    // chainlinkPriceFeed = await ChainlinkPriceFeed.deploy("0x8A753747A1Fa494EC906cE90E9f37563A8AF630e");
    // await chainlinkPriceFeed.deployed();

    const MockV3 = await hre.ethers.getContractFactory("MockV3Aggregator");
    mockV3 = await MockV3.deploy(DECIMALS, INITIAL_PRICE);
    await mockV3.deployed();

    const mockAdd = await mockV3.address;
    console.log("mock address: ", mockAdd);
    const ChainlinkPriceFeed = await hre.ethers.getContractFactory(
      "ChainlinkPriceFeed"
    );
    chainlinkPriceFeed = await ChainlinkPriceFeed.deploy(mockAdd);
    await chainlinkPriceFeed.deployed();
  });

  it("should not fund", async () => {
    await expect(
      chainlinkPriceFeed.getFiatPrice({ value: lessAmount })
    ).to.be.revertedWith("Not enough Eth");
  });

  it("should return eth to dollar", async () => {
    const e = await chainlinkPriceFeed.ethToDollar("1");
    console.log("dollar: ", e.toString());
  });

  it("Should fund", async () => {
    await chainlinkPriceFeed.getFiatPrice({ value: sendAmount });

    const len = await chainlinkPriceFeed.funderArraySize();
    console.log(`
        length : ${len}
    `);
    assert.equal(len.toString(), "1");
    const val = await chainlinkPriceFeed.getFunderToAmount(deployer);
    assert.equal(val.toString(), sendAmount.toString());
    const funderAdd = await chainlinkPriceFeed.getFunderAddress(0);
    assert.equal(funderAdd, deployer);
  });

  it("Multiple funders should fund", async () => {
    const accounts = await ethers.getSigners();
    for (var i = 0; i < 4; i++) {
      await chainlinkPriceFeed
        .connect(accounts[i])
        .getFiatPrice({ value: sendAmount });
    }
    for (var i = 0; i < 4; i++) {
      let amount = await chainlinkPriceFeed.getFunderToAmount(
        accounts[i].address
      );
      assert.equal(amount.toString(), sendAmount.toString());
    }
    const size = await chainlinkPriceFeed.funderArraySize();
    assert.equal(size.toString(), "4");
  });

  it("One funder should fund multiple times", async () => {
    let amount;
    for (var i = 0; i < 2; i++) {
      await chainlinkPriceFeed
        .connect(acc1)
        .getFiatPrice({ value: sendAmount });
    }
    amount = await chainlinkPriceFeed.getFunderToAmount(acc1.address);
    assert.equal(amount.toString(), "80000000000000000");
  });
});
