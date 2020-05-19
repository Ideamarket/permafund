pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor (string memory _name, string memory _symbol) ERC20(_name, _symbol) public {}

    function testMint(address _to, uint _amount) external {
        _mint(_to, _amount);
    }
}