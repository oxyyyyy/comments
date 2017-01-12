'use strict';
(function () {
    /**
     * @ngdoc function
     * @name todoApp.controller:LoginCtrl
     * @description
     * # LoginCtrl
     * Backand login control - need to implement in order to get the token for authentication
     */

    angular.module('Comments')
        .controller('authCtrl', ['AuthService', AuthController]);

    function AuthController(AuthService) {

        var vm = this;

        vm.appName = AuthService.appName;
        vm.newUser = true;
        vm.error = '';

        vm.authenticate = function () {
            vm.error = null;

            if (vm.newUser) {
                vm.signup();
            } else {
                vm.signin();
            }
        };

        vm.signup = function () {

            AuthService.signup(vm.firstName, "", vm.username, vm.password)
                .then(
                function (response) {
                    //check status of the sign in
                    console.log(response)
                    $('.authBox').modal('hide');
                }, showError);

            vm.firstName = "";
            vm.username = "";
            vm.password = "";
        };

        vm.signin = function () {
            AuthService.signin(vm.username, vm.password)
                .then(function (){
                    $('.authBox').modal('hide');
                }, showError);

            vm.firstName = "";
            vm.username = "";
            vm.password = "";
        };

        function showError(error) {
            console.error(error);
            vm.error = error.data;
        }

    }


})();
