pragma solidity ^0.6.8;

import "./interfaces/IRDai.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Permafund {

    address public recipient;

    IERC20 private dai;
    IRDai private rDai;

    event Deposit(address from, uint amount);

    constructor(address _recipient, address _dai, address _rDai) public {
        recipient = _recipient;
        dai = IERC20(_dai);
        rDai = IRDai(_rDai);

        setHat();
    }

    function deposit(uint _amount) external {
        require(dai.allowance(msg.sender, address(this)) >= _amount, "not enough dai allowance");
        require(dai.transferFrom(msg.sender, address(this), _amount), "dai transfer failed");
        require(dai.approve(address(rDai), _amount), "dai rdai approve failed");
        require(rDai.mint(_amount), "rdai mint failed");
        emit Deposit(msg.sender, _amount);
    }

    function setHat() private {
        address[] memory recipients = new address[](1);
        recipients[0] = recipient;
        uint32[] memory proportions = new uint32[](1);
        proportions[0] = 100;

        rDai.createHat(recipients, proportions, true);
    }
}