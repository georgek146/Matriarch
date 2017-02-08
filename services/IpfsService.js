Matriarch.service( 'IpfsService',['$q', 
function ($q) {
    console.log('Loading IpfsService');
	ipfs.setProvider();
    
	var service = {
		getIpfsData: function (ipfsHash) {
            var deferred = $q.defer();
            
            var local = localStorage.getItem(ipfsHash);
            if(!local){
                //console.log("fetching data from ipfs for", ipfsHash);
                var post = ipfs.catJson(ipfsHash, function(err, ipfsData) {
                    if(err || !ipfsData){
                        deferred.reject(err);
                    } else {
                        localStorage.setItem(ipfsHash,JSON.stringify(ipfsData));
                        var parsed = JSON.parse(ipfsData);
                        console.log(parsed);
                        deferred.resolve(parsed);
                    }
                });
            } else {
                //console.log('Found ipfs data in localStorage');
                var parsed = JSON.parse(local);
                console.log(parsed);
                deferred.resolve(parsed);
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
    /*$http({
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
    });*/

	return service;
}]);
