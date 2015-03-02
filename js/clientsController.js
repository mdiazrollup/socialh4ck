/*****
*** TODO:: IE8 and lower support
*****/
var CLIENTS_URL = "http://socialh4ck.com/dev/jobs/test/frontend/data.json";
var MAP_API_KEY = "AIzaSyB-c_JhODjXP3HyYUy4_Wvx7HWIfRGHlH4";
var socialHackApp = angular.module('socialHackApp', ['uiGmapgoogle-maps']);

socialHackApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: MAP_API_KEY,
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})

socialHackApp.controller('ClientsController',function($scope,$http) {
  $scope.mapOptions = {scrollwheel: false};
  $scope.clientStatus = ["All","Active","Inactive"];
  $scope.currentStatus = $scope.clientStatus[0];
  $scope.currentClient = null;
  $scope.filteredClients=[];

  $scope.clients = [];

  $scope.filterClients = function(){
    if($scope.currentStatus===$scope.clientStatus[1] || $scope.currentStatus===$scope.clientStatus[2]){
      var newClients = [];
      var isActive = ($scope.currentStatus === "Active");
      angular.forEach($scope.clients, function(c) {
        if(c.isActive == isActive){
          newClients.push(c);
        }
        $scope.filteredClients = newClients;
      });
    }else{
      $scope.filteredClients = $scope.clients;
    }
  }

  $scope.clientTags = function(){
    var usertags = $scope.currentClient.tags;
    var tags = "";
    for(i=0;i<usertags.length;i++){
      var tag = usertags[i];
      tags = (i==usertags.length-1)?tags.concat(tag):tags.concat(tag+",");
    }
    return tags;
  }

  $scope.getDate = function(){
    var stringDate = $scope.currentClient.registered;
    var date = new Date(stringDate.replace(" ",""));
  }

  $scope.loadMap = function(){
    var latitude = $scope.currentClient.latitude;
    var logitude = $scope.currentClient.longitude;
    $scope.map = { center: { latitude: latitude, longitude: logitude }, zoom: 6 };
    $scope.marker = {
      id: 0,
      coords: {
        latitude: latitude,
        longitude: logitude
      },
      options: {
        draggable: false,
        labelContent: "lat: " + latitude + ' ' + 'lon: ' + logitude,
        labelAnchor: "100 0"
      }
    };
  }

  $scope.loadClients = function () {
      $http.get(CLIENTS_URL).
      success(function(data) {
        $scope.clients = data; 
        $scope.filterClients();
      }).
      error(function(data, status, headers, config){console.log("Error loading clients");});
  };

  $scope.loadClients();



});