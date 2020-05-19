pragma solidity ^0.6.8;

import "../interfaces/IRDai.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20, IRDai {
    IERC20 private dai;
    uint private lastHatID;
    mapping(address => uint) userHats;
    mapping(uint => Hat) hats;

    struct Hat {
        address[] recipients;
        uint32[] proportions;
    }

    constructor (address _dai) ERC20("rDai", "rDai") public {
        dai = IERC20(_dai);
    }

    function mint(uint256 _mintAmount) external override returns (bool) {
        require(dai.allowance(msg.sender, address(this)) >= _mintAmount, "rDai: not enough dai allowance");
        require(dai.transferFrom(msg.sender, address(this), _mintAmount), "rDai: dai transfer failed");
        _mint(msg.sender, _mintAmount);
    }

    function createHat(address[] memory recipients, uint32[] memory proportions, bool doChangeHat) public override returns (uint256) {
        require(recipients.length > 0, "hat must have recipients");
        require(recipients.length == proportions.length, "recipients and proportions length must match");
        hats[++lastHatID] = Hat(recipients, proportions);

        if(doChangeHat) {
            userHats[msg.sender] = lastHatID;
        }

        return lastHatID;
    }
}