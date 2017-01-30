Matriarch.controller('CongressViewController', ['$scope','$location','Matriarch','MiniMeToken','Web3Service',
function($scope,$location,Matriarch,MiniMeToken,Web3Service){
    console.log('Loading Proposals View');
    
    Matriarch.getMajorityPercent().then(
    function(percent){
        $scope.majorityPercent = percent;
    });
    
    Matriarch.getCurator().then(
    function(curator){
        $scope.curator = curator;
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
    
    $scope.proposal1Percent = 75;
    $scope.proposal2Percent = 55;
    $scope.proposal3Percent = 23;
    
    $scope.goto = function(url) {
        $location.url(url);
    };
}]);