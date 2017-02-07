Matriarch.controller('MyProposalsViewController', ['$scope','Web3Service','IpfsService','Matriarch',
function($scope,Web3Service,IpfsService,Matriarch){
    console.log('Loading My Proposals View');
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    Matriarch.getTotalProposals().then(
    function(total){
        $scope.total_proposals = total.toNumber();
    }).catch(function(err){
        console.error(err);
    });
    
    $scope.actions = ['Ongoing','updateMatriarch','createCloneToken','generateTokens'];
    $scope.proposal = {
        action: null,
        title: null,
        description: null,
        address: null,
        amount: null,
    };
    
    $scope.goto = function(url) {
        $location.url(url);
    };
    
    $scope.submitProposal = function(){
        console.log($scope.proposal);
            
        IpfsService.getIpfsHash(JSON.stringify($scope.proposal)).then(
        function(ipfsHash){
            console.log(ipfsHash);
            return Matriarch.submitProposal($scope.proposal.action,ipfsHash,$scope.proposal.address,$scope.proposal.amount);
        }).then(function(txHash){
            console.log(txHash);
        }).catch(function(err){
            console.error(err);
        });
    };
    
}]);