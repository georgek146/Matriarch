Matriarch.controller('MeDaoViewController', ['$scope','Web3Service','MeDao','MiniMeToken','Matriarch','Congress','IpfsService','$location',
function($scope, Web3Service, MeDao, MiniMeToken, Matriarch, Congress, IpfsService, $location){
    console.log('Loading MeDao View');
    
    var url = $location.url();
    var array = url.split('/');
    $scope.currentAccount = array[2].toLowerCase();
    
    Matriarch.getMeDaoAddress($scope.currentAccount).then(
    function(meDaoAddress){
        if(meDaoAddress !== '0x0000000000000000000000000000000000000000'){
            MeDao.setMeDaoAddress(meDaoAddress);
            MeDao.getMMTAddress().then(
            function(mmtAddress){
                MiniMeToken.setMMTAddress(mmtAddress);
                setup();
                $scope.hidden = false;
                return MeDao.getCongressAddress();
            }).then(function(congressAddress){
                Congress.setCongressAddress(congressAddress);
            }).catch(function(err){
                console.error(err);
            });
        } else {
            $scope.goto('deploy');
        }
    }).catch(function(err){
        console.error(err);
    });
    
    $scope.goto = function(url){
        console.log(url);
        $location.url(url);
    };
    
    var setup = function(){
        
        MeDao.getCEO().then(
        function(ceo){
            $scope.ceo = ceo;
        });

        MeDao.getVault().then(
        function(vault){
            $scope.vault = vault;
        });

        MeDao.getCurator().then(
        function(curator){
            $scope.curator = curator;
        });

        MeDao.getMaxTokenSupply().then(
        function(max){
            $scope.maxTokenSupply = max;//web3.fromWei(max, 'ether');
        });

        MeDao.getTransferState().then(
        function(state){
            $scope.transfersAllowed = state;
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

        MiniMeToken.getDecimals().then(
        function(decimals){
            $scope.decimals = decimals.toNumber();
        }).catch(function(err){
            console.error(err);
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
    };
    
}]);