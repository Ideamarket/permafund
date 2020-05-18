pragma solidity ^0.6.8;

import "./Permafund.sol";

contract PermafundFactory {

    mapping(address => address) public permafunds;
    address private dai;
    address private rDai;

    event NewPermafund(address recipient, address permafund);

    constructor(address _dai, address _rDai) public {
        dai = _dai;
        rDai = _rDai;
    }

    function deployPermafund(address _recipient) external returns (address) {
        require(permafunds[_recipient] == address(0), "permafund exists already");

        address permafund = address(new Permafund(_recipient, dai, rDai));
        permafunds[_recipient] = permafund;
        emit NewPermafund(_recipient, permafund);

        return permafund;
    }
}

