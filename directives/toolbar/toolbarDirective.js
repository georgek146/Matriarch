Matriarch.directive('toolbar', ['$location','Web3Service','MiniMeToken',
function($location, Web3Service, MiniMeToken) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope){
            console.log('Loading toolbar');
            
            $scope.goto = function(url) {
                if($scope.id)
                    $scope.id= null;
                
                $location.url(url);
            };
            
            $scope.currentNavItem = $location.url().slice(1);
            $scope.urlArray = $scope.currentNavItem.split('/');
            $scope.id = $scope.urlArray[1];
            
            $scope.$on('$routeChangeStart', function(next, current) { 
                $scope.currentNavItem = $location.url().slice(1);
                $scope.urlArray = $scope.currentNavItem.split('/');
                $scope.id = $scope.urlArray[1];
             });
                        
            setInterval(function(){
                
                MiniMeToken.getCurrentTokenSupply().then(
                function(supply){
                    $scope.currentTokenSupply = supply;
                });

                MiniMeToken.getTokenBalance(Web3Service.getCurrentAccount())
                .then( function(balance){
                    $scope.tokenBalance = web3.fromWei(balance, 'ether');
                }).catch( function(err){
                    console.error(err);
                });

                Web3Service.getEtherBalance(Web3Service.getCurrentAccount())
                .then( function(maxBalance){
                    $scope.etherBalance = web3.fromWei(maxBalance , 'ether');
                }).catch( function(err){
                    console.error(err);
                });
            },1000);
            
            MiniMeToken.getSymbol(Web3Service.getCurrentAccount())
            .then( function(symbol){
                $scope.symbol = symbol;
            }).catch( function(err){
                console.error(err);
            });
            
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);