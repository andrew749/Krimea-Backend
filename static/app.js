angular.module("krimea", [])
  .directive("mapCanvas", function(){
    return {
      link: function(scope, element, attrs) {
        function initialize() {
            var mapCanvas = document.getElementById('map-canvas');
            var mapOptions = {
                center: new google.maps.LatLng(43.6470034,-79.3872184),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }

            var map = new google.maps.Map(mapCanvas, mapOptions);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                map: map,
                title: 'Last Location!'
            });

            scope.map = map;
            scope.marker = marker;
        }
        initialize();

        scope.$watch("currentLocation", function(newValue, oldValue){
          if (!newValue) return;
          var position = new google.maps.LatLng(
            scope.currentLocation.lat,
            scope.currentLocation.lon);

          scope.marker.setPosition(position);
          scope.map.setCenter(position);
        });
      }
    };
  })
  .controller("MapController", function($scope, $http){
    var url = window.location.href.split("#")[0];
    urlcomponents = url.split("/");
    var panic_id = urlcomponents[urlcomponents.length - 1];

    $scope.locations = [];

    $http.get(url + "/locations").success(function(data){
      $scope.locations = data.locations.slice(0); // Copies array
      $scope.locations.sort(function(a,b){
        if (a.time < b.time) {
          return 1;
        } else if (a.time > b.time) {
          return -1;
        } else {
          return 0;
        }
      });
      $scope.currentLocation = $scope.locations[0];
    });

    $scope.socket = io('', {query: "panic_id="+panic_id});
    $scope.socket.on("newlocation", function(data){
      $scope.locations.push(data.location);
      $scope.locations.sort(function(a,b){
        if (a.time < b.time) {
          return 1;
        } else if (a.time > b.time) {
          return -1;
        } else {
          return 0;
        }
      });
      console.log("Got a new location");
      $scope.currentLocation = data.location;
      $scope.$apply();
    });

    $scope.socket.on("allclear", function(data){
      console.log("Got an all clear");
      $scope.$apply();
    });
  });
