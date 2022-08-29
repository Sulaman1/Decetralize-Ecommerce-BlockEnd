const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  console.log("deployer: ", deployer);

  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  log("----------------------------------------------------");
  log("Deploying ChainlinkPriceFeed and waiting for confirmations...");

  const chainlinkPriceFeed = await deploy("ChainlinkPriceFeed", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
  console.log("ChainlinkPriceFeed address: ", chainlinkPriceFeed.address);
};

module.exports.tags = ["all", "chainlinkpricefeed"];
