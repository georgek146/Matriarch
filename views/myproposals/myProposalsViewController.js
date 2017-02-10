Matriarch.controller('MyProposalsViewController', ['$scope','Web3Service','IpfsService','Congress',
function($scope,Web3Service,IpfsService,Congress){
    console.log('Loading My Proposals View');
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    Congress.getTotalProposals().then(
    function(total){
        $scope.total_proposals = total.toNumber();
    }).catch(function(err){
        console.error(err);
    });
    
    
    $scope.goto = function(url) {
        $location.url(url);
    };
    
    
}]);