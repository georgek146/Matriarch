Matriarch.controller('CongressViewController', ['$scope','$location','Congress','MiniMeToken','Web3Service','IpfsService','MeDao','Matriarch',
function($scope,$location,Congress,MiniMeToken,Web3Service,IpfsService,MeDao,Matriarch){
    console.log('Loading Congress View');
    
    $scope.show = false;
    $scope.submitText = 'Submit Proposal';
    
    var url = $location.url();
    var array = url.split('/');
    $scope.currentAccount = array[2].toLowerCase();
    
    $scope.goto = function(url) {
        $location.url(url);
    };
    
    Matriarch.getMeDaoAddress($scope.currentAccount).then(
    function(medaoAddress){
        MeDao.setMeDaoAddress(medaoAddress);
        
        MeDao.getMMTAddress(medaoAddress).then(
        function(mmtAddress){
            MiniMeToken.setMMTAddress(mmtAddress);
            
            MiniMeToken.getSymbol(Web3Service.getCurrentAccount()).then(
            function(symbol){
                $scope.symbol = symbol;
            }).catch( function(err){
                console.error(err);
            });

            MiniMeToken.getName(mmtAddress).then(
            function(name){
                $scope.name = name;
            }).catch( function(err){
                console.error(err);
            });

            MiniMeToken.getCurrentTokenSupply().then(
            function(supply){
                $scope.currentTokenSupply = supply;
            });
            
            MiniMeToken.getTokenBalance(Web3Service.getCurrentAccount()).then(
            function(balance){
                $scope.tokenBalance = web3.fromWei(balance,'ether').toNumber();
            }).catch(function(err){
                console.error(err);
            });
        }).catch(function(err){
            console.error(err);
        });

        MeDao.getCongressAddress().then(
        function(congressAddress){
            Congress.setCongressAddress(congressAddress);
            
            Congress.getMajorityPercent().then(
            function(percent){
                $scope.majorityPercent = percent.toString();
            });

            Congress.getCurator().then(
            function(curator){
                $scope.curator = curator;
            });

            Congress.getTotalLockedTokens().then(
            function(locked){
                $scope.totalLocked = web3.fromWei(locked.toNumber(),'ether');;
            }).catch( function(err){
                console.error(err);
            });

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
    }).catch(function(err){
        console.error(err);
    });
    
    $scope.options = ['Ongoing','updateMeDao','createCloneToken','generateTokens'];
    $scope.proposal = {
        action: null,
        title: null,
        description: null,
        address: null,
        amount: null,
    };
    
    $scope.clicked = false;
    $scope.submitProposal = function(){
        $scope.clicked = true;
        
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
}]);