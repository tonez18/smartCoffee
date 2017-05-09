angular.module('Coffee', [])
    .controller('CoffeeCtrl', function($scope, $http, $timeout, $interval) {

        getStatus();

        $scope.coffeeMachineActive = false;
        $scope.turnCoffeeMaschine = function () {
            $scope.blocked = true;

            $http.get('/coffee/turnPower', {
            })
                .then(
                    function(response){

                        if(!$scope.coffeeMachineActive){
                            $scope.coffeeMachineWarming = true;

                            $scope.status = 0;
                            $interval(function () {
                                $scope.status++
                            },1000);

                            $scope.getPercentage = function () {
                                return (1.7 * $scope.status).toFixed(2);
                            };

                            $timeout(function () {
                                getStatus();
                                $scope.coffeeMachineActive = true;
                                $scope.coffeeMachineWarming = false;
                                $scope.blocked = false;

                                $interval.cancel()
                            },60000)

                        }
                        else {
                            $scope.coffeeMachineActive = false;
                            $timeout(function () {
                                getStatus();
                            },1000)

                        }

                    },
                    function(response){
                        console.log("error")
                    }
                );
        };
        $scope.makeCoffee = function () {
            $http.get('/coffee/brew', {
            })
                .then(
                    function(response){
                        $scope.coffeeInProcess = true;
                        $scope.statusBrew = 0;
                        $interval(function () {
                            $scope.statusBrew++
                        },1000);

                        $scope.getPercentageBrew = function () {
                            return (5 * $scope.statusBrew).toFixed(2);
                        };

                        $timeout(function () {
                            $scope.coffeeInProcess = false;
                            $interval.cancel();
                            $scope.statusBrew = 0;
                            getStatus();
                        },20000)

                    },
                    function(response){
                        console.log("error")
                    }
                );
        };

       function getStatus() {
            $http.get('/coffee/activities').then(result => {
                $scope.actions = result.data
            });
           $http.get('/coffee/count').then(result => {
               $scope.coffeeCounter = result.data
           });
        };

    });