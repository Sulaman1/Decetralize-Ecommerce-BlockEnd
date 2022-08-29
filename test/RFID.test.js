const { getNamedAccounts, ethers, network } = require("hardhat");
const { expect, assert } = require("chai");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

let linkT, oracle, chainId;
let mockO, rfid;

describe("RFID", function () {
  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    [acc1, acc2, acc3, acc4] = await ethers.getSigners();
    chainId = network.config.chainId;
    console.log("chain id: ", chainId);

    //set log level to ignore non errors
    ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

    let linkToken = await hre.ethers.getContractFactory("LinkToken");
    linkT = await linkToken.deploy();
    await linkT.deployed();
    let linkTokenAddress = await linkT.address;

    const MockO = await hre.ethers.getContractFactory("MockOracle");
    mockO = await MockO.deploy(linkTokenAddress);
    await mockO.deployed();

    oracle = mockO.address;
    const jobId = ethers.utils.toUtf8Bytes(networkConfig[chainId]["jobId"]);
    const fee = networkConfig[chainId]["fee"];

    const waitBlockConfirmations = developmentChains.includes(network.name)
      ? 1
      : VERIFICATION_BLOCK_CONFIRMATIONS;
    const args = [oracle, jobId, fee, linkTokenAddress];

    console.log(`
          Oracle: ${oracle}
          JobId: ${jobId}
          fee: ${fee}
          LinkAddress: ${linkTokenAddress}
        `);

    const Rfid = await hre.ethers.getContractFactory("RFID");
    rfid = await Rfid.deploy(oracle, jobId, fee, linkTokenAddress);
    await rfid.deployed();

    await hre.run("fund-link", {
      contract: rfid.address,
      linkaddress: linkTokenAddress,
      fundamount: "2000000000000000000",
    });
  });
  it("Should pass", async () => {
    let transactionReceipt;

    const transaction = await rfid.requestData();
    transactionReceipt = await transaction.wait(1);
    const requestId = transactionReceipt.events[0].topics[1];
    console.log("transactionReceipt: ", transactionReceipt.events[0].topics);
    // expect(requestId).to.not.be.null
    const id = await rfid.last_uid();
    console.log("id: ", id);
  });
});
