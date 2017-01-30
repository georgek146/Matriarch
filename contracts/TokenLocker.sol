pragma solidity ^0.4.6;

import "Owned.sol";
import "MiniMeToken.sol";

contract TokenLocker is Owned {
    
    struct Voter {
        address owner;
        uint weight;
        
        uint locks; //This is the total remaining votes that must be undone
                    //before the balance can be reclaimed
    }
    
    MiniMeToken token;
    
    uint total_voters;
    mapping (uint => address) public voterIndex;
    mapping (address => Voter) public voters;
    
    function TokenLocker(address _MiniMiToken){
        token = MiniMeToken(_MiniMiToken);
    }
    
    function isLocked(address _owner) constant returns (bool) {
        if(voters[_owner].locks == 0)
            return false;
        
        return true;
    }
    
}