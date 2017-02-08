pragma solidity ^0.4.8;

import "MiniMeToken.sol";

contract Matriarch is TokenController {
    
    string public Version = 'Matriarch_0.0.5';
    
    address public ceo; //The beneficiary and figure head of this contract 
    address public vault; //Ether collected during the ico is sent here
    address public curator; //Training wheels that can be removed later
    
    MiniMeToken public tokens; //This token represents the economic weight behind
                               //any votes cast by a holder
    
    uint public MAX_PURCHASABLE_TOKEN_SUPPLY;
    uint public PURCHASED_TOKEN_SUPPLY;
    bool public PURCHASABLE_TOKEN_SUPPLY_CAPPED = false;
    bool public TRANSFERS_ALLOWED = true;
    
////////////////
// Matriarch Constructor and Default Function
////////////////

    function Matriarch (
        address _ceo, 
        address _curator, 
        address _vault,
        address _MiniMeToken,
        uint _MAX_PURCHASABLE_TOKEN_SUPPLY
    ) {
        ceo = _ceo;
        curator = _curator;
        vault = _vault;
        tokens = MiniMeToken(_MiniMeToken);
        
        MAX_PURCHASABLE_TOKEN_SUPPLY = _MAX_PURCHASABLE_TOKEN_SUPPLY;
        PURCHASABLE_TOKEN_SUPPLY_CAPPED = false;
        TRANSFERS_ALLOWED = true;
    }
    
    function () payable {
        if(!proxyPayment(msg.sender))
            throw;
    }
    
////////////////
// Token Controller Functions
////////////////
    
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) payable returns(bool) {
        if(PURCHASABLE_TOKEN_SUPPLY_CAPPED)
            return false;
        
        if(PURCHASED_TOKEN_SUPPLY >= MAX_PURCHASABLE_TOKEN_SUPPLY)
            return false;
            
        uint remaining_tokens = MAX_PURCHASABLE_TOKEN_SUPPLY - PURCHASED_TOKEN_SUPPLY;
        uint amount_to_generate = msg.value;
        if(amount_to_generate > remaining_tokens){
            uint difference = amount_to_generate - remaining_tokens;
            if(!msg.sender.send(difference))
                return false;
                
            amount_to_generate = remaining_tokens;
            PURCHASABLE_TOKEN_SUPPLY_CAPPED = true;
        }
        
        PURCHASED_TOKEN_SUPPLY += amount_to_generate;
    
        tokens.generateTokens(_owner,amount_to_generate);
        if(!vault.send(amount_to_generate))
            return false;
        
        TokensGenerated_event(_owner,amount_to_generate);
        return true;
    }

    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) returns(bool) {
        bool LOCKED = voters[_from].locks > 0;
        
        return (TRANSFERS_ALLOWED && !LOCKED);
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) returns(bool) {
        bool LOCKED = voters[_owner].locks > 0;
        
        return (TRANSFERS_ALLOWED && !LOCKED);
    }
    
