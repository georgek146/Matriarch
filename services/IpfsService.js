Matriarch.service( 'IpfsService',['$q','$http',
function ($q,$http) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
    var getViaGateway = function(ipfsHash){
        var deferred = $q.defer();

        $http({
            method: 'GET',
            url: 'http://gateway.ipfs.io/ipfs/' + ipfsHash
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log('Fetching from gateway!', response);
            deferred.resolve(response.data);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject(response);
        });
        
        return deferred.promise;
    };
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            
            var local = localStorage.getItem(ipfsHash);
            if(!local){
                //console.log("fetching data from ipfs for", ipfsHash);
                var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                    if(err || !ipfsData){
                        return getViaGateway(ipfsHash);
                    } else {
                        localStorage.setItem(ipfsHash,JSON.stringify(ipfsData));
                        deferred.resolve(ipfsData);
                    }
                });
            } else {
                //console.log('Found ipfs data in localStorage');
                deferred.resolve(JSON.parse(local));
            }
            
            return deferred.promise;
		},
		getIpfsHash: function (data) {
            var deferred = $q.defer();
            
            //console.log("Calculating ipfs hash for", data);
			var promise = ipfs.addJson(data, function(err, hash){
                if(err || !hash){
                    deferred.reject(err);
                } else {
                    //console.log(hash);
                    deferred.resolve(hash);
                }
            });
            
            return deferred.promise;
		}
	};

	return service;
}]);
