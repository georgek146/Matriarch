Matriarch.directive('proposal', ['$location','Web3Service','IpfsService','MiniMeToken','Congress',
function($location, Web3Service, IpfsService, MiniMeToken, Congress) {
	return {
		restrict: 'E',
		scope: {
            id:'='
		},
		replace: true,
		templateUrl: 'directives/proposal/proposalDirective.html',
		controller: function($scope){
            console.log('Loading proposal');
            
            var url = $location.url();
            var array = url.split('/');
            $scope.currentAccount = array[2];
            
            Congress.getProposal($scope.id).then(
            function(proposal){
                var support = web3.fromWei(proposal[7],'ether').toNumber();
                var against = web3.fromWei(proposal[8],'ether').toNumber();
                $scope.support = 0;

                if((support+against) > 0){
                    var percent = support/(support+against)*100;
                    $scope.support = Math.round(percent);
                }
                
                $scope.against = 100 - $scope.support;
                
                IpfsService.getIpfsData(proposal[1]).then(
                function(data){
                    if(typeof data !== 'object')
                        data = JSON.parse(data);
                    $scope.proposal = {
                        id: $scope.id,
                        action: web3.toAscii(proposal[0]),
                        hash: proposal[1],
                        address: proposal[2],
                        amount: web3.fromWei(proposal[3].toNumber(),'ether'),
                        passed: proposal[4],
                        rejected: proposal[5],
                        timestamp: new Date(proposal[6]*1000),
                        support: $scope.support,
                        against: $scope.against,
                        totalVoters: proposal[9].toNumber(),
                        title: data.title,
                        description: data.description
                    };
                });
            }).catch(function(err){
                console.error(err);
            });
            
            $scope.goto = function(url) {
                console.log(url);
                $location.url(url);
            };
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);