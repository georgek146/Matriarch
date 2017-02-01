Matriarch.controller('ProposalViewController', ['$scope','$http','Matriarch','MiniMeToken','Web3Service',
function($scope,$http,Matriarch,MiniMeToken,Web3Service){
    console.log('Loading Proposal View');
    
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
    
    $scope.currentAccount = Web3Service.getCurrentAccount();
    
    $http({
      method: 'GET',
      url: 'http://gateway.ipfs.io/ipfs/QmYy4LAoXn2nALvu6UWpWoKoAJEQ967bKSUrVDTQ5XvvMF'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(response);
        $scope.markdown = response.data;
        
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(response);
    });
    
}]);