Matriarch.service('Congress', ['$q','Web3Service',
function ($q, Web3Service) {
    console.log('Loading Matriarch Service');

    var Congress_contract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"action","type":"bytes32"},{"name":"description_hash","type":"string"},{"name":"address_storage","type":"address"},{"name":"uint_storage","type":"uint256"},{"name":"passed","type":"bool"},{"name":"rejected","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"support","type":"uint256"},{"name":"against","type":"uint256"},{"name":"total_voters","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_action","type":"bytes32"},{"name":"_description_hash","type":"string"},{"name":"_relevant_address","type":"address"},{"name":"_relevant_amount","type":"uint256"}],"name":"submitProposal","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"unvote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"locks","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_proposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_locked_tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"getAction","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"getAddressStorage","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"},{"name":"support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"},{"name":"_curator","type":"address"},{"name":"_threshold","type":"uint256"}],"name":"tallyVotes","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_voters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_MiniMeToken","type":"address"}],"payable":false,"type":"constructor"}]);
    
    var Congress_Address = '0x61d5B00eBf3C4b1D2823Eb76888C3FfC67767f8d'; //TestNet
    var Congress = Congress_contract.at(Congress_Address);
    
    var service = {
        getTotalLockedTokens: function(){
            var deferred = $q.defer();
            Congress.total_locked_tokens(function(err,locked){
                if(!err)
                    deferred.resolve(locked);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTotalProposals: function(){
            var deferred = $q.defer();
            Congress.total_proposals(function(err,proposals){
                if(!err)
                    deferred.resolve(proposals);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTotalVoters: function(){
            var deferred = $q.defer();
            Congress.total_proposals(function(err,voters){
                if(!err)
                    deferred.resolve(voters);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        submitProposal: function(action,description_hash){
            var deferred = $q.defer();
            
            var transactionObject = {from: Web3Service.getCurrentAccount(), 
                                 to: Congress_Address,
                                 value: web3.toWei(amount, 'ether'),
                                 gas: 300000};
        
            console.log(transactionObject);

            web3.eth.estimateGas(action, description_hash, transactionObject, function(err, gas){
                console.log(err,gas); 
                transactionObject.gas = Math.round(gas*1.1);
                Congress.submitProposal(transactionObject, 
                function(err,txHash){
                    if(!err)
                        deferred.resolve(ceo);
                    else
                        deferred.reject(err);
                });
            }); 
            return deferred.promise;
        },
        vote: function(proposal_id, support){
            var deferred = $q.defer();
            Congress.vote(proposal_id, support, function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        unvote: function(proposal_id){
            var deferred = $q.defer();
            Congress.unvote(proposal_id, function(err,txHash){
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