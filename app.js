var Matriarch = angular.module('Matriarch',['ngRoute','ngMaterial','ngMessages','material.svgAssetsCache','ngSanitize']);

Matriarch.config(function ($routeProvider) {
	$routeProvider.
    when('/home', {
        templateUrl: 'views/home/homeView.html',
        controller: 'HomeViewController'
    }).
    when('/votes', {
        templateUrl: 'views/votes/votesView.html',
        controller: 'VotesViewController'
    }).
    when('/proposals', {
        templateUrl: 'views/proposals/proposalsView.html',
        controller: 'ProposalsViewController'
    }).
    when('/proposals/:id', {
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
        };
    }
});

Matriarch.filter('decimals', [function(decimals) {
    return function(decimals) {
        return val.toFixed(decimals);
    };
}]);

Matriarch.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});