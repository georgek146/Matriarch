Matriarch.controller('MeDaoViewController', ['$scope','Web3Service','MeDao','MiniMeToken','Matriarch','Congress','IpfsService','$location',
function($scope, Web3Service, MeDao, MiniMeToken, Matriarch, Congress, IpfsService, $location){
    console.log('Loading MeDao View');
    
    var url = $location.url();
    var array = url.split('/');
    $scope.currentAccount = array[2].toLowerCase();
    $scope.loggedInAccount = Web3Service.getCurrentAccount();
    
    $scope.editDescription = false;
    $scope.newDescription = {};
    $scope.newDescription.text = '*Markdown* is **supported!**';
    $scope.newDescription.marked = marked($scope.newDescription.text);
    
    $scope.$watch('newDescription.text', function() {
        $scope.newDescription.marked = marked($scope.newDescription.text);
    });
    
    Matriarch.getDescriptionHash($scope.currentAccount).then(
    function(hash){
        console.log(hash);
        return IpfsService.getIpfsData(hash);
    }).then(function(data){
        console.log(data);
        if(data)
            $scope.description = marked(data);
    }).catch(function(err){
        console.error(err);
    });
    
    Matriarch.getMeDaoAddress($scope.currentAccount).then(
    function(meDaoAddress){
        if(meDaoAddress !== '0x0000000000000000000000000000000000000000'){
            MeDao.setMeDaoAddress(meDaoAddress);
            
            MeDao.getMMTAddress(meDaoAddress).then(
            function(mmtAddress){
                MiniMeToken.setMMTAddress(mmtAddress);
                
                MiniMeToken.getName(mmtAddress)
                .then( function(name){
                    $scope.name = name;
                }).catch( function(err){
                    console.error(err);
                });
                
                MiniMeToken.getSymbol(Web3Service.getCurrentAccount())
                .then( function(symbol){
                    $scope.symbol = symbol;
                }).catch( function(err){
                    console.error(err);
                });
                
                $scope.hidden = false;
                
            });
            
            MeDao.getCongressAddress().then(
            function(congressAddress){
                Congress.setCongressAddress(congressAddress);
            }).catch(function(err){
                console.error(err);
            });
            
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
    
    $scope.setDescription = function(){
        IpfsService.getIpfsHash($scope.newDescription.text).then(
        function(ipfsHash){
            return Matriarch.updateDescription(ipfsHash);
        }).then(function(txHash){
            Web3Service.getTransactionReceipt(txHash).then(
            function(reciept){
                MeDao.getDescription().then(
                function(description){
                    $scope.description = description;
                });
            });
        });
    };
    
}]);