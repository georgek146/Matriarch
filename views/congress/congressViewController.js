Matriarch.controller('CongressViewController', ['$scope','$location','Matriarch','MiniMeToken','Web3Service','IpfsService',
function($scope,$location,Matriarch,MiniMeToken,Web3Service,IpfsService){
    console.log('Loading Congress View');
    
    Matriarch.getMajorityPercent().then(
    function(percent){
        $scope.majorityPercent = percent;
    });
    
    Matriarch.getCurator().then(
    function(curator){
        $scope.curator = curator;
    });
    
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
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    $scope.goto = function(url) {
        $location.url(url);
    };
    
    Matriarch.getTotalLockedTokens().then(
    function(locked){
        $scope.totalLocked = web3.fromWei(locked.toNumber(),'ether');;
    }).catch( function(err){
        console.error(err);
    });
    
    $scope.proposals = {id:[]};
    Matriarch.getTotalProposals().then(
    function(total){
        $scope.total_proposals = total.toNumber();
        
        for(var i = 0; i < total.toNumber(); i++) {
            Matriarch.getProposal(i).then(
            function(proposal){
                $scope.proposal = proposal;
                console.log(i,proposal);
                var support = web3.fromWei(proposal[7],'ether').toNumber();
                var against = web3.fromWei(proposal[8],'ether').toNumber();
                console.log(support,against);
                $scope.support = 0;
                
                if((support+against) > 0){
                    var percent = support/(support+against)*100;
                    $scope.support = Math.round(percent);
                    
                    console.log(percent, $scope.support);
                }
                $scope.against = 100 - $scope.support;
                console.log(support,against, $scope.support, $scope.against);
                
                IpfsService.getIpfsData(proposal[1]).then(
                function(data){
                    console.log(data);
                    console.log(JSON.parse(data));
                    var proposalInfo = {
                        id: $scope.proposals.id.length,
                        action: web3.toAscii(proposal[0]),
                        hash: proposal[1],
                        address: proposal[2],
                        amount: web3.fromWei(proposal[3].toNumber(),'ether'),
                        passed: proposal[4],
                        rejected: proposal[5],
                        timestamp: new Date(proposal[6]*1000),
                        support: $scope.support,
                        against: $scope.against,
                        totalVoters: proposal[9].toNumber(),
                        title: data.title,
                        description: data.description
                    };
                    
                    $scope.proposals.id.push(proposalInfo);
                    console.log($scope.proposals.id);
                });
                    
            }).catch(function(err){
                console.error(err);
            });
        }
    }).catch(function(err){
        console.error(err);
    });
}]);