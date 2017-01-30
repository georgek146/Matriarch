pragma solidity ^0.4.6;

contract Owned {
    /// @notice The address of the owner is the only address that can call
    ///  a function with this modifier
    modifier isOwner {
        if (msg.sender != owner)
            throw; 
        _; 
    }

    address public owner;

    function Owned() { 
        owner = msg.sender;
    }

    /// @notice Changes the controller of the contract
    /// @param _newOwner The new owner of the contract
    function changeOwner(address _newOwner) isOwner {
        owner = _newOwner;
    }
}