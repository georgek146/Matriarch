Matriarch.controller('ProposalViewController', ['$scope','$location','MeDao','MiniMeToken','Web3Service','IpfsService','Matriarch','Congress',
function($scope,$location,MeDao,MiniMeToken,Web3Service,IpfsService,Matriarch,Congress){
    console.log('Loading Proposal View');
    
    
    var url = $location.url();
    var array = url.split('/');
    $scope.currentAccount = array[2].toLowerCase();
    
    $scope.goto = function(url) {
        console.log(url);
        $location.url(url);
    };
    
    Matriarch.getMeDaoAddress($scope.currentAccount).then(
    function(medaoAddress){
        MeDao.setMeDaoAddress(medaoAddress);
        
        MeDao.getMMTAddress(medaoAddress).then(
        function(mmtAddress){
            MiniMeToken.setMMTAddress(mmtAddress);

            MiniMeToken.getSymbol(Web3Service.getCurrentAccount())
            .then( function(symbol){
                $scope.symbol = symbol;
            }).catch( function(err){
                console.error(err);
            });

            MiniMeToken.getName(mmtAddress)
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

            Congress.getTotalLockedTokens().then(
            function(locked){
                $scope.totalLocked = web3.fromWei(locked.toNumber(),'ether');;
            }).catch( function(err){
                console.error(err);
            });

            Congress.getProposal($scope.id).then(
            function(proposal){
                $scope.proposal = proposal;
                $scope.action = web3.toAscii(proposal[0]);
                $scope.passed = proposal[4];
                $scope.rejected = proposal[5];
                var support = web3.fromWei(proposal[7],'ether').toNumber();
                var against = web3.fromWei(proposal[8],'ether').toNumber();
                //console.log(support,against);
                $scope.support = 0;

                if((support+against) > 0){
                    var total = support+against;
                    var percent = support/total;
                    $scope.support = Math.round(percent*100);

                    //console.log(total, percent, $scope.support);
                }
                $scope.against = 100 - $scope.support;
                //console.log(support,against, $scope.support, $scope.against);

                IpfsService.getIpfsData(proposal[1]).then(
                function(data){
                    console.log(data);
                    if(typeof data == 'string')
                        data = JSON.parse(data);
                    console.log(data);
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

            Congress.getCurator().then(
            function(curator){
                $scope.curator = curator;
            });

            Congress.getMajorityPercent().then(
            function(percent){
                $scope.majorityPercent = percent;
            });

        }).catch(function(err){
            console.error(err);
        });
    }).catch(function(err){
        console.error(err);
    });
    
    $scope.currentNavItem = $location.url().slice(1);
    $scope.urlArray = $scope.currentNavItem.split('/');
    $scope.id = $scope.urlArray[3];
    
    $scope.vote = function(support){
        Congress.vote($scope.id,support).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.unvote = function(){
        Congress.vote($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
    $scope.pass = function(){
        Congress.passProposal($scope.id).then(
        function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    }
}]);