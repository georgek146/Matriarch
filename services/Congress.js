Matriarch.service('Congress', ['$q','Web3Service','MiniMeToken',
function ($q, Web3Service, MiniMeToken) {
    console.log('Loading Congress Service');

    var Congress_contract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"passed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"toggleTransfers","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"easyUpdateMatriarch","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"TRANSFERS_ALLOWED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"congress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ceo","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_voter","type":"address"}],"name":"getWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_PURCHASABLE_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASABLE_TOKEN_SUPPLY_CAPPED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"proxyPayment","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"vault","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASED_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_ceo","type":"address"},{"name":"_curator","type":"address"},{"name":"_vault","type":"address"},{"name":"_MiniMeToken","type":"address"},{"name":"_Congress","type":"address"},{"name":"_MAX_PURCHASABLE_TOKEN_SUPPLY","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newController","type":"address"}],"name":"NewController_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCongress","type":"address"}],"name":"NewCongress_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"allowed","type":"bool"}],"name":"TransfersToggled_event","type":"event"}]);
    
    var Congress_Address; //TestNet
    var Congress;
    
    var service = {
        setCongressAddress: function(address) {
            Congress_Address = address;
            Congress = Congress_contract.at(Congress_Address);
        },
        changeController: function(newController){
            var deferred = $q.defer();
            
            var txdata = {from: Web3Service.getCurrentAccount(), 
                          to: Congress_Address,
                          gas: 300000};
        
            Congress.changeController(newController, txdata, 
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        getMajorityPercent: function(){
            var deferred = $q.defer();
            Congress.MAJORITY_PERCENT(function(err,percent){
                if(!err)
                    deferred.resolve(percent.toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
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
        submitProposal: function(action,description_hash,address,amount){
            var deferred = $q.defer();
            
            var txdata = {from: Web3Service.getCurrentAccount(), 
                                 to: Congress_Address,
                                 gas: 300000};
        
            console.log(txdata);
            Congress.submitProposal(action, description_hash, address, web3.toWei(amount, 'ether'), txdata, 
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
                          to: Congress_Address,
                          gas: 300000};
        
            Congress.vote(proposal_id, support, txinfo, 
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
                          to: Congress_Address,
                          gas: 300000};
            Congress.unvote(proposal_id, txinfo,
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
            Congress.proposals(proposal_id,
            function(err, infoArray){
                if(!err)
                    deferred.resolve(infoArray);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        passProposal: function(proposal_id){
            var deferred = $q.defer();
            var txinfo = {from: Web3Service.getCurrentAccount(), 
                          to: Congress_Address,
                          gas: 300000};
            Congress.passProposal(proposal_id, txinfo,
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