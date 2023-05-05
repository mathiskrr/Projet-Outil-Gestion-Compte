angular.module("myApp").controller("UsersController", function ($scope, $http) {
  $scope.users = [];

  $scope.getUsers = function () {
    $http.get("/api/users").then(
      function (response) {
        $scope.users = response.data;
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.getUsers();

  $scope.newUser = {};

  $scope.addUser = function () {
    // Vérifier si le champ "email" est rempli
    if (!$scope.newUser.email) {
      alert("Veuillez saisir une adresse email.");
      return;
    }

    $http.post("/api/users", $scope.newUser).then(function (response) {
      $scope.users.push(response.data);
      $scope.newUser = {}; // Réinitialiser le formulaire
    });
  };

  $scope.editingUser = null;

  $scope.editUser = function (user) {
    $scope.editingUser = angular.copy(user);
  };

  $scope.cancelEdit = function () {
    $scope.editingUser = null;
  };

  $scope.saveUser = function () {
    console.log($scope.editingUser.website);
    console.log($scope.editingUser.password);
    $http.put("/api/users/" + $scope.editingUser.id, $scope.editingUser).then(
      function (response) {
        $scope.editingUser = null;
        $scope.getUsers();
        console.log($scope.editingUser.website);
        console.log($scope.editingUser.password);
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.deleteUser = function (user) {
    $http.delete("/api/users/" + user.id).then(
      function (response) {
        $scope.getUsers();
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.sortBy = function (column) {
    $http.get("/api/users?sort=" + column).then(
      function (response) {
        $scope.users = response.data;
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.searchTerm = "";

  $scope.searchUsers = function () {
    $http.get("/api/users/search?website=" + $scope.searchTerm).then(
      function (response) {
        if (response.data.length > 0) {
          $scope.users = response.data;
        } else {
          alert("Aucun utilisateur ne correspond à votre recherche.");
        }
      },
      function (error) {
        console.log(error);
      }
    );
  };

  $scope.showAllUsers = function () {
    $scope.searchTerm = "";
    $scope.getUsers();
  };

  $scope.exportUsers = function () {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = [
      "Website",
      "Nom Utilisateur",
      "Email",
      "Mot de passe",
    ].join(",");
    csvContent += headers + "\n";

    $scope.users.forEach(function (user) {
      const values = [user.website, user.name, user.email, user.password].join(
        ","
      );
      csvContent += values + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
  };
});
