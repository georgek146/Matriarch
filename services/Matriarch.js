Matriarch.service('Matriarch', ['$q','Web3Service','MiniMeToken',
function ($q, Web3Service, MiniMeToken) {
    console.log('Loading Matriarch Service');

    var Matriarch_contract = web3.eth.contract(
        [{"constant":true,"inputs":[],"name":"TOKEN_SUPPLY_CAPPED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"toggleTransfers","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"updatedMatriarch","type":"address"}],"name":"easyUpdateMatriarch","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"updateMatriarch","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"TRANSFERS_ALLOWED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"}],"name":"generateTokens","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"congress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ceo","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAJORITY_PERCENT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"}],"name":"destroyTokens","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"proxyPayment","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"vault","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_ceo","type":"address"},{"name":"_curator","type":"address"},{"name":"_vault","type":"address"},{"name":"_max_token_supply","type":"uint256"},{"name":"_MiniMeToken","type":"address"},{"name":"_newCongress","type":"address"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensGenerated_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensDestroyed_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newController","type":"address"}],"name":"NewController_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"allowed","type":"bool"}],"name":"TransfersToggled_event","type":"event"}]);
    
    var Matriarch_Address = '0x58364609D6e7462A34ed9e5C754E5Bf4d900FbC9'; //TestNet
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
            Matriarch.MAX_TOKEN_SUPPLY(function(err,max){
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
        }
    };
    
    return service;
}]);