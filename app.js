var Matriarch = angular.module('Matriarch',['ngRoute','ngMaterial','ngMessages','material.svgAssetsCache','ngSanitize']);

Matriarch.config(function ($routeProvider) {
	$routeProvider.
    when('/home', {
        templateUrl: 'views/home/homeView.html',
        controller: 'HomeViewController'
    }).
    when('/deploy', {
        templateUrl: 'views/deploy/deployView.html',
        controller: 'DeployViewController'
    }).
    when('/medao/:account', {
        templateUrl: 'views/medao/medaoView.html',
        controller: 'MeDaoViewController'
    }).
    when('/medao/:address/congress', {
        templateUrl: 'views/congress/congressView.html',
        controller: 'CongressViewController'
    }).
    when('/medao/:address/finance', {
        templateUrl: 'views/finance/financeView.html',
        controller: 'FinanceViewController'
    }).
    when('/medao/:address/proposal/:id', {
        templateUrl: 'views/proposal/proposalView.html',
        controller: 'ProposalViewController'
    }).
	otherwise({
      redirectTo: '/home'
    });
});

Matriarch.run(function() {
    console.log('Matriarch begins spreading her wings...');
});

Matriarch.filter('capitalize', function() {
    return function(input){
        if(input){
            if(input.indexOf(' ') !== -1){
                var input = input.toLowerCase();
                var inputPieces = input.split(' ');
                for(i = 0; i < inputPieces.length; i++){
                    inputPieces[i] = capitalizeString(inputPieces[i]);
                }
                return inputPieces.toString().replace(/,/g,' ');
            } else {
                input = input.toLowerCase();
                return capitalizeString(input);
            }

            function capitalizeString(inputString){
                return inputString.substring(0,1).toUpperCase() + inputString.substring(1);
            }
        }
    }
});

Matriarch.filter('decimals', [function() {
    return function(value, decimals) {
        return parseFloat(value).toFixed(decimals);
    };
}]);

Matriarch.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});