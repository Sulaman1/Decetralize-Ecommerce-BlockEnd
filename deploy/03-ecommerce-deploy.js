module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deployer: ", deployer);

  const eMarket = await deploy("EcommerceMarket", {
    from: deployer,
    log: true,
  });

  console.log("eMarketAddress: ", eMarket.address);

  const eCommerce = await deploy("Ecommerce", {
    from: deployer,
    log: true,
    args: [eMarket.address],
  });

  console.log("eCommerceAddress: ", eCommerce.address);
};

module.exports.tags = ["all", "market"];
