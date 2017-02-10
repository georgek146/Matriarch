Matriarch.service('Congress', ['$q','Web3Service','MiniMeToken',
function ($q, Web3Service, MiniMeToken) {
    console.log('Loading Congress Service');

    var Congress_contract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"action","type":"bytes32"},{"name":"description_hash","type":"string"},{"name":"address_storage","type":"address"},{"name":"uint_storage","type":"uint256"},{"name":"passed","type":"bool"},{"name":"rejected","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"support","type":"uint256"},{"name":"against","type":"uint256"},{"name":"total_voters","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_voter","type":"address"},{"name":"_proposal_id","type":"uint256"}],"name":"unvote","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"getProposalAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_action","type":"bytes32"},{"name":"_description_hash","type":"string"},{"name":"_relevant_address","type":"address"},{"name":"_relevant_amount","type":"uint256"}],"name":"submitProposal","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_voter","type":"address"}],"name":"isVoterLocked","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newController","type":"address"}],"name":"changeController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"majority_percent","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"getProposalUint","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"getProposalAction","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_proposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"voters","outputs":[{"name":"timestamp","type":"uint256"},{"name":"locks","type":"uint256"},{"name":"locked_tokens","type":"uint256"},{"name":"total_votes","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_locked_tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"},{"name":"_support","type":"bool"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"pass","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_voters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_curator","type":"address"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_cloneToken","type":"address"},{"indexed":false,"name":"_snapshotBlock","type":"uint256"}],"name":"NewCloneToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Approval","type":"event"}]);
    
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
            Congress.majority_percent(function(err,percent){
                if(!err)
                    deferred.resolve(percent.toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getCurator: function(){
            var deferred = $q.defer();
            Congress.curator(function(err,curator){
                if(!err)
                    deferred.resolve(curator);
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