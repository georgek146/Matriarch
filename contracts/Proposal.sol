pragma solidity ^0.4.8;

import "Owned.sol";

contract Proposal is Owned{
    
    bool public passed = false;
    uint public passed_timestamp;
    
    bytes32 public action;
    string public description_hash;
    
    //Matriarch.generate/destroyTokens(address _owner, uint _amount)
    address public owner;
    uint public amount;
    
    //Matriarch.updateDAO(_newDAOController)
    address public newDAOController;
    
    uint public current_support = 0;
    uint public total_voters = 0;
    mapping (uint => address) voters;
    mapping (address => uint) weights;
    
    function Proposal(bytes32 _action, string _description_hash, address _owner, 
    uint _amount, address _newDAOController){
        action = _action;
        description_hash = _description_hash;
        owner = _owner;
        amount = _amount;
        newDAOController = _newDAOController;
    }
    
    //The integrity of '_voter' and '_weight' is gauranteed by the Matriarch
    function depositVote(address _voter, uint _weight) isOwner {
        uint difference = _weight - weights[_voter];
        weights[_voter] += difference;
        current_support += difference;
    }
    
    //The integrity of '_voter' is gauranteed by the Matriarch
    function withdrawVote(address _voter) isOwner {
        current_support -= weights[_voter];
        weights[_voter] = 0;
        total_voters--;
    }
}