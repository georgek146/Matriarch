Matriarch.controller('MyProposalsViewController', ['$scope','Web3Service',
function($scope,Web3Service){
    console.log('Loading My Proposals View');
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    $scope.total_proposals = '0000';
    $scope.actions = ['updateMatriarch','Clone','Meta','generateTokens'];
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
    };
    
}]);