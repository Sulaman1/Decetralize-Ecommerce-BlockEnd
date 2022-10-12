const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  console.log("deployer: ", deployer);

  const chainId = network.config.chainId;

  let linkTokenAddress;
  let oracle;
  let additionalMessage = "";
  //set log level to ignore non errors
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);


  let linkToken, MockOracle
  if (developmentChains.includes(network.name)){
    linkToken = await get("LinkToken");
    MockOracle = await get("MockOracle"); 

    linkTokenAddress = linkToken.address;
    oracle = MockOracle.address;
  }
  else{
    console.log("In else...")
    linkTokenAddress = networkConfig[chainId]["linkToken"]

    oracle = networkConfig[chainId]["oracle"]
  }
      
  const jobId = ethers.utils.toUtf8Bytes(networkConfig[chainId]["jobId"]);
  const fee = networkConfig[chainId]["fee"];

  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS;
  const args = [oracle, jobId, fee, linkTokenAddress];

  console.log(`
    Args: ${args}
  `)

  const apiConsumer = await deploy("RFID", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: waitBlockConfirmations,
  });

  console.log("RFID Address: ", apiConsumer.address)

  await hre.run("fund-link", {
    contract: apiConsumer.address,
    linkaddress: linkTokenAddress,
    fundamount: "2000000000000000000",
  });

};

module.exports.tags = ["all", "rfid", "ms"];
