// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract ChainlinkPriceFeed {
    uint256 public MIN_USD = 50 * 10**18;
    address public admin;
    address[] public funders;
    mapping(address => uint256) public funderToAmount;
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        admin = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function ethToDollar(uint256 eth) public view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();

        uint256 ethPrice = uint256(price * 10000000000);
        uint256 ethPriceInUsd = (ethPrice * eth) / 1000000000000000000;

        return ethPriceInUsd;
    }

    function getFiatPrice() public payable {
        uint256 dollar = ethToDollar(msg.value);
        require(dollar >= MIN_USD, "Not enough Eth");
        funders.push(msg.sender);
        funderToAmount[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(msg.sender == admin, "Only Admin can access");
        uint size = funders.length;
        for (uint i = 0; i < size; i++) {
            funderToAmount[funders[i]] = 0;
        }
        funders = new address[](0);
        (bool success, ) = payable(admin).call{value: address(this).balance}(
            ""
        );
        require(success);
    }

    function getContractAmount() public view returns (uint256) {
        return address(this).balance;
    }

    function getFunderAddress(uint256 index) public view returns (address) {
        return funders[index];
    }

    function funderArraySize() public view returns (uint256) {
        return funders.length;
    }

    function getFunderToAmount(address funder) public view returns (uint256) {
        return funderToAmount[funder];
    }
}
