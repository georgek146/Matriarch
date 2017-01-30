Matriarch.controller('HomeViewController', ['$scope','Web3Service','Matriarch','MiniMeToken','$http',
function($scope, Web3Service, Matriarch, MiniMeToken, $http){
    console.log('Loading Home View');
    
    $scope.hidden = localStorage.getItem('hide-home-view-notification');
    
    $scope.hide = function(){
        $scope.hidden = true;
        localStorage.setItem('hide-home-view-notification', $scope.hidden);
    };
    
    $http({
      method: 'GET',
      url: 'http://gateway.ipfs.io/ipfs/QmYy4LAoXn2nALvu6UWpWoKoAJEQ967bKSUrVDTQ5XvvMF'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(response);
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(response);
    });
    
    Matriarch.getCEO().then(
    function(ceo){
        $scope.ceo = ceo;
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
                          value: web3.toWei(amount, 'ether')};
        
        console.log(transactionObject);
                                            
        web3.eth.sendTransaction(transactionObject,
        function(err,address){
            console.log(err,address);
        });
    }
    
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