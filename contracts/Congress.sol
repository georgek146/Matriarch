pragma solidity ^0.4.6;

import "Owned.sol";
import "MiniMeToken.sol";
import "TokenLocker.sol";
import "Proposal.sol";

contract Congress is TokenLocker {
    
    uint public total_weight;
    
    uint public total_proposals = 0; //Also serves as the next proposal ID
    mapping (uint => Proposal) public proposals;
    
    function Congress(address _MiniMeToken) TokenLocker(_MiniMeToken){ }
    
    function submitProposal(bytes32 _action, string _description_hash,
    address _owner, uint _amount, address _newDAOController) isOwner {
        proposals[total_proposals] = new Proposal(_action, _description_hash, 
            _owner, _amount, _newDAOController);
            
        total_proposals++;
    }
    
    function vote(uint _proposal_id) {
        if(_proposal_id >= total_proposals)
            throw;
            
        uint weight = token.balanceOf(msg.sender);
        if(weight == 0)
            throw;
          
        voters[msg.sender].weight = weight;
        voters[msg.sender].locks++;
        
        Proposal(_proposal_id).depositVote(msg.sender,weight);
    }
    
    function unvote(uint _proposal_id) {
        if(_proposal_id >= total_proposals)
            throw;
            
        uint weight = token.balanceOf(msg.sender);
        if(weight == 0)
            throw;
            
        if(voters[msg.sender].locks == 0)
            throw;
        
        voters[msg.sender].locks--;
        
        Proposal(_proposal_id).withdrawVote(msg.sender);
    }
}