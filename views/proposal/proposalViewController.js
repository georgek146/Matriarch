Matriarch.controller('ProposalViewController', ['$scope','$location','MeDao','MiniMeToken','Web3Service','IpfsService',
function($scope,$location,MeDao,MiniMeToken,Web3Service,IpfsService){
    console.log('Loading Proposal View');
    
    MeDao.getCurator().then(
    function(curator){
        $scope.curator = curator;
    });
    
    MeDao.getMajorityPercent().then(
    function(percent){
        $scope.majorityPercent = percent;
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
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    $scope.currentNavItem = $location.url().slice(1);
    $scope.urlArray = $scope.currentNavItem.split('/');
    $scope.id = $scope.urlArray[1];
    
    MeDao.getTotalLockedTokens().then(
    function(locked){
        $scope.totalLocked = web3.fromWei(locked.toNumber(),'ether');;
    }).catch( function(err){
        console.error(err);
    });
    
    MeDao.getProposal($scope.id).then(
    function(proposal){
        $scope.proposal = proposal;
        $scope.action = web3.toAscii(proposal[0]);
        $scope.passed = proposal[4];
        $scope.rejected = proposal[5];
        var support = web3.fromWei(proposal[7],'ether').toNumber();
        var against = web3.fromWei(proposal[8],'ether').toNumber();
        console.log(support,against);
        $scope.support = 0;

        if((support+against) > 0){
            var total = support+against;
            var percent = support/total;
            $scope.support = Math.round(percent*100);

            console.log(total, percent, $scope.support);
        }
        $scope.against = 100 - $scope.support;
        console.log(support,against, $scope.support, $scope.against);

        IpfsService.getIpfsData(proposal[1]).then(
        function(data){
            console.log(data);
            data = JSON.parse(data);
            $scope.proposal = {
                action: web3.toAscii(proposal[0]),
                hash: proposal[1],
                address: proposal[2],
                amount: web3.fromWei(proposal[3].toNumber(),'ether'),
                passed: proposal[4],
                rejected: proposal[5],
                timestamp: new Date(proposal[6]*1000),
                support_percent: $scope.support,
                against_percent: $scope.against,
                support: support,
                against: against,
                totalVoters: proposal[9].toNumber(),
                title: data.title,
                description: data.description
            };
        });
    });
    
    $scope.vote = function(support){
        MeDao.vote($scope.id,support).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.unvote = function(){
        MeDao.vote($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.pass = function(){
        MeDao.passProposal($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    }
}]);