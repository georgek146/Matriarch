Matriarch.controller('ProposalsViewController', ['$scope','Matriarch','MiniMeToken','Web3Service',
function($scope,Matriarch,MiniMeToken,Web3Service){
    console.log('Loading Proposals View');
    
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
    
    $scope.proposal1Percent = 75;
    $scope.proposal2Percent = 50;
    $scope.proposal3Percent = 25;
    
}]);