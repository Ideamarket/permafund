pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface IRDai is IERC20 {
    function mint(uint256 mintAmount) external returns (bool);
    function createHat(address[] calldata recipients, uint32[] calldata proportions, bool doChangeHat) external returns (uint256);
    function payInterest(address owner) external returns (bool);
}