pragma solidity ^0.6.0;

import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "hardhat/console.sol";

contract RFID is ChainlinkClient {
    // where to store the last id scanned
    bytes32 public last_uid;
    // Chainlink vars for communicating with the RFID external adapter
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor(
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        address _linkTokenAddress
    ) public {
        if (_linkTokenAddress == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_linkTokenAddress);
        }
        oracle = _oracle; //0x42149D794A135989319b66Dbcb770Ad36075a92e;
        jobId = _jobId; //"785558e0bed6466b9567322cc2f4ca91";
        fee = _fee; //1 * 10**18; // 0.1 LINK
    }

    function requestData() public returns (bytes32 requestId) {
        // creates the Request
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // Sends the request
        return sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, bytes32 uid)
        public
        recordChainlinkFulfillment(_requestId)
    {
        last_uid = uid;
    }
}
