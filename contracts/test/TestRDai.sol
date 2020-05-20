pragma solidity ^0.6.8;

import "../interfaces/IRDai.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestRDai is ERC20, IRDai {
    IERC20 private dai;
    uint private lastHatID;

    mapping(address => uint) public userHats;
    mapping(uint => Hat) private hats;

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
        return true;
    }

    function createHat(address[] memory _recipients, uint32[] memory _proportions, bool _doChangeHat) public override returns (uint256) {
        require(_recipients.length > 0, "hat must have recipients");
        require(_recipients.length == _proportions.length, "recipients and proportions length must match");
        hats[++lastHatID] = Hat(_recipients, _proportions);

        if(_doChangeHat) {
            userHats[msg.sender] = lastHatID;
        }

        return lastHatID;
    }

    function getHatRecipients(uint _hatID) external view returns(address[] memory) {
        return hats[_hatID].recipients;
    }

    function getHatProportions(uint _hatID) external view returns(uint32[] memory) {
        return hats[_hatID].proportions;
    }

    function payInterest(address owner) external returns (bool) {
        // Not implemented
        return true;
    }
}