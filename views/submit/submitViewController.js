Matriarch.controller('SubmitViewController', ['$scope','$location','MeDao','MiniMeToken','Web3Service','IpfsService','Congress','Matriarch',
function($scope,$location,MeDao,MiniMeToken,Web3Service,IpfsService,Congress,Matriarch){
    console.log('Loading Submit View');
    
    $scope.options = ['Ongoing','updateMeDao','createCloneToken','generateTokens'];
    $scope.proposal = {
        action: null,
        title: null,
        description: null,
        address: null,
        amount: null,
    };
    
    var url = $location.url();
    var array = url.split('/');
    $scope.currentAccount = array[2];
    
    $scope.goto = function(url) {
        console.log(url);
        $location.url(url);
    };
    
    $scope.submitProposal = function(){
        IpfsService.getIpfsHash(JSON.stringify($scope.proposal)).then(
        function(ipfsHash){
            return Congress.submitProposal($scope.proposal.action,ipfsHash,$scope.proposal.address,$scope.proposal.amount);
        }).then(function(txHash){
            Web3Service.getTransactionReceipt(txHash).then(
            function(receipt){
                $scope.goto('medao/'+ $scope.currentAccount + '/proposal/' + ($scope.total_proposals-1));
            });
        }).catch(function(err){
            console.error(err);
        });
    };
    
    Matriarch.getMeDaoAddress($scope.currentAccount).then(
    function(medaoAddress){
        MeDao.setMeDaoAddress(medaoAddress);
        
        MeDao.getMMTAddress().then(
        function(mmtAddress){
            MiniMeToken.setMMTAddress(mmtAddress);

            MiniMeToken.getSymbol(Web3Service.getCurrentAccount()).then(
            function(symbol){
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
        }).catch(function(err){
            console.error(err);
        });

        MeDao.getCongressAddress().then(
        function(congressAddress){
            Congress.setCongressAddress(congressAddress);

            $scope.proposals = {ids:[]};
            Congress.getTotalProposals().then(
            function(total){
                $scope.total_proposals = total.toNumber();

                for(var i = 0; i < total.toNumber(); i++) {
                   $scope.proposals.ids.push(i);
                }
            }).catch(function(err){
                console.error(err);
            });
        }).catch(function(err){
            console.error(err);
        });
    });
}]);