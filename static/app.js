angular.module("krimea", [])
  .controller("MapController", function($scope, $http){
    $scope.socket = io();
  });
