Matriarch.directive('sidenav', ['$mdSidenav','$location','Web3Service','Matriarch','MiniMeToken','MeDao',
function($mdSidenav, $location, Web3Service, Matriarch, MiniMeToken, MeDao) {
	return {
		restrict: 'E',
		scope: {
            
		},
		replace: true,
		templateUrl: 'directives/sidenav/sidenavDirective.html',
		controller: function($scope, $mdSidenav){
            
            $scope.loaded = false;
            $scope.deployed = false;
            
            $scope.currentAccount = Web3Service.getCurrentAccount();
            
            $scope.saved = [];
            $scope.saved.push({ 
                address:$scope.currentAccount,
                balance: 0,
                symbol: '___'
            });
            
            $scope.goto = function(url){
                console.log(url);
                $location.url(url);
            };
            
            setInterval(function(){
                Web3Service.getEtherBalance().then(
                function(balance){
                    $scope.etherBalance = web3.fromWei(balance, 'ether').toFixed(3);
                });
                
                Matriarch.getMeDaoAddress(Web3Service.getCurrentAccount()).then(
                function(meDaoAddress){
                    if(meDaoAddress !== '0x0000000000000000000000000000000000000000')
                        $scope.deployed = true;    
                    $scope.loaded = true;
                }).catch(function(err){
                    console.error(err);
                });
            }, 500);
            
            Web3Service.getEtherBalance().then(
            function(balance){
                $scope.etherBalance = web3.fromWei(balance, 'ether').toFixed(3);
            });
            
            $scope.$on('$routeChangeStart', function(next, current) { 
                Matriarch.getMeDaoAddress(Web3Service.getCurrentAccount()).then(
                function(meDaoAddress){
                    if(meDaoAddress !== '0x0000000000000000000000000000000000000000')
                        $scope.deployed = true;    
                    $scope.loaded = true;
                }).catch(function(err){
                    console.error(err);
                });
            });
            
            Matriarch.getMeDaoAddress(Web3Service.getCurrentAccount()).then(
            function(meDaoAddress){
                if(meDaoAddress !== '0x0000000000000000000000000000000000000000')
                    $scope.deployed = true;    
                $scope.loaded = true;
            }).catch(function(err){
                console.error(err);
            });
            
            $scope.openSideNavPanel = function() {
                $mdSidenav('left').open();
            };
            
            $scope.closeSideNavPanel = function() {
                $mdSidenav('left').close();
            };
            
            
            $scope.medaos = [];
            Matriarch.getTotalDaos().then(
            function(total){
                for(var i = 0; i < total; i++){
                    setMeDao(i);
                }
            }).catch(function(err){
                console.error(err);
            });
            
            var setMeDao = function(index){
                var medaoCeo;
                Matriarch.getIndex(index).then(
                function(ceo){
                    medaoCeo = ceo;
                    return Matriarch.getMeDaoAddress(ceo);
                }).then(function(medaoAddress){
                    return MeDao.getMMTAddress(medaoAddress)
                }).then(function(mmtAddress){
                    return MiniMeToken.getName(mmtAddress);
                }).then(function(name){
                    $scope.medaos.push({ceo:medaoCeo,name:name});
                }).catch(function(err){
                    console.error(err);
                });  
            };
		},
		link : function($scope, $element, $attrs) {
            
		}
	}
}]);