angular.module("krimea", [])
  .controller("MapController", function($scope, $http){
    var url = window.location.href;
    urlcomponents = url.split("/");
    var panic_id = urlcomponents[urlcomponents.length - 1];

    $scope.locations = [];

    $http.get(url + "/locations").success(function(data){
      $scope.locations = data.locations.slice(0); // Copies array
    });

    $scope.socket = io('', {query: "panic_id="+panic_id});
    $scope.socket.on("newlocation", function(data){
      $scope.locations.push(data.location);
    });
  });