////////////////
// DAO Functions
////////////////

    uint INACTIVE = 60 days;
    
    uint public majority_percent = 51;
    uint public total_locked_tokens;
    
    uint public total_voters = 0; //All voters accross all proposals
    mapping (address => Voter) public voters;
    
    uint public total_proposals = 0; //Also serves as the next proposal ID
    mapping (uint => Proposal) public proposals;
    
    function submitProposal(bytes32 _action, string _description_hash, 
    address _relevant_address, uint _relevant_amount) isTokenHolder  {
        proposals[total_proposals] = Proposal(_action, _description_hash, 
            _relevant_address, _relevant_amount, false, false, 0, 0, 0, 0);
        total_proposals++;
    }
    
    function vote(uint _proposal_id, bool _support) validProposal(_proposal_id) 
    isTokenHolder {
        
        //Has this voter ever voted before?
        if(voters[msg.sender].locks == 0){
            total_voters++;
        }
        
        var current_balance = tokens.balanceOf(msg.sender);
        var locked_balance = voters[msg.sender].locked_tokens;
        var difference = current_balance - locked_balance;
        if(difference > 0){
            total_locked_tokens += difference;
            voters[msg.sender].locked_tokens = current_balance;
        }
        
        var proposal_balance = proposals[_proposal_id].votes[msg.sender].weight;
        var proposal_support = proposals[_proposal_id].votes[msg.sender].support;
        
        //Has this voter ever voted on this proposal?
        if(proposal_balance > 0){
            //Is the voter switching sides?
            if(proposal_support != _support){
                if(proposal_support)
                    proposals[_proposal_id].support -= proposal_balance;
                else
                    proposals[_proposal_id].against -= proposal_balance;
            }
            
            proposals[_proposal_id].votes[msg.sender].weight = current_balance;
            proposals[_proposal_id].votes[msg.sender].support = _support;
            
            if(_support)
                proposals[_proposal_id].support += current_balance;
            else
                proposals[_proposal_id].against += current_balance;
                
        } else {
            voters[msg.sender].voteIndex[voters[msg.sender].total_votes] = _proposal_id;
            voters[msg.sender].total_votes++;
            proposals[_proposal_id].total_voters++;
            proposals[_proposal_id].votes[msg.sender].weight = current_balance;
            if(_support)
                proposals[_proposal_id].support += current_balance;
            else
                proposals[_proposal_id].against += current_balance;
                
            voters[msg.sender].locks++;
        }
        
        voters[msg.sender].timestamp = block.timestamp;
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
            
        if(proposals[_proposal_id].votes[_voter].support)
            proposals[_proposal_id].support -= proposals[_proposal_id].votes[_voter].weight;
        else
            proposals[_proposal_id].against -= proposals[_proposal_id].votes[_voter].weight;
        
        proposals[_proposal_id].total_voters--;
        voters[_voter].locks--;
        
        //If this voter has no votes remaining remove from voting pool
        if(voters[_voter].locks == 0){
            total_locked_tokens -= voters[_voter].locked_tokens;
            voters[_voter].locked_tokens = 0;
            total_voters--;
        }
    }
    
////////////////
// Curator Functions
////////////////
    
    function toggleTransfers() isCurator {
        //This will require token holder approval in the future
        TRANSFERS_ALLOWED = !TRANSFERS_ALLOWED;
        tokens.enableTransfers(TRANSFERS_ALLOWED);
        
        TransfersToggled_event(TRANSFERS_ALLOWED);
    }
    
    function finalizeProposal(uint _proposal_id)
    validProposal(_proposal_id) 
    passed(_proposal_id)
    isCurator {
        bytes32 action = proposals[_proposal_id].action;
        if(action == 'updateMatriarch'){
            address updatedMatriarch = proposals[_proposal_id].address_storage;
            tokens.changeController(updatedMatriarch);
            
            NewController_event(updatedMatriarch);
        } else if(action == 'generateTokens'){
            address owner =  proposals[_proposal_id].address_storage;
            uint amount =  proposals[_proposal_id].uint_storage;
            tokens.generateTokens(owner, amount);
            
            TokensGenerated_event(owner, amount);
        }
    }
    
    function easyUpdateMatriarch(address newAddress) isCurator {
        tokens.changeController(newAddress);
        NewController_event(newAddress);
    }

////////////////
// Modifiers
////////////////

    modifier isCurator { 
        if(msg.sender != curator)
            throw;
        _;
    }
    
    modifier passed(uint _proposal_id) { 
       bytes32 action = proposals[_proposal_id].action;
        if(action == 'ongoing')
            throw;
        
        uint threshold = total_locked_tokens * majority_percent / 100;
        uint support = proposals[_proposal_id].support;
        if(support > threshold)
            proposals[_proposal_id].passed = true;
            
        uint against = proposals[_proposal_id].against;
        if(against > threshold)
            proposals[_proposal_id].rejected = true;
        _;
    }
    
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
    
    
////////////////
// Events
////////////////

    event TokensGenerated_event(address owner, uint256 amount);
    event TokensDestroyed_event(address owner, uint256 amount);
    event NewController_event(address newController);
    event NewCongress_event(address newCongress);
    event TransfersToggled_event(bool allowed);

////////////////
// Structs
////////////////

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