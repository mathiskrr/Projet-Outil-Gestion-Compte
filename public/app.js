angular
  .module("myApp", [])
  .controller("UsersController", function ($scope, $http) {
    $http.get("/api/users").then(function (response) {
      $scope.users = response.data;
    });
  });
