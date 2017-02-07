Matriarch.service('Matriarch', ['$q','Web3Service','MiniMeToken',
function ($q, Web3Service, MiniMeToken) {
    console.log('Loading Matriarch Service');

    var Matriarch_contract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"action","type":"bytes32"},{"name":"description_hash","type":"string"},{"name":"address_storage","type":"address"},{"name":"uint_storage","type":"uint256"},{"name":"passed","type":"bool"},{"name":"rejected","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"support","type":"uint256"},{"name":"against","type":"uint256"},{"name":"total_voters","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_voter","type":"address"},{"name":"_proposal_id","type":"uint256"}],"name":"unvote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_action","type":"bytes32"},{"name":"_description_hash","type":"string"},{"name":"_relevant_address","type":"address"},{"name":"_relevant_amount","type":"uint256"}],"name":"submitProposal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"toggleTransfers","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"TRANSFERS_ALLOWED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_proposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ceo","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"passProposal","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"timestamp","type":"uint256"},{"name":"locks","type":"uint256"},{"name":"locked_tokens","type":"uint256"},{"name":"total_votes","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_locked_tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAJORITY_PERCENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"},{"name":"_support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_PURCHASABLE_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_voters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASABLE_TOKEN_SUPPLY_CAPPED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"proxyPayment","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"vault","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASED_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_ceo","type":"address"},{"name":"_curator","type":"address"},{"name":"_vault","type":"address"},{"name":"_MiniMeToken","type":"address"},{"name":"_MAX_PURCHASABLE_TOKEN_SUPPLY","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensGenerated_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensDestroyed_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newController","type":"address"}],"name":"NewController_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCongress","type":"address"}],"name":"NewCongress_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"allowed","type":"bool"}],"name":"TransfersToggled_event","type":"event"}]);
    
    var Matriarch_Address = '0xB0d7e66A892af6baa182d02574B33297483d76Bc'; //TestNet
    var Matriarch = Matriarch_contract.at(Matriarch_Address);
    
    var MiniMeToken_Address = MiniMeToken.getMMTAddress();
    
    var service = {
        getCEO: function(){
            var deferred = $q.defer();
            Matriarch.ceo(function(err,ceo){
                if(!err)
                    deferred.resolve(ceo);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getVault: function(){
            var deferred = $q.defer();
            Matriarch.vault(function(err,vault){
                if(!err)
                    deferred.resolve(vault);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getCurator: function(){
            var deferred = $q.defer();
            Matriarch.curator(function(err,curator){
                if(!err)
                    deferred.resolve(curator);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getMaxTokenSupply: function(){
            var deferred = $q.defer();
            Matriarch.MAX_PURCHASABLE_TOKEN_SUPPLY(function(err,max){
                if(!err)
                    deferred.resolve(web3.fromWei(max, 'ether').toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTransferState: function(){
            var deferred = $q.defer();
            Matriarch.TRANSFERS_ALLOWED(function(err,state){
                if(!err)
                    deferred.resolve(state);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getMajorityPercent: function(){
            var deferred = $q.defer();
            Matriarch.MAJORITY_PERCENT(function(err,percent){
                if(!err)
                    deferred.resolve(percent.toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        //Utility Functions
        getTokenFactory(){
            var deferred = $q.defer();
            Matriarch.tokenFactory(function(err,address){
                if(!err)
                    deferred.resolve(address);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getAddress: function(){
            return MiniMeToken_Address;
        },
        getTotalLockedTokens: function(){
            var deferred = $q.defer();
            Matriarch.total_locked_tokens(function(err,locked){
                if(!err)
                    deferred.resolve(locked);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTotalProposals: function(){
            var deferred = $q.defer();
            Matriarch.total_proposals(function(err,proposals){
                if(!err)
                    deferred.resolve(proposals);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTotalVoters: function(){
            var deferred = $q.defer();
            Matriarch.total_proposals(function(err,voters){
                if(!err)
                    deferred.resolve(voters);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        submitProposal: function(action,description_hash,address,amount){
            var deferred = $q.defer();
            
            var transactionObject = {from: Web3Service.getCurrentAccount(), 
                                 to: Matriarch_Address,
                                 gas: 300000};
        
            console.log(transactionObject);
            Matriarch.submitProposal(action, description_hash, address, web3.toWei(amount, 'ether'), transactionObject, 
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        vote: function(proposal_id, support){
            var deferred = $q.defer();
            var txinfo = {from: Web3Service.getCurrentAccount(), 
                          to: Matriarch_Address,
                          gas: 300000};
        
            Matriarch.vote(proposal_id, support, txinfo, 
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        unvote: function(proposal_id){
            var deferred = $q.defer();
            var txinfo = {from: Web3Service.getCurrentAccount(), 
                          to: Matriarch_Address,
                          gas: 300000};
            Matriarch.unvote(proposal_id, txinfo,
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getProposal: function(proposal_id){
            var deferred = $q.defer();
            Matriarch.proposals(proposal_id,
            function(err, infoArray){
                if(!err)
                    deferred.resolve(infoArray);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        tallyVotes: function(){
            var deferred = $q.defer();
            var txinfo = {from: Web3Service.getCurrentAccount(), 
                          to: Matriarch_Address,
                          gas: 300000};
            Matriarch.unvote(proposal_id, txinfo,
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        }
    };
    
    return service;
}]);