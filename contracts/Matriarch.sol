pragma solidity^0.4.8;

import "MiniMeToken.sol";

contract Matriarch is Controlled {
    
    struct DAO {
        address meDao;
        string description_hash;
        bool vetted;
    }
    
    uint public total_daos;
    mapping (uint => address) public index;
    mapping (address => DAO) public meDaos;
    
    function registerMeDao(address _meDao) {
        index[total_daos] = msg.sender;
        meDaos[msg.sender] = DAO(_meDao, '', false);
        total_daos++;
    }
    
    function setDescriptionHash(string _description_hash) {
        meDaos[msg.sender].description_hash = _description_hash;
    }
    
    function isVetted(address _account) constant returns (bool) {
        return meDaos[_account].vetted;
    }
    
////////////////
// Controller Functions
////////////////
    
    function vet(address _ceo, bool _vetted) onlyController {
        meDaos[_ceo].vetted = _vetted;
    }
    
}