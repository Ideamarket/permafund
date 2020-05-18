pragma solidity ^0.6.8;

import "./Permafund.sol";

contract PermafundFactory {

    mapping(address => address) public permafunds;

    event NewPermafund(address recipient, address permafund);

    function deployPermafund(address _recipient) external returns (address) {
        require(permafunds[_recipient] == address(0), "permafund exists already");

        address permafund = address(new Permafund(_recipient));
        permafunds[_recipient] = permafund;
        emit NewPermafund(_recipient, permafund);

        return permafund;
    }
}

