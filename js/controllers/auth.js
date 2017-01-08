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
        vm.error = "";
        vm.newUser = true;

        vm.authenticate = function () {
            vm.error = null;
            vm.success = null;

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
                    switch (response.data.currentStatus) {
                        case 1: // The user is ready to sign in
                            break;
                        case 2: //The system is now waiting for the user to respond a verification email.
                            vm.success = 'Please check your email to continue';
                            break;
                        case 3: //The user signed up and is now waiting for an administrator approval.
                            vm.success = 'Please wait for the administrator to approve the sign up';
                            break;
                    }
                }, showError
            );
            vm.firstName = "";
            vm.username = "";
            vm.password = "";
        };

        vm.signin = function () {
            AuthService.signin(vm.username, vm.password)
                .then(
                showError
            );
            vm.firstName = "";
            vm.username = "";
            vm.password = "";
        };

        function showError(error) {
            vm.error = error && error.data || error.error_description || 'Unknown error from server';
        }

    }


})();
