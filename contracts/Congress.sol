pragma solidity ^0.4.6;

import "MiniMeToken.sol";
import "Owned.sol";

contract Congress is Owned {
    
    uint INACTIVE = 60 days;
    
    MiniMeToken public tokens;
    uint public total_locked_tokens;
    
    uint public total_voters = 0; //All voters accross all proposals
    mapping (address => Voter) public voters;
    
    uint public total_proposals = 0; //Also serves as the next proposal ID
    mapping (uint => Proposal) public proposals;
    
    function Congress(address _MiniMeToken){
        tokens = MiniMeToken(_MiniMeToken);
    }
    
    function submitProposal(bytes32 _action, string _description_hash, 
    address _relevant_address, uint _relevant_amount) isTokenHolder  {
        total_proposals++;
        
        proposals[total_proposals] = Proposal(_action, _description_hash, 
            _relevant_address, _relevant_amount, 0, false, false, 0, 0, 0, 0);
    }
    
    function vote(uint _proposal_id, bool _support) validProposal(_proposal_id) 
    isTokenHolder {
        
        //Has this voter ever voted before?
        if(voters[msg.sender].total_votes == 0){
            total_locked_tokens += tokens.balanceOf(msg.sender);
            total_voters++;
        }
        
        //If the voter has never voted on this proposal
        if(proposals[_proposal_id].votes[msg.sender].weight == 0) {
            voters[msg.sender].voteIndex[voters[msg.sender].total_votes] = _proposal_id; 
            voters[msg.sender].total_votes++;
            voters[msg.sender].locks++;
            proposals[_proposal_id].votes[msg.sender].weight = tokens.balanceOf(msg.sender);
        }
                
        uint old_weight = proposals[_proposal_id].votes[msg.sender].weight;
        if(old_weight > 0){
            if(proposals[_proposal_id].votes[msg.sender].support)
                proposals[_proposal_id].support -= old_weight;
            else
                proposals[_proposal_id].against -= old_weight;
            
            proposals[_proposal_id].votes[msg.sender].weight = 0;
        }
        
        if(_support)
            proposals[_proposal_id].support += tokens.balanceOf(msg.sender);
        else
            proposals[_proposal_id].against += tokens.balanceOf(msg.sender);
            
        total_locked_tokens += 
        tokens.balanceOf(msg.sender) - voters[msg.sender].locked_tokens;
    }
    
    function unvote(address _voter, uint _proposal_id) validProposal(_proposal_id) 
    isTokenHolder {
        if(_voter != msg.sender)
             if( (block.timestamp - voters[_voter].timestamp) < INACTIVE) throw;
            
        if(voters[_voter].locks == 0)
            throw;
        
        //Has the voter ever voted on this proposal?
        if(proposals[_proposal_id].votes[_voter].weight == 0)
            throw;
        
        proposals[_proposal_id].votes[_voter].weight = 0;
        voters[_voter].locks--;
            
        //If this voter has no votes remove from voting pool
        if(voters[_voter].total_votes == 0){
            total_locked_tokens -= tokens.balanceOf(_voter);
            total_voters--;
        }
    }
    
    function tallyVotes(uint _proposal_id, uint _threshold) 
    validProposal(_proposal_id) isOwner returns (bool) {
        
    }
    
////////////////
// Getter Functions
////////////////

    function getAction(uint _proposal_id) validProposal(_proposal_id) constant 
    returns (bytes32) {
        return proposals[_proposal_id].action;
    }
    
    function getAddressStorage(uint _proposal_id) validProposal(_proposal_id) constant 
    returns (address) {
        return proposals[_proposal_id].address_storage;
    }
    
    function getUintStorage(uint _proposal_id) validProposal(_proposal_id) constant 
    returns (uint) {
        return proposals[_proposal_id].uint_storage;
    }
    
    function getVoterWeight(address _voter, uint _proposal_id) constant
    returns (uint) {
        return proposals[_proposal_id].votes[_voter].weight;
    }
    
    function getVoterSupport(address _voter, uint _proposal_id) constant
    returns (bool) {
        return proposals[_proposal_id].votes[_voter].support;
    }
    
    function isLocked(address _voter) constant returns (bool) {
        if(voters[_voter].locks > 0)
            return true;
        
        return false;
    }
    
////////////////
// Modifiers and Structs
////////////////

    modifier validProposal(uint _proposal_id) {
        if(_proposal_id >= total_proposals) throw;
        if(proposals[_proposal_id].passed) throw;
        if(proposals[_proposal_id].rejected) throw;
        _;
    }
    
    modifier isTokenHolder() {
        if(tokens.balanceOf(msg.sender) == 0) throw;
        _;
    }
    
    struct Voter {
        uint timestamp; //To determine inactivity
        uint locks; //1 lock = 1 vote
        uint locked_tokens;
        
        uint total_votes;
        mapping(uint => uint) voteIndex; //vote# => proposal_id
    }
    
    struct Vote {
        uint weight; //The voters weight for a proposal
        bool support; //Is the voter for or against a proposal
    }
    
    struct Proposal {
        bytes32 action;
        string description_hash;
        address address_storage;
        uint uint_storage;
        
        uint majority_percent;
        bool passed;
        bool rejected;
        uint timestamp;
        
        uint support;
        uint against;
        
        uint total_voters;
        mapping (uint => address) voterIndex;
        mapping (address => Vote) votes;  
    }
}