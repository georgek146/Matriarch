Matriarch.controller('ProposalViewController', ['$scope','$location','Matriarch','MiniMeToken','Web3Service','IpfsService',
function($scope,$location,Matriarch,MiniMeToken,Web3Service,IpfsService){
    console.log('Loading Proposal View');
    
    Matriarch.getCurator().then(
    function(curator){
        $scope.curator = curator;
    });
    
    Matriarch.getMajorityPercent().then(
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
    
    Matriarch.getTotalLockedTokens().then(
    function(locked){
        $scope.totalLocked = web3.fromWei(locked.toNumber(),'ether');;
    }).catch( function(err){
        console.error(err);
    });
    
    Matriarch.getProposal($scope.id).then(
    function(proposal){
        $scope.proposal = proposal;
        $scope.action = web3.toAscii(proposal[0]);
        $scope.passed = proposal[5];
        $scope.rejected = proposal[6];
        var support = web3.fromWei(proposal[8],'ether').toNumber();
        var against = web3.fromWei(proposal[9],'ether').toNumber();
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
            console.log($scope.proposal, data);
            $scope.proposal = {
                action: web3.toAscii(proposal[0]),
                hash: proposal[1],
                address: proposal[2],
                amount: web3.fromWei(proposal[3].toNumber(),'ether'),
                majority_percent: proposal[4],
                passed: proposal[5],
                rejected: proposal[6],
                timestamp: new Date(proposal[7]*1000),
                support_percent: $scope.support,
                against_percent: $scope.against,
                support: support,
                against: against,
                totalVoters: proposal[10].toNumber(),
                title: data.title,
                description: data.description
            };
        });
    });
    
    $scope.vote = function(support){
        Matriarch.vote($scope.id,support).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.unvote = function(){
        Matriarch.vote($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.approve = function(){
        Matriarch.tallyVotes($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    }
}]);