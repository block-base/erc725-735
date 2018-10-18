pragma solidity ^0.4.24;

import "./ClaimHolder.sol";

contract UserRegistry {

    event NewUser(address _address, address _identity);
    mapping(address => address) public users;

    function identity() public {
        address _identity = new ClaimHolder();
        users[msg.sender] = _identity;
        emit NewUser(msg.sender, _identity);
    }

}
