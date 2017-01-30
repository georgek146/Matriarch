pragma solidity ^0.4.8;

import "MiniMeToken.sol";
import "Congress.sol";
import "TokenLocker.sol";


contract Matriarch is TokenController, Owned {
    
    string public Version = 'Matriarch_0.0.1';
    
    address public ceo; //The creator of the contract, also usually the beneficiary
    address public beneficiary; //Ether sold during the ico belongs to the beneficiary 
    address public vault; //Ether collected during the ico is sent here
    address public curator; //Training wheels that can be removed later
    
    MiniMeToken public tokens; //This token represents the economic weight behind
                               //any votes cast by a holder
    Congress congress; //This is where you send tokens to cast a vote
    
    uint public MAX_TOKEN_SUPPLY = 1000000 ether;
    uint public MAJORITY_PERCENT = 51;
    bool public TOKEN_SUPPLY_CAPPED = false;
    bool public TRANSFERS_ALLOWED = true;
    
////////////////
// Matriarch Functions
////////////////

    function Matriarch (
        address _ceo, 
        address _beneficiary, 
        address _curator, 
        address _vault, 
        uint _max_token_supply, 
        address _MiniMeToken, 
        address _newCongress
    ) {
        ceo = _ceo;
        beneficiary = _beneficiary;
        curator = _curator;
        vault = _vault;
        MAX_TOKEN_SUPPLY = _max_token_supply;
        tokens = MiniMeToken(_MiniMeToken);
        congress = Congress(_newCongress);
        
        TOKEN_SUPPLY_CAPPED = false;
        TRANSFERS_ALLOWED = true;
    }
    
    function () payable {
        if(!proxyPayment(msg.sender))
            throw;
    }
    
    function updateMatriarch(uint _proposal_id) {
        if(tokens.balanceOf(msg.sender) == 0)
            throw;
            
        //This will require token holder approval in the future
        //A malicious controller could inflate token supply or destroy tokens!
        Proposal proposal = Proposal(congress.proposals(_proposal_id));
        if(proposal.action() != "updateMatriarch")
            throw;
        
        uint threshold = congress.total_weight() * MAJORITY_PERCENT / 100;
        uint support = proposal.current_support();
        if( support < threshold)
            throw;
            
        tokens.changeController(proposal.newDAOController());
        
        NewController_event(proposal.newDAOController());
    }
    
////////////////
// Token Controller Functions
////////////////
    
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) payable returns(bool) {
        if(TOKEN_SUPPLY_CAPPED)
            return false;
        
        uint remaining_tokens = MAX_TOKEN_SUPPLY - tokens.totalSupply();
        uint amount_to_generate = msg.value;
        if(amount_to_generate > remaining_tokens){
            uint difference = amount_to_generate - remaining_tokens;
            if(!msg.sender.send(difference))
                return false;
                
            amount_to_generate = remaining_tokens;
            TOKEN_SUPPLY_CAPPED = true;
        }
        
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
        bool LOCKED = congress.isLocked(_from);
        
        return (TRANSFERS_ALLOWED && !LOCKED);
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount) returns(bool) {
        return TRANSFERS_ALLOWED;
    }
    
////////////////
// MiniMe Token Functions
////////////////
    
    function generateTokens(address _owner, uint _amount) isOwner {
        //This will require token holder approval in the future
        //Can be used to burn tokens or removed completely
        tokens.generateTokens(_owner, _amount);
        
        TokensGenerated_event(_owner, _amount);
    }
    
    function destroyTokens(address _owner, uint _amount) isOwner {
        //This will require token holder approval in the future
        //Can be used to burn tokens or removed completely
        tokens.destroyTokens(_owner, _amount);
        
        TokensDestroyed_event(_owner, _amount);
    }
    
    function toggleTransfers() isOwner {
        //This will require token holder approval in the future
        TRANSFERS_ALLOWED = !TRANSFERS_ALLOWED;
        tokens.enableTransfers(TRANSFERS_ALLOWED);
        
        TransfersToggled_event(TRANSFERS_ALLOWED);
    }
    
////////////////
// Events
////////////////

    event TokensGenerated_event(address owner, uint256 _amount);
    event TokensDestroyed_event(address owner, uint256 _amount);
    event NewController_event(address _newController);
    event TransfersToggled_event(bool allowed);
    
}