Matriarch.directive('toolbar', ['Web3Service',
function(Web3Service) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/toolbar/toolbarDirective.html',
		controller: function($scope){
            console.log('Loading toolbar');
            
            $scope.currentAccount = Web3Service.getCurrentAccount();
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);