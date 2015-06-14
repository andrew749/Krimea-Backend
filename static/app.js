angular.module("krimea", [])
  .controller("MapController", function($scope, $http){
    var url = window.location.href;
    urlcomponents = url.split("/");
    var panic_id = urlcomponents[urlcomponents.length - 1];

    $scope.locations = [];

    $http.get("")

    $scope.socket = io('', {query: "panic_id="+panic_id});
    $scope.socket.on("newlocation", function(data){
      $scope.locations.
    });
  });
