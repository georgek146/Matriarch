Matriarch.service('MiniMeToken', ['$q','Web3Service', 
function($q,Web3Service) {
    console.log('Loading MiniMeTokenService');
    
    var MiniMeToken_contract = web3.eth.contract(
        [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"creationBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_newController","type":"address"}],"name":"changeController","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_blockNumber","type":"uint256"}],"name":"balanceOfAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_cloneTokenName","type":"string"},{"name":"_cloneDecimalUnits","type":"uint8"},{"name":"_cloneTokenSymbol","type":"string"},{"name":"_snapshotBlock","type":"uint256"},{"name":"_transfersEnabled","type":"bool"}],"name":"createCloneToken","outputs":[{"name":"","type":"addres0x383fD5ddd2A9551A92071D16F848AF0E193Ff7C1s"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"parentToken","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"}],"name":"generateTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_blockNumber","type":"uint256"}],"name":"totalSupplyAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"transfersEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"parentSnapShotBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"}],"name":"destroyTokens","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenFactory","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_transfersEnabled","type":"bool"}],"name":"enableTransfers","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"_tokenFactory","type":"address"},{"name":"_parentToken","type":"address"},{"name":"_parentSnapShotBlock","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"},{"name":"_transfersEnabled","type":"bool"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_cloneToken","type":"address"},{"indexed":false,"name":"_snapshotBlock","type":"uint256"}],"name":"NewCloneToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Approval","type":"event"}]);
    
    var MiniMeToken_Address; //TestNet
    var MiniMeToken;
    
    var service = {
        changeController: function(newController){
            var deferred = $q.defer();
            
            var txdata = {from: Web3Service.getCurrentAccount(), 
                          to: MiniMeToken_Address,
                          gas: 300000};
        
            MiniMeToken.changeController(newController, txdata, 
            function(err,txHash){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            
            return deferred.promise;
        },
        setMMTAddress: function(newMMTAddress) {
            MiniMeToken_Address = newMMTAddress;
            MiniMeToken = MiniMeToken_contract.at(MiniMeToken_Address);
        },
        getMMTAddress: function(){
            return MiniMeToken_Address;
        },
        getTokenBalance: function(account){
            var deferred = $q.defer();
            
            MiniMeToken.balanceOf(account, {from:Web3Service.getCurrentAccount()},
            function(err, balance){
                if(!err){
                    deferred.resolve(balance);
                } else{
                    deferred.reject(err);
                }
            });
            
            return deferred.promise;
        },
        getCurrentTokenSupply: function(){
            var deferred = $q.defer();
            MiniMeToken.totalSupply(
            function(err, supply){
                if(!err)
                    deferred.resolve(web3.fromWei(supply, 'ether').toString());
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getName: function(mmtAddress){
            var deferred = $q.defer();
            var mmt = MiniMeToken_contract.at(mmtAddress);
            mmt.name(
            function(err, name){
                if(!err)
                    deferred.resolve(name);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getSymbol: function(){
            var deferred = $q.defer();
            MiniMeToken.symbol(
            function(err, symbol){
                if(!err)
                    deferred.resolve(symbol);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        getDecimals: function(){
            var deferred = $q.defer();
            MiniMeToken.decimals(function(err,decimals){
                if(!err)
                    deferred.resolve(decimals);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        },
        transfer: function(to,amount){
            var deferred = $q.defer();
            MiniMeToken.transfer(to, web3.toWei(amount, 'ether'), {from:Web3Service.getCurrentAccount()}, function(){
                if(!err)
                    deferred.resolve(txHash);
                else
                    deferred.reject(err);
            });
            return deferred.promise;
        }
    }
    
    return service;
}]); 