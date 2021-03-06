Matriarch.service('Matriarch', ['$q','Web3Service',
function ($q, Web3Service) {
    console.log('Loading Matriarch Service');

    var Matriarch_contract = web3.eth.contract(
        [{"constant":true,"inputs":[{"name":"_account","type":"address"}],"name":"isVetted","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"deleteDao","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"total_daos","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_meDao","type":"address"}],"name":"registerMeDao","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"index","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newController","type":"address"}],"name":"changeController","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ceo","type":"address"},{"name":"_vetted","type":"bool"}],"name":"vet","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_description_hash","type":"string"}],"name":"updateDescriptionHash","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"meDaos","outputs":[{"name":"owner","type":"address"},{"name":"meDao","type":"address"},{"name":"description_hash","type":"string"},{"name":"vetted","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newMeDao","type":"address"}],"name":"updateMeDao","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"}]);
    
    //var Matriarch_Address = '0x8a3f4cab1E1aa6CEF8D8b8ae1AA9f2F264116578'; newest
    var Matriarch_Address = '0xFD5E121159533D66Ac510B49D9c2C2Ea49474f86';
    var Matriarch = Matriarch_contract.at(Matriarch_Address);
    
    var service = {
        registerMeDao: function(address) {
            var deferred = $q.defer();
            Matriarch.registerMeDao(address, {from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        },
        getMeDaoAddress: function(account){
            var deferred = $q.defer();
            Matriarch.meDaos(account, 
            function(err, meDaoArray) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(meDaoArray[1]);
                    
            });
            return deferred.promise;
        },
        updateMeDao: function(newMeDao) {
            var deferred = $q.defer();
            Matriarch.updateMeDao(newMeDao, {from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        },
        updateDescription: function(hash) {
            var deferred = $q.defer();
            Matriarch.updateDescriptionHash(hash, {from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        },
        getDescriptionHash: function(address) {
            var deferred = $q.defer();
            Matriarch.meDaos(address,
            function(err, dao) {
                console.log(dao);
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(dao[2]);
            });
            return deferred.promise;
        },
        isVetted: function(account) {
            var deferred = $q.defer();
            Matriarch.isVetter(address, 
            function(err, vetted) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(vetted);
                    
            });
            return deferred.promise;
        },
        vet: function(account) {
            var deferred = $q.defer();
            Matriarch.vet(address, {from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        },
        getTotalDaos: function() {
            var deferred = $q.defer();
            Matriarch.total_daos({from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        },
        getIndex: function(index) {
            var deferred = $q.defer();
            Matriarch.index(index, {from:Web3Service.getCurrentAccount()}, 
            function(err, txHash) {
                if(err)
                    deferred.reject(err);
                else
                    deferred.resolve(txHash);
                    
            });
            return deferred.promise;
        }
    };
    
    return service;
}]);