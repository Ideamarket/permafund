pragma solidity ^0.6.8;

import "./interfaces/IRDai.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Permafund {

    address public recipient;

    IERC20 private dai;
    IRDai private rDai;

    event Deposit(address from, uint amount);

    constructor(address _recipient) public {
        recipient = _recipient;
        dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
        rDai = IRDai(0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0);

        address[] memory recipients = [_recipient];
        uint32[] memory proportions = [100];

        require(rDai.createHat(recipients, proportions, true), "failed to create rDai hat");
    }

    function deposit(uint amount) external {
        require(dai.allowance(msg.sender, address(this)) >= amount, "not enough dai allowance");
        require(dai.transferFrom(msg.sender, address(this), amount), "dai transfer failed");
        require(dai.approve(address(rDai), amount), "dai rdai approve failed");
        require(rDai.mint(amount), "rdai mint failed");
        emit Deposit(msg.sender, amount);
    }
}