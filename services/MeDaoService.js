Matriarch.service('MeDao', ['$q','Web3Service','MiniMeToken',
function ($q, Web3Service, MiniMeToken) {
    console.log('Loading MeDao Service');

    var MeDao_contract = web3.eth.contract(
        [{"constant":false,"inputs":[{"name":"_proposal_id","type":"uint256"}],"name":"passed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"toggleTransfers","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"easyUpdateMatriarch","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"TRANSFERS_ALLOWED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"congress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ceo","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_voter","type":"address"}],"name":"getWeight","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"Version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onApprove","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MAX_PURCHASABLE_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"curator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASABLE_TOKEN_SUPPLY_CAPPED","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"proxyPayment","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"vault","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"PURCHASED_TOKEN_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_ceo","type":"address"},{"name":"_curator","type":"address"},{"name":"_vault","type":"address"},{"name":"_MiniMeToken","type":"address"},{"name":"_Congress","type":"address"},{"name":"_MAX_PURCHASABLE_TOKEN_SUPPLY","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newController","type":"address"}],"name":"NewController_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCongress","type":"address"}],"name":"NewCongress_event","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"allowed","type":"bool"}],"name":"TransfersToggled_event","type":"event"}]);
    
    var MeDao_Address = '0xE364fF985Fa0bEF6658dC940cF8df9E4EEa6f261'; //TestNet
    var MeDao = MeDao_contract.at(MeDao_Address);
    
    var service = {
        setMeDaoAddress: function(address) {
            MeDao_Address = address;
            MeDao = MeDao_contract.at(MeDao_Address);
        },
        getCEO: function(){
            var deferred = $q.defer();
            MeDao.ceo(function(err,ceo){
                if(!err)
                    deferred.resolve(ceo);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getVault: function(medaoAddress){
            var deferred = $q.defer();
            var medao = MeDao_contract.at(medaoAddress);
            medao.vault(function(err,vault){
                if(!err)
                    deferred.resolve(vault);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getCurator: function(){
            var deferred = $q.defer();
            MeDao.curator(function(err,curator){
                if(!err)
                    deferred.resolve(curator);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getMaxTokenSupply: function(){
            var deferred = $q.defer();
            MeDao.MAX_PURCHASABLE_TOKEN_SUPPLY(function(err,max){
                if(!err)
                    deferred.resolve(web3.fromWei(max, 'ether').toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getTransferState: function(){
            var deferred = $q.defer();
            MeDao.TRANSFERS_ALLOWED(function(err,state){
                if(!err)
                    deferred.resolve(state);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getMMTAddress: function(medaoAddress){
            var deferred = $q.defer();
            var medao = MeDao_contract.at(medaoAddress);
            medao.tokens(function(err,mmtAddress){
                if(!err)
                    deferred.resolve(mmtAddress);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getCongressAddress: function(){
            var deferred = $q.defer();
            MeDao.congress(function(err,congressAddress){
                if(!err)
                    deferred.resolve(congressAddress);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        }
    };
    
    return service;
}]);