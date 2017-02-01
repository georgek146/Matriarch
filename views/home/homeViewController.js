Matriarch.controller('HomeViewController', ['$scope','Web3Service','Matriarch','MiniMeToken',
function($scope, Web3Service, Matriarch, MiniMeToken){
    console.log('Loading Home View');
    
    $scope.hidden = localStorage.getItem('hide-home-view-notification');
    
    $scope.hide = function(){
        $scope.hidden = true;
        localStorage.setItem('hide-home-view-notification', $scope.hidden);
    };
    
    Matriarch.getCEO().then(
    function(ceo){
        $scope.ceo = ceo;
    });
    
    Matriarch.getVault().then(
    function(vault){
        $scope.vault = vault;
    });
    
    Matriarch.getCurator().then(
    function(curator){
        $scope.curator = curator;
    });
    
    Matriarch.getMaxTokenSupply().then(
    function(max){
        $scope.maxTokenSupply = max;
    });
    
    MiniMeToken.getDecimals().then(
    function(decimals){
        $scope.decimals = decimals.toNumber();
    }).catch(function(err){
        console.error(err);
    });
    
    setInterval(function(){
        MiniMeToken.getCurrentTokenSupply().then(
        function(supply){
            $scope.currentTokenSupply = supply;
        });
        
        MiniMeToken.getTokenBalance(Web3Service.getCurrentAccount())
        .then( function(balance){
            $scope.actions.sell.max = web3.fromWei(balance, 'ether').toNumber();
        }).catch( function(err){
            console.error(err);
        });

        Web3Service.getEtherBalance(Web3Service.getCurrentAccount())
        .then( function(etherBalance){
            $scope.actions.buy.max = web3.fromWei(etherBalance , 'ether').toNumber();
        }).catch( function(err){
            console.error(err);
        });
    }, 1000);
    
    Matriarch.getTransferState().then(
    function(state){
        $scope.transfersAllowed = state;
    });
    
    MiniMeToken.getSymbol(Web3Service.getCurrentAccount())
    .then( function(symbol){
        $scope.symbol = symbol;
    }).catch( function(err){
        console.error(err);
    });
    
    MiniMeToken.getName(Web3Service.getCurrentAccount())
    .then( function(name){
        $scope.name = name;
    }).catch( function(err){
        console.error(err);
    });
    
    $scope.MMTAddress = MiniMeToken.getMMTAddress();
    
    $scope.actions = {
        buy: {
            token: 0,
            ico: 0,
            max: 0
        },
        sell: {
            token: 0,
            max: 0
        },
        transfer: {
            to: '',
            amount: 0
        },
        change: {
            newMMTaddress: $scope.currentMMTAddress
        }
    };
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    $scope.buyICOTokens = function(amount) {
        if($scope.maxTokenSupply <= $scope.currentTokenSupply)
            return false;
        
        var transactionObject = {from: Web3Service.getCurrentAccount(), 
                                 to: MiniMeToken.getMMTAddress(),
                                 value: web3.toWei(amount, 'ether'),
                                 gas: 300000};
        
        console.log(transactionObject);
        
        web3.eth.estimateGas(transactionObject, function(err, gas){
            console.log(err,gas); 
            transactionObject.gas = Math.round(gas*1.1);
            web3.eth.sendTransaction(transactionObject,
            function(err,address){
                console.log(err,address);
            });
        });                               
    };
    
    $scope.transfer = function(to,amount) {
        console.log(to,amount);
        MiniMeToken.transfer(to,amount).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.errror(err);
        });
    };
}]);