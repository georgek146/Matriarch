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
    
    $scope.proposals = {ids:[]};
    Matriarch.getTotalProposals().then(
    function(total){
        $scope.total_proposals = total.toNumber();
        
        for(var i = 0; i < total.toNumber(); i++) {
           $scope.proposals.ids.push(i);
        }
        console.log($scope.proposals);
    }).catch(function(err){
        console.error(err);
    });
}]);