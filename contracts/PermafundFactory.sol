pragma solidity ^0.6.8;

import "./Permafund.sol";

contract PermafundFactory {

    mapping(address => address) public permafunds;

    event NewPermafund(address recipient, address permafund);

    function deployPermafund(address recipient) external returns (address) {
        require(permafunds[recipient] == address(0), "Permafund exists already");

        address permafund = address(new Permafund(recipient));
        permafunds[recipient] = permafund;
        emit NewPermafund(recipient, permafund);

        return permafund;
    }
}

