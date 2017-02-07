pragma solidity ^0.4.8;

import "MiniMeToken.sol";
import "Congress.sol";
import "Owned.sol";

contract Matriarch is TokenController, Owned {
    
    string public Version = 'Matriarch_0.0.4';
    
    address public ceo; //The beneficiary and figure head of this contract 
    address public vault; //Ether collected during the ico is sent here
    address public curator; //Training wheels that can be removed later
    
    MiniMeToken public tokens; //This token represents the economic weight behind
                               //any votes cast by a holder
    Congress public congress; //Congress allows token holders to submit and vote
                              //on proposals
    
    uint public MAX_TOKEN_SUPPLY;
    uint public MAJORITY_PERCENT = 51;
    bool public TOKEN_SUPPLY_CAPPED = false;
    bool public TRANSFERS_ALLOWED = true;
    
////////////////
// Matriarch Constructor and Default Function
////////////////

    function Matriarch (
        address _ceo, 
        address _curator, 
        address _vault, 
        uint _max_token_supply,
        address _MiniMeToken, 
        address _Congress
    ) {
        ceo = _ceo;
        curator = _curator;
        vault = _vault;
        MAX_TOKEN_SUPPLY = _max_token_supply;
        tokens = MiniMeToken(_MiniMeToken);
        congress = Congress(_Congress);
        
        TOKEN_SUPPLY_CAPPED = false;
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
        bool LOCKED = congress.isLocked(_owner);
        
        return (TRANSFERS_ALLOWED && !LOCKED);
    }
    
////////////////
// MiniMe Token Functions
////////////////
    
    function generateTokens(uint _proposal_id) passed(_proposal_id) {
        bytes32 action = congress.getAction(_proposal_id);
        if(action != 'generateTokens')
            throw;
        
        address owner = congress.getAddressStorage(_proposal_id);
        uint amount = congress.getUintStorage(_proposal_id);
        
        tokens.generateTokens(owner, amount);
        
        TokensGenerated_event(owner, amount);
    }
    
    function toggleTransfers() isCurator {
        //This will require token holder approval in the future
        TRANSFERS_ALLOWED = !TRANSFERS_ALLOWED;
        tokens.enableTransfers(TRANSFERS_ALLOWED);
        
        TransfersToggled_event(TRANSFERS_ALLOWED);
    }

////////////////
// Matriarch Updater Functions
////////////////

    function updateMatriarch(uint _proposal_id) passed(_proposal_id) isCurator {
        bytes32 action = congress.getAction(_proposal_id);
        if(action != 'updateMatriarch')
            throw;
        
        address updatedMatriarch = congress.getAddressStorage(_proposal_id);
        tokens.changeController(updatedMatriarch);
        
        NewController_event(updatedMatriarch);
    }
    
    function easyUpdateMatriarch(address _updatedMatriarch) isCurator {
        tokens.changeController(_updatedMatriarch);
        
        NewController_event(_updatedMatriarch);
    }
    
////////////////
// Matriarch Modifiers
////////////////

    modifier isCurator { 
        if(msg.sender != curator)
            throw;
        _;
    }
    
    modifier passed(uint _proposal_id) { 
        uint threshold = congress.total_locked_tokens() * MAJORITY_PERCENT / 100;
        bool passed = congress.tallyVotes(_proposal_id, threshold);
        if(!passed)
            throw;
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
    
}