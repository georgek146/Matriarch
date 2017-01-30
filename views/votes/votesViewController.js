Matriarch.controller('VotesViewController', ['$scope','$location','MiniMeToken','Web3Service',
function($scope,$location,MiniMeToken,Web3Service){
    console.log('Loading Votes View');
    
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
    
    $scope.proposal1Percent = 70;
    $scope.proposal2Percent = 55;
    $scope.proposal3Percent = 23;
    
    $scope.goto = function(url) {
        $location.url(url);
    };
}]);